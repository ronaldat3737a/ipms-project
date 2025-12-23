package com.ipms.repository;

import com.ipms.entity.ApplicationAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<ApplicationAttachment, UUID> {
}