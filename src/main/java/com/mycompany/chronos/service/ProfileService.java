package com.mycompany.chronos.service;

import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.repository.ProfileServiceRepository;
import com.mycompany.chronos.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileServiceRepository profileRepo;
    private final UserRepository userRepo;

    public ProfileService(ProfileServiceRepository profileRepo, UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    // Tạo profile mới khi user đăng ký
    public Profile createProfileForUser(User user, String taxCode, String companyName) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setTaxCode(taxCode);
        profile.setCompanyName(companyName);
        profile.setStatus("ACTIVE");
        profile.getCreatedAt();

        return profileRepo.save(profile);
    }

    // Lấy profile theo ID
    public Profile getProfileById(Integer id) {
        return profileRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy profile ID: " + id));
    }

    // Lấy profile theo User
    public Optional<Profile> getProfileByUser(User user) {
        if (user == null || user.getUserId() == null) {
            return Optional.empty();
        }
        return profileRepo.findByUserId(user.getUserId());
    }

    // Lấy profileId từ username (dùng khi login)
    public Integer getProfileIdByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại: " + username));

        return profileRepo.findByUserId(user.getUserId())
                .map(Profile::getProfileId)
                .orElse(null);
    }

    // Tìm profile theo taxCode + companyName
    public Optional<Profile> findByTaxAndCompany(String taxCode, String companyName) {
        return profileRepo.findByTaxCodeAndCompanyName(taxCode, companyName);
    }
    
    // === Lưu hoặc cập nhật profile ===
    public Profile saveProfile(Profile profile) {
        if (profile.getCreatedAt() == null) {
            profile.getCreatedAt();
        }
        return profileRepo.save(profile);
    }
}
