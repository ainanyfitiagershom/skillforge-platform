package com.tsarajoro.skillforge.sandbox.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Requete d'execution sandbox envoyee par backend-app.
 *
 * @param language langage du code (PHP, JS)
 * @param userCode code soumis par le candidat (max 50 Ko)
 * @param hiddenTests tests unitaires fournis par le recruteur (optionnel)
 * @param timeoutSeconds timeout custom (optionnel, sinon valeur par defaut)
 */
public record ExecutionRequest(
        @NotNull Language language,
        @NotBlank @Size(max = 50_000) String userCode,
        @Size(max = 50_000) String hiddenTests,
        Integer timeoutSeconds
) {}
