package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.mail.MailService;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.TestRepository;
import com.tsarajoro.skillforge.test.InvitationService;
import com.tsarajoro.skillforge.test.TestCompositionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tests")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class TestController {

    // Table de libelles utilisateur pour les codes profil metier (evite les codes bruts
    // dans les mails candidats).
    private static final Map<String, String> PROFILE_LABELS = Map.of(
            "DEV_PHP",        "Developpeur PHP",
            "INT_WORDPRESS",  "Integrateur WordPress",
            "DEV_VUE",        "Developpeur Vue.js",
            "SEO_TECH",       "Specialiste SEO technique"
    );

    private final TestCompositionService compositionService;
    private final InvitationService invitationService;
    private final TestRepository testRepo;
    private final CandidateRepository candidateRepo;
    private final MailService mailService;

    public TestController(TestCompositionService compositionService,
                          InvitationService invitationService,
                          TestRepository testRepo,
                          CandidateRepository candidateRepo,
                          MailService mailService) {
        this.compositionService = compositionService;
        this.invitationService = invitationService;
        this.testRepo = testRepo;
        this.candidateRepo = candidateRepo;
        this.mailService = mailService;
    }

    @PostMapping
    public ResponseEntity<TestResponse> create(@Valid @RequestBody ComposeRequest body) {
        Test test = compositionService.compose(body.name(), body.durationMinutes(), body.orderedQuestionIds());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TestResponse(test.getId(), test.getName(), test.getDurationMinutes()));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<InvitationResponse> invite(@PathVariable UUID id) {
        Invitation inv = invitationService.createForTest(id);

        // Tentative d envoi email au candidat pre-etabli sur le test.
        // Echec silencieux : le recruteur peut toujours copier le lien manuellement.
        boolean emailSent = false;
        String candidateEmail = null;
        Test test = testRepo.findById(id).orElse(null);
        if (test != null && test.getCandidateId() != null) {
            Candidate c = candidateRepo.findById(test.getCandidateId()).orElse(null);
            if (c != null && c.getEmail() != null && !c.getEmail().isBlank()) {
                candidateEmail = c.getEmail();
                String profileLabel = PROFILE_LABELS.getOrDefault(
                        test.getProfileCode(), test.getProfileCode());
                int ttlHours = (int) ChronoUnit.HOURS.between(
                        OffsetDateTime.now(), inv.getExpiresAt());
                emailSent = mailService.sendInvitationLink(
                        c.getEmail(), c.getDisplayName(), inv.getToken(),
                        inv.getAccessCode(),
                        profileLabel, Math.max(1, ttlHours));
            }
        }

        // On expose l accessCode au recruteur (pour affichage/copie dans la modale
        // d invitation) mais JAMAIS via l endpoint public /invitations/{token}.
        return ResponseEntity.status(HttpStatus.CREATED).body(new InvitationResponse(
                inv.getId(), inv.getToken(), inv.getExpiresAt(), inv.getAccessCode(),
                emailSent, candidateEmail));
    }

    public record ComposeRequest(
            @NotBlank String name,
            @Min(5) @Max(240) int durationMinutes,
            @NotEmpty List<UUID> orderedQuestionIds) {}

    public record TestResponse(UUID id, String name, int durationMinutes) {}

    public record InvitationResponse(
            UUID id, String token, OffsetDateTime expiresAt, String accessCode,
            boolean emailSent, String candidateEmail) {}
}
