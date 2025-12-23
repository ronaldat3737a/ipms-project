package com.ipms.entity;

import com.ipms.entity.enums.ApplicantType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "applicants", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "applicant_type_enum")
    private ApplicantType type = ApplicantType.CA_NHAN;

    @Column(name = "full_name", nullable = false, columnDefinition = "text")
    private String fullName;

    @Column(name = "dob")
    private LocalDate dob; // Kiểu date trong Postgres tương ứng với LocalDate trong Java

    @Column(name = "id_number", length = 50, nullable = false)
    private String idNumber;

    @Column(name = "address", nullable = false, columnDefinition = "text")
    private String address;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "rep_code", length = 50)
    private String repCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    // --- MỐI QUAN HỆ (RELATIONSHIPS) ---

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", referencedColumnName = "id", nullable = false)
    private Application application; // Mối quan hệ 1-1 với bảng Applications
}