package com.tsarajoro.skillforge.generation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionStatus;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.llm.GenerationRequest;
import com.tsarajoro.skillforge.llm.LlmClient;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult.GeneratedQuestion;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import com.tsarajoro.skillforge.test.TestCompositionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TestGenerationService {

    private static final Logger log = LoggerFactory.getLogger(TestGenerationService.class);

    private final LlmClient llmClient;
    private final QuestionRepository questionRepo;
    private final CandidateRepository candidateRepo;
    private final TestCompositionService testCompositionService;
    private final ObjectMapper mapper = new ObjectMapper();

    public TestGenerationService(LlmClient llmClient,
                                  QuestionRepository questionRepo,
                                  CandidateRepository candidateRepo,
                                  TestCompositionService testCompositionService) {
        this.llmClient = llmClient;
        this.questionRepo = questionRepo;
        this.candidateRepo = candidateRepo;
        this.testCompositionService = testCompositionService;
    }

    @Transactional
    public GenerationOutput generate(GenerationRequest request) {
        QuestionGenerationResult result = llmClient.generateQuestions(request);

        List<Question> persisted = new ArrayList<>();
        for (GeneratedQuestion g : result.questions()) {
            String cleanPayload = sanitizeJsonPayload(g.jsonPayload());
            Question q = Question.newQuestion(
                    g.type(),
                    g.statement(),
                    g.difficulty(),
                    QuestionStatus.PENDING_REVIEW,
                    cleanPayload);
            persisted.add(questionRepo.save(q));
        }

        Test test = null;
        if (request.candidateId() != null && !persisted.isEmpty()) {
            String candidateLabel = candidateRepo.findById(request.candidateId())
                    .map(c -> c.getDisplayName() != null ? c.getDisplayName() : c.getEmail())
                    .orElse("candidat");
            String testName = "Test " + request.profileCode() + " pour " + candidateLabel;
            test = testCompositionService.compose(
                    testName,
                    60,
                    request.candidateId(),
                    request.profileCode(),
                    persisted.stream().map(Question::getId).toList());
        }

        return new GenerationOutput(
                persisted,
                test != null ? test.getId() : null,
                result.llmProvider(),
                result.llmModel(),
                result.tokensUsed(),
                result.costEur().toPlainString());
    }

    private String sanitizeJsonPayload(String raw) {
        if (raw == null || raw.isBlank()) {
            return "{}";
        }
        try {
            JsonNode node = mapper.readTree(raw);
            return mapper.writeValueAsString(node);
        } catch (Exception e) {
            log.warn("LLM a renvoye un JSON invalide ({}), stockage en payload d'erreur", e.getMessage());
            try {
                return mapper.writeValueAsString(Map.of(
                        "_error", "invalid_json_from_llm",
                        "_rawText", raw,
                        "_parseError", e.getMessage()));
            } catch (Exception ee) {
                return "{}";
            }
        }
    }

    public record GenerationOutput(
            List<Question> questions,
            UUID testId,
            String llmProvider,
            String llmModel,
            int tokensUsed,
            String costEur) {}
}
