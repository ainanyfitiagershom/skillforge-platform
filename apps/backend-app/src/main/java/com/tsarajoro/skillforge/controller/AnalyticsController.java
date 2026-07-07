package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.analytics.AnalyticsService;
import com.tsarajoro.skillforge.analytics.AnalyticsService.QuestionQuality;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Dashboard analytique recruteur : KPIs, distribution scores, pouvoir discriminant, export CSV. */
@RestController
@RequestMapping("/analytics")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class AnalyticsController {

    @PersistenceContext
    private EntityManager em;

    @GetMapping("/kpis")
    @Transactional(readOnly = true)
    public AnalyticsKpisView kpis() {
        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM candidates) AS total_candidates,
                    (SELECT COUNT(*) FROM passations WHERE submitted_at IS NOT NULL) AS submitted_passations,
                    (SELECT COUNT(*) FROM passations) AS total_passations,
                    (SELECT AVG(global_score) FROM passations WHERE submitted_at IS NOT NULL) AS avg_global_score,
                    (SELECT COUNT(*) FROM questions WHERE status = 'APPROVED') AS approved_questions,
                    (SELECT COUNT(*) FROM reports) AS reports_generated,
                    (SELECT AVG(fraud_risk_score) FROM passations WHERE submitted_at IS NOT NULL AND fraud_risk_score > 0) AS avg_fraud_score,
                    (SELECT COUNT(*) FROM passations WHERE submitted_at IS NOT NULL AND fraud_risk_score >= 51) AS high_fraud_count
                """;
        Tuple r = (Tuple) em.createNativeQuery(sql, Tuple.class).getSingleResult();
        return new AnalyticsKpisView(
                asInt(r.get("total_candidates")),
                asInt(r.get("submitted_passations")),
                asInt(r.get("total_passations")),
                asBigDecimal(r.get("avg_global_score")),
                asInt(r.get("approved_questions")),
                asInt(r.get("reports_generated")),
                asBigDecimal(r.get("avg_fraud_score")),
                asInt(r.get("high_fraud_count")));
    }

    @GetMapping("/scores-distribution")
    @Transactional(readOnly = true)
    public List<ScoreBucket> scoresDistribution() {
        String sql = """
                SELECT
                    FLOOR(global_score / 10)::int AS bucket,
                    COUNT(*)::int AS n
                FROM passations
                WHERE submitted_at IS NOT NULL AND global_score IS NOT NULL
                GROUP BY bucket
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();
        Map<Integer, Integer> byBucket = new HashMap<>();
        for (Tuple r : rows) {
            byBucket.put(asInt(r.get("bucket")), asInt(r.get("n")));
        }
        List<ScoreBucket> out = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            int min = i * 10;
            int max = (i == 9) ? 100 : min + 10;
            out.add(new ScoreBucket(min, max, byBucket.getOrDefault(i, 0)));
        }
        return out;
    }

    @GetMapping("/questions-stats")
    @Transactional(readOnly = true)
    public List<QuestionStatsView> questionsStats() {
        String sql = """
                SELECT
                    q.id AS question_id,
                    q.type,
                    q.statement,
                    q.difficulty,
                    a.score AS answer_score,
                    p.global_score AS passation_score
                FROM answers a
                JOIN passations p ON p.id = a.passation_id
                JOIN questions q ON q.id = a.question_id
                WHERE p.submitted_at IS NOT NULL
                  AND a.score IS NOT NULL
                  AND p.global_score IS NOT NULL
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();

        Map<UUID, QuestionAggregate> byQuestion = new HashMap<>();
        for (Tuple r : rows) {
            UUID qid = (UUID) r.get("question_id");
            QuestionAggregate agg = byQuestion.computeIfAbsent(qid, k -> new QuestionAggregate(
                    qid,
                    (String) r.get("type"),
                    (String) r.get("statement"),
                    ((Number) r.get("difficulty")).intValue()));
            double answerScore = ((BigDecimal) r.get("answer_score")).doubleValue();
            double passationScore = ((BigDecimal) r.get("passation_score")).doubleValue();
            agg.observations.add(answerScore);
            if (answerScore >= AnalyticsService.thresholdForType(agg.type)) {
                agg.successPassationScores.add(passationScore);
            } else {
                agg.failurePassationScores.add(passationScore);
            }
        }

        List<QuestionStatsView> out = new ArrayList<>();
        for (QuestionAggregate agg : byQuestion.values()) {
            int usages = agg.observations.size();
            double avg = agg.observations.stream().mapToDouble(Double::doubleValue).average().orElse(0);
            double p = usages == 0 ? 0 : (double) agg.successPassationScores.size() / usages;
            Double rpb = AnalyticsService.computePointBiserial(
                    agg.successPassationScores, agg.failurePassationScores);
            QuestionQuality quality = AnalyticsService.classify(usages, p, rpb);

            out.add(new QuestionStatsView(
                    agg.questionId,
                    agg.type,
                    agg.statement,
                    agg.difficulty,
                    usages,
                    round(p, 4),
                    round(avg, 2),
                    rpb == null ? null : round(rpb, 4),
                    quality.name()));
        }
        out.sort((a, b) -> {
            Double da = a.discriminantPower() == null ? -2.0 : a.discriminantPower().doubleValue();
            Double db = b.discriminantPower() == null ? -2.0 : b.discriminantPower().doubleValue();
            return Double.compare(db, da);
        });
        return out;
    }

    @GetMapping("/skills-avg")
    @Transactional(readOnly = true)
    public List<SkillAverage> skillsAvg() {
        Long linkCount = ((Number) em.createNativeQuery("SELECT COUNT(*) FROM question_skills")
                .getSingleResult()).longValue();

        if (linkCount == 0) {
            return skillsAvgFallbackByProfile();
        }

        String sql = """
                SELECT
                    s.code, s.display_name, s.category,
                    AVG(a.score) AS avg_score,
                    COUNT(DISTINCT a.passation_id) AS candidate_count
                FROM skills s
                JOIN question_skills qs ON qs.skill_id = s.id
                JOIN answers a ON a.question_id = qs.question_id
                JOIN passations p ON p.id = a.passation_id
                WHERE p.submitted_at IS NOT NULL AND a.score IS NOT NULL
                GROUP BY s.code, s.display_name, s.category
                HAVING COUNT(DISTINCT a.passation_id) >= 1
                ORDER BY avg_score DESC
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();
        List<SkillAverage> out = new ArrayList<>();
        for (Tuple r : rows) {
            out.add(new SkillAverage(
                    (String) r.get("code"),
                    (String) r.get("display_name"),
                    (String) r.get("category"),
                    asBigDecimal(r.get("avg_score")),
                    asInt(r.get("candidate_count"))));
        }
        return out;
    }

    private List<SkillAverage> skillsAvgFallbackByProfile() {
        String sql = """
                SELECT
                    t.profile_code AS code,
                    t.profile_code AS display_name,
                    AVG(p.global_score) AS avg_score,
                    COUNT(DISTINCT p.id) AS candidate_count
                FROM passations p
                JOIN invitations i ON i.id = p.invitation_id
                JOIN tests t ON t.id = i.test_id
                WHERE p.submitted_at IS NOT NULL AND p.global_score IS NOT NULL
                GROUP BY t.profile_code
                ORDER BY avg_score DESC
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();
        List<SkillAverage> out = new ArrayList<>();
        for (Tuple r : rows) {
            out.add(new SkillAverage(
                    (String) r.get("code"),
                    (String) r.get("display_name"),
                    "Profil",
                    asBigDecimal(r.get("avg_score")),
                    asInt(r.get("candidate_count"))));
        }
        return out;
    }

    @GetMapping("/recent-candidates")
    @Transactional(readOnly = true)
    public List<RecentCandidateView> recentCandidates() {
        String sql = """
                SELECT
                    p.id AS passation_id,
                    p.submitted_at,
                    p.global_score,
                    p.fraud_risk_score,
                    c.email AS candidate_email,
                    c.display_name AS candidate_name,
                    t.profile_code,
                    r.recommendation
                FROM passations p
                JOIN candidates c ON c.id = p.candidate_id
                JOIN invitations i ON i.id = p.invitation_id
                JOIN tests t ON t.id = i.test_id
                LEFT JOIN reports r ON r.passation_id = p.id
                WHERE p.submitted_at IS NOT NULL
                ORDER BY p.submitted_at DESC
                LIMIT 10
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();
        List<RecentCandidateView> out = new ArrayList<>();
        for (Tuple r : rows) {
            out.add(new RecentCandidateView(
                    (UUID) r.get("passation_id"),
                    toOffsetDateTime(r.get("submitted_at")),
                    (String) r.get("candidate_name"),
                    (String) r.get("candidate_email"),
                    (String) r.get("profile_code"),
                    asBigDecimal(r.get("global_score")),
                    (String) r.get("recommendation"),
                    asInt(r.get("fraud_risk_score"))));
        }
        return out;
    }

    @GetMapping(value = "/export/candidates.csv", produces = "text/csv")
    @Transactional(readOnly = true)
    public ResponseEntity<String> exportCandidatesCsv() {
        String sql = """
                SELECT
                    p.id AS passation_id, c.email, c.display_name,
                    t.profile_code, p.submitted_at, p.global_score,
                    p.fraud_risk_score, r.recommendation
                FROM passations p
                JOIN candidates c ON c.id = p.candidate_id
                JOIN invitations i ON i.id = p.invitation_id
                JOIN tests t ON t.id = i.test_id
                LEFT JOIN reports r ON r.passation_id = p.id
                WHERE p.submitted_at IS NOT NULL
                ORDER BY p.submitted_at DESC
                """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = em.createNativeQuery(sql, Tuple.class).getResultList();

        StringBuilder csv = new StringBuilder();
        csv.append("passation_id,candidate_name,candidate_email,profile_code,submitted_at,global_score,fraud_risk_score,recommendation\n");
        for (Tuple r : rows) {
            csv.append(AnalyticsService.escapeCsvCell(String.valueOf(r.get("passation_id")))).append(',');
            csv.append(AnalyticsService.escapeCsvCell((String) r.get("display_name"))).append(',');
            csv.append(AnalyticsService.escapeCsvCell((String) r.get("email"))).append(',');
            csv.append(AnalyticsService.escapeCsvCell((String) r.get("profile_code"))).append(',');
            OffsetDateTime submitted = toOffsetDateTime(r.get("submitted_at"));
            csv.append(submitted == null ? "" : submitted.toString()).append(',');
            BigDecimal score = asBigDecimal(r.get("global_score"));
            csv.append(score == null ? "" : score.toPlainString()).append(',');
            csv.append(asInt(r.get("fraud_risk_score"))).append(',');
            csv.append(AnalyticsService.escapeCsvCell((String) r.get("recommendation")));
            csv.append('\n');
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(csv.toString());
    }

    @GetMapping(value = "/export/questions-stats.csv", produces = "text/csv")
    @Transactional(readOnly = true)
    public ResponseEntity<String> exportQuestionsStatsCsv() {
        List<QuestionStatsView> stats = questionsStats();
        StringBuilder csv = new StringBuilder();
        csv.append("question_id,type,difficulty,usages,difficulty_index,avg_score,discriminant_power,quality_label,statement\n");
        for (QuestionStatsView q : stats) {
            csv.append(q.id()).append(',');
            csv.append(q.type()).append(',');
            csv.append(q.difficulty()).append(',');
            csv.append(q.usages()).append(',');
            csv.append(q.difficultyIndex() == null ? "" : q.difficultyIndex().toPlainString()).append(',');
            csv.append(q.avgScore() == null ? "" : q.avgScore().toPlainString()).append(',');
            csv.append(q.discriminantPower() == null ? "" : q.discriminantPower().toPlainString()).append(',');
            csv.append(q.qualityLabel()).append(',');
            csv.append(AnalyticsService.escapeCsvCell(q.statement()));
            csv.append('\n');
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(csv.toString());
    }

    private static int asInt(Object v) {
        if (v == null) return 0;
        return ((Number) v).intValue();
    }

    private static BigDecimal asBigDecimal(Object v) {
        if (v == null) return null;
        if (v instanceof BigDecimal bd) return bd;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        return null;
    }

    private static BigDecimal round(double v, int scale) {
        return BigDecimal.valueOf(v).setScale(scale, RoundingMode.HALF_UP);
    }

    private static OffsetDateTime toOffsetDateTime(Object value) {
        if (value == null) return null;
        if (value instanceof OffsetDateTime odt) return odt;
        if (value instanceof java.time.Instant inst) return inst.atOffset(ZoneOffset.UTC);
        if (value instanceof java.sql.Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        return null;
    }

    private static class QuestionAggregate {
        final UUID questionId;
        final String type;
        final String statement;
        final int difficulty;
        final List<Double> observations = new ArrayList<>();
        final List<Double> successPassationScores = new ArrayList<>();
        final List<Double> failurePassationScores = new ArrayList<>();

        QuestionAggregate(UUID id, String type, String statement, int difficulty) {
            this.questionId = id;
            this.type = type;
            this.statement = statement;
            this.difficulty = difficulty;
        }
    }

    public record AnalyticsKpisView(
            int totalCandidates,
            int submittedPassations,
            int totalPassations,
            BigDecimal avgGlobalScore,
            int approvedQuestions,
            int reportsGenerated,
            BigDecimal avgFraudScore,
            int highFraudCount) {}

    public record ScoreBucket(int min, int max, int count) {}

    public record QuestionStatsView(
            UUID id,
            String type,
            String statement,
            int difficulty,
            int usages,
            BigDecimal difficultyIndex,
            BigDecimal avgScore,
            BigDecimal discriminantPower,
            String qualityLabel) {}

    public record SkillAverage(
            String code,
            String displayName,
            String category,
            BigDecimal avgScore,
            int candidateCount) {}

    public record RecentCandidateView(
            UUID passationId,
            OffsetDateTime submittedAt,
            String candidateName,
            String candidateEmail,
            String profileCode,
            BigDecimal globalScore,
            String recommendation,
            int fraudRiskScore) {}
}
