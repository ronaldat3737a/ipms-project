package com.ipms.repository;

import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewHistoryRepository extends JpaRepository<ReviewHistory, UUID> {
    // Lấy lịch sử theo Application ID, sắp xếp mới nhất lên đầu
    List<ReviewHistory> findByApplicationIdOrderByReviewDateDesc(UUID applicationId);
    Optional<ReviewHistory> findFirstByApplicationIdAndNoteIsNotNullOrderByReviewDateDesc(UUID applicationId);

    // Tìm bản ghi từ chối mới nhất của hồ sơ
    Optional<ReviewHistory> findFirstByApplicationIdAndStatusToOrderByReviewDateDesc(
        UUID applicationId, 
        AppStatus statusTo
    );
}