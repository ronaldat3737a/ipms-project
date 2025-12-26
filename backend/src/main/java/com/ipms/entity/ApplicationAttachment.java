package com.ipms.entity;

import com.ipms.entity.enums.DocType;
import com.ipms.entity.enums.FileCategory;
import com.ipms.entity.enums.FileStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode; // Thêm import này
import org.hibernate.type.SqlTypes;           // Thêm import này

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "application_attachments", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giúp khớp với kiểu 'file_category_enum' trong Postgres
    @Column(name = "category", nullable = false)
    private FileCategory category;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giúp khớp với kiểu 'doc_type_enum' trong Postgres
    @Column(name = "doc_type", nullable = false)
    private DocType docType;

    @Column(name = "payment_stage")
    private Short paymentStage; 

    @Column(name = "file_name", nullable = false, columnDefinition = "text")
    private String fileName;

    @Column(name = "file_url", nullable = false, columnDefinition = "text")
    private String fileUrl; 

    @Column(name = "file_size")
    private Long fileSize; 

    @Column(name = "extension", length = 10)
    private String extension; 

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giúp khớp với kiểu 'file_status_enum' trong Postgres
    @Column(name = "status")
    private FileStatus status = FileStatus.HOAN_TAT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application; 
}