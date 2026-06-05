package com.tsarajoro.skillforge.sandbox.api;

/**
 * Resultat d'une execution sandbox.
 *
 * @param status code de fin (cf. ExecutionStatus)
 * @param exitCode code retour Unix du processus (0 = succes)
 * @param stdout sortie standard tronquee a maxStdoutBytes
 * @param stderr sortie d'erreur tronquee a maxStdoutBytes
 * @param durationMs duree reelle d'execution
 * @param testsPassed nombre de tests caches reussis (si fournis)
 * @param testsTotal nombre total de tests caches
 * @param score note graduee 0.0 a 1.0 (= testsPassed / testsTotal si tests, sinon exitCode==0 ? 1 : 0)
 */
public record ExecutionResult(
        ExecutionStatus status,
        int exitCode,
        String stdout,
        String stderr,
        long durationMs,
        int testsPassed,
        int testsTotal,
        double score
) {

    public enum ExecutionStatus {
        OK,
        TIMEOUT,
        OOM,
        ERROR,
        SECURITY_VIOLATION
    }
}
