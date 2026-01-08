package com.ipms.repository;

import com.ipms.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ApplicantRepository extends JpaRepository<Applicant, UUID> {
    
    // Thêm dòng này để tìm kiếm chủ đơn dựa trên ID của hồ sơ
    Optional<Applicant> findByApplicationId(UUID applicationId);
}