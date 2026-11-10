package com.mycompany.chronos.service;

import com.mycompany.chronos.repository.BankDashboardRepository;
import org.springframework.stereotype.Service;

@Service
public class BankDashboardService {

    private final BankDashboardRepository transactionRepository;

    public BankDashboardService(BankDashboardRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public long getWaitingComplianceCount() {
        return transactionRepository.countWaitingCompliance();
    }

    public long getWaitingApprovalCount() {
        return transactionRepository.countWaitingApproval();
    }

    public long getWaitingProcessingCount() {
        return transactionRepository.countWaitingProcessing();
    }
}
