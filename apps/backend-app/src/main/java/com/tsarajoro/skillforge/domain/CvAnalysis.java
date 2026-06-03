package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cv_analyses")
public class CvAnalysis {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "cv_id", nullable = false, unique = true)
    private UUID cvId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "extracted_skills", nullable = false, columnDefinition = "jsonb")
    private String extractedSkillsJson;

    @Column(name = "llm_provider", nullable = false)
    private String llmProvider;

    @Column(name = "llm_model", nullable = false)
    private String llmModel;

    @Column(name = "tokens_used", nullable = false)
    private int tokensUsed;

    @Column(name = "cost_eur", nullable = false)
    private BigDecimal costEur;

    @Column(name = "analyzed_at", nullable = false)
    private OffsetDateTime analyzedAt;

    protected CvAnalysis() {}

    public CvAnalysis(UUID id, UUID cvId, String extractedSkillsJson, String llmProvider,
                      String llmModel, int tokensUsed, BigDecimal costEur, OffsetDateTime analyzedAt) {
        this.id = id;
        this.cvId = cvId;
        this.extractedSkillsJson = extractedSkillsJson;
        this.llmProvider = llmProvider;
        this.llmModel = llmModel;
        this.tokensUsed = tokensUsed;
        this.costEur = costEur;
        this.analyzedAt = analyzedAt;
    }

    public UUID getId() { return id; }
    public UUID getCvId() { return cvId; }
    public String getExtractedSkillsJson() { return extractedSkillsJson; }
    public String getLlmProvider() { return llmProvider; }
    public String getLlmModel() { return llmModel; }
    public int getTokensUsed() { return tokensUsed; }
    public BigDecimal getCostEur() { return costEur; }
    public OffsetDateTime getAnalyzedAt() { return analyzedAt; }
}
