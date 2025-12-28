package com.ipms.entity;

import com.ipms.entity.enums.AppStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "review_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    // Liên kết với thực thể Application (Hồ sơ)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    // ID người thẩm định (giả định bạn lưu ID từ bảng User)
    @Column(name = "examiner_id")
    private Long examinerId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // Giữ nguyên theo config của bạn cho PostgreSQL
    @Column(name = "status_to")
    private AppStatus statusTo;

    @Column(columnDefinition = "text")
    private String note;

    @CreationTimestamp // Tự động tạo thời gian khi insert vào DB
    @Column(name = "review_date", updatable = false)
    private OffsetDateTime reviewDate;
}