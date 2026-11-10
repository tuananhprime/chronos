package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.TTInwardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TTInwardTransactionRepository extends JpaRepository<TTInwardTransaction, Integer> {

    // Tìm sender xem đã tồn tại chưa
    Optional<TTInwardTransaction> findBySender(String sender);

    // Có thể thêm để kiểm tra nhanh sự tồn tại (nếu cần)
    boolean existsBySender(String sender);
    boolean existsByTransactionID(Integer transactionID);
};
