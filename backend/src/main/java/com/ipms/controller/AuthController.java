package com.ipms.controller;

import com.ipms.dto.LoginRequest;
import com.ipms.dto.LoginResponse;
import com.ipms.dto.RegisterRequest;
import com.ipms.entity.User;
import com.ipms.entity.enums.UserRole;
import com.ipms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Khai báo công cụ băm mật khẩu BCrypt
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Mã bảo mật nhân viên cố định để xác thực quyền đăng ký Người duyệt đơn
    private final String STAFF_SECURITY_CODE = "NhanVienIP2025";

    /**
     * API Đăng ký người dùng mới
     * Xử lý cho cả APPLICANT (Người nộp đơn) và EXAMINER (Người duyệt đơn)
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        
        // 1. Kiểm tra Email đã tồn tại trong Database chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }

        // 2. Kiểm tra CCCD/Mã nhân viên đã tồn tại chưa (Dùng chung cột cccd_number)
        if (userRepository.existsByCccdNumber(request.getCccdNumber())) {
            String label = (request.getRole() == UserRole.EXAMINER) ? "Mã số nhân viên" : "Số CCCD";
            return ResponseEntity.badRequest().body("Lỗi: " + label + " này đã tồn tại trên hệ thống!");
        }

        // 3. Kiểm tra mã xác thực nhân viên nếu role là Người duyệt đơn
        if (request.getRole() == UserRole.EXAMINER) {
            if (request.getSecurityCode() == null || !request.getSecurityCode().equals(STAFF_SECURITY_CODE)) {
                return ResponseEntity.status(403).body("Lỗi: Mã code xác thực nhân viên không chính xác!");
            }
        }

        try {
            // 4. Khởi tạo Entity User và ánh xạ dữ liệu từ DTO (RegisterRequest)
            User user = new User();
            user.setFullName(request.getFullName());
            user.setDob(request.getDob());
            user.setCccdNumber(request.getCccdNumber()); // Lưu CCCD hoặc Mã NV vào cột định danh duy nhất
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(request.getRole());

            // 5. Logic mã hóa mật khẩu
            // Lấy mật khẩu thô từ trường 'password' trong DTO gửi từ React
            String rawPassword = request.getPassword();
            String hashedPassword = passwordEncoder.encode(rawPassword);
            user.setPasswordHash(hashedPassword); // Gán mật khẩu đã băm vào Entity để lưu xuống DB

            // 6. Thực hiện lưu vào database ipms_db
            userRepository.save(user);
            
            String roleDisplayName = (request.getRole() == UserRole.EXAMINER) ? "Nhân viên" : "Người nộp đơn";
            return ResponseEntity.ok("Đăng ký thành công vai trò " + roleDisplayName + ": " + user.getFullName());

        } catch (Exception e) {
            // Trả về lỗi 500 nếu có sự cố phát sinh trong quá trình lưu dữ liệu
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
    // 1. Tìm người dùng theo email
    return userRepository.findByEmail(request.getEmail())
        .map(user -> {
            // 2. So khớp mật khẩu (Mật khẩu thô vs Mật khẩu đã mã hóa)
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                // 3. Nếu khớp, trả về thông tin vai trò
                return ResponseEntity.ok(new LoginResponse(
                    "Đăng nhập thành công!", 
                    user.getRole(), 
                    user.getFullName(),
                    user.getEmail(),      
                    user.getCccdNumber(), 
                    user.getId(),
                    user.getDob(),          
                    user.getPhoneNumber()

                ));
            } else {
                return ResponseEntity.badRequest().body("Mật khẩu không chính xác!");
            }
        })
        .orElse(ResponseEntity.badRequest().body("Email không tồn tại trên hệ thống!"));
    }
   
}