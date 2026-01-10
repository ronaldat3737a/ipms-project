package com.ipms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DesignRequestDto {

    // --- Thông tin chung của đơn ---
    private String appType; // Sẽ được set là 'KIEU_DANG_CN'
    private String title;
    private Integer totalPages; // Số trang của tài liệu, có thể cần cho phí

    // --- Thông tin Chủ đơn (Applicant) ---
    private String ownerType;
    private String ownerName;
    private String ownerDob;
    private String ownerId;
    private String ownerAddress;
    private String ownerPhone;
    private String ownerEmail;
    private String ownerRepCode;

    // --- Danh sách Tác giả (Authors) ---
    private List<AuthorDTO> authors;

    // --- Thông tin đặc thù của Kiểu dáng công nghiệp ---
    private String usageField;

    @JsonProperty("locarnoCodes")
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<String> locarnoCodes;

    private String similarDesign;
    private String descriptionDetail;
    private String claims; // Yêu cầu bảo hộ là một trường text

    // --- Danh sách tài liệu đính kèm (quan trọng để tính phí công bố) ---
    private List<AttachmentDTO> attachments;

    // --- Thông tin phí ---
    private Double totalFee;
}
