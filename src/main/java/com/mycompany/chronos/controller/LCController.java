package com.mycompany.chronos.controller;

import com.mycompany.chronos.entity.LC;
import com.mycompany.chronos.service.LCService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lc")
@CrossOrigin(origins = "*")
public class LCController {

    private final LCService lcService;

    public LCController(LCService lcService) {
        this.lcService = lcService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLC(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody LC lc
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // bỏ "Bearer "
        try {
            LC created = lcService.createLCWithToken(token, lc);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create LC: " + e.getMessage());
        }
    }
}
