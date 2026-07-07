package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.FraudEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FraudEventRepository extends JpaRepository<FraudEvent, UUID> {

    List<FraudEvent> findByPassationIdOrderByOccurredAtAsc(UUID passationId);

    long countByPassationId(UUID passationId);
}
