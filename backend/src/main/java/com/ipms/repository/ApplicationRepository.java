package com.ipms.repository;

import com.ipms.entity.Application;
import com.ipms.entity.enums.AppType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    
    // THÊM DÒNG NÀY ĐỂ HẾT LỖI
    List<Application> findByAppType(AppType appType);
    Optional<Application> findByAppNo(String appNo);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT COUNT(a)
    FROM Application a
    WHERE a.appType = :appType
      AND YEAR(a.createdAt) = :year
    """)
    long countByAppTypeAndCreatedAtYear(@Param("appType") AppType appType, @Param("year") int year);
    
}