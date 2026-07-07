package com.tsarajoro.skillforge.candidate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.Answer;
import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.domain.Passation;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.llm.CasGradingResult;
import com.tsarajoro.skillforge.llm.LlmClient;
import com.tsarajoro.skillforge.report.ReportService;
import com.tsarajoro.skillforge.repository.AnswerRepository;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.InvitationRepository;
import com.tsarajoro.skillforge.repository.PassationRepository;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import com.tsarajoro.skillforge.repository.TestCompositionRepository;
import com.tsarajoro.skillforge.sandbox.SandboxApiClient;
import com.tsarajoro.skillforge.sandbox.SandboxApiClient.SandboxExecuteRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/** Orchestre la passation candidat : start, save, runCode, submit avec auto-grading par type. */
@Service
public class CandidatePassationService {

    private static final Logger log = LoggerFactory.getLogger(CandidatePassationService.class);

    private static final BigDecimal WEIGHT_QCM = new BigDecimal("0.30");
    private static final BigDecimal WEIGHT_CODE = new BigDecimal("0.50");
    private static final BigDecimal WEIGHT_CAS = new BigDecimal("0.20");

    private final InvitationRepository invitationRepo;
    private final PassationRepository passationRepo;
    private final AnswerRepository answerRepo;
    private final CandidateRepository candidateRepo;
    private final QuestionRepository questionRepo;
    private final TestCompositionRepository compositionRepo;
    private final SandboxApiClient sandboxClient;
    private final LlmClient llmClient;
    private final ReportService reportService;
    private final ObjectMapper mapper = new ObjectMapper();

    public CandidatePassationService(
            InvitationRepository invitationRepo,
            PassationRepository passationRepo,
            AnswerRepository answerRepo,
            CandidateRepository candidateRepo,
            QuestionRepository questionRepo,
            TestCompositionRepository compositionRepo,
            SandboxApiClient sandboxClient,
            LlmClient llmClient,
            ReportService reportService) {
        this.invitationRepo = invitationRepo;
        this.passationRepo = passationRepo;
        this.answerRepo = answerRepo;
        this.candidateRepo = candidateRepo;
        this.questionRepo = questionRepo;
        this.compositionRepo = compositionRepo;
        this.sandboxClient = sandboxClient;
        this.llmClient = llmClient;
        this.reportService = reportService;
    }

    @Transactional
    public Passation startOrResume(String token, String candidateEmail, String candidateDisplayName) {
        Invitation inv = validInvitation(token);
        return passationRepo.findByInvitationId(inv.getId())
                .orElseGet(() -> {
                    Candidate candidate = candidateRepo.findByEmail(candidateEmail)
                            .orElseGet(() -> candidateRepo.save(
                                    Candidate.newCandidate(candidateEmail, candidateDisplayName)));
                    return passationRepo.save(Passation.newPassation(inv.getId(), candidate.getId()));
                });
    }

    @Transactional
    public Answer saveTextAnswer(UUID passationId, UUID questionId, String answerText) {
        Answer existing = answerRepo
                .findByPassationIdAndQuestionId(passationId, questionId)
                .orElse(null);
        Integer qcmIdx = parseQcmIndex(questionId, answerText);

        if (existing != null) {
            existing.setAnswerText(answerText);
            if (qcmIdx != null) existing.setQcmSelectedIndex(qcmIdx);
            return answerRepo.save(existing);
        }
        Answer a = Answer.newAnswer(passationId, questionId, answerText, null, null);
        if (qcmIdx != null) a.setQcmSelectedIndex(qcmIdx);
        return answerRepo.save(a);
    }

    @Transactional
    public RunCodeResult runCode(UUID passationId, UUID questionId, String language,
                                  String userCode, String hiddenTests) {
        Question question = questionRepo.findById(questionId).orElseThrow();
        String trustedHiddenTests = extractTextField(question.getJsonPayload(), "hiddenTests");
        JsonNode resp = sandboxClient.execute(new SandboxExecuteRequest(
                language, userCode, trustedHiddenTests, null));

        String status = resp.path("status").asText("ERROR");
        int exitCode = resp.path("exitCode").asInt(-1);
        String stdout = resp.path("stdout").asText("");
        String stderr = resp.path("stderr").asText("");
        long durationMs = resp.path("durationMs").asLong(0);
        int testsPassed = resp.path("testsPassed").asInt(0);
        int testsTotal = resp.path("testsTotal").asInt(0);
        double score = resp.path("score").asDouble(0.0);

        BigDecimal scoreBd = BigDecimal.valueOf(score * 100).setScale(2, RoundingMode.HALF_UP);
        Answer existing = answerRepo
                .findByPassationIdAndQuestionId(passationId, questionId)
                .orElse(null);
        Answer a = existing != null
                ? existing
                : Answer.newAnswer(passationId, questionId, null, userCode, null);
        a.setSubmittedCode(userCode);
        a.setScore(scoreBd);
        a.setLastTestsPassed(testsPassed);
        a.setLastTestsTotal(testsTotal);
        a.setLastStdout(stdout);
        a.setLastStderr(stderr);
        answerRepo.save(a);

        return new RunCodeResult(status, exitCode, stdout, stderr, durationMs,
                testsPassed, testsTotal, score);
    }

