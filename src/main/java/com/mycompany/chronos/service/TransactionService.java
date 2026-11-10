package com.mycompany.chronos.service;

import com.mycompany.chronos.dto.TransactionRequest;
import com.mycompany.chronos.entity.*;
import com.mycompany.chronos.repository.*;
import com.mycompany.chronos.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ImporterRepository importerRepository;

    @Autowired
    private ProfileServiceRepository profileServiceRepository;

    @Autowired
    private TTInwardTransactionRepository ttInwardTransactionRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    public Transaction createTransaction(TransactionRequest req, String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        Integer profileId = authService.getProfileIdByUsername(username);

        Profile profile = profileServiceRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy profile"));

        Importer importer = new Importer();
        importer.setProfileId(profile.getProfileId());
        importer.setCompanyName(profile.getCompanyName());
        importer.setAddress(req.getAddress());
        importerRepository.save(importer);

        Transaction transaction = new Transaction();
        transaction.setProfile(profile);
        transaction.setAmount(req.getAmount());
        transaction.setCurrency(req.getCurrency());
        transaction.setStatus("PENDING");
        transaction.setCreatedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);

        Optional<TTInwardTransaction> existingSender =
                ttInwardTransactionRepository.findBySender(profile.getCompanyName());

        if (existingSender.isEmpty()) {
            TTInwardTransaction inward = new TTInwardTransaction();
            inward.setTransactionID(transaction.getTransactionId());
            inward.setSender(profile.getCompanyName());
            ttInwardTransactionRepository.save(inward);
        }

        return transaction;
    }
}
