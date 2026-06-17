package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tests")
public class Test {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(name = "profile_code")
    private String profileCode;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Test() {}

    public Test(UUID id, String name, int durationMinutes, UUID candidateId,
                String profileCode, OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.durationMinutes = durationMinutes;
        this.candidateId = candidateId;
        this.profileCode = profileCode;
        this.createdAt = createdAt;
    }

    public static Test newTest(String name, int durationMinutes, UUID candidateId, String profileCode) {
        return new Test(UUID.randomUUID(), name, durationMinutes, candidateId, profileCode, OffsetDateTime.now());
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public int getDurationMinutes() { return durationMinutes; }
    public UUID getCandidateId() { return candidateId; }
    public String getProfileCode() { return profileCode; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
