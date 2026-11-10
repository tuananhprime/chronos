package com.mycompany.chronos.service;

import com.mycompany.chronos.entity.*;
import com.mycompany.chronos.repository.*;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class LCService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final ProfileServiceRepository profileServiceRepository;
    private final LCRepository lcRepository;
    private final TransactionRepository transactionRepository;

    public LCService(
            JwtUtil jwtUtil,
            UserRepository userRepository,
            BusinessProfileRepository businessProfileRepository,
            ProfileServiceRepository profileServiceRepository,
            LCRepository lcRepository,
            TransactionRepository transactionRepository
    ) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.profileServiceRepository = profileServiceRepository;
        this.lcRepository = lcRepository;
        this.transactionRepository = transactionRepository;
    }

    public LC createLCWithToken(String token, LC lcRequest) {
        // 1️⃣ Giải mã token để lấy username
        String username = jwtUtil.extractUsername(token);

        // 2️⃣ Tìm user tương ứng
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Tìm BusinessProfile
        BusinessProfile businessProfile = businessProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Business profile not found"));

        // 4️⃣ Tìm ProfileService để lấy profileId
        Profile profileService = profileServiceRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("ProfileService not found"));

        Integer profileId = profileService.getProfileId();

        // 5️⃣ Tạo transaction trước
        Transaction tt = new Transaction();
        tt.setAmount(lcRequest.getAmount());
        tt.setCurrency("USD");
        tt.setStatus("PENDING");
        tt.setProfile(profileService);
        tt.setCreatedAt(LocalDateTime.now());

        Transaction savedTx = transactionRepository.save(tt);

        // 6️⃣ Tạo LC mới và gắn transactionID
        LC lc = new LC();
        lc.setApplicant(lcRequest.getApplicant());
        lc.setBeneficiary(lcRequest.getBeneficiary());
        lc.setExpiryDate(lcRequest.getExpiryDate());
        lc.setAmount(lcRequest.getAmount());
        lc.setStatus("PENDING");
        lc.setIssueDate(LocalDate.now());
        lc.setTransactionID(savedTx.getTransactionId());
        lc.setProfileId(profileId);

        // 7️⃣ Lưu vào DB
        return lcRepository.save(lc);
    }
}
