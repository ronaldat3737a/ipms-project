package com.ipms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình CORS để React (Port 5173) có thể gọi API
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Tắt CSRF (Bắt buộc để các API POST/GET từ bên ngoài như VNPay hoạt động)
            .csrf(csrf -> csrf.disable()) 
            
            // 3. Cấu hình phân quyền truy cập
            .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả các API liên quan đến thanh toán (Tạo link, IPN, Return)
                .requestMatchers("/api/payment/**").permitAll()
                
                // Cho phép các API xác thực (Đăng ký/Đăng nhập)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Giữ nguyên chức năng cũ: Cho phép tất cả các request khác (để bạn dễ Demo)
                // Sau này khi nộp đồ án, bạn có thể đổi thành .anyRequest().authenticated() để bảo mật hơn
                .anyRequest().permitAll() 
            );

        return http.build();
    }

    // Cấu hình chi tiết CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cho phép Origin của React (Cổng 5173)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        
        // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE,...)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Cho phép tất cả các Headers
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        
        // Cho phép gửi kèm Credentials (Cookies, Auth Headers)
        configuration.setAllowCredentials(true);
        
        // Expose Headers nếu cần (ví dụ cho JWT)
        configuration.setExposedHeaders(List.of("x-auth-token"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}