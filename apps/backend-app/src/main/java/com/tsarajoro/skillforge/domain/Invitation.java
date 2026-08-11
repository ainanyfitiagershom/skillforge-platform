package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "invitations")
public class Invitation {

    private static final SecureRandom RNG = new SecureRandom();

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

    /** Code d acces a 6 chiffres genere aleatoirement, envoye au candidat par email. */
    @Column(name = "access_code", length = 6)
    private String accessCode;

    protected Invitation() {}

    public Invitation(UUID id, UUID testId, String token, OffsetDateTime expiresAt, boolean used, String accessCode) {
        this.id = id;
        this.testId = testId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.used = used;
        this.accessCode = accessCode;
    }

    public static Invitation newInvitation(UUID testId, int ttlHours) {
        return new Invitation(
                UUID.randomUUID(),
                testId,
                UUID.randomUUID().toString().replace("-", ""),
                OffsetDateTime.now().plusHours(ttlHours),
                false,
                generateAccessCode());
    }

    /** Genere un code a 6 chiffres avec SecureRandom (0-padded, ex : 042817). */
    private static String generateAccessCode() {
        int n = RNG.nextInt(1_000_000); // 0 a 999999
        return String.format("%06d", n);
    }

    public UUID getId() { return id; }
    public UUID getTestId() { return testId; }
    public String getToken() { return token; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public boolean isUsed() { return used; }
    public String getAccessCode() { return accessCode; }

    public void markUsed() { this.used = true; }
}
