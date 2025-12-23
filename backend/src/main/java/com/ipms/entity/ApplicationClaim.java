package com.ipms.entity;

import com.ipms.entity.enums.ClaimStatus;
import com.ipms.entity.enums.ClaimType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
    name = "application_claims", 
    schema = "public",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"application_id", "order_index"}) // Ràng buộc duy nhất
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
    private Integer orderIndex; // Thứ tự của điểm (1, 2, 3...)

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "claim_type_enum")
    private ClaimType type = ClaimType.DOK_LAP;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "claim_status_enum")
    private ClaimStatus status = ClaimStatus.HOP_LE;

    @Column(name = "validation_message", columnDefinition = "text")
    private String validationMessage; // Thông báo lỗi phân tích tệp

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application; // Liên kết với đơn chính

    // Logic Tự tham chiếu: Một điểm phụ thuộc trỏ về một điểm cha
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_claim_id")
    private ApplicationClaim parentClaim;

    // Danh sách các điểm con phụ thuộc vào điểm này (tùy chọn)
    @OneToMany(mappedBy = "parentClaim", cascade = CascadeType.ALL)
    private List<ApplicationClaim> dependentClaims;
}