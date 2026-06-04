package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "test_id", nullable = false)
    private UUID testId;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(nullable = false)
    private boolean used;

    protected Invitation() {}

    public Invitation(UUID id, UUID testId, String token, OffsetDateTime expiresAt, boolean used) {
        this.id = id;
        this.testId = testId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.used = used;
    }

    public static Invitation newInvitation(UUID testId, int ttlHours) {
        return new Invitation(
                UUID.randomUUID(),
                testId,
                UUID.randomUUID().toString().replace("-", ""),
                OffsetDateTime.now().plusHours(ttlHours),
                false);
    }

    public UUID getId() { return id; }
    public UUID getTestId() { return testId; }
    public String getToken() { return token; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public boolean isUsed() { return used; }

    public void markUsed() { this.used = true; }
}
