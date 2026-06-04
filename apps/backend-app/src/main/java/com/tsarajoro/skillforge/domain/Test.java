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

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Test() {}

    public Test(UUID id, String name, int durationMinutes, OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
    }

    public static Test newTest(String name, int durationMinutes) {
        return new Test(UUID.randomUUID(), name, durationMinutes, OffsetDateTime.now());
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public int getDurationMinutes() { return durationMinutes; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
