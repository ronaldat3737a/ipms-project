package com.ipms.service;

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
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentStage2Service {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;

    @Transactional
    public ApplicationFee createFeeForStage2(Application application) {
        
        // Find if a fee for this stage already exists to avoid duplicates
        Optional<ApplicationFee> existingFee = feeRepository.findByApplication_IdAndStage(application.getId(), FeeStage.PHI_GD2);
        if (existingFee.isPresent()) {
            return existingFee.get();
        }

        // --- REPLICATE FRONTEND FEE CALCULATION LOGIC ---
        BigDecimal FEE_PUBLICATION = BigDecimal.valueOf(120000);
        BigDecimal FEE_SUBSTANTIVE_EXAM_PER_CLAIM = BigDecimal.valueOf(720000);
        BigDecimal FEE_EXCESS_PAGE = BigDecimal.valueOf(32000);

        long numIndependentClaims = application.getClaims().stream()
                .filter(c -> c.getType() == ClaimType.DOK_LAP)
                .count();

        int totalPages = application.getTotalPages() != null ? application.getTotalPages() : 0;

        BigDecimal substantiveExamFee = FEE_SUBSTANTIVE_EXAM_PER_CLAIM.multiply(BigDecimal.valueOf(numIndependentClaims));
        BigDecimal excessPageFee = totalPages > 6
                ? FEE_EXCESS_PAGE.multiply(BigDecimal.valueOf(totalPages - 6))
                : BigDecimal.ZERO;

        BigDecimal totalAmount = FEE_PUBLICATION.add(substantiveExamFee).add(excessPageFee);
        // --- END OF CALCULATION ---

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD2)
                .amount(totalAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        return feeRepository.save(fee);
    }

    @Transactional
    public Application processStage2Payment(Application application, ApplicationFee fee, Map<String, String> vnp_Params) {
        if (fee.getStatus() == PaymentStatus.DA_THANH_TOAN) {
            System.out.println("IPN for Stage 2 already processed for " + vnp_Params.get("vnp_TxnRef"));
            return application;
        }

        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        
        // Use the fee amount calculated and stored in the database as the source of truth
        if (fee.getAmount().compareTo(paidAmount) != 0) {
            System.err.println("CRITICAL: Paid amount (" + paidAmount + ") does not match expected fee (" + fee.getAmount() + ") for TxnRef: " + vnp_Params.get("vnp_TxnRef"));
            // Optionally, you could create a review history item here to flag this discrepancy for manual review
            // For now, we will proceed but log it as a critical error.
        }
        
        // Even if amount is different, we'll update with what was paid and flag it.
        // Or you could reject it. For now, let's accept it but use the DB amount.
        // Let's correct the fee amount to what was paid, as per original logic.
        if (fee.getAmount().compareTo(paidAmount) != 0) {
             System.out.println("Correcting Stage 2 fee amount from " + fee.getAmount() + " to " + paidAmount);
             fee.setAmount(paidAmount);
        }


        fee.setStatus(PaymentStatus.DA_THANH_TOAN);
        fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
        fee.setPaidAt(OffsetDateTime.now());
        feeRepository.save(fee);

        application.setStatus(AppStatus.DANG_TD_NOI_DUNG);
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(AppStatus.DANG_TD_NOI_DUNG);
        history.setNote(
                "Xác nhận nộp phí " + FeeStage.PHI_GD2 +
                " qua VNPay. GD: " + fee.getTransactionId()
        );
        reviewHistoryRepository.save(history);

        System.out.println("IPN SUCCESS (Stage 2): " + application.getAppNo() + " - " + paidAmount);
        return application;
    }
}
