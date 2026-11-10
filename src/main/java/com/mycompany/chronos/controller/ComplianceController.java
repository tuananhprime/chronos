package com.mycompany.chronos.controller;

import com.mycompany.chronos.entity.Transaction;
import com.mycompany.chronos.repository.TransactionRepository;
import com.mycompany.chronos.repository.ProfileServiceRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@RestController
@RequestMapping("/api/bank")
public class ComplianceController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProfileServiceRepository profileServiceRepository;

    @GetMapping("/compliance")
    public List<Map<String, Object>> getComplianceTasks() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Transaction t : transactions) {
            Map<String, Object> map = new LinkedHashMap<>();

            // Transaction ID
            map.put("transactionId", t.getTransactionId());

            // Customer
            String customerName = null;
            if (t.getProfile() != null && t.getProfile().getCompanyName() != null) {
                customerName = t.getProfile().getCompanyName();
            } else if (t.getProfile() != null) {
                customerName = "Profile #" + t.getProfile().getProfileId();
            } else {
                customerName = "Unknown Profile";
            }
            map.put("customer", customerName);

            // Type
            String type = "Unknown";
            try {
                if (transactionRepository.existsInTT(t.getTransactionId())) {
                    type = "T/T";
                } else if (transactionRepository.existsInLC(t.getTransactionId())) {
                    type = "L/C";
                }
            } catch (Exception e) {
                System.err.println("Error checking type for transaction " + t.getTransactionId() + ": " + e.getMessage());
            }
            map.put("type", type);

            // Amount
            String amountStr = String.format("$%,.2f USD", t.getAmount());
            map.put("amount", amountStr);

            // Submitted Date
            map.put("submittedDate", t.getCreatedAt() != null ? t.getCreatedAt().toString() : "N/A");

            // Status – map lại các status backend thành frontend dễ dùng
            String status = t.getStatus() != null ? t.getStatus() : "unknown";
            switch(status) {
                case "Pending Approval": status = "APPROVED"; break;
                case "Rejected": status = "REJECTED"; break;
                case "Request Information": status = "REQUEST_INFO"; break;
                default: break;
            }
            map.put("status", status);

            result.add(map);
        }

        return result;
    }
}
