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

    public ApiAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
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
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String username = jwtUtil.extractUsername(header.substring(7));
                authenticated = username != null && !username.isBlank();
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
        chain.doFilter(request, response);
    }
}
