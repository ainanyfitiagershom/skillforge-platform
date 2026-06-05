package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "passations")
public class Passation {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "invitation_id", nullable = false, unique = true)
    private UUID invitationId;

    @Column(name = "candidate_id", nullable = false)
    private UUID candidateId;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "global_score", precision = 5, scale = 2)
    private BigDecimal globalScore;

    @Column(name = "fraud_risk_score", nullable = false)
    private int fraudRiskScore;

    protected Passation() {}

    public Passation(UUID id, UUID invitationId, UUID candidateId,
                     OffsetDateTime startedAt, OffsetDateTime submittedAt,
                     BigDecimal globalScore, int fraudRiskScore) {
        this.id = id;
        this.invitationId = invitationId;
        this.candidateId = candidateId;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
        this.globalScore = globalScore;
        this.fraudRiskScore = fraudRiskScore;
    }

    public static Passation newPassation(UUID invitationId, UUID candidateId) {
        return new Passation(UUID.randomUUID(), invitationId, candidateId,
                OffsetDateTime.now(), null, null, 0);
    }

    public UUID getId() { return id; }
    public UUID getInvitationId() { return invitationId; }
    public UUID getCandidateId() { return candidateId; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public BigDecimal getGlobalScore() { return globalScore; }
    public int getFraudRiskScore() { return fraudRiskScore; }

    public void submit(BigDecimal score) {
        this.submittedAt = OffsetDateTime.now();
        this.globalScore = score;
    }

    public void setFraudRiskScore(int s) { this.fraudRiskScore = s; }
}
