package com.tsarajoro.skillforge.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.llm.CvExtractionResult.ExtractedSkill;
import com.tsarajoro.skillforge.llm.CvExtractionResult.SkillLevel;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult.GeneratedQuestion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation Ollama (LLM local, API OpenAI-compatible).
 * Activee quand skillforge.llm.provider=ollama.
 *
 * <p>Avantage majeur : 100% souverain (aucune donnee CV / candidat ne
 * quitte la machine), zero quota, zero dependance externe reseau apres
 * le pull initial du modele. Argument fort pour le jury M2 (RGPD,
 * souverainete donnees, deploiement on-premise chez Tsarajoro).
 *
 * <p>Configuration :
 *   - En dev : conteneur skillforge-ollama du docker-compose, expose
 *     sur http://localhost:11434.
 *   - Modele conseille : qwen2.5:7b (bon compromis qualite / RAM 8 Go /
 *     support JSON structure natif).
 *   - Autres options : llama3.2:3b (plus rapide, moins fiable en JSON),
 *     qwen2.5-coder:7b (specialise code).
 *
 * <p>Doc : https://ollama.com/library
 */
@Component
@ConditionalOnProperty(name = "skillforge.llm.provider", havingValue = "ollama")
public class OllamaLlmClient implements LlmClient {

    private static final Logger log = LoggerFactory.getLogger(OllamaLlmClient.class);
    // Ollama est local -> aucun cout, aucun quota.
    private static final BigDecimal COST_PER_TOKEN = BigDecimal.ZERO;

    private final RestClient http;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();

