package com.ipms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "industrial_design_details", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndustrialDesignDetail {

    @Id
    @Column(name = "application_id", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID applicationId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(name = "usage_field", nullable = false, columnDefinition = "text")
    private String usageField;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "locarno_codes", nullable = false, columnDefinition = "text[]")
    private List<String> locarnoCodes;

    @Column(name = "similar_design", columnDefinition = "text")
    private String similarDesign;

    @Column(name = "description_detail", nullable = false, columnDefinition = "text")
    private String descriptionDetail;

    @Column(name = "claims", nullable = false, columnDefinition = "text")
    private String claims;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
