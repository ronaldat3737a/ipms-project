package com.ipms.dto;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Cực kỳ quan trọng: Bỏ qua nếu React gửi thừa trường lạ, tránh lỗi 500
public class PatentSubmissionDTO {
    
    // Bước 1: Thông tin chung
    private String appType; 
    private String title;
    private String solutionDetail;
    private String solutionType;
    private String technicalField;
    private String summary;
    
    // Sửa lỗi mapping ipcCode (đã thống nhất)
    @JsonProperty("ipcCode")
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<String> ipcCodes;

    // Bước 2: Thông tin Chủ đơn (DẠNG PHẲNG - Khớp 100% với React)
    private String ownerType;    // Khớp với "ownerType" từ React
    private String ownerName;    // Khớp với "ownerName" từ React
    private String ownerDob;     // Khớp với "ownerDob" từ React
    private String ownerId;      // Khớp với "ownerId" từ React
    private String ownerAddress; // Khớp với "ownerAddress" từ React
    private String ownerPhone;   // Khớp với "ownerPhone" từ React
    private String ownerEmail;   // Khớp với "ownerEmail" từ React
    private String ownerRepCode; // Khớp với "ownerRepCode" từ React

    // Bước 2: Danh sách Tác giả (Vẫn là mảng nên giữ nguyên)
    private List<AuthorDTO> authors;

    // Bước 3: Danh sách Tài liệu (Attachments)
    private List<AttachmentDTO> attachments;

    // Bước 4: Danh sách Điểm bảo hộ (Claims)
    private List<ClaimDTO> claims;

    // Bước 5: Thông tin phí
    private Double totalFee;
}