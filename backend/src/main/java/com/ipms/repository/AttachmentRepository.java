package com.ipms.repository;

import com.ipms.entity.ApplicationAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<ApplicationAttachment, UUID> {
    @Modifying // Thêm dòng này
    @Transactional // Thêm dòng này
    void deleteByApplicationId(UUID applicationId);
}