package com.ipms.entity;

import com.ipms.entity.enums.UserRole;
import jakarta.persistence.*; // Chuyển từ javax sang jakarta để khớp với Spring Boot 3
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users", schema = "public")
@Data
@Builder // Thêm Builder để đồng bộ với logic gọi User trong PatentService
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "user_role")
    private UserRole role;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "cccd_number", unique = true, nullable = false, length = 12)
    private String cccdNumber;

    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "password_hash", nullable = false, columnDefinition = "text")
    private String passwordHash;

    @CreationTimestamp // Tự động ghi nhận thời gian tạo
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt; // Sử dụng OffsetDateTime để khớp với 'timestamp with time zone' trong Postgres
}