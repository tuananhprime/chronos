package com.mycompany.chronos.service;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.repository.UserRepository;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class BankAuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtTokenUtil;
    private final AuthService authService;

    public BankAuthService(UserRepository userRepository, JwtUtil jwtTokenUtil, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public String login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername()).orElse(null);

        if (user == null) {
            return "Tên đăng nhập hoặc mật khẩu không đúng!";
        }

        // Kiểm tra role phải là BANK
        if (!"bank_user".equalsIgnoreCase(user.getRole())) {
            return "Tài khoản không tồn tại trong hệ thống Ngân hàng";
        }

        // So sánh mật khẩu thường (không mã hoá)
        if (!authService.matchesPassword(user, req.getPassword())) {
            return "Tên đăng nhập hoặc mật khẩu không đúng!";
        }

        // Tạo JWT token
        return jwtTokenUtil.generateToken(user.getUsername());
    }

    public Integer getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return user != null ? user.getUserId() : null;
    }
}