package com.ipms.controller;

import com.ipms.dto.PatentSubmissionDTO;
import com.ipms.entity.Application;
import com.ipms.service.PatentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React truy cập API
public class PatentController {

    private final PatentService patentService;

    @PostMapping("/submit")
    public ResponseEntity<Application> submitPatent(@RequestBody PatentSubmissionDTO dto) {
        // Giả sử userId = 1 cho mục đích kiểm thử
        // Trong thực tế, bạn sẽ lấy ID từ Spring Security (Principal)
        Long mockUserId = 1L; 
        
        Application savedApp = patentService.submitPatent(dto, mockUserId);
        
        // Trả về đối tượng Application đã lưu thành công
        return ResponseEntity.ok(savedApp);
    }
}