package com.ipms.service;

import com.ipms.dto.ApplicationFeeDTO;
import com.ipms.entity.Application;
import com.ipms.entity.ApplicationFee;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
import com.ipms.entity.enums.ClaimType;
import com.ipms.entity.enums.FeeStage;
import com.ipms.entity.enums.PaymentStatus;
import com.ipms.repository.ApplicationFeeRepository;
import com.ipms.repository.ApplicationRepository;
import com.ipms.repository.ReviewHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;
    private final PaymentStage2Service paymentStage2Service;
    private final PaymentStage3Service paymentStage3Service;

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

    /* =====================================================
     * CREATE FEE FOR STAGE 1 (BACKEND CALCULATES)
     * ===================================================== */
    @Transactional
    public ApplicationFee createFeeForStage1(Application application) {

        long independentClaims = application.getClaims()
                .stream()
                .filter(c -> c.getType() == ClaimType.DOK_LAP)
                .count();

        int numPages = 0; // TODO: move to Application entity later

        BigDecimal filingFee = BigDecimal.valueOf(150_000);
        BigDecimal examFeePerClaim = BigDecimal.valueOf(180_000);
        BigDecimal pageExceedFee = BigDecimal.valueOf(8_000);

        BigDecimal examFee = examFeePerClaim.multiply(BigDecimal.valueOf(independentClaims));
        BigDecimal pageFee = pageExceedFee.multiply(BigDecimal.valueOf(Math.max(0, numPages - 6)));

        BigDecimal totalAmount = filingFee.add(examFee).add(pageFee);

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD1)
                .amount(totalAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        return feeRepository.save(fee);
    }

    /* =====================================================
     * VNPay IPN PROCESSING (CORE LOGIC & DISPATCHER)
     * ===================================================== */
    @Transactional
    public Application processVnPayIpn(Map<String, String> vnp_Params) {

        /* ---------- 1. CHECK PAYMENT RESULT ---------- */
        if (!"00".equals(vnp_Params.get("vnp_ResponseCode"))) {
            System.err.println("IPN failed: " + vnp_Params.get("vnp_ResponseCode"));
            return null;
        }

        /* ---------- 2. PARSE TxnRef ---------- */
        String txnRef = vnp_Params.get("vnp_TxnRef");
        String[] parts = txnRef.split("_");

        if (parts.length < 2) {
            System.err.println("Invalid TxnRef: " + txnRef);
            return null;
        }

        String appNo = parts[0];
        String stage = parts[1];

        FeeStage feeStage;
        switch (stage) {
            case "1":
                feeStage = FeeStage.PHI_GD1;
                break;
            case "2":
                feeStage = FeeStage.PHI_GD2;
                break;
            case "3":
                feeStage = FeeStage.PHI_GD3;
                break;
            default:
                System.err.println("Unsupported stage: " + stage);
                return null;
        }


        /* ---------- 3. FIND APPLICATION & FEE ---------- */
        Application application = applicationRepository.findByAppNo(appNo)
                .orElseThrow(() -> new RuntimeException("Application not found: " + appNo));

        ApplicationFee fee = feeRepository
                .findByApplication_IdAndStage(application.getId(), feeStage)
                .orElseThrow(() -> new RuntimeException("Fee not found for appNo " + appNo + " stage " + feeStage));


        /* ---------- 4. IDEMPOTENCY CHECK ---------- */
        if (fee.getStatus() == PaymentStatus.DA_THANH_TOAN) {
            System.out.println("IPN already processed for " + txnRef);
            return application;
        }

        /* ---------- 5. DISPATCH TO APPROPRIATE SERVICE ---------- */
        switch (feeStage) {
            case PHI_GD1:
                // Keep stage 1 logic here to minimize risk to existing flow
                return processStage1Payment(application, fee, vnp_Params);
            case PHI_GD2:
                // Delegate to the new stage 2 service
                return paymentStage2Service.processStage2Payment(application, fee, vnp_Params);
            case PHI_GD3:
                // Delegate to the new stage 3 service
                return paymentStage3Service.processStage3Payment(application, fee, vnp_Params);
            default:
                 System.err.println("IPN ERROR: Should not reach here. Stage not supported " + feeStage);
                 return null; // Should not happen due to earlier check
        }
    }

    @Transactional
    public Application processStage1Payment(Application application, ApplicationFee fee, Map<String, String> vnp_Params) {
        /* ---------- AMOUNT FROM VNPAY (SOURCE OF TRUTH) ---------- */
        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount"))
                .divide(BigDecimal.valueOf(100));

        /* ---------- VALIDATE AMOUNT ---------- */
        if (fee.getAmount() == null || fee.getAmount().compareTo(paidAmount) != 0) {
            System.out.println("Correcting fee amount from "
                    + fee.getAmount() + " to " + paidAmount);
            fee.setAmount(paidAmount);
        }

        /* ---------- UPDATE FEE ---------- */
        fee.setStatus(PaymentStatus.DA_THANH_TOAN);
        fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
        fee.setPaidAt(OffsetDateTime.now());
        feeRepository.save(fee);

        /* ---------- UPDATE APPLICATION ---------- */
        application.setStatus(AppStatus.DANG_TD_HINH_THUC);
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        /* ---------- REVIEW HISTORY ---------- */
        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(AppStatus.DANG_TD_HINH_THUC);
        history.setNote(
                "Xác nhận nộp phí " + fee.getStage() +
                " qua VNPay. GD: " + fee.getTransactionId()
        );
        reviewHistoryRepository.save(history);

        System.out.println("IPN SUCCESS: " + application.getAppNo() + " - " + paidAmount);
        return application;
    }
}
