package com.ipms.repository;

import com.ipms.entity.Application;
import com.ipms.entity.enums.AppType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    
    // THÊM DÒNG NÀY ĐỂ HẾT LỖI
    List<Application> findByAppType(AppType appType);
    Optional<Application> findByAppNo(String appNo);
    
}