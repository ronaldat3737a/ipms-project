package com.ipms.entity;

import com.ipms.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.type.SqlTypes;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;


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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "app_no", length = 25, unique = true)
    private String appNo; 

    // --- CẬP NHẬT ENUM STATUS ---
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Sử dụng cái này thay cho columnDefinition
    @Column(name = "status")
    private AppStatus status = AppStatus.MOI;
    
    // --- CẬP NHẬT ENUM APP_TYPE ---
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Đồng bộ với DB Enum đã tạo (SANG_CHE, GIAI_PHAP_HUU_ICH)
    @Column(name = "app_type", nullable = false)
    private AppType appType;

    @Column(nullable = false, columnDefinition = "text")
    private String title;

    @Column(name = "solution_detail", length = 100, nullable = false)
    private String solutionDetail;

    // --- CẬP NHẬT ENUM SOLUTION_TYPE ---
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "solution_type")
    private SolutionType solutionType;

    @Column(name = "technical_field", nullable = false, columnDefinition = "text")
    private String technicalField;

    @JdbcTypeCode(SqlTypes.ARRAY) 
    @Column(name = "ipc_codes", nullable = false, columnDefinition = "text[]")
    private List<String> ipcCodes;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Builder.Default
    @Column(name = "total_pages")
    private Integer totalPages = 0;

    // --- CẬP NHẬT ENUM FILING_BASIS ---
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "filing_basis")
    private FilingBasis filingBasis;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // --- MỐI QUAN HỆ (GIỮ NGUYÊN) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"applications", "password", "role", "handler", "hibernateLazyInitializer"})
    private User user;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Applicant applicant;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"application", "handler", "hibernateLazyInitializer"})
    private List<Author> authors;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"application", "handler", "hibernateLazyInitializer"})
    private List<ApplicationClaim> claims;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"application", "handler", "hibernateLazyInitializer"})
    private List<ApplicationAttachment> attachments;
}