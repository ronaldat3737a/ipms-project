package com.ipms.repository;

import com.ipms.entity.ApplicationClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<ApplicationClaim, UUID> {
    @Modifying
    @Transactional
    @Query("DELETE FROM ApplicationClaim c WHERE c.application.id = :appId")
    void deleteByApplicationId(@Param("appId") UUID appId); // Xóa tất cả điểm bảo hộ của một đơn
}