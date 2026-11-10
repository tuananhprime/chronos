package com.mycompany.chronos.controller;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.service.BankAuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/bank/auth")
public class BankAuthController {

    private final BankAuthService bankAuthService;

    public BankAuthController(BankAuthService bankAuthService) {
        this.bankAuthService = bankAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            String token = bankAuthService.login(req);

            // Nếu sai tài khoản/mật khẩu hoặc không phải bank user
            if (token.equals("Tên đăng nhập hoặc mật khẩu không đúng!") || token.equals("Tài khoản không tồn tại trong hệ thống Ngân hàng")) {
                return ResponseEntity.status(401).body(Map.of("error", token));
            }

            // Lấy userId (vì cả user và bankuser chung bảng)
            Integer userId = bankAuthService.getUserIdByUsername(req.getUsername());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", userId,
                    "role", "bank_user"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
