package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {

    Optional<Answer> findByPassationIdAndQuestionId(UUID passationId, UUID questionId);

    List<Answer> findByPassationId(UUID passationId);
}
