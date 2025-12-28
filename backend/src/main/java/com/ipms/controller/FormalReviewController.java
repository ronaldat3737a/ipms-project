package com.ipms.controller;

import com.ipms.dto.ReviewRequest;
import com.ipms.service.FormalReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/formal-review")
@RequiredArgsConstructor
public class FormalReviewController {

    private final FormalReviewService reviewService;

    @PostMapping("/{appId}/submit")
    public ResponseEntity<String> submitReview(
            @PathVariable UUID appId, 
            @RequestBody ReviewRequest request) {
        
        reviewService.handleFormalReview(appId, request);
        return ResponseEntity.ok("Cập nhật kết quả thẩm định hình thức thành công.");
    }
}