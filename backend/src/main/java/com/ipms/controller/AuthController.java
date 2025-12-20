package com.ipms.controller;

import com.ipms.entity.User;
import com.ipms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 1. Thêm thư viện mã hóa
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 2. Khai báo công cụ mã hóa mật khẩu
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // 1. Kiểm tra logic nghiệp vụ (Giữ nguyên của bạn)
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email đã được sử dụng!");
        }
        if (userRepository.existsByCccdNumber(user.getCccdNumber())) {
            return ResponseEntity.badRequest().body("Lỗi: Số CCCD đã tồn tại trên hệ thống!");
        }

        try {
            // 2. LOGIC MÃ HÓA MẬT KHẨU (Thêm mới)
            // Lấy mật khẩu thô từ người dùng nhập -> Mã hóa nó -> Gán lại vào Object
            String rawPassword = user.getPasswordHash();
            String hashedPassword = passwordEncoder.encode(rawPassword);
            user.setPasswordHash(hashedPassword);

            // 3. Lưu vào database ipms_db (Giữ nguyên của bạn)
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok("Đăng ký thành công cho: " + savedUser.getFullName());
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}