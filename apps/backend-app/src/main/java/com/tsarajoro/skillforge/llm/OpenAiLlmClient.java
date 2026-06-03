package com.tsarajoro.skillforge.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.llm.CvExtractionResult.ExtractedSkill;
import com.tsarajoro.skillforge.llm.CvExtractionResult.SkillLevel;
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

/**
 * Implementation OpenAI : appelle l'API chat/completions avec une sortie structuree JSON.
 * Activee quand skillforge.llm.provider=openai.
 */
@Component
@ConditionalOnProperty(name = "skillforge.llm.provider", havingValue = "openai")
public class OpenAiLlmClient implements LlmClient {

    private static final String BASE_URL = "https://api.openai.com/v1";

    private final RestClient http;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();

    public OpenAiLlmClient(
            @Value("${skillforge.llm.openai.api-key}") String apiKey,
            @Value("${skillforge.llm.openai.model}") String model) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "OPENAI_API_KEY is missing while skillforge.llm.provider=openai");
        }
        this.model = model;
        this.http = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
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
            // Estimation grossiere du cout (gpt-4o-mini ~ 0.15/1M input, 0.60/1M output)
            BigDecimal cost = BigDecimal.valueOf(tokens).multiply(new BigDecimal("0.0000005"));
            return new CvExtractionResult(skills, providerName(), model, tokens, cost);

        } catch (Exception e) {
            throw new LlmCallException("openai chat/completions failed: " + e.getMessage(), e);
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
    public String providerName() {
        return "openai";
    }
}
