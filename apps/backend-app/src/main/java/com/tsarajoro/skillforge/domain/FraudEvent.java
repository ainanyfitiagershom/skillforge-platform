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

/** Un evenement anti-fraude enregistre pendant une passation candidat. */
@Entity
@Table(name = "fraud_events")
public class FraudEvent {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "passation_id", nullable = false)
    private UUID passationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 64)
    private FraudEventType eventType;

    @Column(name = "occurred_at", nullable = false)
    private OffsetDateTime occurredAt;

    /** JSON stocke en JSONB (ex: {"durationMs":5000} ou {"pastedLength":342,"questionId":"..."}). */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata;

    protected FraudEvent() {}

    public FraudEvent(UUID id, UUID passationId, FraudEventType eventType,
                      OffsetDateTime occurredAt, String metadata) {
        this.id = id;
        this.passationId = passationId;
        this.eventType = eventType;
        this.occurredAt = occurredAt;
        this.metadata = metadata;
    }

    public static FraudEvent newEvent(UUID passationId, FraudEventType type, String metadataJson) {
        return new FraudEvent(UUID.randomUUID(), passationId, type, OffsetDateTime.now(), metadataJson);
    }

    public UUID getId() { return id; }
    public UUID getPassationId() { return passationId; }
    public FraudEventType getEventType() { return eventType; }
    public OffsetDateTime getOccurredAt() { return occurredAt; }
    public String getMetadata() { return metadata; }
}
