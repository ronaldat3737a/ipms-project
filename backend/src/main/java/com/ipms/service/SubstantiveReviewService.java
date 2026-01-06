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
public class SubstantiveReviewService {

    private final ApplicationRepository appRepository;
    private final ReviewHistoryRepository historyRepository;

    @Transactional(rollbackFor = Exception.class)
    public void handleSubstantiveReview(UUID appId, ReviewRequest request) {
        // 1. Find the application
        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ với ID: " + appId));

        // 2. Business logic check
        if (app.getStatus() != AppStatus.DANG_TD_NOI_DUNG && app.getStatus() != AppStatus.CHO_SUA_DOI_NOI_DUNG) {
            throw new IllegalStateException("Hồ sơ không ở trạng thái có thể thẩm định nội dung.");
        }

        // 3. Determine the next status based on the review decision
        AppStatus nextStatus = request.getStatus(); // Directly use the status from the request
        
        // Safeguard to ensure valid state transitions
        if (nextStatus != AppStatus.CHO_NOP_PHI_GD3 && nextStatus != AppStatus.CHO_SUA_DOI_NOI_DUNG && nextStatus != AppStatus.TU_CHOI_DON) {
            throw new IllegalStateException("Trạng thái chuyển tiếp không hợp lệ cho thẩm định nội dung: " + nextStatus);
        }
        
        app.setStatus(nextStatus);
        appRepository.save(app);

        // 4. Save review history
        ReviewHistory history = ReviewHistory.builder()
                .application(app)
                .statusTo(nextStatus)
                .note(request.getNote())
                .build();
        historyRepository.save(history);
    }
}
