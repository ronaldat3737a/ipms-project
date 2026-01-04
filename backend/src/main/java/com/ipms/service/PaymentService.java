package com.ipms.service;

import com.ipms.dto.ApplicationFeeDTO;
import com.ipms.entity.Application;
import com.ipms.entity.ApplicationFee;
import com.ipms.entity.enums.ClaimType;
import com.ipms.entity.enums.FeeStage;
import com.ipms.entity.enums.PaymentStatus;
import com.ipms.repository.ApplicationFeeRepository;
import com.ipms.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ApplicationFeeRepository feeRepository;
    private final ApplicationRepository applicationRepository;

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

    @Transactional
    public ApplicationFee createFeeForStage1(Application application) {
        // Fee calculation logic moved from frontend to backend
        long numIndependentClaims = application.getClaims().stream()
                .filter(c -> c.getType() == ClaimType.DOK_LAP)
                .count();

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
}
