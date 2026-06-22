package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Compte rendu IA d une passation : un seul rapport par passation (FK unique). */
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "passation_id", nullable = false, unique = true)
    private UUID passationId;

    @Column(name = "summary", columnDefinition = "TEXT", nullable = false)
    private String summary;

    /** JSON array de strings, ex: ["Maitrise PHP", "Bonne logique"]. */
    @Column(name = "strengths", columnDefinition = "TEXT", nullable = false)
    private String strengths;

    /** JSON array de strings. */
    @Column(name = "weaknesses", columnDefinition = "TEXT", nullable = false)
    private String weaknesses;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation", nullable = false)
    private Recommendation recommendation;

    @Column(name = "generated_at", nullable = false)
    private OffsetDateTime generatedAt;

    @Column(name = "llm_provider")
    private String llmProvider;

    @Column(name = "llm_model")
    private String llmModel;

    @Column(name = "tokens_used", nullable = false)
    private int tokensUsed;

    @Column(name = "cost_eur", nullable = false, precision = 8, scale = 4)
    private BigDecimal costEur;

    protected Report() {}

    public Report(UUID id, UUID passationId, String summary, String strengths,
                  String weaknesses, Recommendation recommendation, OffsetDateTime generatedAt,
                  String llmProvider, String llmModel, int tokensUsed, BigDecimal costEur) {
        this.id = id;
        this.passationId = passationId;
        this.summary = summary;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.recommendation = recommendation;
        this.generatedAt = generatedAt;
        this.llmProvider = llmProvider;
        this.llmModel = llmModel;
        this.tokensUsed = tokensUsed;
        this.costEur = costEur;
    }

    public static Report newReport(UUID passationId, String summary, String strengths,
                                    String weaknesses, Recommendation recommendation,
                                    String llmProvider, String llmModel,
                                    int tokensUsed, BigDecimal costEur) {
        return new Report(UUID.randomUUID(), passationId, summary, strengths, weaknesses,
                recommendation, OffsetDateTime.now(), llmProvider, llmModel, tokensUsed, costEur);
    }

    public UUID getId() { return id; }
    public UUID getPassationId() { return passationId; }
    public String getSummary() { return summary; }
    public String getStrengths() { return strengths; }
    public String getWeaknesses() { return weaknesses; }
    public Recommendation getRecommendation() { return recommendation; }
    public OffsetDateTime getGeneratedAt() { return generatedAt; }
    public String getLlmProvider() { return llmProvider; }
    public String getLlmModel() { return llmModel; }
    public int getTokensUsed() { return tokensUsed; }
    public BigDecimal getCostEur() { return costEur; }

    public void setSummary(String s) { this.summary = s; }
    public void setStrengths(String s) { this.strengths = s; }
    public void setWeaknesses(String s) { this.weaknesses = s; }
    public void setRecommendation(Recommendation r) { this.recommendation = r; }
    public void setGeneratedAt(OffsetDateTime d) { this.generatedAt = d; }
    public void setLlmProvider(String p) { this.llmProvider = p; }
    public void setLlmModel(String m) { this.llmModel = m; }
    public void setTokensUsed(int t) { this.tokensUsed = t; }
    public void setCostEur(BigDecimal c) { this.costEur = c; }
}
