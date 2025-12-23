package com.ipms.entity;

import com.ipms.entity.enums.DocType;
import com.ipms.entity.enums.FileCategory;
import com.ipms.entity.enums.FileStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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
    @Column(name = "category", nullable = false, columnDefinition = "file_category_enum")
    private FileCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false, columnDefinition = "doc_type_enum")
    private DocType docType;

    @Column(name = "payment_stage")
    private Short paymentStage; // smallint trong SQL tương ứng với Short trong Java

    @Column(name = "file_name", nullable = false, columnDefinition = "text")
    private String fileName;

    @Column(name = "file_url", nullable = false, columnDefinition = "text")
    private String fileUrl; // Đường dẫn lưu trữ (S3, Cloudinary hoặc Local Storage)

    @Column(name = "file_size")
    private Long fileSize; // bigint trong SQL tương ứng với Long trong Java

    @Column(name = "extension", length = 10)
    private String extension; // .pdf, .docx, .png...

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "file_status_enum")
    private FileStatus status = FileStatus.HOAN_TAT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application; // Nhiều tài liệu thuộc về một đơn nộp
}