package com.tsarajoro.skillforge.candidate;

import com.fasterxml.jackson.databind.JsonNode;
import com.tsarajoro.skillforge.domain.Answer;
import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.domain.Passation;
import com.tsarajoro.skillforge.repository.AnswerRepository;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.InvitationRepository;
import com.tsarajoro.skillforge.repository.PassationRepository;
import com.tsarajoro.skillforge.sandbox.SandboxApiClient;
import com.tsarajoro.skillforge.sandbox.SandboxApiClient.SandboxExecuteRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Orchestre la passation cote candidat (depuis le frontend public).
 *
 * - startOrResume : ouvre/reprend une passation a partir du token d'invitation
 * - saveQcm / saveOpenAnswer : sauvegarde auto au fur et a mesure
 * - runCode : appelle backend-sandbox et stocke le score
 * - submit : marque la passation terminee (un seul submit par invitation)
 */
@Service
public class CandidatePassationService {

    private final InvitationRepository invitationRepo;
    private final PassationRepository passationRepo;
    private final AnswerRepository answerRepo;
    private final CandidateRepository candidateRepo;
    private final SandboxApiClient sandboxClient;

    public CandidatePassationService(
            InvitationRepository invitationRepo,
            PassationRepository passationRepo,
            AnswerRepository answerRepo,
            CandidateRepository candidateRepo,
            SandboxApiClient sandboxClient) {
        this.invitationRepo = invitationRepo;
        this.passationRepo = passationRepo;
        this.answerRepo = answerRepo;
        this.candidateRepo = candidateRepo;
        this.sandboxClient = sandboxClient;
    }

    @Transactional
    public Passation startOrResume(String token, String candidateEmail, String candidateDisplayName) {
        Invitation inv = validInvitation(token);

        return passationRepo.findByInvitationId(inv.getId())
                .orElseGet(() -> {
                    // Premiere fois : creer ou retrouver le candidat
                    Candidate candidate = candidateRepo.findByEmail(candidateEmail)
                            .orElseGet(() -> candidateRepo.save(
                                    Candidate.newCandidate(candidateEmail, candidateDisplayName)));
                    return passationRepo.save(Passation.newPassation(inv.getId(), candidate.getId()));
                });
    }

    @Transactional
    public Answer saveTextAnswer(UUID passationId, UUID questionId, String answerText) {
        Answer existing = answerRepo
                .findByPassationIdAndQuestionId(passationId, questionId)
                .orElse(null);

        if (existing != null) {
            existing.setAnswerText(answerText);
            return answerRepo.save(existing);
        }
        return answerRepo.save(Answer.newAnswer(passationId, questionId, answerText, null, null));
    }

    @Transactional
    public RunCodeResult runCode(UUID passationId, UUID questionId, String language,
                                  String userCode, String hiddenTests) {
        JsonNode resp = sandboxClient.execute(new SandboxExecuteRequest(
                language, userCode, hiddenTests, null));

        // Extraire les infos cles
        String status = resp.path("status").asText("ERROR");
        int exitCode = resp.path("exitCode").asInt(-1);
        String stdout = resp.path("stdout").asText("");
        String stderr = resp.path("stderr").asText("");
        long durationMs = resp.path("durationMs").asLong(0);
        int testsPassed = resp.path("testsPassed").asInt(0);
        int testsTotal = resp.path("testsTotal").asInt(0);
        double score = resp.path("score").asDouble(0.0);

        // Mettre a jour ou creer la reponse
        BigDecimal scoreBd = BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
        Answer existing = answerRepo
                .findByPassationIdAndQuestionId(passationId, questionId)
                .orElse(null);
        if (existing != null) {
            existing.setSubmittedCode(userCode);
            existing.setScore(scoreBd);
            answerRepo.save(existing);
        } else {
            answerRepo.save(Answer.newAnswer(passationId, questionId, null, userCode, scoreBd));
        }

        return new RunCodeResult(status, exitCode, stdout, stderr, durationMs,
                testsPassed, testsTotal, score);
    }

    @Transactional
    public Passation submit(UUID passationId) {
        Passation p = passationRepo.findById(passationId).orElseThrow();
        if (p.getSubmittedAt() != null) {
            // Deja soumis : pas de double submission
            return p;
        }

        // Calculer le score global comme moyenne des scores individuels
        List<Answer> answers = answerRepo.findByPassationId(passationId);
        BigDecimal sum = BigDecimal.ZERO;
        int counted = 0;
        for (Answer a : answers) {
            if (a.getScore() != null) {
                sum = sum.add(a.getScore());
                counted++;
            }
        }
        BigDecimal global = counted == 0
                ? BigDecimal.ZERO
                : sum.divide(BigDecimal.valueOf(counted), 2, RoundingMode.HALF_UP);

        p.submit(global);

        // Marquer l'invitation comme utilisee
        invitationRepo.findById(p.getInvitationId()).ifPresent(inv -> {
            inv.markUsed();
            invitationRepo.save(inv);
        });

        return passationRepo.save(p);
    }

    /**
     * Valide qu'une invitation est utilisable, sinon leve.
     */
    private Invitation validInvitation(String token) {
        Optional<Invitation> opt = invitationRepo.findByToken(token);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("invitation introuvable");
        }
        Invitation inv = opt.get();
        if (inv.isUsed()) {
            throw new IllegalStateException("invitation deja utilisee");
        }
        if (inv.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalStateException("invitation expiree");
        }
        return inv;
    }

    public record RunCodeResult(
            String status,
            int exitCode,
            String stdout,
            String stderr,
            long durationMs,
            int testsPassed,
            int testsTotal,
            double score
    ) {}
}
