package com.tsarajoro.skillforge.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Envoi via l API HTTPS de Resend (https://resend.com).
 *
 * <p>Utilise en prod cloud quand l hebergeur bloque les ports SMTP sortants
 * (cas de Render Free qui bloque 25, 465 et 587 pour anti-spam). L API passe
 * sur le port 443 standard HTTPS, jamais bloque.
 *
 * <p>Active quand skillforge.mail.provider=resend. Necessite la cle
 * RESEND_API_KEY dans les variables d env.
 *
 * <p>Format attendu par Resend (POST https://api.resend.com/emails) :
 * <pre>
 * {
 *   "from": "SkillForge &lt;onboarding@resend.dev&gt;",
 *   "to": ["candidat@example.com"],
 *   "subject": "Objet",
 *   "html": "&lt;html&gt;...&lt;/html&gt;"
 * }
 * </pre>
 */
@Component
@ConditionalOnProperty(name = "skillforge.mail.provider", havingValue = "resend")
public class ResendEmailSender implements EmailSender {

    private static final String RESEND_API = "https://api.resend.com";

    private final RestClient http;

    public ResendEmailSender(@Value("${skillforge.mail.resend.api-key:}") String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "RESEND_API_KEY manquante alors que skillforge.mail.provider=resend");
        }
        this.http = RestClient.builder()
                .baseUrl(RESEND_API)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public void send(String to, String fromAddr, String fromName,
                     String subject, String html) throws EmailSendException {
        String from = fromName == null || fromName.isBlank()
                ? fromAddr
                : fromName + " <" + fromAddr + ">";

        Map<String, Object> body = Map.of(
                "from", from,
                "to", new String[] { to },
                "subject", subject,
                "html", html);

        try {
            http.post()
                    .uri("/emails")
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            throw new EmailSendException("Envoi Resend echoue : " + e.getMessage(), e);
        }
    }
}
