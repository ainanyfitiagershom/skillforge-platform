package com.tsarajoro.skillforge.test;

import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.repository.InvitationRepository;
import com.tsarajoro.skillforge.repository.TestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Cree et valide les invitations candidat (lien securise a usage unique).
 */
@Service
public class InvitationService {

    private static final int DEFAULT_TTL_HOURS = 24;

    private final InvitationRepository invitationRepo;
    private final TestRepository testRepo;

    public InvitationService(InvitationRepository invitationRepo, TestRepository testRepo) {
        this.invitationRepo = invitationRepo;
        this.testRepo = testRepo;
    }

    @Transactional
    public Invitation createForTest(UUID testId) {
        testRepo.findById(testId).orElseThrow(
                () -> new IllegalArgumentException("test introuvable : " + testId));
        return invitationRepo.save(Invitation.newInvitation(testId, DEFAULT_TTL_HOURS));
    }

    @Transactional(readOnly = true)
    public InvitationStatus checkToken(String token) {
        Invitation inv = invitationRepo.findByToken(token).orElse(null);
        if (inv == null) return InvitationStatus.UNKNOWN;
        if (inv.isUsed()) return InvitationStatus.ALREADY_USED;
        if (inv.getExpiresAt().isBefore(OffsetDateTime.now())) return InvitationStatus.EXPIRED;
        return InvitationStatus.VALID;
    }

    public enum InvitationStatus {
        VALID, EXPIRED, ALREADY_USED, UNKNOWN
    }
}
