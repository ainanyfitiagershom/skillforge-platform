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

    @Column(name = "qcm_selected_index")
    private Integer qcmSelectedIndex;

    @Column(name = "last_tests_passed")
    private Integer lastTestsPassed;

    @Column(name = "last_tests_total")
    private Integer lastTestsTotal;

    @Column(name = "last_stdout", columnDefinition = "TEXT")
    private String lastStdout;

    @Column(name = "last_stderr", columnDefinition = "TEXT")
    private String lastStderr;

    @Column(name = "grading_explanation", columnDefinition = "TEXT")
    private String gradingExplanation;

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
    public Integer getQcmSelectedIndex() { return qcmSelectedIndex; }
    public Integer getLastTestsPassed() { return lastTestsPassed; }
    public Integer getLastTestsTotal() { return lastTestsTotal; }
    public String getLastStdout() { return lastStdout; }
    public String getLastStderr() { return lastStderr; }
    public String getGradingExplanation() { return gradingExplanation; }

    public void setAnswerText(String t) { this.answerText = t; }
    public void setSubmittedCode(String c) { this.submittedCode = c; }
    public void setScore(BigDecimal s) { this.score = s; }
    public void setQcmSelectedIndex(Integer i) { this.qcmSelectedIndex = i; }
    public void setLastTestsPassed(Integer v) { this.lastTestsPassed = v; }
    public void setLastTestsTotal(Integer v) { this.lastTestsTotal = v; }
    public void setLastStdout(String s) { this.lastStdout = s; }
    public void setLastStderr(String s) { this.lastStderr = s; }
    public void setGradingExplanation(String s) { this.gradingExplanation = s; }
}
