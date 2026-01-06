package com.ipms.service;

import com.ipms.config.VnPayConfig;
import com.ipms.dto.ApplicationFeeDTO;
import com.ipms.entity.Application;
import com.ipms.entity.ApplicationFee;
import com.ipms.entity.Payment;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
import com.ipms.entity.enums.ClaimType;
import com.ipms.entity.enums.FeeStage;
import com.ipms.entity.enums.PaymentStatus;
import com.ipms.repository.ApplicationFeeRepository;
import com.ipms.repository.ApplicationRepository;
import com.ipms.repository.PaymentRepository;
import com.ipms.repository.ReviewHistoryRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;
    private final PaymentRepository paymentRepository;

    // --- Fee calculation constants ---
    private static final BigDecimal FEE_FILING = new BigDecimal("150000");
    private static final BigDecimal FEE_EXAM_PER_CLAIM_STAGE_1 = new BigDecimal("180000");
    private static final BigDecimal FEE_EXCESS_PAGE_STAGE_1 = new BigDecimal("8000");

    private static final BigDecimal FEE_PUBLICATION = new BigDecimal("120000");
    private static final BigDecimal FEE_SUBSTANTIVE_EXAM_PER_CLAIM = new BigDecimal("720000");
    private static final BigDecimal FEE_EXCESS_PAGE_STAGE_2 = new BigDecimal("32000");

    private static final BigDecimal FEE_GRANTING = new BigDecimal("120000");


    @Transactional
    public String createPaymentUrl(String appNo, int stage, HttpServletRequest request) throws UnsupportedEncodingException {
        // 1. Find Application
        Application application = applicationRepository.findByAppNo(appNo)
                .orElseThrow(() -> new RuntimeException("Mã đơn không hợp lệ hoặc không tồn tại!"));

        // 2. Convert int stage to FeeStage enum
        FeeStage feeStage = convertIntToFeeStage(stage);

        // 3. Validate application status
        validateApplicationStatus(application, feeStage);

        // 4. Find or Create Fee ("On-demand Fee Creation")
        ApplicationFee fee = feeRepository.findByApplication_IdAndStage(application.getId(), feeStage)
                .orElseGet(() -> {
                    BigDecimal amount = calculateAmount(application, feeStage);
                    ApplicationFee newFee = ApplicationFee.builder()
                            .application(application)
                            .stage(feeStage)
                            .amount(amount)
                            .status(PaymentStatus.CHUA_THANH_TOAN)
                            .build();
                    return feeRepository.save(newFee);
                });

        // 5. Generate VNPay URL
        return generateVnPayUrl(fee, request);
    }


    private BigDecimal calculateAmount(Application application, FeeStage stage) {
        return switch (stage) {
            case PHI_GD1 -> {
                long independentClaims = application.getClaims().stream().filter(c -> c.getType() == ClaimType.DOK_LAP).count();
                BigDecimal examFee = FEE_EXAM_PER_CLAIM_STAGE_1.multiply(BigDecimal.valueOf(independentClaims));
                BigDecimal pageFee = FEE_EXCESS_PAGE_STAGE_1.multiply(BigDecimal.valueOf(Math.max(0, application.getTotalPages() - 6)));
                yield FEE_FILING.add(examFee).add(pageFee);
            }
            case PHI_GD2 -> {
                long independentClaims = application.getClaims().stream().filter(c -> c.getType() == ClaimType.DOK_LAP || c.getType().name().equals("DOK_LAP")).count();
                BigDecimal substantiveExamFee = FEE_SUBSTANTIVE_EXAM_PER_CLAIM.multiply(BigDecimal.valueOf(independentClaims));
                BigDecimal excessPageFee = FEE_EXCESS_PAGE_STAGE_2.multiply(BigDecimal.valueOf(Math.max(0, application.getTotalPages() - 6)));
                yield FEE_PUBLICATION.add(substantiveExamFee).add(excessPageFee);
            }
            case PHI_GD3 -> FEE_GRANTING;
        };
    }

    private void validateApplicationStatus(Application application, FeeStage feeStage) {
        boolean isStatusValid = switch (feeStage) {
            case PHI_GD1 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD1;
            case PHI_GD2 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD2;
            case PHI_GD3 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD3;
        };
        if (!isStatusValid) {
            throw new IllegalStateException("Đơn không ở trạng thái hợp lệ để nộp phí giai đoạn " + feeStage.name() + ". Trạng thái hiện tại: " + application.getStatus().name());
        }
    }

    private FeeStage convertIntToFeeStage(int stage) {
        return switch (stage) {
            case 1 -> FeeStage.PHI_GD1;
            case 2 -> FeeStage.PHI_GD2;
            case 3 -> FeeStage.PHI_GD3;
            default -> throw new IllegalArgumentException("Giai đoạn thanh toán không hợp lệ: " + stage);
        };
    }

    private String generateVnPayUrl(ApplicationFee fee, HttpServletRequest request) throws UnsupportedEncodingException {
        long amount = fee.getAmount().multiply(new BigDecimal("100")).longValue();
        String vnp_TxnRef = fee.getApplication().getAppNo() + "_" + fee.getStage().name() + "_" + System.currentTimeMillis();
        String vnp_OrderInfo = "Thanh toan le phi " + fee.getStage().name() + " cho don " + fee.getApplication().getAppNo();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", "250000");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpnUrl", VnPayConfig.vnp_IpnUrl);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // Or get from request

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        return VnPayConfig.vnp_PayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;
    }


    /* =====================================================
     * VNPay IPN PROCESSING (CORE LOGIC)
     * ===================================================== */
    @Transactional
    public Application processVnPayIpn(Map<String, String> vnp_Params) {

        if (!"00".equals(vnp_Params.get("vnp_ResponseCode"))) {
            System.err.println("IPN failed: " + vnp_Params.get("vnp_ResponseCode"));
            return null;
        }

        String txnRef = vnp_Params.get("vnp_TxnRef");
        String[] parts = txnRef.split("_");
        if (parts.length < 2) {
            System.err.println("Invalid TxnRef: " + txnRef);
            return null;
        }
        String appNo = parts[0];
        FeeStage feeStage;
        try {
            feeStage = FeeStage.valueOf(parts[1]);
        } catch (IllegalArgumentException e) {
             System.err.println("Invalid stage in TxnRef: " + parts[1]);
             return null;
        }
        int stageInt = feeStage.ordinal() + 1;


        Application application = applicationRepository.findByAppNo(appNo)
                .orElseThrow(() -> new RuntimeException("Application not found: " + appNo));

        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount"))
                .divide(BigDecimal.valueOf(100));

        Payment payment = Payment.builder()
                .application(application)
                .amount(paidAmount)
                .paymentStage(stageInt)
                .status("SUCCESS")
                .vnpayTransactionNo(vnp_Params.get("vnp_TransactionNo"))
                .build();
        paymentRepository.save(payment);

        AppStatus nextStatus = null;
        String historyNote = "";

        if (stageInt == 1 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD1) {
            nextStatus = AppStatus.DANG_TD_HINH_THUC;
            historyNote = "Xác nhận nộp phí Giai đoạn 1 qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else if (stageInt == 2 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD2) {
            nextStatus = AppStatus.DANG_TD_NOI_DUNG;
            historyNote = "Xác nhận nộp phí Giai đoạn 2 qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else if (stageInt == 3 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD3) {
            nextStatus = AppStatus.DA_CAP_VAN_BANG;
             historyNote = "Xác nhận nộp phí cấp văn bằng qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else {
             System.out.println("Payment for stage " + stageInt + " received, but application " + appNo + " is in status " + application.getStatus() + ". No status change.");
             return application;
        }
        
        application.setStatus(nextStatus);
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(nextStatus);
        history.setNote(historyNote);
        reviewHistoryRepository.save(history);

        // Update the original fee record as well
        feeRepository.findByApplication_IdAndStage(application.getId(), feeStage).ifPresent(fee -> {
            fee.setStatus(PaymentStatus.DA_THANH_TOAN);
            fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
            fee.setPaidAt(OffsetDateTime.now());

            // Correct amount if it was different
             if (fee.getAmount() == null || fee.getAmount().compareTo(paidAmount) != 0) {
                System.out.println("Correcting fee amount from "
                        + fee.getAmount() + " to " + paidAmount);
                fee.setAmount(paidAmount);
            }
            feeRepository.save(fee);
        });

        System.out.println("IPN SUCCESS: " + appNo + " - " + paidAmount + " for stage " + stageInt);
        return application;
    }

     /* =====================================================
     * GET FEES FOR APPLICATION
     * ===================================================== */
    @Transactional(readOnly = true)
    public List<ApplicationFeeDTO> getFeesForApplication(UUID applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new RuntimeException("Application not found: " + applicationId);
        }

        return feeRepository.findByApplication_Id(applicationId)
                .stream()
                .map(ApplicationFeeDTO::new)
                .collect(Collectors.toList());
    }
}
