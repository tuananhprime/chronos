package com.mycompany.chronos.config;

import com.mycompany.chronos.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
public class ApiAuthenticationFilter extends OncePerRequestFilter {
    private static final Set<String> PUBLIC_ENDPOINTS = Set.of(
        "/api/auth/login", "/api/auth/register", "/api/bank/auth/login"
    );
    private final JwtUtil jwtUtil;
    private final com.mycompany.chronos.repository.UserRepository users;
    private final com.mycompany.chronos.repository.ProfileServiceRepository profiles;

    public ApiAuthenticationFilter(JwtUtil jwtUtil, com.mycompany.chronos.repository.UserRepository users, com.mycompany.chronos.repository.ProfileServiceRepository profiles) {
        this.jwtUtil = jwtUtil;
        this.users = users;
        this.profiles = profiles;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain chain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (!path.startsWith("/api/") || PUBLIC_ENDPOINTS.contains(path)
                || "OPTIONS".equals(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }
        String header = request.getHeader("Authorization");
        boolean authenticated = false;
        com.mycompany.chronos.entity.User currentUser = null;
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String username = jwtUtil.extractUsername(header.substring(7));
                currentUser = users.findByUsername(username).orElse(null);
                authenticated = currentUser != null;
            } catch (RuntimeException ignored) {
                // Invalid signatures and expired tokens require a new login.
            }
        }
        if (!authenticated) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"Vui lòng đăng nhập để thực hiện thao tác này.\"}");
            return;
        }
        boolean bankOnly = path.startsWith("/api/bank/") || path.startsWith("/api/compliance/") || path.startsWith("/api/screening/");
        if (bankOnly && !"bank_user".equalsIgnoreCase(currentUser.getRole())) {
            response.setStatus(403);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"Bạn không có quyền thực hiện thao tác này.\"}");
            return;
        }
        if (path.matches("/api/profile/(?:update/)?[0-9]+")) {
            Integer profileId = Integer.valueOf(path.substring(path.lastIndexOf('/') + 1));
            if (!profiles.existsByProfileIdAndUser_UserId(profileId, currentUser.getUserId())) {
                response.setStatus(403);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"Bạn không có quyền truy cập hồ sơ này.\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
