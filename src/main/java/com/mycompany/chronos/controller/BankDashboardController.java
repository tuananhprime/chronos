package com.mycompany.chronos.controller;

import com.mycompany.chronos.service.BankDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class BankDashboardController {

    private final BankDashboardService bankDashboardService;

    public BankDashboardController(BankDashboardService bankDashboardService) {
        this.bankDashboardService = bankDashboardService;
    }

    @GetMapping("/api/bank/kpi")
    public Map<String, Long> getKpiData() {
        long complianceWait = bankDashboardService.getWaitingComplianceCount();
        long approvalWait = bankDashboardService.getWaitingApprovalCount();
        long processingWait = bankDashboardService.getWaitingProcessingCount();

        return Map.of(
            "waitingComplianceReview", complianceWait,
            "waitingApproval", approvalWait,
            "waitingProcessing", processingWait
        );
    }
}
