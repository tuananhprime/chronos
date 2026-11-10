package com.mycompany.chronos.service;

import com.mycompany.chronos.entity.Blacklist;
import com.mycompany.chronos.entity.Transaction;
import com.mycompany.chronos.entity.Profile;
import com.mycompany.chronos.repository.BlacklistRepository;
import com.mycompany.chronos.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScreeningService {

    @Autowired
    private BlacklistRepository blacklistRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Map<String, Object> screenTransaction(Integer transactionId) {

        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found: " + transactionId));

        Profile profile = tx.getProfile();

        List<Blacklist> blacklists = blacklistRepository.findByIsActiveTrue();

        List<String> matchedKeywords = new ArrayList<>();
        String riskLevel = "LOW";

        // ===== RULE DUY NHẤT =====
        // Trùng COMPANY NAME -> HIGH RISK
        String companyName = safe(profile != null ? profile.getCompanyName() : "")
                .toUpperCase()
                .trim();

        for (Blacklist b : blacklists) {
            String keyword = safe(b.getKeyword())
                    .toUpperCase()
                    .trim();

            if (!keyword.isEmpty() && companyName.contains(keyword)) {
                matchedKeywords.add(b.getKeyword());
                riskLevel = "HIGH";
                break; // đủ rồi, không cần diễn tiếp
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("riskLevel", riskLevel);
        result.put("matchedKeywords", matchedKeywords);
        result.put("passed", riskLevel.equals("LOW"));

        return result;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
