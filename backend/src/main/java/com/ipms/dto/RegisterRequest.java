package com.ipms.dto;

import com.ipms.entity.UserRole;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String fullName;
    private LocalDate dob;
    private String cccdNumber;
    private String email;
    private String phoneNumber;
    private String password; // Đổi tên thành password cho chuẩn JSON gửi từ React
    private UserRole role;
    private String securityCode;
}