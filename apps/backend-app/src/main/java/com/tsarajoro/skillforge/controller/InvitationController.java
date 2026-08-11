package com.tsarajoro.skillforge.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.InvitationRepository;
import com.tsarajoro.skillforge.repository.TestRepository;
import com.tsarajoro.skillforge.test.InvitationService;
import com.tsarajoro.skillforge.test.InvitationService.InvitationStatus;
import com.tsarajoro.skillforge.test.TestCompositionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Endpoint PUBLIC (whitelist Spring Security) : un candidat peut valider son lien d'invitation
 * et recuperer la composition du test associe, sans avoir de compte SkillForge.
 */
@RestController
@RequestMapping("/invitations")
public class InvitationController {

    private static final ObjectMapper JSON = new ObjectMapper();

    private final InvitationService invitationService;
    private final InvitationRepository invitationRepo;
    private final TestCompositionService compositionService;
    private final TestRepository testRepo;
    private final CandidateRepository candidateRepo;

    public InvitationController(InvitationService invitationService,
                                 InvitationRepository invitationRepo,
                                 TestCompositionService compositionService,
                                 TestRepository testRepo,
                                 CandidateRepository candidateRepo) {
        this.invitationService = invitationService;
        this.invitationRepo = invitationRepo;
        this.compositionService = compositionService;
        this.testRepo = testRepo;
        this.candidateRepo = candidateRepo;
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> resolve(@PathVariable String token) {
        InvitationStatus status = invitationService.checkToken(token);
        if (status != InvitationStatus.VALID) {
            return ResponseEntity.status(410).body(new ErrorResponse(status.name()));
        }
        // Recuperer les questions du test (sans les bonnes reponses pour le candidat).
        var inv = invitationRepo.findByToken(token).orElseThrow();
        List<Question> qs = compositionService.getQuestionsOrdered(inv.getTestId());

        // UX-01 : identite candidat pre-etablie par le recruteur (test.candidate_id).
        // On expose email + display_name + profile_code au frontend pour verrouiller
        // les champs (plus de saisie libre du nom).
        Test test = testRepo.findById(inv.getTestId()).orElse(null);
        String candidateEmail = null;
        String candidateDisplayName = null;
        String profileCode = null;
        if (test != null) {
            profileCode = test.getProfileCode();
            if (test.getCandidateId() != null) {
                Candidate c = candidateRepo.findById(test.getCandidateId()).orElse(null);
                if (c != null) {
                    candidateEmail = c.getEmail();
                    candidateDisplayName = c.getDisplayName();
                }
            }
        }

        // On expose requiresAccessCode = true si un code d acces existe pour cette
        // invitation (jamais le code lui-meme : il est secret, connu du candidat
        // uniquement via l email recu).
        boolean requiresAccessCode = inv.getAccessCode() != null && !inv.getAccessCode().isBlank();

        return ResponseEntity.ok(new InvitationPayload(
                inv.getTestId(),
                candidateEmail,
                candidateDisplayName,
                profileCode,
                requiresAccessCode,
                qs.stream().map(CandidateQuestionView::sanitize).toList()));
    }

    public record InvitationPayload(
            UUID testId,
            String candidateEmail,
            String candidateDisplayName,
            String profileCode,
            boolean requiresAccessCode,
            List<CandidateQuestionView> questions) {}

    public record CandidateQuestionView(UUID id, QuestionType type, String statement,
                                         int difficulty, String publicPayload) {
        static CandidateQuestionView sanitize(Question q) {
            String payload = sanitizePayload(q.getJsonPayload());
            return new CandidateQuestionView(q.getId(), q.getType(), q.getStatement(),
                    q.getDifficulty(), payload);
        }

        private static String sanitizePayload(String rawPayload) {
            try {
                JsonNode node = JSON.readTree(rawPayload);
                if (node instanceof ObjectNode object) {
                    object.remove(List.of("correctIndex", "hiddenTests", "explanation"));
                    return JSON.writeValueAsString(object);
                }
                return "{}";
            } catch (Exception ignored) {
                return "{}";
            }
        }
    }

    public record ErrorResponse(String reason) {}
}
