package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.candidate.CandidatePassationService;
import com.tsarajoro.skillforge.candidate.CandidatePassationService.RunCodeResult;
import com.tsarajoro.skillforge.domain.Passation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Endpoints PUBLICS pour le candidat (whitelist Spring Security via /candidate/**).
 *
 * Pas d'authentification JWT : le candidat n'a pas de compte SkillForge.
 * La securite repose sur :
 * - le token d'invitation a usage unique
 * - l'expiration (24 h par defaut)
 * - le statut 'used' qui se marque a la soumission
 */
@RestController
@RequestMapping("/candidate")
public class CandidateController {

    private final CandidatePassationService service;

    public CandidateController(CandidatePassationService service) {
        this.service = service;
    }

    @PostMapping("/passations/start")
    public PassationView startOrResume(@Valid @RequestBody StartRequest body) {
        Passation p = service.startOrResume(body.token(), body.candidateEmail(), body.candidateDisplayName());
        return PassationView.of(p);
    }

    @PostMapping("/passations/{passationId}/answer-text")
    public ResponseEntity<Void> saveText(@PathVariable UUID passationId,
                                          @Valid @RequestBody TextAnswerRequest body) {
        service.saveTextAnswer(passationId, body.questionId(), body.answerText());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/passations/{passationId}/run-code")
    public RunCodeResult runCode(@PathVariable UUID passationId,
                                  @Valid @RequestBody RunCodeRequest body) {
        return service.runCode(passationId, body.questionId(), body.language(),
                body.userCode(), body.hiddenTests());
    }

    @PostMapping("/passations/{passationId}/submit")
    public PassationView submit(@PathVariable UUID passationId) {
        return PassationView.of(service.submit(passationId));
    }

    // ---------- DTOs ----------

    public record StartRequest(
            @NotBlank String token,
            @Email @NotBlank String candidateEmail,
            @NotBlank String candidateDisplayName
    ) {}

    public record TextAnswerRequest(
            UUID questionId,
            String answerText
    ) {}

    public record RunCodeRequest(
            UUID questionId,
            @NotBlank String language,
            @NotBlank String userCode,
            String hiddenTests
    ) {}

    public record PassationView(
            UUID id, UUID invitationId, UUID candidateId,
            String startedAt, String submittedAt,
            BigDecimal globalScore, int fraudRiskScore) {
        static PassationView of(Passation p) {
            return new PassationView(
                    p.getId(), p.getInvitationId(), p.getCandidateId(),
                    p.getStartedAt() == null ? null : p.getStartedAt().toString(),
                    p.getSubmittedAt() == null ? null : p.getSubmittedAt().toString(),
                    p.getGlobalScore(), p.getFraudRiskScore());
        }
    }
}
