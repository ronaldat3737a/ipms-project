package com.ipms.dto;

import lombok.Data; // Phải có dòng này

@Data
public class AttachmentDTO {
    private String category; // 'Hồ sơ pháp lý', 'Tài liệu kỹ thuật'...
    private String docType;  // 'Bản mô tả', 'Yêu cầu bảo hộ'...
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String extension;
}
