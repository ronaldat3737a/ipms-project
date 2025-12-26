package com.ipms.entity;

import com.ipms.entity.enums.ClaimStatus;
import com.ipms.entity.enums.ClaimType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
    name = "application_claims", 
    schema = "public",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"application_id", "order_index"})
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex; 

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giúp khớp với kiểu enum 'claim_type_enum' trong Postgres
    @Column(name = "type", nullable = false)
    private ClaimType type = ClaimType.DOK_LAP; 

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giúp khớp với kiểu enum 'claim_status_enum' trong Postgres
    @Column(name = "status")
    private ClaimStatus status = ClaimStatus.HOP_LE;

    @Column(name = "validation_message", columnDefinition = "text")
    private String validationMessage; 

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_claim_id")
    private ApplicationClaim parentClaim;

    @OneToMany(mappedBy = "parentClaim", cascade = CascadeType.ALL)
    private List<ApplicationClaim> dependentClaims;
}