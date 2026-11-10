package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BankDashboardRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdByOps IS NULL")
    long countWaitingCompliance();

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.preApprovedByOps IS NULL")
    long countWaitingApproval();

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.approvedByBankUser IS NULL")
    long countWaitingProcessing();
}
