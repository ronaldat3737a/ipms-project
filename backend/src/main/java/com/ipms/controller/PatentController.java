package com.ipms.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ipms.dto.PatentSubmissionDTO;
import com.ipms.entity.Application;
import com.ipms.entity.enums.AppStatus;
import com.ipms.service.PatentService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ipms.repository.ReviewHistoryRepository;

// Import cho xử lý File và Path (Java chuẩn)
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;

// Import cho Spring Framework (Xử lý Resource và Header)
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

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
    private final ReviewHistoryRepository reviewHistoryRepository;

    @GetMapping("/{id}/rejection-detail")
    public ResponseEntity<?> getRejectionDetail(@PathVariable UUID id) {
        // Bây giờ biến reviewHistoryRepository đã có thể sử dụng được
        return reviewHistoryRepository.findFirstByApplicationIdAndStatusToOrderByReviewDateDesc(id, AppStatus.TU_CHOI_DON)
            .map(history -> ResponseEntity.ok(Map.of(
                "reason", history.getNote() != null ? history.getNote() : "Không có lý do chi tiết",
                "date", history.getReviewDate()
            )))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Không tìm thấy dữ liệu từ chối cho hồ sơ này.")));
    }

    @GetMapping("/{id}/correction-detail")
    public ResponseEntity<?> getCorrectionDetail(@PathVariable UUID id) {
        // Tìm bản ghi lịch sử mới nhất có trạng thái "Chờ sửa đổi" (Hình thức hoặc Nội dung)
        return reviewHistoryRepository.findFirstByApplicationIdAndNoteIsNotNullOrderByReviewDateDesc(id)
            .map(history -> ResponseEntity.ok(Map.of(
                "note", history.getNote(),
                "date", history.getReviewDate(),
                "status", history.getStatusTo()
            )))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Không tìm thấy yêu cầu sửa đổi cho hồ sơ này.")));
    }

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

    // ENDPOINT: CẬP NHẬT LẠI HỒ SƠ SAU KHI SỬA ĐỔI
    // SỬA: Đổi consumes thành MULTIPART_FORM_DATA_VALUE
@PutMapping(value = "/{id}/resubmit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
public ResponseEntity<Application> resubmitApplication(
        @PathVariable UUID id,
        @RequestPart("patentData") String patentDataJson, // Nhận JSON dạng String giống hàm create
        @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {

    // Chuyển chuỗi JSON thành DTO
    ObjectMapper objectMapper = new ObjectMapper();
    PatentSubmissionDTO dto = objectMapper.readValue(patentDataJson, PatentSubmissionDTO.class);

    // Gọi service xử lý (Đảm bảo hàm resubmitApplication trong Service cũng nhận thêm tham số files)
    Application resubmittedApp = patentService.resubmitApplication(id, dto, files); 
    return ResponseEntity.ok(resubmittedApp);
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
        
        // 1. Lấy trạng thái mới từ JSON (ví dụ: TU_CHOI_DON)
        String newStatus = statusUpdate.get("status");
        
        // 2. MỚI: Lấy thêm lý do/ghi chú từ JSON (trường 'note' gửi từ React)
        String note = statusUpdate.get("note"); 
        
        // 3. Gọi Service với 3 tham số (ID, Status, Note) để thực hiện lưu DB và ReviewHistory
        Application updatedApp = patentService.updateApplicationStatus(id, newStatus, note);
        
        return ResponseEntity.ok(updatedApp);
    }


}