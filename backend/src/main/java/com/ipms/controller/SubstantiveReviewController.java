package com.ipms.controller;

import com.ipms.dto.ReviewRequest;
import com.ipms.service.SubstantiveReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/substantive-review")
@RequiredArgsConstructor
public class SubstantiveReviewController {

    private final SubstantiveReviewService reviewService;

    @PostMapping("/{appId}/submit")
    public ResponseEntity<String> submitReview(
            @PathVariable UUID appId,
            @RequestBody ReviewRequest request) {

        reviewService.handleSubstantiveReview(appId, request);
        return ResponseEntity.ok("Cập nhật kết quả thẩm định nội dung thành công.");
    }
}
