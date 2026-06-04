package com.tsarajoro.skillforge.generation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionStatus;
import com.tsarajoro.skillforge.llm.GenerationRequest;
import com.tsarajoro.skillforge.llm.LlmClient;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult.GeneratedQuestion;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Orchestre la generation adaptative de questions par le LLM, puis les persiste en
 * statut PENDING_REVIEW pour validation manuelle par le recruteur.
 *
 * Note : les LLM renvoient parfois des chaines JSON mal echappees (sauts de ligne dans
 * du code, guillemets non echappes...). Pour eviter de planter PostgreSQL JSONB, on
 * passe chaque payload par un sanitizer Jackson qui le re-serialise proprement, ou,
 * en cas d'echec total, le stocke dans un objet d'erreur structure.
 */
@Service
public class TestGenerationService {

    private static final Logger log = LoggerFactory.getLogger(TestGenerationService.class);

    private final LlmClient llmClient;
    private final QuestionRepository questionRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public TestGenerationService(LlmClient llmClient, QuestionRepository questionRepo) {
        this.llmClient = llmClient;
        this.questionRepo = questionRepo;
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

        return new GenerationOutput(persisted, result.llmProvider(), result.llmModel(),
                result.tokensUsed(), result.costEur().toPlainString());
    }

    /**
     * Re-serialise un payload JSON pour eviter les erreurs de parsing PostgreSQL JSONB.
     * Si le JSON est invalide, on stocke un objet d'erreur structure (et on log un warning).
     */
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
            String llmProvider,
            String llmModel,
            int tokensUsed,
            String costEur) {}
}
