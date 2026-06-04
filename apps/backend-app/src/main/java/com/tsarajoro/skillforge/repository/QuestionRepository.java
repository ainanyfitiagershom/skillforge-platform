package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionStatus;
import com.tsarajoro.skillforge.domain.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {

    List<Question> findByStatus(QuestionStatus status);

    List<Question> findByType(QuestionType type);

    List<Question> findByStatusAndType(QuestionStatus status, QuestionType type);
}
