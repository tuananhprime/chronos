package com.mycompany.chronos.service;

import com.mycompany.chronos.dto.LoginRequest;
import com.mycompany.chronos.dto.RegisterRequest;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.entity.BusinessProfile;
import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.repository.UserRepository;
import com.mycompany.chronos.repository.BusinessProfileRepository;
import com.mycompany.chronos.repository.ProfileServiceRepository;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final ProfileServiceRepository profileServiceRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       BusinessProfileRepository businessProfileRepository,
                       ProfileServiceRepository profileServiceRepository,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.profileServiceRepository = profileServiceRepository;
        this.jwtUtil = jwtUtil;
    }

    // --- Đăng ký ---
    public String register(RegisterRequest req) {
        Optional<User> existing = userRepository.findByUsername(req.getUsername());
        if (existing.isPresent()) {
            return "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác";
        }

        User newUser = new User();
        newUser.setUsername(req.getUsername());
        newUser.setEmail(req.getEmail());
        newUser.setHashedPassword(req.getPassword()); // Giữ nguyên không mã hóa
        newUser.setRole(req.getRole() == null || req.getRole().isEmpty() ? "USER" : req.getRole());
        newUser.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        if (req.getBusinessName() != null && !req.getBusinessName().isEmpty()) {
            BusinessProfile businessProfile = new BusinessProfile();
            businessProfile.setUser(savedUser);
            businessProfile.setBusinessName(req.getBusinessName());
            businessProfile.setTaxId(req.getTaxId());
            businessProfile.setCreatedAt(LocalDateTime.now());
            BusinessProfile savedProfile = businessProfileRepository.save(businessProfile);

            Profile profileService = new Profile();
            profileService.setTaxCode(savedProfile.getTaxId());
            profileService.setCompanyName(savedProfile.getBusinessName());
            profileService.setStatus("ACTIVE");
            profileServiceRepository.save(profileService);
        }

        // ✅ Trả JWT thật
        return jwtUtil.generateToken(savedUser.getUsername());
    }

    // --- Đăng nhập ---
    public String login(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername());
        if (userOpt.isEmpty()) {
            return "Tên đăng nhập hoặc mật khẩu không đúng!";
        }

        User user = userOpt.get();
        if (!user.getHashedPassword().equals(req.getPassword())) {
            return "Tên đăng nhập hoặc mật khẩu không đúng!";
        }

        // ✅ Trả JWT thật thay vì TOKEN-xxx
        return jwtUtil.generateToken(user.getUsername());
    }
     // --- Lấy profileId từ username ---
    public Integer getProfileIdByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();
        Optional<BusinessProfile> bpOpt = businessProfileRepository.findByUser(user);
        return bpOpt.map(BusinessProfile::getBusinessId).orElse(null);
    }
}