package com.ipms.entity;

import com.ipms.entity.enums.*;
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
@Table(name = "applications", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "app_no", length = 25, unique = true, insertable = false)
    private String appNo; // insertable = false vì Trigger trong DB sẽ tự sinh mã này

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "app_status_enum")
    private AppStatus status = AppStatus.MOI;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "app_type", nullable = false, columnDefinition = "app_type_enum")
    private AppType appType;

    @Column(nullable = false, columnDefinition = "text")
    private String title;

    @Column(name = "solution_detail", length = 100, nullable = false)
    private String solutionDetail;

    @Enumerated(EnumType.STRING)
    @Column(name = "solution_type", columnDefinition = "solution_type_enum")
    private SolutionType solutionType;

    @Column(name = "technical_field", nullable = false, columnDefinition = "text")
    private String technicalField;

    @JdbcTypeCode(SqlTypes.ARRAY) // Xử lý kiểu dữ liệu text[] trong PostgreSQL
    @Column(name = "ipc_codes", nullable = false, columnDefinition = "text[]")
    private List<String> ipcCodes;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(name = "filing_basis", columnDefinition = "filing_basis_enum")
    private FilingBasis filingBasis;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Người nộp đơn (chủ tài khoản)

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL)
    private Applicant applicant; // Thông tin định danh chủ đơn

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Author> authors; // Danh sách tác giả

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationClaim> claims; // Các điểm yêu cầu bảo hộ

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationAttachment> attachments; // Các tệp đính kèm
}