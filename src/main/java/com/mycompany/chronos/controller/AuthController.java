package com.mycompany.chronos.controller;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.dto.RegisterRequest;
import com.mycompany.chronos.service.AuthService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(Map.of("token", auth.register(req)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(Map.of("error", "Tên đăng nhập hoặc email đã được sử dụng."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String token = auth.login(req);
        if (token.equals("Tên đăng nhập hoặc mật khẩu không đúng!")) {
            return ResponseEntity.status(401).body(Map.of("error", token));
        }
        Integer profileId = auth.getProfileIdByUsername(req.getUsername());
        var result = new java.util.HashMap<String, Object>();
        result.put("token", token);
        if (profileId != null) result.put("profileId", profileId);
        return ResponseEntity.ok(result);
    }
}
