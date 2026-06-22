package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Recommendation;
import com.tsarajoro.skillforge.domain.Report;
import com.tsarajoro.skillforge.report.ReportService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Vue recruteur : liste des passations + detail (questions + reponses + scoring). */
@RestController
@RequestMapping("/passations")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class PassationController {

    @PersistenceContext
    private EntityManager em;

    private final ReportService reportService;

    public PassationController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<PassationSummary> list() {
        String sql = """
                SELECT
                    p.id            AS passation_id,
                    p.started_at, p.submitted_at, p.global_score, p.fraud_risk_score,
                    c.id            AS candidate_id,
                    c.email         AS candidate_email,
                    c.display_name  AS candidate_name,
                    t.id            AS test_id,
                    t.name          AS test_name,
                    t.profile_code,
                    t.created_at    AS test_created_at
                FROM passations p
                JOIN invitations i ON i.id = p.invitation_id
                JOIN tests t       ON t.id = i.test_id
                JOIN candidates c  ON c.id = p.candidate_id
                ORDER BY COALESCE(p.submitted_at, p.started_at) DESC
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();
        List<PassationSummary> out = new ArrayList<>();
        for (Tuple r : rows) {
            out.add(new PassationSummary(
                    (UUID) r.get("passation_id"),
                    toOffsetDateTime(r.get("started_at")),
                    toOffsetDateTime(r.get("submitted_at")),
                    (BigDecimal) r.get("global_score"),
                    ((Number) r.get("fraud_risk_score")).intValue(),
                    (UUID) r.get("candidate_id"),
                    (String) r.get("candidate_email"),
                    (String) r.get("candidate_name"),
                    (UUID) r.get("test_id"),
                    (String) r.get("test_name"),
                    (String) r.get("profile_code"),
                    toOffsetDateTime(r.get("test_created_at"))));
        }
        return out;
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<PassationDetail> detail(@PathVariable UUID id) {
        String header = """
                SELECT
                    p.id            AS passation_id,
                    p.started_at, p.submitted_at, p.global_score, p.fraud_risk_score,
                    c.id            AS candidate_id,
                    c.email         AS candidate_email,
                    c.display_name  AS candidate_name,
                    t.id            AS test_id,
                    t.name          AS test_name,
                    t.profile_code,
                    t.created_at    AS test_created_at
                FROM passations p
                JOIN invitations i ON i.id = p.invitation_id
                JOIN tests t       ON t.id = i.test_id
                JOIN candidates c  ON c.id = p.candidate_id
                WHERE p.id = :pid
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> headerRows = em.createNativeQuery(header, Tuple.class)
                .setParameter("pid", id)
                .getResultList();
        if (headerRows.isEmpty()) return ResponseEntity.notFound().build();
        Tuple h = headerRows.get(0);

        String detail = """
                SELECT
                    q.id              AS question_id,
                    q.type, q.statement, q.difficulty,
                    q.json_payload::text AS payload,
                    tc.position,
                    a.id              AS answer_id,
                    a.answer_text, a.submitted_code, a.score,
                    a.qcm_selected_index, a.last_tests_passed, a.last_tests_total,
                    a.last_stdout, a.last_stderr, a.grading_explanation
                FROM passations p
                JOIN invitations i      ON i.id = p.invitation_id
                JOIN test_compositions tc ON tc.test_id = i.test_id
                JOIN questions q        ON q.id = tc.question_id
                LEFT JOIN answers a     ON a.passation_id = p.id AND a.question_id = q.id
                WHERE p.id = :pid
                ORDER BY tc.position
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> detailRows = em.createNativeQuery(detail, Tuple.class)
                .setParameter("pid", id)
                .getResultList();
        List<AnswerDetail> answers = new ArrayList<>();
        for (Tuple r : detailRows) {
            answers.add(new AnswerDetail(
                    (UUID) r.get("answer_id"),
                    (UUID) r.get("question_id"),
                    (String) r.get("type"),
                    (String) r.get("statement"),
                    ((Number) r.get("difficulty")).intValue(),
                    (String) r.get("payload"),
                    ((Number) r.get("position")).intValue(),
                    (String) r.get("answer_text"),
                    (String) r.get("submitted_code"),
                    (BigDecimal) r.get("score"),
                    r.get("qcm_selected_index") == null ? null : ((Number) r.get("qcm_selected_index")).intValue(),
                    r.get("last_tests_passed") == null ? null : ((Number) r.get("last_tests_passed")).intValue(),
                    r.get("last_tests_total") == null ? null : ((Number) r.get("last_tests_total")).intValue(),
                    (String) r.get("last_stdout"),
                    (String) r.get("last_stderr"),
                    (String) r.get("grading_explanation")));
        }

        return ResponseEntity.ok(new PassationDetail(
                (UUID) h.get("passation_id"),
                toOffsetDateTime(h.get("started_at")),
                toOffsetDateTime(h.get("submitted_at")),
                (BigDecimal) h.get("global_score"),
                ((Number) h.get("fraud_risk_score")).intValue(),
                (UUID) h.get("candidate_id"),
                (String) h.get("candidate_email"),
                (String) h.get("candidate_name"),
                (UUID) h.get("test_id"),
                (String) h.get("test_name"),
                (String) h.get("profile_code"),
                toOffsetDateTime(h.get("test_created_at")),
                answers));
    }

    @GetMapping("/{id}/report")
    @Transactional(readOnly = true)
    public ResponseEntity<ReportView> getReport(@PathVariable UUID id) {
        Optional<Report> r = reportService.findByPassation(id);
        return r.map(rep -> ResponseEntity.ok(ReportView.of(rep, reportService)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/report/regenerate")
    public ResponseEntity<ReportView> regenerateReport(@PathVariable UUID id) {
        Optional<Report> r = reportService.generateForPassation(id);
        return r.map(rep -> ResponseEntity.ok(ReportView.of(rep, reportService)))
                .orElseGet(() -> ResponseEntity.status(503).build());
    }

    private static OffsetDateTime toOffsetDateTime(Object value) {
        if (value == null) return null;
        if (value instanceof OffsetDateTime odt) return odt;
        if (value instanceof java.time.Instant inst) return inst.atOffset(ZoneOffset.UTC);
        if (value instanceof java.sql.Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        throw new IllegalStateException("Type date non supporte : " + value.getClass());
    }

    public record PassationSummary(
            UUID passationId,
            OffsetDateTime startedAt,
            OffsetDateTime submittedAt,
            BigDecimal globalScore,
            int fraudRiskScore,
            UUID candidateId,
            String candidateEmail,
            String candidateName,
            UUID testId,
            String testName,
            String profileCode,
            OffsetDateTime testCreatedAt) {}

    public record PassationDetail(
            UUID passationId,
            OffsetDateTime startedAt,
            OffsetDateTime submittedAt,
            BigDecimal globalScore,
            int fraudRiskScore,
            UUID candidateId,
            String candidateEmail,
            String candidateName,
            UUID testId,
            String testName,
            String profileCode,
            OffsetDateTime testCreatedAt,
            List<AnswerDetail> answers) {}

    public record AnswerDetail(
            UUID id,
            UUID questionId,
            String type,
            String statement,
            int difficulty,
            String jsonPayload,
            int position,
            String answerText,
            String submittedCode,
            BigDecimal score,
            Integer qcmSelectedIndex,
            Integer lastTestsPassed,
            Integer lastTestsTotal,
            String lastStdout,
            String lastStderr,
            String gradingExplanation) {}

    public record ReportView(
            UUID id,
            UUID passationId,
            String summary,
            List<String> strengths,
            List<String> weaknesses,
            Recommendation recommendation,
            OffsetDateTime generatedAt,
            String llmProvider,
            String llmModel,
            int tokensUsed,
            BigDecimal costEur) {
        static ReportView of(Report r, ReportService svc) {
            return new ReportView(
                    r.getId(),
                    r.getPassationId(),
                    r.getSummary(),
                    svc.parseList(r.getStrengths()),
                    svc.parseList(r.getWeaknesses()),
                    r.getRecommendation(),
                    r.getGeneratedAt(),
                    r.getLlmProvider(),
                    r.getLlmModel(),
                    r.getTokensUsed(),
                    r.getCostEur());
        }
    }
}
