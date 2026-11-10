package com.mycompany.chronos.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;

    // ✅ Lấy secret key từ application.properties và decode Base64
    public JwtUtil(org.springframework.core.env.Environment env) {
        String secret = env.getProperty("app.jwt.secret");
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // 🔹 Tạo token từ username
    public String generateToken(String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 86400000)) // 1 ngày
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔹 Giải mã token -> username
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 🔹 Kiểm tra token hết hạn chưa
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // 🔹 Xác thực token với username
    public boolean validateToken(String token, String username) {
        try {
            String extractedUsername = extractUsername(token);
            boolean valid = extractedUsername.equals(username) && !isTokenExpired(token);
            if (!valid) {
                System.out.println("⚠️ Token invalid or expired for user: " + extractedUsername);
            }
            return valid;
        } catch (Exception e) {
            System.out.println("❌ Token invalid: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            return false;
        }
    }

    // 🔹 Lấy payload (Claims)
    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("❌ Token parse error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        }
    }
    
}
