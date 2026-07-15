package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.candidate.CandidatePassationService;
import com.tsarajoro.skillforge.candidate.CandidatePassationService.PassationState;
import com.tsarajoro.skillforge.candidate.CandidatePassationService.RunCodeResult;
import com.tsarajoro.skillforge.candidate.CandidatePassationService.ScoreBreakdown;
import com.tsarajoro.skillforge.candidate.CandidatePassationService.SubmitResult;
import com.tsarajoro.skillforge.domain.FraudEventType;
import com.tsarajoro.skillforge.domain.Passation;
import com.tsarajoro.skillforge.fraud.FraudDetectionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

/** Endpoints publics candidat (whitelist Spring Security /candidate/**). */
@RestController
@RequestMapping("/candidate")
public class CandidateController {

    private final CandidatePassationService service;
    private final FraudDetectionService fraudService;

    public CandidateController(CandidatePassationService service, FraudDetectionService fraudService) {
        this.service = service;
        this.fraudService = fraudService;
    }

    @PostMapping("/passations/start")
    public PassationView startOrResume(@Valid @RequestBody StartRequest body) {
        Passation p = service.startOrResume(body.token(), body.candidateEmail(), body.candidateDisplayName());
        return PassationView.of(p, null);
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

    @GetMapping("/passations/{passationId}/state")
    public PassationState state(@PathVariable UUID passationId) {
        return service.getState(passationId);
    }

    @PostMapping("/passations/{passationId}/submit")
    public PassationView submit(@PathVariable UUID passationId) {
        SubmitResult r = service.submit(passationId);
        return PassationView.of(r.passation(), ScoreBreakdownView.of(r.breakdown()));
    }

    @PostMapping("/passations/{passationId}/fraud-event")
    public ResponseEntity<Void> reportFraudEvent(@PathVariable UUID passationId,
                                                  @Valid @RequestBody FraudEventRequest body) {
        fraudService.recordEvent(passationId, body.eventType(),
                body.metadata() == null ? "{}" : body.metadata());
        return ResponseEntity.noContent().build();
    }

    public record FraudEventRequest(
            @NotNull FraudEventType eventType,
            String metadata
    ) {}

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

    public record ScoreBreakdownView(
            int qcmPassed, int qcmTotal,
            int codePassed, int codeTotal,
            int casPassed, int casTotal) {
        static ScoreBreakdownView of(ScoreBreakdown b) {
            if (b == null) return null;
            return new ScoreBreakdownView(
                    b.qcmPassed(), b.qcmTotal(),
                    b.codePassed(), b.codeTotal(),
                    b.casPassed(), b.casTotal());
        }
    }

    public record PassationView(
            UUID id, UUID invitationId, UUID candidateId,
            String startedAt, String submittedAt,
            BigDecimal globalScore, int fraudRiskScore,
            ScoreBreakdownView scoreBreakdown) {
        static PassationView of(Passation p, ScoreBreakdownView breakdown) {
            return new PassationView(
                    p.getId(), p.getInvitationId(), p.getCandidateId(),
                    p.getStartedAt() == null ? null : p.getStartedAt().toString(),
                    p.getSubmittedAt() == null ? null : p.getSubmittedAt().toString(),
                    p.getGlobalScore(), p.getFraudRiskScore(),
                    breakdown);
        }
    }
}
