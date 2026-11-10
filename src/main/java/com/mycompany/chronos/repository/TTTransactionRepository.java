package com.mycompany.chronos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mycompany.chronos.entity.Transaction;

public interface TTTransactionRepository extends JpaRepository<Transaction, Integer> {
}
