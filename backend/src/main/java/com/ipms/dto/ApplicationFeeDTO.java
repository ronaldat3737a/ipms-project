package com.ipms.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ipms.entity.ApplicationFee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationFeeDTO {

    private UUID id;
    private UUID applicationId;
    private String stage;
    private BigDecimal amount;
    private String status;
    private String transactionId;
    private OffsetDateTime paidAt;
    private OffsetDateTime createdAt;

    // Constructor to map from the Entity
    public ApplicationFeeDTO(ApplicationFee entity) {
        this.id = entity.getId();
        this.applicationId = (entity.getApplication() != null) ? entity.getApplication().getId() : null;
        this.stage = entity.getStage().name();
        this.amount = entity.getAmount();
        this.status = entity.getStatus().name();
        this.transactionId = entity.getTransactionId();
        this.paidAt = entity.getPaidAt();
        this.createdAt = entity.getCreatedAt();
    }
}
