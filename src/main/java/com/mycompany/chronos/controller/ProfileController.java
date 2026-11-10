package com.mycompany.chronos.controller;

import com.mycompany.chronos.dto.ProfileResponse;
import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // --- GET profile theo profileId ---
    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfile(@PathVariable("profileId") Integer profileId) {
        Profile profile = profileService.getProfileById(profileId);

        if (profile == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found"));
        }

        ProfileResponse pr = mapToDto(profile);
        return ResponseEntity.ok(pr);
    }

    // --- POST update profile theo profileId ---
    @PostMapping("/update/{profileId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer profileId,
            @RequestBody ProfileResponse payload
    ) {
        Profile profile = profileService.getProfileById(profileId);

        if (profile == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found"));
        }

        // Cập nhật các thông tin từ payload
        profile.setCompanyName(payload.getBusinessName());
        profile.setTaxCode(payload.getTaxId());
        // Nếu muốn, có thể lưu thêm các trường khác trong Profile entity
        // profile.setCountry(payload.getRegistrationCountry());
        // profile.setIndustry(payload.getIndustryType());
        // profile.setAddress(payload.getAddress());
        // profile.setContactPerson(payload.getContactPerson());
        // profile.setPhoneNumber(payload.getPhoneNumber());

        profileService.saveProfile(profile);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // --- Hàm tiện ích map entity -> DTO ---
    private ProfileResponse mapToDto(Profile profile) {
        ProfileResponse pr = new ProfileResponse();

        if (profile.getUser() != null) {
            String username = profile.getUser().getUsername();
        // Xóa số và viết hoa
            String formattedName = username.replaceAll("\\d", "").toUpperCase();
            pr.setFullName(formattedName);
            pr.setEmail(profile.getUser().getEmail());
        }

        pr.setBusinessName(profile.getCompanyName());
        pr.setTaxId(profile.getTaxCode());
        pr.setCountry("United States"); // default
        pr.setIndustry("Technology");           // default
        pr.setAddress("120 YEN LANG, California");  // default
        pr.setContactPerson("");
        pr.setPhoneNumber("");

        return pr;
    }
}
