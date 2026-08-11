package com.tsarajoro.skillforge.candidate;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Compteur d echecs de saisie du code d acces par invitation, pour bloquer le
 * brute force du code a 6 chiffres (fix C4 code review POC 3).
 *
 * <p>Strategie : 5 tentatives echouees successives -> lock de 15 min sur
 * l invitation. Une reussite reset le compteur. Une invitation "used" ne
 * peut plus jamais etre re-verifiee de toute facon.
 *
 * <p>Stockage in-memory suffisant pour POC (1 seul backend, redemarrage rare).
 * En prod multi-instances, remplacer par Redis ou table dediee.
 */
@Component
public class AccessCodeAttemptTracker {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration LOCK_DURATION = Duration.ofMinutes(15);

    private static class State {
        int failures = 0;
        Instant lockedUntil = null;
    }

    private final Map<UUID, State> byInvitation = new ConcurrentHashMap<>();

    /** Retourne true si l invitation est verrouillee suite a trop d echecs. */
    public boolean isLocked(UUID invitationId) {
        State s = byInvitation.get(invitationId);
        if (s == null) return false;
        if (s.lockedUntil == null) return false;
        if (Instant.now().isBefore(s.lockedUntil)) return true;
        // Lock expire naturellement -> on nettoie
        byInvitation.remove(invitationId);
        return false;
    }

    /** Enregistre un echec. Verrouille apres MAX_ATTEMPTS. */
    public synchronized void recordFailure(UUID invitationId) {
        State s = byInvitation.computeIfAbsent(invitationId, k -> new State());
        s.failures++;
        if (s.failures >= MAX_ATTEMPTS) {
            s.lockedUntil = Instant.now().plus(LOCK_DURATION);
        }
    }

    /** Reset le compteur apres une reussite (le candidat legitime a saisi le bon code). */
    public void recordSuccess(UUID invitationId) {
        byInvitation.remove(invitationId);
    }
}
