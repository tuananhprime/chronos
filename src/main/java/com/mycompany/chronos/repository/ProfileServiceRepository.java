package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

@Repository
public interface ProfileServiceRepository extends JpaRepository<Profile, Integer> {

    boolean existsByProfileIdAndUser_UserId(Integer profileId, Integer userId);

    Optional<Profile> findByTaxCodeAndCompanyName(String taxCode, String companyName);

    // Lấy profile theo user_id (dùng Integer vì user.userId là Integer)
    @Query("SELECT p FROM Profile p WHERE p.user.userId = :userId")
    Optional<Profile> findByUserId(@Param("userId") Integer userId);

    // Xoá profile theo user_id
    void deleteByUser_UserId(Integer userId);
}
