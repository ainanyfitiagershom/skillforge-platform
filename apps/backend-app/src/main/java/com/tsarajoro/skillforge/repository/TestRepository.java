package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TestRepository extends JpaRepository<Test, UUID> {
}
