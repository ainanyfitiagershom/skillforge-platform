package com.tsarajoro.skillforge.generation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionStatus;
import com.tsarajoro.skillforge.domain.QuestionType;
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
            String cleanPayload = sanitizeJsonPayload(g.jsonPayload(), g.type(), g.statement());
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

    private String sanitizeJsonPayload(String raw, QuestionType type, String statement) {
        JsonNode parsed = parseWithRepair(raw);
        if (parsed == null) {
            // JSON irreparable : on garde la logique existante (payload d erreur).
            log.warn("LLM a renvoye un JSON invalide pour une question {} (statement={}),"
                    + " stockage en payload d'erreur", type, truncate(statement, 80));
            try {
                return mapper.writeValueAsString(Map.of(
                        "_error", "invalid_json_from_llm",
                        "_rawText", raw == null ? "" : raw));
            } catch (Exception ee) {
                return "{}";
            }
        }
        // Pour les questions CODE, on garantit la presence des champs cles.
        // Le prompt LLM les reclame deja mais GPT-4o-mini / Gemini / Groq les
        // oublient de temps en temps. Sans starterCode, le candidat se retrouve
        // devant un editeur vide impossible a utiliser.
        if (type == QuestionType.CODE && parsed.isObject()) {
            parsed = ensureCodeDefaults((ObjectNode) parsed, statement);
        }
        try {
            return mapper.writeValueAsString(parsed);
        } catch (Exception e) {
            return "{}";
        }
    }

    /**
     * Parse le JSON brut, avec reparation automatique en cas de troncature max_tokens.
     * Retourne null si le JSON est irreparable.
     */
    private JsonNode parseWithRepair(String raw) {
        if (raw == null || raw.isBlank()) {
            return mapper.createObjectNode();
        }
        try {
            return mapper.readTree(raw);
        } catch (Exception firstError) {
            String repaired = attemptJsonRepair(raw);
            if (repaired != null) {
                try {
                    JsonNode node = mapper.readTree(repaired);
                    log.info("JSON reconstruit avec succes apres troncature LLM (+{} caracteres)",
                            repaired.length() - raw.length());
                    return node;
                } catch (Exception ignored) {
                    // repair a echoue aussi
                }
            }
            return null;
        }
    }

    /**
     * Garantit que le payload d une question CODE contient language, starterCode
     * et hiddenTests utilisables, meme si le LLM les a oublies. Le candidat
     * doit toujours voir un vrai squelette dans son editeur.
     */
    private ObjectNode ensureCodeDefaults(ObjectNode payload, String statement) {
        String language = payload.path("language").asText("").toUpperCase();
        if (!language.equals("PHP") && !language.equals("JS")) {
            language = detectLanguageFromStatement(statement);
            payload.put("language", language);
        }
        if (isBlankNode(payload.path("starterCode"))) {
            log.info("starterCode manquant pour question CODE ({}), fallback applique", language);
            payload.put("starterCode", defaultStarterCode(language));
        }
        if (isBlankNode(payload.path("hiddenTests"))) {
            log.info("hiddenTests manquants pour question CODE ({}), fallback applique", language);
            payload.put("hiddenTests", defaultHiddenTests(language));
        }
        if (isBlankNode(payload.path("explanation"))) {
            payload.put("explanation",
                    "Implementez la fonction solve en respectant la signature fournie.");
        }
        return payload;
    }

    /** Devine PHP vs JS a partir de l enonce (par defaut : JS). */
    private String detectLanguageFromStatement(String statement) {
        if (statement == null) return "JS";
        String lower = statement.toLowerCase();
        if (lower.contains("php")) return "PHP";
        if (lower.contains("javascript") || lower.contains(" js ") || lower.contains("node")) {
            return "JS";
        }
        return "JS";
    }

    private boolean isBlankNode(JsonNode node) {
        return node == null || node.isMissingNode() || node.isNull()
                || (node.isTextual() && node.asText().isBlank());
    }

    private String defaultStarterCode(String language) {
        if ("PHP".equals(language)) {
            return "<?php\n"
                    + "/**\n"
                    + " * Implementez la fonction demandee.\n"
                    + " */\n"
                    + "function solve($input) {\n"
                    + "    // TODO: implementer ici\n"
                    + "    return null;\n"
                    + "}\n";
        }
        // JS par defaut
        return "/**\n"
                + " * Implementez la fonction demandee.\n"
                + " */\n"
                + "function solve(input) {\n"
                + "    // TODO: implementer ici\n"
                + "    return null;\n"
                + "}\n"
                + "module.exports = { solve };\n";
    }

    private String defaultHiddenTests(String language) {
        if ("PHP".equals(language)) {
            return "<?php use PHPUnit\\Framework\\TestCase; require_once 'solution.php';\n"
                    + "class HiddenTest extends TestCase {\n"
                    + "    public function testBasic(): void {\n"
                    + "        $this->assertNotNull(solve(null));\n"
                    + "    }\n"
                    + "}\n";
        }
        return "const { solve } = require('./solution');\n"
                + "describe('solve', () => {\n"
                + "    test('fonction definie', () => {\n"
                + "        expect(typeof solve).toBe('function');\n"
                + "    });\n"
                + "});\n";
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "...";
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
