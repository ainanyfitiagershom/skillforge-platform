package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.TestComposition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestCompositionRepository extends JpaRepository<TestComposition, TestComposition.Pk> {

    List<TestComposition> findByIdTestIdOrderByPositionAsc(UUID testId);
}
