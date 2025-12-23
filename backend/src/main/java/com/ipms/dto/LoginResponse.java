package com.ipms.dto;
import com.ipms.entity.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private UserRole role;
    private String fullName;
    private String email;      
    private String cccdNumber; 
    private Long id;
}