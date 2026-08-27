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
        // 1er essai : parse direct
        try {
            JsonNode node = mapper.readTree(raw);
            return mapper.writeValueAsString(node);
        } catch (Exception firstError) {
            // 2e essai : auto-repair d un JSON tronque par le LLM (Groq/OpenAI coupent
            // la reponse au max_tokens et laissent parfois un objet mal ferme). On
            // ferme les accolades / crochets manquants et on retente.
            String repaired = attemptJsonRepair(raw);
            if (repaired != null) {
                try {
                    JsonNode node = mapper.readTree(repaired);
                    log.info("JSON reconstruit avec succes apres troncature LLM (+{} caracteres)",
                            repaired.length() - raw.length());
                    return mapper.writeValueAsString(node);
                } catch (Exception ignored) {
                    // repair a echoue aussi, on tombe dans le fallback
                }
            }
            log.warn("LLM a renvoye un JSON invalide ({}), stockage en payload d'erreur",
                    firstError.getMessage());
            try {
                return mapper.writeValueAsString(Map.of(
                        "_error", "invalid_json_from_llm",
                        "_rawText", raw,
                        "_parseError", firstError.getMessage()));
            } catch (Exception ee) {
                return "{}";
            }
        }
    }

    /**
     * Auto-repair d un JSON coupe par le max_tokens du LLM. Strategie :
     * 1) Retirer une string litterale non terminee en fin (ex: "explanation":"...")
     * 2) Retirer une virgule trainante
     * 3) Fermer les [ et { manquants dans le bon ordre (stack simulee)
     *
     * <p>Ne repare que les cas simples ou le JSON est coupe dans/apres une valeur.
     * Retourne null si la reparation est impossible (chaine trop cassee).
     */
    private String attemptJsonRepair(String raw) {
        if (raw == null || raw.length() < 2) return null;
        String s = raw.trim();
        // Etat courant : dans/hors d une string, backslash actif, stack de containers.
        java.util.Deque<Character> stack = new java.util.ArrayDeque<>();
        boolean inString = false;
        boolean escape = false;
        int lastValidEnd = -1;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (inString) {
                if (escape) { escape = false; continue; }
                if (c == '\\') { escape = true; continue; }
                if (c == '"') inString = false;
                continue;
            }
            switch (c) {
                case '"' -> inString = true;
                case '{' -> stack.push('}');
                case '[' -> stack.push(']');
                case '}', ']' -> { if (!stack.isEmpty()) stack.pop(); }
                default -> {}
            }
            // Position sure : hors string, apres un caractere qui peut cloturer une valeur.
            if (!inString && (c == '"' || c == '}' || c == ']'
                    || Character.isDigit(c) || c == 'e' || c == 'l')) {
                lastValidEnd = i;
            }
        }
        if (stack.isEmpty()) return null; // pas de troncature detectable
        StringBuilder repaired = new StringBuilder();
        if (inString) {
            // On coupe la string incomplete a la derniere position sure et on referme.
            if (lastValidEnd < 0) return null;
            repaired.append(s, 0, lastValidEnd + 1);
        } else {
            repaired.append(s);
        }
        // Enlever une virgule trainante avant de fermer.
        while (repaired.length() > 0) {
            char last = repaired.charAt(repaired.length() - 1);
            if (last == ',' || Character.isWhitespace(last)) {
                repaired.setLength(repaired.length() - 1);
            } else {
                break;
            }
        }
        while (!stack.isEmpty()) {
            repaired.append(stack.pop());
        }
        return repaired.toString();
    }

    public record GenerationOutput(
            List<Question> questions,
            UUID testId,
            String llmProvider,
            String llmModel,
            int tokensUsed,
            String costEur) {}
}
