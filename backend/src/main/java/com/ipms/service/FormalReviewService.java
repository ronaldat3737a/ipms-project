package com.ipms.service;

import com.ipms.dto.ReviewRequest;
import com.ipms.entity.Application;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
import com.ipms.repository.ApplicationRepository;
import com.ipms.repository.ReviewHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FormalReviewService {

    private final ApplicationRepository appRepository;
    private final ReviewHistoryRepository historyRepository;

    @Transactional
    public void handleFormalReview(UUID appId, ReviewRequest request) {
        // 1. Kiểm tra tồn tại
        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ với ID: " + appId));

        // 2. Kiểm tra logic nghiệp vụ (Business Rule)
        // Chỉ được thẩm định khi đang ở trạng thái MOI hoặc DANG_TD_HINH_THUC
        if (app.getStatus() != AppStatus.MOI && app.getStatus() != AppStatus.DANG_TD_HINH_THUC) {
            throw new IllegalStateException("Trạng thái hiện tại (" + app.getStatus() + ") không cho phép thẩm định hình thức.");
        }

        // 3. Cập nhật trạng thái
        app.setStatus(request.getStatus());
        appRepository.save(app);

        // 4. Lưu lịch sử
        ReviewHistory history = ReviewHistory.builder()
                .application(app)
                .statusTo(request.getStatus())
                .note(request.getNote())
                .build();
        historyRepository.save(history);
    }
}