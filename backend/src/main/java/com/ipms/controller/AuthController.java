package com.ipms.controller;

import com.ipms.entity.User;
import com.ipms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // 1. Kiểm tra logic nghiệp vụ
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email đã được sử dụng!");
        }
        if (userRepository.existsByCccdNumber(user.getCccdNumber())) {
            return ResponseEntity.badRequest().body("Lỗi: Số CCCD đã tồn tại trên hệ thống!");
        }

        // 2. Lưu vào database ipms_db
        // Lưu ý: Trong thực tế bạn nên mã hóa password trước khi lưu
        user.setPasswordHash(user.getPasswordHash()); 
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok("Đăng ký thành công cho: " + savedUser.getFullName());
    }
}