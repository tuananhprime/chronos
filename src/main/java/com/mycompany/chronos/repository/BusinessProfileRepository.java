package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.BusinessProfile;
import com.mycompany.chronos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Integer> {

    // Trường hợp dùng object User
    Optional<BusinessProfile> findByUser(User user);

    // Trường hợp chỉ biết userId (integer)
    Optional<BusinessProfile> findByUser_UserId(Integer userId);
}
