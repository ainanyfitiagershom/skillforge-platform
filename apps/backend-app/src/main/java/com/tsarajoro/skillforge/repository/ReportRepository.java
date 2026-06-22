package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    Optional<Report> findByPassationId(UUID passationId);
}
