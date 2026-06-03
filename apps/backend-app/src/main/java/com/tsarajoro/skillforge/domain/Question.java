package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String statement;

    @Column(nullable = false)
    private int difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status;

    @Column(nullable = false)
    private int version;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "json_payload", nullable = false, columnDefinition = "jsonb")
    private String jsonPayload;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Question() {}

    public Question(UUID id, QuestionType type, String statement, int difficulty,
                    QuestionStatus status, int version, String jsonPayload, OffsetDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.statement = statement;
        this.difficulty = difficulty;
        this.status = status;
        this.version = version;
        this.jsonPayload = jsonPayload;
        this.createdAt = createdAt;
    }

    public static Question newQuestion(QuestionType type, String statement, int difficulty,
                                       QuestionStatus status, String jsonPayload) {
        return new Question(UUID.randomUUID(), type, statement, difficulty, status, 1,
                jsonPayload, OffsetDateTime.now());
    }

    public UUID getId() { return id; }
    public QuestionType getType() { return type; }
    public String getStatement() { return statement; }
    public int getDifficulty() { return difficulty; }
    public QuestionStatus getStatus() { return status; }
    public int getVersion() { return version; }
    public String getJsonPayload() { return jsonPayload; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setStatement(String statement) { this.statement = statement; this.version++; }
    public void setDifficulty(int difficulty) { this.difficulty = difficulty; }
    public void setStatus(QuestionStatus status) { this.status = status; }
    public void setJsonPayload(String jsonPayload) { this.jsonPayload = jsonPayload; }
}
