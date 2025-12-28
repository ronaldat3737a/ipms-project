package com.ipms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ipms.dto.PatentSubmissionDTO;
import com.ipms.entity.Application;
import com.ipms.service.PatentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Chỉ định rõ cổng của React để tránh lỗi CORS
public class PatentController {

    private final PatentService patentService;

    // --- 1. CHỨC NĂNG DÀNH CHO NGƯỜI NỘP ĐƠN (APPLICANT) ---
    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Application> submitPatent(
            @RequestPart("patentData") String patentDataJson, 
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) throws Exception {
        
        ObjectMapper objectMapper = new ObjectMapper();
        PatentSubmissionDTO dto = objectMapper.readValue(patentDataJson, PatentSubmissionDTO.class);

        // Giả lập UserId (Cần khớp với kiểu dữ liệu trong User Entity của bạn, thường là Long hoặc UUID)
        Long mockUserId = 1L; 
        
        Application savedApp = patentService.submitPatent(dto, mockUserId, files);
        return ResponseEntity.ok(savedApp);
    }

    // --- 2. CHỨC NĂNG DÀNH CHO THẨM ĐỊNH VIÊN (EXAMINER) ---
    // Đây là phương thức bạn đang thiếu dẫn đến lỗi 404
    @GetMapping("/all")
    public ResponseEntity<List<Application>> getAllPatents() {
        // Gọi service lấy toàn bộ đơn có loại là SANG_CHE từ PostgreSQL
        List<Application> applications = patentService.getPatentApplications();
        return ResponseEntity.ok(applications);
    }
}