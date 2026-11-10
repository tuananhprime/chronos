package com.mycompany.chronos.repository;

import java.util.List;
import com.mycompany.chronos.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.profile.profileId = :profileId AND UPPER(t.status) = 'PENDING'")
    long countPendingApprovals(@Param("profileId") Integer profileId);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.profile.profileId = :profileId
          AND MONTH(t.createdAt) = MONTH(CURRENT_DATE)
          AND YEAR(t.createdAt) = YEAR(CURRENT_DATE)
    """)
    double sumTotalValueThisMonth(@Param("profileId") Integer profileId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.profile.profileId = :profileId")
    long countAllByProfileId(@Param("profileId") Integer profileId);

    @Query("SELECT CASE WHEN COUNT(tt) > 0 THEN true ELSE false END FROM TTInwardTransaction tt WHERE tt.transactionID = :transactionId")
    boolean existsInTT(@Param("transactionId") Integer transactionId);

    @Query("SELECT CASE WHEN COUNT(lc) > 0 THEN true ELSE false END FROM LC lc WHERE lc.transactionID = :transactionId")
    boolean existsInLC(@Param("transactionId") Integer transactionId);

    // ✅ CHỈ LẤY TRANSACTION THEO PROFILE
    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.profile.profileId = :profileId
        ORDER BY t.createdAt DESC
    """)
    List<Transaction> findTop1000ByProfileIdOrderByCreatedAtDesc(
            @Param("profileId") Integer profileId
    );
}
