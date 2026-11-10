package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.LC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface LCRepository extends JpaRepository<LC, Integer> {

    // Lấy toàn bộ transactionID thuộc LC của profile
    @Query("""
        SELECT l.transactionID
        FROM LC l
        WHERE l.profileId = :profileId
          AND l.transactionID IS NOT NULL
    """)
    Set<Integer> findTransactionIdsByProfileId(@Param("profileId") Integer profileId);
}
