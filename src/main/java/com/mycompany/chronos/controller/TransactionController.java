package com.mycompany.chronos.controller;

import com.mycompany.chronos.dto.TransactionRequest;
import com.mycompany.chronos.dto.TransactionResponse;
import com.mycompany.chronos.entity.Transaction;
import com.mycompany.chronos.service.TransactionService;
import com.mycompany.chronos.service.TransactionViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionViewService transactionViewService;

    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(
            @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        Transaction tx = transactionService.createTransaction(request, authHeader);
        return ResponseEntity.ok(java.util.Map.of("transactionId", tx.getTransactionId(), "status", tx.getStatus()));
    }

    // ✅ CHỈ LẤY TRANSACTION CỦA USER ĐANG ĐĂNG NHẬP
    @GetMapping("/list")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @RequestHeader("Authorization") String authHeader
    ) {
        List<TransactionResponse> transactions =
                transactionViewService.getLatestTransactionsForCurrentUser(authHeader);
        return ResponseEntity.ok(transactions);
    }
}
