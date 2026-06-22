package com.tsarajoro.skillforge.report;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.Answer;
import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.domain.Passation;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.domain.Recommendation;
import com.tsarajoro.skillforge.domain.Report;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.llm.LlmClient;
import com.tsarajoro.skillforge.llm.ReportGenerationResult;
import com.tsarajoro.skillforge.repository.AnswerRepository;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.InvitationRepository;
import com.tsarajoro.skillforge.repository.PassationRepository;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import com.tsarajoro.skillforge.repository.ReportRepository;
import com.tsarajoro.skillforge.repository.TestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/** Genere et persiste le compte rendu IA d une passation soumise. */
@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final PassationRepository passationRepo;
    private final InvitationRepository invitationRepo;
    private final TestRepository testRepo;
    private final CandidateRepository candidateRepo;
    private final QuestionRepository questionRepo;
    private final AnswerRepository answerRepo;
    private final ReportRepository reportRepo;
    private final LlmClient llmClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public ReportService(
            PassationRepository passationRepo,
            InvitationRepository invitationRepo,
            TestRepository testRepo,
            CandidateRepository candidateRepo,
            QuestionRepository questionRepo,
            AnswerRepository answerRepo,
            ReportRepository reportRepo,
            LlmClient llmClient) {
        this.passationRepo = passationRepo;
        this.invitationRepo = invitationRepo;
        this.testRepo = testRepo;
        this.candidateRepo = candidateRepo;
        this.questionRepo = questionRepo;
        this.answerRepo = answerRepo;
        this.reportRepo = reportRepo;
        this.llmClient = llmClient;
    }

    /** Trouve le rapport existant pour une passation. */
    @Transactional(readOnly = true)
    public Optional<Report> findByPassation(UUID passationId) {
        return reportRepo.findByPassationId(passationId);
    }

    /** Genere ou regenere le rapport pour une passation. Retourne Optional.empty() si echec LLM. */
    @Transactional
    public Optional<Report> generateForPassation(UUID passationId) {
        long t0 = System.currentTimeMillis();
        Passation p = passationRepo.findById(passationId).orElse(null);
        if (p == null) {
            log.warn("Report: passation introuvable id={}", passationId);
            return Optional.empty();
        }

        ReportGenerationResult.Input input = buildInput(p);
        if (input == null) {
            log.warn("Report: impossible de construire l input pour passation {}", passationId);
            return Optional.empty();
        }

        ReportGenerationResult result;
        try {
            result = llmClient.generateReport(input);
        } catch (Exception e) {
            log.warn("Report: appel LLM en echec pour passation {} ({})", passationId, e.getMessage());
            return Optional.empty();
        }

        String strengthsJson = serializeList(result.strengths());
        String weaknessesJson = serializeList(result.weaknesses());

        Report existing = reportRepo.findByPassationId(passationId).orElse(null);
        Report saved;
        if (existing != null) {
            existing.setSummary(safeString(result.summary()));
            existing.setStrengths(strengthsJson);
            existing.setWeaknesses(weaknessesJson);
            existing.setRecommendation(result.recommendation() == null
                    ? Recommendation.INTERVIEW : result.recommendation());
            existing.setGeneratedAt(java.time.OffsetDateTime.now());
            existing.setLlmProvider(result.llmProvider());
            existing.setLlmModel(result.llmModel());
            existing.setTokensUsed(result.tokensUsed());
            existing.setCostEur(result.costEur() == null ? BigDecimal.ZERO : result.costEur());
            saved = reportRepo.save(existing);
        } else {
            saved = reportRepo.save(Report.newReport(
                    passationId,
                    safeString(result.summary()),
                    strengthsJson,
                    weaknessesJson,
                    result.recommendation() == null ? Recommendation.INTERVIEW : result.recommendation(),
                    result.llmProvider(),
                    result.llmModel(),
                    result.tokensUsed(),
                    result.costEur() == null ? BigDecimal.ZERO : result.costEur()));
        }
        log.info("Report: genere pour passation {} en {} ms (provider={}, tokens={})",
                passationId, System.currentTimeMillis() - t0, result.llmProvider(), result.tokensUsed());
        return Optional.of(saved);
    }

    /** Parse le JSON array stocke en strengths/weaknesses pour exposition API. */
    public List<String> parseList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return mapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private String serializeList(List<String> list) {
        try {
            return mapper.writeValueAsString(list == null ? List.of() : list);
        } catch (Exception e) {
            return "[]";
        }
    }

    private String safeString(String s) {
        return s == null ? "" : s;
    }

    private ReportGenerationResult.Input buildInput(Passation p) {
        Invitation inv = invitationRepo.findById(p.getInvitationId()).orElse(null);
        if (inv == null) return null;
        Test test = testRepo.findById(inv.getTestId()).orElse(null);
        if (test == null) return null;
        Candidate candidate = candidateRepo.findById(p.getCandidateId()).orElse(null);
        String candidateLabel = candidate == null
                ? "(candidat inconnu)"
                : (candidate.getDisplayName() != null && !candidate.getDisplayName().isBlank()
                    ? candidate.getDisplayName()
                    : candidate.getEmail());

        List<Answer> answers = answerRepo.findByPassationId(p.getId());
        Map<UUID, Answer> byQuestion = new HashMap<>();
        for (Answer a : answers) byQuestion.put(a.getQuestionId(), a);
        List<UUID> qIds = new ArrayList<>(byQuestion.keySet());
        Map<UUID, Question> questionsById = new HashMap<>();
        for (Question q : questionRepo.findAllById(qIds)) questionsById.put(q.getId(), q);

        TypeBucket qcm = new TypeBucket();
        TypeBucket code = new TypeBucket();
        TypeBucket cas = new TypeBucket();
        List<ReportGenerationResult.QuestionSnapshot> snapshots = new ArrayList<>();

        for (Map.Entry<UUID, Answer> entry : byQuestion.entrySet()) {
            Answer a = entry.getValue();
            Question q = questionsById.get(entry.getKey());
            if (q == null) continue;

            BigDecimal score = a.getScore();
            BigDecimal threshold = q.getType() == QuestionType.CODE
                    ? new BigDecimal("75")
                    : q.getType() == QuestionType.QCM ? new BigDecimal("100") : new BigDecimal("60");
            boolean passed = score != null && score.compareTo(threshold) >= 0;
            TypeBucket b = switch (q.getType()) {
                case QCM -> qcm;
                case CODE -> code;
                case CAS_PRATIQUE -> cas;
            };
            b.total++;
            if (passed) b.passed++;

            snapshots.add(new ReportGenerationResult.QuestionSnapshot(
                    q.getType().name(),
                    q.getStatement(),
                    q.getDifficulty(),
                    score,
                    a.getGradingExplanation()));
        }

        return new ReportGenerationResult.Input(
                candidateLabel,
                test.getProfileCode(),
                p.getGlobalScore(),
                qcm.passed, qcm.total,
                code.passed, code.total,
                cas.passed, cas.total,
                snapshots);
    }

    private static class TypeBucket {
        int total = 0;
        int passed = 0;
    }
}
