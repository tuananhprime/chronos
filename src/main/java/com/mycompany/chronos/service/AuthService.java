package com.mycompany.chronos.service;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.dto.RegisterRequest;
import com.mycompany.chronos.entity.BusinessProfile;
import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.repository.BusinessProfileRepository;
import com.mycompany.chronos.repository.ProfileServiceRepository;
import com.mycompany.chronos.repository.UserRepository;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository users;
    private final BusinessProfileRepository businesses;
    private final ProfileServiceRepository profiles;
    private final JwtUtil jwt;
    private final BCryptPasswordEncoder passwords = new BCryptPasswordEncoder();

    public AuthService(UserRepository users, BusinessProfileRepository businesses,
                       ProfileServiceRepository profiles, JwtUtil jwt) {
        this.users = users;
        this.businesses = businesses;
        this.profiles = profiles;
        this.jwt = jwt;
    }

    @Transactional
    public String register(RegisterRequest req) {
        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String email = req.getEmail() == null ? "" : req.getEmail().trim();
        if (!username.matches("[a-zA-Z0-9_.-]{3,50}") || email.length() > 100
                || !email.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][A-Za-z]{2,}")
                || req.getPassword() == null || req.getPassword().length() < 8
                || req.getPassword().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72
                || req.getBusinessName() == null || req.getBusinessName().isBlank()
                || req.getBusinessName().length() > 255
                || (req.getTaxId() != null && req.getTaxId().length() > 50)) {
            throw new IllegalArgumentException("Kiểm tra thông tin đăng ký. Mật khẩu cần ít nhất 8 ký tự.");
        }
        if (users.findByUsername(username).isPresent() || users.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc email đã được sử dụng.");
        }
        User user = new User(username, email, passwords.encode(req.getPassword()), "customer");
        user.setCreatedAt(LocalDateTime.now());
        user = users.save(user);
        BusinessProfile business = new BusinessProfile();
        business.setUser(user);
        business.setBusinessName(req.getBusinessName().trim());
        business.setTaxId(req.getTaxId());
        business.setCreatedAt(LocalDateTime.now());
        businesses.save(business);
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setTaxCode(business.getTaxId());
        profile.setCompanyName(business.getBusinessName());
        profile.setStatus("ACTIVE");
        profiles.save(profile);
        return jwt.generateToken(username);
    }

    @Transactional
    public String login(LoginRequest req) {
        User user = users.findByUsername(req.getUsername() == null ? "" : req.getUsername()).orElse(null);
        if (user == null || !matchesPassword(user, req.getPassword())) {
            return "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
        return jwt.generateToken(user.getUsername());
    }

    public boolean matchesPassword(User user, String password) {
        if (password == null || password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) return false;
        String stored = user.getHashedPassword();
        if (stored.startsWith("$2")) return passwords.matches(password, stored);
        // Migrate legacy local accounts when they next log in.
        if (!stored.equals(password)) return false;
        user.setHashedPassword(passwords.encode(password));
        users.save(user);
        return true;
    }

    @Transactional
    public Integer getProfileIdByUsername(String username) {
        User user = users.findByUsername(username).orElse(null);
        if (user == null) return null;
        Profile own = profiles.findByUserId(user.getUserId()).orElse(null);
        if (own != null) return own.getProfileId();
        // Attach an existing, unassigned profile for legacy local accounts.
        BusinessProfile business = businesses.findByUser(user).orElse(null);
        if (business == null) return null;
        Profile legacy = profiles.findByTaxCodeAndCompanyName(business.getTaxId(), business.getBusinessName()).orElse(null);
        if (legacy == null || legacy.getUser() != null) return null;
        legacy.setUser(user);
        return profiles.save(legacy).getProfileId();
    }
}
