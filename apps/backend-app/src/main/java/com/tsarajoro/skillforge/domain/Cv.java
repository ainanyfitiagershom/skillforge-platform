package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cvs")
public class Cv {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "candidate_id", nullable = false)
    private UUID candidateId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "content", nullable = false)
    private byte[] content;

    @Column(name = "uploaded_at", nullable = false)
    private OffsetDateTime uploadedAt;

    @Column(name = "purge_at", nullable = false)
    private OffsetDateTime purgeAt;

    protected Cv() {}

    public Cv(UUID id, UUID candidateId, String fileName, byte[] content,
              OffsetDateTime uploadedAt, OffsetDateTime purgeAt) {
        this.id = id;
        this.candidateId = candidateId;
        this.fileName = fileName;
        this.content = content;
        this.uploadedAt = uploadedAt;
        this.purgeAt = purgeAt;
    }

    public static Cv newCv(UUID candidateId, String fileName, byte[] content, int retentionMonths) {
        OffsetDateTime now = OffsetDateTime.now();
        return new Cv(UUID.randomUUID(), candidateId, fileName, content, now,
                now.plusMonths(retentionMonths));
    }

    public UUID getId() { return id; }
    public UUID getCandidateId() { return candidateId; }
    public String getFileName() { return fileName; }
    public byte[] getContent() { return content; }
    public OffsetDateTime getUploadedAt() { return uploadedAt; }
    public OffsetDateTime getPurgeAt() { return purgeAt; }
}
