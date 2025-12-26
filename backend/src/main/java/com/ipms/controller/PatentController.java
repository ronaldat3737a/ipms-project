package com.ipms.controller;

import com.fasterxml.jackson.databind.ObjectMapper; // Dùng để chuyển String JSON sang DTO
import com.ipms.dto.PatentSubmissionDTO;
import com.ipms.entity.Application;
import com.ipms.service.PatentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatentController {

    private final PatentService patentService;

    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Application> submitPatent(
            @RequestPart("patentData") String patentDataJson, // Nhận JSON dạng chuỗi
            @RequestPart(value = "files", required = false) MultipartFile[] files // Nhận mảng file
    ) throws Exception {
        
        // 1. Chuyển chuỗi JSON nhận được sang Object DTO
        ObjectMapper objectMapper = new ObjectMapper();
        PatentSubmissionDTO dto = objectMapper.readValue(patentDataJson, PatentSubmissionDTO.class);

        // 2. Gọi Service để xử lý lưu cả dữ liệu và file vật lý
        Long mockUserId = 1L; 
        // Tại dòng 33 của PatentController.java, hãy sửa thành:
        Application savedApp = patentService.submitPatent(dto, mockUserId, files);
        
        return ResponseEntity.ok(savedApp);
    }
}