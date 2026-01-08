package com.ipms.repository;

import com.ipms.entity.ApplicationClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<ApplicationClaim, UUID> {
    @Modifying
    @Transactional
    void deleteByApplicationId(UUID applicationId); // Xóa tất cả điểm bảo hộ của một đơn
}