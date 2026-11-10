package com.mycompany.chronos.service;

import com.mycompany.chronos.dto.TransactionResponse;
import com.mycompany.chronos.entity.BusinessProfile;
import com.mycompany.chronos.entity.Transaction;
import com.mycompany.chronos.entity.User;
import com.mycompany.chronos.repository.BusinessProfileRepository;
import com.mycompany.chronos.repository.TransactionRepository;
import com.mycompany.chronos.repository.UserRepository;
import com.mycompany.chronos.repository.LCRepository;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionViewService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BusinessProfileRepository businessProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LCRepository lcRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<TransactionResponse> getLatestTransactionsForCurrentUser(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        // 1️⃣ username → User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Integer userId = user.getUserId();

        // 2️⃣ userId → BusinessProfile
        BusinessProfile businessProfile = businessProfileRepository
                .findByUser_UserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("BusinessProfile not found for userId: " + userId)
                );

        // 3️⃣ business_id == profileId
        Integer profileId = businessProfile.getBusinessId();

        // 4️⃣ profileId → Transactions
        List<Transaction> txList =
                transactionRepository.findTop1000ByProfileIdOrderByCreatedAtDesc(profileId);

        // 5️⃣ Lấy toàn bộ transactionID thuộc LC của profile (1 query, không ngu)
        Set<Integer> lcTransactionIds =
                lcRepository.findTransactionIdsByProfileId(profileId);

        // 6️⃣ Map response, xác định type đúng nghiệp vụ
        return txList.stream()
                .map(tx -> {
                    String type = lcTransactionIds.contains(tx.getTransactionId())
                            ? "LC"
                            : "TT";

                    return new TransactionResponse(
                            tx.getTransactionId(),
                            type,
                            tx.getCreatedAt(),
                            tx.getStatus(),
                            tx.getAmount(),
                            tx.getCurrency()
                    );
                })
                .collect(Collectors.toList());
    }
}
