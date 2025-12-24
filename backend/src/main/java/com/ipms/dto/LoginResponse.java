package com.ipms.dto;

import com.ipms.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String message;
    private UserRole role;
    private String fullName;
    private String email;      
    private String cccdNumber; 
    private Long id;
    private LocalDate dob;      // THÊM MỚI
    private String phoneNumber; // THÊM MỚI
}