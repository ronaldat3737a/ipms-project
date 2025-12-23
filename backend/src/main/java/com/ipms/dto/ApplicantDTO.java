package com.ipms.dto;

import lombok.Data; // Phải có dòng này

@Data
public class ApplicantDTO {
    private String type; // 'Cá nhân' hoặc 'Tổ chức'
    private String fullName;
    private String dob;
    private String idNumber;
    private String address;
    private String phone;
    private String email;
    private String repCode;
}