    /** Lit jsonPayload qui peut etre une string echappee ou un objet imbrique. */
    private String extractJsonPayload(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return "{}";
        }
        if (node.isTextual()) {
            String raw = node.asText();
            return raw.isBlank() ? "{}" : raw;
        }
        if (node.isObject() || node.isArray()) {
            try {
                return mapper.writeValueAsString(node);
            } catch (Exception e) {
                return "{}";
            }
        }
        return "{}";
    }

    public OllamaLlmClient(
            @Value("${skillforge.llm.ollama.base-url:http://localhost:11434/v1}") String baseUrl,
            @Value("${skillforge.llm.ollama.model:qwen2.5:7b}") String model) {
        this.model = model;
        this.http = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public CvExtractionResult extractSkillsFromCv(String cvText, String profileCode) {
        String systemPrompt = """
                Tu es un expert RH technique. Tu analyses un CV et tu extrais STRICTEMENT les competences techniques declarees.
                Reponds UNIQUEMENT en JSON, sans aucun texte avant ou apres, au format suivant :
                {
                  "skills": [
                    { "code": "LANG_PHP", "displayName": "PHP", "level": "SENIOR", "yearsOfExperience": 5 }
                  ]
                }
                Les valeurs de 'code' doivent etre choisies dans le referentiel suivant :
                LANG_PHP, LANG_JS, LANG_TS, LANG_HTML, LANG_CSS, LANG_SQL,
                FW_LARAVEL, FW_SYMFONY, FW_VUE, FW_NUXT, FW_REACT, FW_TAILWIND,
                CMS_WP, CMS_WP_HOOKS, CMS_WP_THEME, CMS_WP_PLUGIN,
                DB_MYSQL, DB_MARIADB, DB_POSTGRES,
                SEO_ONPAGE, SEO_TECHNIQUE, SEO_NETLINKING, SEO_SCHEMA, PERF_WEB,
                TOOL_GIT, TOOL_DOCKER, TOOL_COMPOSER, TOOL_NPM.
                'level' est l'un de : JUNIOR, CONFIRME, SENIOR, UNKNOWN.
                'yearsOfExperience' est un entier ou null si non determinable.
                N'invente jamais de competence absente du CV.
                """;

        Map<String, Object> body = Map.of(
                "model", model,
                "response_format", Map.of("type", "json_object"),
                "max_tokens", 4000,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content",
                                "Profil cible : " + profileCode + "\n\nCV :\n" + cvText)));

        try {
            JsonNode response = http.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            String content = response.path("choices").path(0).path("message").path("content").asText();
            JsonNode parsed = mapper.readTree(content);

            List<ExtractedSkill> skills = new ArrayList<>();
            for (JsonNode s : parsed.path("skills")) {
                String code = s.path("code").asText();
                String name = s.path("displayName").asText();
                String levelStr = s.path("level").asText("UNKNOWN");
                Integer years = s.hasNonNull("yearsOfExperience")
                        ? s.path("yearsOfExperience").asInt()
                        : null;
                skills.add(new ExtractedSkill(code, name, parseLevel(levelStr), years));
            }

            int tokens = response.path("usage").path("total_tokens").asInt(0);
            return new CvExtractionResult(skills, providerName(), model, tokens, COST_PER_TOKEN);

        } catch (Exception e) {
            throw new LlmCallException("ollama chat/completions failed: " + e.getMessage(), e);
        }
    }

    private SkillLevel parseLevel(String s) {
        try {
            return SkillLevel.valueOf(s.toUpperCase());
        } catch (Exception e) {
            return SkillLevel.UNKNOWN;
        }
    }

    @Override
    public QuestionGenerationResult generateQuestions(GenerationRequest request) {
        String typesBreakdown = request.types().stream()
                .map(q -> q.count() + " questions de type " + q.type())
                .collect(Collectors.joining(", "));

        String systemPrompt = """
                Tu generes des questions techniques d'evaluation en JSON.
                Reponds UNIQUEMENT ce JSON :
                {"questions":[{"type":"QCM","statement":"...","difficulty":3,"targetSkillCodes":["LANG_PHP"],"jsonPayload":"..."}]}

                type: QCM | CODE | CAS_PRATIQUE.
                difficulty: 1-5.
                statement: enonce concis 2-3 phrases.
                jsonPayload: CHAINE JSON echappee (jamais objet), forme selon type :
                - QCM: {"options":["A","B","C","D"],"correctIndex":1,"explanation":"..."}
                - CODE: {"language":"PHP"|"JS","starterCode":"...","hiddenTests":"...","explanation":"..."}
                - CAS_PRATIQUE: {"scenario":"...","expectedAnswerPoints":["..."],"explanation":"..."}

                CODE: starterCode = vraie signature + docbloc + "// TODO: implementer" + return par defaut (jamais vide). hiddenTests = 2 assertions courtes.
                Sois concis pour tenir dans la limite de tokens.
                """;

        String userPrompt = String.format("""
                Profil cible : %s
                Competences a evaluer : %s
                Difficulte cible : %d/5
                Repartition demandee : %s
                """, request.profileCode(),
                String.join(", ", request.skillCodes()),
                request.difficulty(),
                typesBreakdown);

        Map<String, Object> body = Map.of(
                "model", model,
                "response_format", Map.of("type", "json_object"),
                "max_tokens", 4000,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)));

        try {
            JsonNode response = http.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            String content = response.path("choices").path(0).path("message").path("content").asText();
            JsonNode parsed = mapper.readTree(content);

            List<GeneratedQuestion> questions = new ArrayList<>();
            for (JsonNode q : parsed.path("questions")) {
                QuestionType type = QuestionType.valueOf(q.path("type").asText());
                String statement = q.path("statement").asText();
                int difficulty = q.path("difficulty").asInt(3);
                List<String> targetSkills = new ArrayList<>();
                for (JsonNode s : q.path("targetSkillCodes")) {
                    targetSkills.add(s.asText());
                }
                String payload = extractJsonPayload(q.path("jsonPayload"));
                if (statement.isBlank() || payload.equals("{}")) {
                    log.warn("LLM a renvoye une question incomplete (type={}, statementEmpty={}, payloadEmpty={}): raw={}",
                            type, statement.isBlank(), payload.equals("{}"), q.toString());
                }
                questions.add(new GeneratedQuestion(type, statement, difficulty, targetSkills, payload));
            }

            int tokens = response.path("usage").path("total_tokens").asInt(0);
            return new QuestionGenerationResult(questions, providerName(), model, tokens, COST_PER_TOKEN);

        } catch (Exception e) {
            throw new LlmCallException("ollama chat/completions (generation) failed: " + e.getMessage(), e);
        }
    }

    @Override
    public CasGradingResult gradeCasPratique(String scenario, java.util.List<String> expectedPoints, String candidateAnswer) {
        String systemPrompt = """
                Tu es un evaluateur RH technique. Tu notes la reponse d un candidat a une
                question de cas pratique, sur une echelle de 0 a 100, en te basant
                STRICTEMENT sur les points attendus fournis.

                Reponds UNIQUEMENT en JSON :
                {"score": 0-100 entier, "explanation": "2 a 3 phrases neutres et factuelles"}

                Bareme :
                - 0-30 : reponse hors sujet, vide ou tres incomplete
                - 31-60 : reponse partielle, couvre 1-2 points attendus
                - 61-85 : reponse correcte couvrant la majorite des points attendus
                - 86-100 : reponse excellente, structuree, couvre tous les points
                """;

        String userPrompt = String.format("""
                Scenario :
                %s

                Points attendus :
                %s

                Reponse du candidat :
                %s
                """,
                scenario == null ? "(non fourni)" : scenario,
                expectedPoints == null || expectedPoints.isEmpty()
                        ? "(aucun)"
                        : String.join("\n- ", expectedPoints),
                candidateAnswer == null || candidateAnswer.isBlank() ? "(vide)" : candidateAnswer);

        Map<String, Object> body = Map.of(
                "model", model,
                "response_format", Map.of("type", "json_object"),
                "max_tokens", 4000,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)));

        try {
            JsonNode response = http.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            String content = response.path("choices").path(0).path("message").path("content").asText();
            JsonNode parsed = mapper.readTree(content);

            int scoreInt = parsed.path("score").asInt(0);
            if (scoreInt < 0) scoreInt = 0;
            if (scoreInt > 100) scoreInt = 100;
            String explanation = parsed.path("explanation").asText("Evaluation IA sans explication.");

            int tokens = response.path("usage").path("total_tokens").asInt(0);
            return new CasGradingResult(
                    BigDecimal.valueOf(scoreInt).setScale(2),
                    explanation,
                    providerName(),
                    model,
                    tokens,
                    COST_PER_TOKEN);
        } catch (Exception e) {
            throw new LlmCallException("ollama chat/completions (grading) failed: " + e.getMessage(), e);
        }
    }

    @Override
    public ReportGenerationResult generateReport(ReportGenerationResult.Input input) {
        String systemPrompt = """
                Tu es un consultant RH technique senior. Tu rediges un compte rendu d evaluation
                concis, factuel et neutre apres un test technique automatise.

                Reponds UNIQUEMENT en JSON :
                {
                  "summary": "2 a 3 phrases qui resument la performance globale",
                  "strengths": ["3 a 5 points forts concrets et identifies"],
                  "weaknesses": ["3 a 5 points faibles concrets et constructifs"],
                  "recommendation": "HIRE" | "INTERVIEW" | "REJECT"
                }

                Bareme recommandation :
                - HIRE : score global >= 75 ET au moins 60% sur chaque type de question presente
                - INTERVIEW : score global 50-74, ou >= 75 mais inegal selon les types
                - REJECT : score global < 50 ou echec marque sur tous les types

                Style : francais professionnel, phrases courtes, factuel.
                """;

        StringBuilder qSummary = new StringBuilder();
        int idx = 1;
        for (ReportGenerationResult.QuestionSnapshot q : input.questions()) {
            qSummary.append(idx++).append(". [").append(q.type()).append(" diff ")
                    .append(q.difficulty()).append("/5] ")
                    .append(q.statement() == null ? "" : q.statement())
                    .append(" — score: ").append(q.score() == null ? "n/a" : q.score().toPlainString())
                    .append("/100");
            if (q.gradingExplanation() != null && !q.gradingExplanation().isBlank()) {
                qSummary.append(" (").append(q.gradingExplanation()).append(")");
            }
            qSummary.append("\n");
        }

        String userPrompt = String.format("""
                Candidat : %s
                Profil cible : %s
                Score global : %s / 100
                Repartition :
                - QCM : %d / %d reussis
                - CODE : %d / %d reussis
                - CAS_PRATIQUE : %d / %d satisfaisants

                Detail des questions :
                %s
                """,
                input.candidateLabel(),
                input.profileCode(),
                input.globalScore() == null ? "n/a" : input.globalScore().toPlainString(),
                input.qcmPassed(), input.qcmTotal(),
                input.codePassed(), input.codeTotal(),
                input.casPassed(), input.casTotal(),
                qSummary.toString());

        Map<String, Object> body = Map.of(
                "model", model,
                "response_format", Map.of("type", "json_object"),
                "max_tokens", 4000,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)));

        try {
            JsonNode response = http.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            String content = response.path("choices").path(0).path("message").path("content").asText();
            JsonNode parsed = mapper.readTree(content);

            String summary = parsed.path("summary").asText("");
            List<String> strengths = new ArrayList<>();
            for (JsonNode n : parsed.path("strengths")) strengths.add(n.asText(""));
            List<String> weaknesses = new ArrayList<>();
            for (JsonNode n : parsed.path("weaknesses")) weaknesses.add(n.asText(""));

            com.tsarajoro.skillforge.domain.Recommendation reco;
            try {
                reco = com.tsarajoro.skillforge.domain.Recommendation.valueOf(
                        parsed.path("recommendation").asText("INTERVIEW").toUpperCase());
            } catch (Exception e) {
                reco = com.tsarajoro.skillforge.domain.Recommendation.INTERVIEW;
            }

            int tokens = response.path("usage").path("total_tokens").asInt(0);
            return new ReportGenerationResult(
                    summary, strengths, weaknesses, reco,
                    providerName(), model, tokens, COST_PER_TOKEN);
        } catch (Exception e) {
            throw new LlmCallException("ollama chat/completions (report) failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String providerName() {
        return "ollama";
    }
}
