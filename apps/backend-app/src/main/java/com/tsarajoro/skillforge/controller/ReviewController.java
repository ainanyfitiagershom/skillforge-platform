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
        String sql = """
                SELECT
                    t.id AS test_id, t.name AS test_name, t.profile_code, t.created_at AS test_created_at,
                    c.id AS candidate_id, c.email AS candidate_email, c.display_name AS candidate_name,
                    q.id AS question_id, q.type AS question_type, q.statement, q.difficulty,
                    q.status, q.json_payload::text AS payload, q.version,
                    tc.position
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
