package com.ipms.repository;

import com.ipms.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

public interface AuthorRepository extends JpaRepository<Author, UUID> {
    @Modifying
    @Transactional
    void deleteByApplicationId(UUID applicationId); // Xóa tất cả tác giả của một đơn
}