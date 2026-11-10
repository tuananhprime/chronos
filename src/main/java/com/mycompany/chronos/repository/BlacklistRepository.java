package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlacklistRepository extends JpaRepository<Blacklist, Integer> {

    List<Blacklist> findByIsActiveTrue();
}
