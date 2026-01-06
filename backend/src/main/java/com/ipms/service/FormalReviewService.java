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

    @Transactional(rollbackFor = Exception.class)
    public void handleFormalReview(UUID appId, ReviewRequest request) {
        // 1. Kiểm tra tồn tại
        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ với ID: " + appId));

        // 2. Kiểm tra logic nghiệp vụ
        if (app.getStatus() != AppStatus.MOI && app.getStatus() != AppStatus.DANG_TD_HINH_THUC) {
            throw new IllegalStateException("Hồ sơ không ở trạng thái thẩm định hình thức.");
        }

        // 3. ĐIỀU CHỈNH LOGIC CHUYỂN TRẠNG THÁI TẠI ĐÂY
        AppStatus nextStatus;

        // Giả sử request.getDecision() là "APPROVE", "REJECT" hoặc "CORRECT"
        // Hoặc nếu bạn dùng request.getStatus(), hãy kiểm tra giá trị của nó
        if (request.getStatus() == AppStatus.CHO_NOP_PHI_GD2 || "APPROVE".equals(request.getNote())) {
            // ÉP BUỘC: Thẩm định hình thức xong PHẢI nộp phí GĐ 2
            nextStatus = AppStatus.CHO_NOP_PHI_GD2;
        } else {
            // Các trường hợp từ chối hoặc yêu cầu sửa đổi thì giữ theo request
            nextStatus = request.getStatus();
        }

        app.setStatus(nextStatus);
        appRepository.save(app);

        // 4. Lưu lịch sử
        ReviewHistory history = ReviewHistory.builder()
                .application(app)
                .statusTo(nextStatus)
                .note(request.getNote())
                .build();
        historyRepository.save(history);
    }
}