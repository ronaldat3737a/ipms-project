package com.ipms.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ipms.dto.PatentSubmissionDTO;
import com.ipms.entity.Application;
import com.ipms.service.PatentService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// Import cho xử lý File và Path (Java chuẩn)
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;

// Import cho Spring Framework (Xử lý Resource và Header)
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;


import java.util.Map;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
@CrossOrigin(
    origins = "http://localhost:5173", 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class PatentController {

    private final PatentService patentService;

    // --- 1. CHỨC NĂNG DÀNH CHO NGƯỜI NỘP ĐƠN (APPLICANT) ---
    
    // ENDPOINT MỚI: BƯỚC 1 - TẠO ĐƠN NHÁP VỚI TRẠNG THÁI "MOI"
    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, UUID>> createApplication(
            @RequestPart("patentData") String patentDataJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        PatentSubmissionDTO dto = objectMapper.readValue(patentDataJson, PatentSubmissionDTO.class);

        // Giả lập UserId (Cần khớp với kiểu dữ liệu trong User Entity của bạn)
        Long mockUserId = 1L;

        Application createdApp = patentService.createApplication(dto, mockUserId, files);
        return ResponseEntity.ok(Map.of("id", createdApp.getId()));
    }

    // ENDPOINT MỚI: BƯỚC 2 - NỘP ĐƠN CHÍNH THỨC
    @PostMapping("/{id}/submit")
    public ResponseEntity<Application> submitApplication(@PathVariable UUID id) {
        Application submittedApp = patentService.submitApplication(id);
        return ResponseEntity.ok(submittedApp);
    }


    // --- 2. CHỨC NĂNG DÀNH CHO THẨM ĐỊNH VIÊN (EXAMINER) ---
    // Đây là phương thức bạn đang thiếu dẫn đến lỗi 404
    @GetMapping("/all")
    public ResponseEntity<List<Application>> getAllPatents() {
        // Gọi service lấy toàn bộ đơn có loại là SANG_CHE từ PostgreSQL
        List<Application> applications = patentService.getPatentApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable UUID id) {
        // Gọi service để lấy dữ liệu chi tiết hồ sơ từ Postgres
        Application application = patentService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

     // Tại file com.ipms.controller.PatentController.java

@PatchMapping("/{id}/status")
public ResponseEntity<Application> updateStatus(
        @PathVariable UUID id, 
        @RequestBody Map<String, String> statusUpdate) {
    
    String newStatus = statusUpdate.get("status");
    Application updatedApp = patentService.updateApplicationStatus(id, newStatus);
    return ResponseEntity.ok(updatedApp);
}
    // Bổ sung vào PatentController.java



@GetMapping("/download/{fileName:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
    try {
        // 1. Giải mã tên file từ URL (Chuyển các ký tự mã hóa về tiếng Việt chuẩn)
        String decodedFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8.name());
        
        // 2. Lấy đường dẫn tuyệt đối đến thư mục uploads
        Path filePath = Paths.get("uploads").toAbsolutePath().resolve(decodedFileName).normalize();
        
        // In log để kiểm tra (Xem trong console Java xem có còn hiện ?? không)
        System.out.println("DEBUG: Dang tim file tai: " + filePath.toString());

        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } else {
            System.err.println("DEBUG: Khong tim thay file tren o cung: " + decodedFileName);
            return ResponseEntity.notFound().build();
        }
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}

}