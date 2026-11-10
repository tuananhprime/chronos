package com.mycompany.chronos.service;

import com.mycompany.chronos.entity.BusinessProfile;
import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.repository.BusinessProfileRepository;
import com.mycompany.chronos.repository.ProfileServiceRepository;
import com.mycompany.chronos.repository.TransactionRepository;
import com.mycompany.chronos.repository.UserRepository;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final ProfileServiceRepository profileServiceRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(
            JwtUtil jwtUtil,
            UserRepository userRepository,
            BusinessProfileRepository businessProfileRepository,
            ProfileServiceRepository profileServiceRepository,
            TransactionRepository transactionRepository
    ) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.profileServiceRepository = profileServiceRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getDashboardKPIs(String token) {
        // 1️⃣ Giải mã token -> username
        String username = jwtUtil.extractUsername(token);

        // 2️⃣ Lấy user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Lấy BusinessProfile
        BusinessProfile businessProfile = businessProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Business profile not found"));

        // 4️⃣ Tìm ProfileService tương ứng (qua tax_id hoặc business_name)
        Profile profileService = profileServiceRepository
                .findByTaxCodeAndCompanyName(businessProfile.getTaxId(), businessProfile.getBusinessName())
                .orElseThrow(() -> new RuntimeException("ProfileService not found"));

        Integer profileId = profileService.getProfileId();

        // 5️⃣ Lấy dữ liệu thống kê
        long pendingApprovals = transactionRepository.countPendingApprovals(profileId);
        double totalValueThisMonth = transactionRepository.sumTotalValueThisMonth(profileId);
        long totalTransactions = transactionRepository.countAllByProfileId(profileId);

        // 6️⃣ Trả kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("pendingApprovals", pendingApprovals);
        result.put("totalValueThisMonth", totalValueThisMonth);
        result.put("totalTransactions", totalTransactions);
        result.put("companyName", profileService.getCompanyName());
        result.put("user", username);

        return result;
    }
}
