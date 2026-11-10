package com.mycompany.chronos.controller;

import com.mycompany.chronos.service.ScreeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/screening")
public class ScreeningController {

    @Autowired
    private ScreeningService screeningService;

    /**
     * API screening cho transaction
     * GET /api/screening/transaction/{id}
     * @param transactionId
     * @return 
     */
    @GetMapping("/transaction/{id}")
    public ResponseEntity<Map<String, Object>> screenTransaction(
            @PathVariable("id") Integer transactionId) {

        Map<String, Object> result = screeningService.screenTransaction(transactionId);
        return ResponseEntity.ok(result);
    }
}
