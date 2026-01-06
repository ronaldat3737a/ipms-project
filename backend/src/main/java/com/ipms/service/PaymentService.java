package com.ipms.service;

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
    private final PaymentRepository paymentRepository;

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
     * VNPay IPN PROCESSING (CORE LOGIC)
     * ===================================================== */
    @Transactional
    public Application processVnPayIpn(Map<String, String> vnp_Params) {

        /* ---------- 1. CHECK PAYMENT RESULT ---------- */
        if (!"00".equals(vnp_Params.get("vnp_ResponseCode"))) {
            System.err.println("IPN failed: " + vnp_Params.get("vnp_ResponseCode"));
            // Optionally save the failed payment attempt
            // Not doing this now to keep it simple
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
        int stage = Integer.parseInt(parts[1]);

        /* ---------- 3. FIND APPLICATION ---------- */
        Application application = applicationRepository.findByAppNo(appNo)
                .orElseThrow(() -> new RuntimeException("Application not found: " + appNo));

        /* ---------- 4. AMOUNT FROM VNPAY (SOURCE OF TRUTH) ---------- */
        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount"))
                .divide(BigDecimal.valueOf(100));

        /* ---------- 5. SAVE PAYMENT RECORD ---------- */
        Payment payment = Payment.builder()
                .application(application)
                .amount(paidAmount)
                .paymentStage(stage)
                .status("SUCCESS") // Directly from VNPay success
                .vnpayTransactionNo(vnp_Params.get("vnp_TransactionNo"))
                .build();
        paymentRepository.save(payment);

        /* ---------- 6. UPDATE APPLICATION STATUS BASED ON STAGE ---------- */
        AppStatus nextStatus = null;
        String historyNote = "";

        if (stage == 1 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD1) {
            nextStatus = AppStatus.DANG_TD_HINH_THUC;
            historyNote = "Xác nhận nộp phí Giai đoạn 1 qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else if (stage == 2 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD2) {
            nextStatus = AppStatus.DANG_TD_NOI_DUNG;
            historyNote = "Xác nhận nộp phí Giai đoạn 2 qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else if (stage == 3 && application.getStatus() == AppStatus.CHO_NOP_PHI_GD3) {
            nextStatus = AppStatus.DA_CAP_VAN_BANG;
             historyNote = "Xác nhận nộp phí cấp văn bằng qua VNPay. GD: " + payment.getVnpayTransactionNo();
        } else {
            // Handle idempotency or wrong state
             System.out.println("Payment for stage " + stage + " received, but application " + appNo + " is in status " + application.getStatus() + ". No status change.");
             return application; // Return without changing status
        }
        
        application.setStatus(nextStatus);
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        /* ---------- 7. REVIEW HISTORY ---------- */
        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(nextStatus);
        history.setNote(historyNote);
        reviewHistoryRepository.save(history);

        System.out.println("IPN SUCCESS: " + appNo + " - " + paidAmount + " for stage " + stage);
        return application;
    }
}
