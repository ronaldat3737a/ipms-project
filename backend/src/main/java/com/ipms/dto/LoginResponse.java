package com.ipms.dto;
import com.ipms.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private UserRole role;
    private String fullName;
}