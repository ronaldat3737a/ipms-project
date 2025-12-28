package com.ipms.repository;

import com.ipms.entity.ReviewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReviewHistoryRepository extends JpaRepository<ReviewHistory, UUID> {
    // Lấy lịch sử theo Application ID, sắp xếp mới nhất lên đầu
    List<ReviewHistory> findByApplicationIdOrderByReviewDateDesc(UUID applicationId);
}