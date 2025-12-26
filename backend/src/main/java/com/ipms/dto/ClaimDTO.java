package com.ipms.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data; // Phải có dòng này

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Thêm dòng này
public class ClaimDTO {
    private Integer orderIndex;
    private String type; // 'Độc lập' hoặc 'Phụ thuộc'
    private String content;
    private Integer parentOrderIndex; // Tham chiếu đến số thứ tự điểm cha
}
