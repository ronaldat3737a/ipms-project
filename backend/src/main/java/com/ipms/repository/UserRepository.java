package com.ipms.repository;

import com.ipms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Kiểm tra trùng lặp email và CCCD trước khi lưu
    boolean existsByEmail(String email);
    boolean existsByCccdNumber(String cccdNumber);
    // Tìm kiếm người dùng theo email
    java.util.Optional<User> findByEmail(String email);
}
