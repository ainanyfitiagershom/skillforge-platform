package com.tsarajoro.skillforge.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Implementation Claude (Anthropic). Squelette pret a etre rempli quand la cle API sera disponible.
 * Activee quand skillforge.llm.provider=claude.
 *
 * Pour completer cette classe :
 * 1. Ajouter l'appel HTTP a https://api.anthropic.com/v1/messages
 * 2. Passer le header x-api-key + anthropic-version: 2023-06-01
 * 3. Utiliser le prompt caching pour reduire les couts (header anthropic-beta: prompt-caching-2024-07-31)
 * 4. Parser la reponse au format Claude (content[0].text contient le JSON)
 */
@Component
@ConditionalOnProperty(name = "skillforge.llm.provider", havingValue = "claude")
public class ClaudeLlmClient implements LlmClient {

    private final String apiKey;
    private final String model;

    public ClaudeLlmClient(
            @Value("${skillforge.llm.claude.api-key}") String apiKey,
            @Value("${skillforge.llm.claude.model}") String model) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "ANTHROPIC_API_KEY is missing while skillforge.llm.provider=claude");
        }
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public CvExtractionResult extractSkillsFromCv(String cvText, String profileCode) {
        throw new UnsupportedOperationException(
                "Claude LLM client not implemented yet — set skillforge.llm.provider=openai or mock");
    }

    @Override
    public String providerName() {
        return "claude";
    }
}
