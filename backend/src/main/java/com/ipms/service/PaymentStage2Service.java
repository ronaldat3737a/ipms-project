package com.ipms.service;

import com.ipms.entity.Application;
import com.ipms.entity.ApplicationFee;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
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

@Service
@RequiredArgsConstructor
public class PaymentStage2Service {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;

    // This method would be called when an application is moved to CHO_NOP_PHI_GD2 status
    @Transactional
    public ApplicationFee createFeeForStage2(Application application) {
        // Define the fee for stage 2. This might be a fixed value or based on some logic.
        // For now, let's assume a fixed fee.
        BigDecimal stage2FeeAmount = BigDecimal.valueOf(500_000); // Example fee

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD2)
                .amount(stage2FeeAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        return feeRepository.save(fee);
    }

    @Transactional
    public Application processStage2Payment(Application application, ApplicationFee fee, Map<String, String> vnp_Params) {
        // This method is called from the central PaymentService IPN handler

        // 1. Idempotency Check (already handled in PaymentService, but can be double-checked)
        if (fee.getStatus() == PaymentStatus.DA_THANH_TOAN) {
            System.out.println("IPN for Stage 2 already processed for " + vnp_Params.get("vnp_TxnRef"));
            return application;
        }

        // 2. Amount Validation
        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        if (fee.getAmount().compareTo(paidAmount) != 0) {
            System.out.println("Correcting Stage 2 fee amount from " + fee.getAmount() + " to " + paidAmount);
            fee.setAmount(paidAmount);
        }

        // 3. Update Fee Entity
        fee.setStatus(PaymentStatus.DA_THANH_TOAN);
        fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
        fee.setPaidAt(OffsetDateTime.now());
        feeRepository.save(fee);

        // 4. Update Application Entity Status
        application.setStatus(AppStatus.DANG_TD_NOI_DUNG); // Next status after stage 2 payment
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        // 5. Create Review History
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
