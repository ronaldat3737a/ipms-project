package com.ipms.dto;

import com.ipms.entity.enums.AppStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    
    private UUID applicationId; // ID của hồ sơ cần xét duyệt
    
    private AppStatus status;   // Trạng thái mới (lấy từ Enum của bạn)
    
    private String note;        // Nội dung ghi chú/nhận xét
    
    private Long examinerId;    // ID người thực hiện xét duyệt
}