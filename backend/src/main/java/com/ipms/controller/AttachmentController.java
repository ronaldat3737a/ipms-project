package com.ipms.controller;

import com.ipms.entity.ApplicationAttachment;
import com.ipms.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AttachmentController {

    private final AttachmentRepository attachmentRepository;

    @Value("${upload.path:uploads/}")
    private String uploadPath;

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id) {
        // 1. Tìm thông tin file trong DB bằng ID
        ApplicationAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy file với ID: " + id));

        try {
            // 2. Lấy đường dẫn đến thư mục upload và kết hợp với fileUrl đã lưu
            // fileUrl trong DB là tên file duy nhất (ví dụ: uuid_tendocgoc.pdf)
            Path fileStorageLocation = Paths.get(uploadPath).toAbsolutePath().normalize();
            Path filePath = fileStorageLocation.resolve(attachment.getFileUrl()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            // 3. Kiểm tra file có tồn tại trên ổ đĩa không
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Lỗi: Không thể đọc file trên server: " + attachment.getFileName());
            }
            
            // 4. Trả về cho client
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM) // Kiểu chung cho download file
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Lỗi tạo đường dẫn file: " + e.getMessage());
        }
    }
}
