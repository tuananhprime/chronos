package com.mycompany.chronos.repository;

import com.mycompany.chronos.entity.ComplianceCase;
import org.springframework.data.jpa.repository.JpaRepository;

// Kế thừa JpaRepository: <Entity Class, Kiểu dữ liệu của ID>
public interface ComplianceCaseRepository extends JpaRepository<ComplianceCase, Integer> {
    // Spring Data JPA sẽ tự động cung cấp các phương thức CRUD cơ bản (save, findById, findAll,...)
}