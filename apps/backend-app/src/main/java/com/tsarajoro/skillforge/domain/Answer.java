package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "passation_id", nullable = false)
    private UUID passationId;

    @Column(name = "question_id", nullable = false)
    private UUID questionId;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "submitted_code", columnDefinition = "TEXT")
    private String submittedCode;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    protected Answer() {}

    public Answer(UUID id, UUID passationId, UUID questionId,
                  String answerText, String submittedCode, BigDecimal score) {
        this.id = id;
        this.passationId = passationId;
        this.questionId = questionId;
        this.answerText = answerText;
        this.submittedCode = submittedCode;
        this.score = score;
    }

    public static Answer newAnswer(UUID passationId, UUID questionId,
                                   String answerText, String submittedCode, BigDecimal score) {
        return new Answer(UUID.randomUUID(), passationId, questionId,
                answerText, submittedCode, score);
    }

    public UUID getId() { return id; }
    public UUID getPassationId() { return passationId; }
    public UUID getQuestionId() { return questionId; }
    public String getAnswerText() { return answerText; }
    public String getSubmittedCode() { return submittedCode; }
    public BigDecimal getScore() { return score; }

    public void setAnswerText(String t) { this.answerText = t; }
    public void setSubmittedCode(String c) { this.submittedCode = c; }
    public void setScore(BigDecimal s) { this.score = s; }
}
