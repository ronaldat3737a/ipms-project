package com.ipms.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatentSubmissionDTO {
    // Bước 1: Thông tin chung
    private String appType;          // 'Sáng chế' hoặc 'Giải pháp hữu ích'
    private String title;
    private String solutionDetail;
    private String solutionType;    // 'Sản phẩm' hoặc 'Quy trình'
    private String technicalField;
    private List<String> ipcCodes;  // Danh sách các mã IPC
    private String summary;

    // Bước 2: Thông tin Chủ đơn (Applicant)
    private ApplicantDTO owner;

    // Bước 2: Danh sách Tác giả (Authors)
    private List<AuthorDTO> authors;

    // Bước 3: Danh sách Tài liệu (Attachments)
    private List<AttachmentDTO> attachments;

    // Bước 4: Danh sách Điểm bảo hộ (Claims)
    private List<ClaimDTO> claims;

    // Bước 5: Thông tin phí
    private Double totalFee;
}