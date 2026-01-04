package com.ipms.service;

import com.ipms.dto.ApplicationFeeDTO;
import com.ipms.dto.PatentSubmissionDTO;
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

    @Transactional(readOnly = true)
    public List<ApplicationFeeDTO> getFeesForApplication(UUID applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            // In a real application, you'd use a custom exception
            throw new RuntimeException("Application not found with ID: " + applicationId);
        }

        return feeRepository.findByApplicationId(applicationId).stream()
                .map(ApplicationFeeDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal getFeeAmountForStage(UUID applicationId, FeeStage stage) {
        ApplicationFee fee = feeRepository.findByApplicationIdAndStage(applicationId, stage)
                .orElseThrow(() -> new RuntimeException("Fee record not found for application " + applicationId + " and stage " + stage));
        return fee.getAmount();
    }

    @Transactional
    public ApplicationFee createFeeForStage1(Application application, PatentSubmissionDTO dto) {
        // Fee calculation logic now uses the DTO directly to ensure data consistency
        long numIndependentClaims = 0;
        if (dto.getClaims() != null) {
            numIndependentClaims = dto.getClaims().stream()
                .filter(c -> "Độc lập".equalsIgnoreCase(c.getType()))
                .count();
        }

        // TODO: The number of pages should be stored on the Application entity itself.
        // Using a placeholder of 0 for now.
        int numPages = 0; 

        BigDecimal feeFiling = new BigDecimal("150000");
        BigDecimal feeExamPerClaim = new BigDecimal("180000");
        BigDecimal feePageExceed = new BigDecimal("8000");

        BigDecimal totalExamFee = feeExamPerClaim.multiply(new BigDecimal(numIndependentClaims));
        
        int pagesOver = Math.max(0, numPages - 6);
        BigDecimal totalPageFee = feePageExceed.multiply(new BigDecimal(pagesOver));

        BigDecimal totalAmount = feeFiling.add(totalExamFee).add(totalPageFee);

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD1)
                .amount(totalAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        return feeRepository.save(fee);
    }
    
    @Transactional
    public Application processVnPayIpn(Map<String, String> vnp_Params) {
        String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
        String vnp_TxnRef = vnp_Params.get("vnp_TxnRef");

        // Proceed only if payment was successful
        if (!"00".equals(vnp_ResponseCode)) {
            System.err.println("IPN: Payment was not successful. Response code: " + vnp_ResponseCode);
            return null;
        }

        // Extract info from TxnRef: [AppNo]_[Stage]_[Timestamp]
        String[] txnRefParts = vnp_TxnRef.split("_");
        if (txnRefParts.length < 2) {
            System.err.println("IPN: Invalid vnp_TxnRef format: " + vnp_TxnRef);
            return null;
        }

        String appNo = txnRefParts[0];
        // The stage from VNPay is a string, needs to be converted to our enum
        // We assume stage '1' corresponds to 'PHI_GD1'
        FeeStage feeStage;
        try {
            int stageNum = Integer.parseInt(txnRefParts[1]);
            if (stageNum == 1) {
                feeStage = FeeStage.PHI_GD1;
            } else {
                // Handle other stages if necessary in the future
                System.err.println("IPN: Unsupported fee stage: " + stageNum);
                return null;
            }
        } catch (NumberFormatException e) {
            System.err.println("IPN: Invalid stage number in vnp_TxnRef: " + txnRefParts[1]);
            return null;
        }

        Optional<Application> optionalApp = applicationRepository.findByAppNo(appNo);
        if (optionalApp.isEmpty()) {
            System.err.println("IPN: Application not found with appNo: " + appNo);
            return null;
        }
        
        Application application = optionalApp.get();

        // Find the specific fee record
        Optional<ApplicationFee> optionalFee = feeRepository.findByApplicationIdAndStage(application.getId(), feeStage);

        if (optionalFee.isEmpty()) {
            System.err.println("IPN: ApplicationFee not found for appNo " + appNo + " and stage " + feeStage);
            return null;
        }

        ApplicationFee fee = optionalFee.get();

        // Idempotency check: Only process if the fee is currently unpaid
        if (fee.getStatus() != PaymentStatus.CHUA_THANH_TOAN) {
            System.out.println("IPN: Fee for appNo " + appNo + " has already been processed. Status is: " + fee.getStatus());
            return application; // Return the app but do no more processing
        }

        // Security Check: Verify that the paid amount matches the stored amount
        String vnpAmount = vnp_Params.get("vnp_Amount");
        if (vnpAmount == null) {
            System.err.println("IPN: vnp_Amount is missing from VNPay parameters for TxnRef: " + vnp_TxnRef);
            return null;
        }
        // VNPay amount is in cents, convert to BigDecimal
        BigDecimal paidAmount = new BigDecimal(vnpAmount).divide(new BigDecimal("100"));
        
        if (paidAmount.compareTo(fee.getAmount()) != 0) {
            System.err.println("[CRITICAL] IPN: Amount mismatch for TxnRef: " + vnp_TxnRef + 
                               ". Expected: " + fee.getAmount() + ", Paid: " + paidAmount);
            // In a real scenario, you might flag this transaction for manual review
            return null;
        }

        // --- UPDATE ApplicationFee ---
        fee.setStatus(PaymentStatus.DA_THANH_TOAN);
        fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
        fee.setPaidAt(OffsetDateTime.now()); // Or parse from vnp_Params if available and reliable
        feeRepository.save(fee);

        // --- UPDATE Application ---
        application.setStatus(AppStatus.DANG_TD_HINH_THUC);
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        // --- CREATE ReviewHistory ---
        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(AppStatus.DANG_TD_HINH_THUC);
        history.setNote("Hệ thống: Xác nhận nộp phí " + feeStage.name() + " qua VNPay. Mã giao dịch: " + fee.getTransactionId());
        reviewHistoryRepository.save(history);
        
        System.out.println("IPN: Successfully processed payment for appNo: " + appNo + " for stage: " + feeStage.name());

        return application;
    }
}
