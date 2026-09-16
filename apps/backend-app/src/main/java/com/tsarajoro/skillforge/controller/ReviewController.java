package com.tsarajoro.skillforge.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/review")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class ReviewController {

    @PersistenceContext
    private EntityManager em;

    @GetMapping("/by-candidate")
    @Transactional(readOnly = true)
    public List<CandidateGroup> byCandidate() {
        // Question par question, avec pour chaque test :
        //  - previous_submissions_count : nb de passations soumises pour CE candidat
        //    sur d AUTRES tests (warning "candidat deja evalue").
        //  - invitation_sent_at : timestamp de la derniere invitation envoyee pour CE
        //    test (null si aucune). Sert a distinguer "prepare" / "envoye".
        //  - test_submitted_at : timestamp de la passation soumise pour CE test precisement
        //    (null si non termine). Sert au statut "termine".
        String sql = """
                SELECT
                    t.id AS test_id, t.name AS test_name, t.profile_code, t.created_at AS test_created_at,
                    c.id AS candidate_id, c.email AS candidate_email, c.display_name AS candidate_name,
                    q.id AS question_id, q.type AS question_type, q.statement, q.difficulty,
                    q.status, q.json_payload::text AS payload, q.version,
                    tc.position,
                    COALESCE((
                        SELECT COUNT(*)
                        FROM invitations inv2
                        JOIN passations p2 ON p2.invitation_id = inv2.id
                        JOIN tests t2 ON t2.id = inv2.test_id
                        WHERE t2.candidate_id = c.id
                          AND t2.id <> t.id
                          AND p2.submitted_at IS NOT NULL
                    ), 0) AS previous_submissions_count,
                    (
                        -- Pas de colonne created_at sur invitations : on approxime
                        -- via expires_at (TTL fixe -> date d envoi = expires_at - TTL,
                        -- mais on garde juste l ordre chronologique cote UI).
                        SELECT MAX(inv3.expires_at)
                        FROM invitations inv3
                        WHERE inv3.test_id = t.id
                    ) AS invitation_sent_at,
                    (
                        SELECT MAX(p3.submitted_at)
                        FROM passations p3
                        JOIN invitations inv4 ON inv4.id = p3.invitation_id
                        WHERE inv4.test_id = t.id
                          AND p3.submitted_at IS NOT NULL
                    ) AS test_submitted_at
                FROM tests t
                JOIN candidates c ON c.id = t.candidate_id
                JOIN test_compositions tc ON tc.test_id = t.id
                JOIN questions q ON q.id = tc.question_id
                ORDER BY t.created_at DESC, tc.position ASC
                """;

        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();

        Map<UUID, CandidateGroup> groups = new LinkedHashMap<>();
        for (Tuple r : rows) {
            UUID testId = (UUID) r.get("test_id");
            CandidateGroup g = groups.computeIfAbsent(testId, k -> new CandidateGroup(
                    testId,
                    (String) r.get("test_name"),
                    (String) r.get("profile_code"),
                    toOffsetDateTime(r.get("test_created_at")),
                    (UUID) r.get("candidate_id"),
                    (String) r.get("candidate_email"),
                    (String) r.get("candidate_name"),
                    ((Number) r.get("previous_submissions_count")).intValue(),
                    toOffsetDateTime(r.get("invitation_sent_at")),
                    toOffsetDateTime(r.get("test_submitted_at")),
                    new ArrayList<>()));
            g.questions().add(new ReviewQuestion(
                    (UUID) r.get("question_id"),
                    (String) r.get("question_type"),
                    (String) r.get("statement"),
                    ((Number) r.get("difficulty")).intValue(),
                    (String) r.get("status"),
                    ((Number) r.get("version")).intValue(),
                    (String) r.get("payload"),
                    ((Number) r.get("position")).intValue()));
        }
        return new ArrayList<>(groups.values());
    }

    private static OffsetDateTime toOffsetDateTime(Object value) {
        if (value == null) return null;
        if (value instanceof OffsetDateTime odt) return odt;
        if (value instanceof java.time.Instant inst) return inst.atOffset(ZoneOffset.UTC);
        if (value instanceof java.sql.Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        throw new IllegalStateException("Type date non supporte : " + value.getClass());
    }

    public record CandidateGroup(
            UUID testId,
            String testName,
            String profileCode,
            OffsetDateTime testCreatedAt,
            UUID candidateId,
            String candidateEmail,
            String candidateName,
            int previousSubmissionsCount,
            /** Timestamp de la derniere invitation envoyee (null si aucune). */
            OffsetDateTime invitationSentAt,
            /** Timestamp de la passation soumise pour ce test (null si non termine). */
            OffsetDateTime testSubmittedAt,
            List<ReviewQuestion> questions) {}

    public record ReviewQuestion(
            UUID id,
            String type,
            String statement,
            int difficulty,
            String status,
            int version,
            String jsonPayload,
            int position) {}
}
