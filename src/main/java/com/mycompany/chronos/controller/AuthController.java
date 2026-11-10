package com.mycompany.chronos.controller;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.dto.RegisterRequest;
import com.mycompany.chronos.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            String token = authService.register(req);
            // Nếu authService trả ra chuỗi lỗi thì gửi lỗi
            if (token.equals("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác")) {
                return ResponseEntity.badRequest().body(Map.of("error", token));
            }
            // Trả về JSON chứa token
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    try {
        // authService.login có thể trả về token
        String token = authService.login(req);

        if (token.equals("Tên đăng nhập hoặc mật khẩu không đúng!")) {
            return ResponseEntity.status(401).body(Map.of("error", token));
        }

        // Giả sử authService có thể lấy profileId dựa vào username
        Integer profileId = authService.getProfileIdByUsername(req.getUsername());

        // Trả về token + profileId
        return ResponseEntity.ok(Map.of(
            "token", token,
            "profileId", profileId
        ));
    } catch (Exception e) {
        return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
    }
}
}
