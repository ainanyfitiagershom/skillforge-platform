package com.tsarajoro.skillforge.sandbox;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

/**
 * Client HTTP appelant le service backend-sandbox (port 8091).
 *
 * Utilise une cle interne X-Internal-Key partagee. En cas d'echec reseau,
 * propage une exception applicative (le service appelant decide quoi faire).
 */
@Component
public class SandboxApiClient {

    private final RestClient http;

    public SandboxApiClient(
            @Value("${skillforge.sandbox.url:http://localhost:8091}") String sandboxUrl,
            @Value("${skillforge.sandbox.internal-key:dev-internal-key-please-change}") String internalKey) {
        this.http = RestClient.builder()
                .baseUrl(sandboxUrl)
                .defaultHeader("X-Internal-Key", internalKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Lance une execution sandbox. Retourne la reponse brute en JsonNode pour
     * eviter de dupliquer les DTOs entre les deux services en V1.
     */
    public JsonNode execute(SandboxExecuteRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("language", req.language());
        body.put("userCode", req.userCode());
        if (req.hiddenTests() != null) body.put("hiddenTests", req.hiddenTests());
        if (req.timeoutSeconds() != null) body.put("timeoutSeconds", req.timeoutSeconds());

        try {
            return http.post()
                    .uri("/sandbox/execute")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            throw new SandboxUnavailableException(
                    "sandbox unavailable or returned error: " + e.getMessage(), e);
        }
    }

    public record SandboxExecuteRequest(
            String language,
            String userCode,
            String hiddenTests,
            Integer timeoutSeconds
    ) {}
}
