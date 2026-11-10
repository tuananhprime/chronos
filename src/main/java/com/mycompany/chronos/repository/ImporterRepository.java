package com.mycompany.chronos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mycompany.chronos.entity.Importer;

public interface ImporterRepository extends JpaRepository<Importer, Integer> {
}