    private String extractTextField(String jsonPayload, String field) {
        try {
            JsonNode node = mapper.readTree(jsonPayload);
            JsonNode value = node.get(field);
            return value == null || value.isNull() ? null : value.asText();
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public SubmitResult submit(UUID passationId) {
        Passation p = passationRepo.findById(passationId).orElseThrow();
        if (p.getSubmittedAt() != null) {
            return new SubmitResult(p, breakdownFromAnswers(p));
        }

        Invitation inv = invitationRepo.findById(p.getInvitationId()).orElseThrow();
        UUID testId = inv.getTestId();
        List<UUID> questionIds = compositionRepo.findByIdTestIdOrderByPositionAsc(testId)
                .stream().map(c -> c.getId().getQuestionId()).toList();
        Map<UUID, Question> questionsById = new HashMap<>();
        for (Question q : questionRepo.findAllById(questionIds)) {
            questionsById.put(q.getId(), q);
        }
        Map<UUID, Answer> answersByQuestion = new HashMap<>();
        for (Answer a : answerRepo.findByPassationId(passationId)) {
            answersByQuestion.put(a.getQuestionId(), a);
        }

        TypeBucket qcm = new TypeBucket();
        TypeBucket code = new TypeBucket();
        TypeBucket cas = new TypeBucket();

        for (UUID qid : questionIds) {
            Question q = questionsById.get(qid);
            if (q == null) continue;
            Answer a = answersByQuestion.computeIfAbsent(qid, k -> {
                Answer fresh = Answer.newAnswer(passationId, qid, null, null, null);
                return answerRepo.save(fresh);
            });
            switch (q.getType()) {
                case QCM -> gradeQcm(q, a, qcm);
                case CODE -> gradeCode(q, a, code);
                case CAS_PRATIQUE -> gradeCas(q, a, cas);
            }
            answerRepo.save(a);
        }

        BigDecimal global = weightedAverage(qcm, code, cas);
        p.submit(global);
        invitationRepo.findById(p.getInvitationId()).ifPresent(i -> {
            i.markUsed();
            invitationRepo.save(i);
        });
        Passation saved = passationRepo.save(p);

        try {
            reportService.generateForPassation(saved.getId());
        } catch (Exception e) {
            log.warn("Generation du compte rendu IA en echec pour passation {} : {}",
                    saved.getId(), e.getMessage());
        }

        return new SubmitResult(saved, new ScoreBreakdown(
                qcm.passed, qcm.total,
                code.passed, code.total,
                cas.passed, cas.total));
    }

    private void gradeQcm(Question q, Answer a, TypeBucket bucket) {
        bucket.total++;
        Integer correct = readCorrectIndex(q);
        Integer chosen = a.getQcmSelectedIndex();
        if (chosen == null && a.getAnswerText() != null) {
            try { chosen = Integer.parseInt(a.getAnswerText().trim()); } catch (Exception ignored) {}
            if (chosen != null) a.setQcmSelectedIndex(chosen);
        }
        if (correct != null && chosen != null && correct.equals(chosen)) {
            a.setScore(new BigDecimal("100.00"));
            a.setGradingExplanation("Bonne reponse.");
            bucket.passed++;
        } else {
            a.setScore(new BigDecimal("0.00"));
            String correctLabel = correct == null ? "inconnue" : "option " + (char)('A' + correct);
            String chosenLabel = chosen == null ? "(aucune)" : "option " + (char)('A' + chosen);
            a.setGradingExplanation("Mauvaise reponse. Choix : " + chosenLabel + " — attendue : " + correctLabel + ".");
        }
    }

    private void gradeCode(Question q, Answer a, TypeBucket bucket) {
        bucket.total++;
        BigDecimal score = a.getScore();
        if (score == null) {
            a.setScore(new BigDecimal("0.00"));
            a.setGradingExplanation("Aucune execution sandbox enregistree.");
            return;
        }
        if (score.compareTo(new BigDecimal("75.00")) >= 0) bucket.passed++;
        Integer tp = a.getLastTestsPassed();
        Integer tt = a.getLastTestsTotal();
        if (tt != null && tp != null && tt > 0) {
            a.setGradingExplanation(tp + " / " + tt + " tests caches reussis.");
        } else {
            a.setGradingExplanation("Score sandbox : " + score + " / 100.");
        }
    }

    private void gradeCas(Question q, Answer a, TypeBucket bucket) {
        bucket.total++;
        if (a.getAnswerText() == null || a.getAnswerText().isBlank()) {
            a.setScore(new BigDecimal("0.00"));
            a.setGradingExplanation("Aucune reponse fournie.");
            return;
        }
        String scenario = readJsonString(q, "scenario");
        List<String> points = readJsonStringList(q, "expectedAnswerPoints");
        try {
            CasGradingResult res = llmClient.gradeCasPratique(scenario, points, a.getAnswerText());
            a.setScore(res.score());
            a.setGradingExplanation(res.explanation());
            if (res.score().compareTo(new BigDecimal("60.00")) >= 0) bucket.passed++;
        } catch (Exception e) {
            log.warn("LLM grading CAS_PRATIQUE en echec ({}), score laisse null", e.getMessage());
            a.setScore(null);
            a.setGradingExplanation("Evaluation IA indisponible — a noter manuellement.");
        }
    }

    private BigDecimal weightedAverage(TypeBucket qcm, TypeBucket code, TypeBucket cas) {
        List<BigDecimal[]> active = new ArrayList<>();
        if (qcm.total > 0) active.add(new BigDecimal[]{ qcm.ratio(), WEIGHT_QCM });
        if (code.total > 0) active.add(new BigDecimal[]{ code.ratio(), WEIGHT_CODE });
        if (cas.total > 0) active.add(new BigDecimal[]{ cas.ratio(), WEIGHT_CAS });
        if (active.isEmpty()) return BigDecimal.ZERO;
        BigDecimal weightSum = BigDecimal.ZERO;
        for (BigDecimal[] p : active) weightSum = weightSum.add(p[1]);
        BigDecimal total = BigDecimal.ZERO;
        for (BigDecimal[] p : active) {
            BigDecimal normalizedWeight = p[1].divide(weightSum, 6, RoundingMode.HALF_UP);
            total = total.add(p[0].multiply(normalizedWeight));
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private ScoreBreakdown breakdownFromAnswers(Passation p) {
        TypeBucket qcm = new TypeBucket();
        TypeBucket code = new TypeBucket();
        TypeBucket cas = new TypeBucket();
        List<Answer> answers = answerRepo.findByPassationId(p.getId());
        for (Answer a : answers) {
            Question q = questionRepo.findById(a.getQuestionId()).orElse(null);
            if (q == null) continue;
            TypeBucket b = switch (q.getType()) {
                case QCM -> qcm;
                case CODE -> code;
                case CAS_PRATIQUE -> cas;
            };
            b.total++;
            if (a.getScore() != null && a.getScore().compareTo(new BigDecimal("60.00")) >= 0) b.passed++;
        }
        return new ScoreBreakdown(qcm.passed, qcm.total, code.passed, code.total, cas.passed, cas.total);
    }

    private Integer parseQcmIndex(UUID questionId, String text) {
        if (text == null || text.isBlank()) return null;
        Question q = questionRepo.findById(questionId).orElse(null);
        if (q == null || q.getType() != QuestionType.QCM) return null;
        try { return Integer.parseInt(text.trim()); } catch (Exception e) { return null; }
    }

    private Integer readCorrectIndex(Question q) {
        try {
            JsonNode node = mapper.readTree(q.getJsonPayload());
            JsonNode ci = node.path("correctIndex");
            return ci.isInt() ? ci.asInt() : null;
        } catch (Exception e) { return null; }
    }

    private String readJsonString(Question q, String field) {
        try {
            JsonNode node = mapper.readTree(q.getJsonPayload());
            return node.path(field).asText("");
        } catch (Exception e) { return ""; }
    }

    private List<String> readJsonStringList(Question q, String field) {
        try {
            JsonNode node = mapper.readTree(q.getJsonPayload());
            JsonNode arr = node.path(field);
            List<String> out = new ArrayList<>();
            if (arr.isArray()) for (JsonNode el : arr) out.add(el.asText(""));
            return out;
        } catch (Exception e) { return List.of(); }
    }

    private Invitation validInvitation(String token) {
        Optional<Invitation> opt = invitationRepo.findByToken(token);
        if (opt.isEmpty()) throw new IllegalArgumentException("invitation introuvable");
        Invitation inv = opt.get();
        if (inv.isUsed()) throw new IllegalStateException("invitation deja utilisee");
        if (inv.getExpiresAt().isBefore(OffsetDateTime.now()))
            throw new IllegalStateException("invitation expiree");
        return inv;
    }

    private static class TypeBucket {
        int total = 0;
        int passed = 0;
        BigDecimal ratio() {
            if (total == 0) return BigDecimal.ZERO;
            return BigDecimal.valueOf(passed * 100.0 / total).setScale(2, RoundingMode.HALF_UP);
        }
    }

    public record ScoreBreakdown(
            int qcmPassed, int qcmTotal,
            int codePassed, int codeTotal,
            int casPassed, int casTotal) {}

    public record SubmitResult(Passation passation, ScoreBreakdown breakdown) {}

    public record RunCodeResult(
            String status,
            int exitCode,
            String stdout,
            String stderr,
            long durationMs,
            int testsPassed,
            int testsTotal,
            double score
    ) {}
}
