package com.ipms.dto;

import lombok.Data; // Phải có dòng này

@Data
public class ClaimDTO {
    private Integer orderIndex;
    private String type; // 'Độc lập' hoặc 'Phụ thuộc'
    private String content;
    private Integer parentOrderIndex; // Tham chiếu đến số thứ tự điểm cha
}
