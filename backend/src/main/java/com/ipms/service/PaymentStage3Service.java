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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentStage3Service {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;

    @Transactional
    public ApplicationFee createFeeForStage3(Application application) {
        
        Optional<ApplicationFee> existingFee = feeRepository.findByApplication_IdAndStage(application.getId(), FeeStage.PHI_GD3);
        if (existingFee.isPresent()) {
            return existingFee.get();
        }

        // --- REPLICATE FRONTEND FEE CALCULATION LOGIC ---
        BigDecimal FEE_GRANT = BigDecimal.valueOf(600000);
        BigDecimal FEE_PUBLICATION = BigDecimal.valueOf(120000);
        BigDecimal FEE_MAINTENANCE_FIRST_YEAR = BigDecimal.valueOf(400000);

        BigDecimal totalAmount = FEE_GRANT.add(FEE_PUBLICATION).add(FEE_MAINTENANCE_FIRST_YEAR);
        // --- END OF CALCULATION ---

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD3)
                .amount(totalAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        return feeRepository.save(fee);
    }

    @Transactional
    public Application processStage3Payment(Application application, ApplicationFee fee, Map<String, String> vnp_Params) {
        if (fee.getStatus() == PaymentStatus.DA_THANH_TOAN) {
            System.out.println("IPN for Stage 3 already processed for " + vnp_Params.get("vnp_TxnRef"));
            return application;
        }

        BigDecimal paidAmount = new BigDecimal(vnp_Params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        if (fee.getAmount().compareTo(paidAmount) != 0) {
            System.out.println("Correcting Stage 3 fee amount from " + fee.getAmount() + " to " + paidAmount);
            fee.setAmount(paidAmount);
        }

        fee.setStatus(PaymentStatus.DA_THANH_TOAN);
        fee.setTransactionId(vnp_Params.get("vnp_TransactionNo"));
        fee.setPaidAt(OffsetDateTime.now());
        feeRepository.save(fee);

        application.setStatus(AppStatus.DA_CAP_VAN_BANG); // Final status after stage 3 payment
        application.setUpdatedAt(OffsetDateTime.now());
        applicationRepository.save(application);

        ReviewHistory history = new ReviewHistory();
        history.setApplication(application);
        history.setReviewDate(OffsetDateTime.now());
        history.setStatusTo(AppStatus.DA_CAP_VAN_BANG);
        history.setNote(
                "Xác nhận nộp phí " + FeeStage.PHI_GD3 +
                " qua VNPay. GD: " + fee.getTransactionId()
        );
        reviewHistoryRepository.save(history);

        System.out.println("IPN SUCCESS (Stage 3): " + application.getAppNo() + " - " + paidAmount);
        return application;
    }
}
