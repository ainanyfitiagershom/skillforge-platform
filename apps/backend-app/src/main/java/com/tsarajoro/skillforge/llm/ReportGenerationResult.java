package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.domain.Recommendation;

import java.math.BigDecimal;
import java.util.List;

/** Resultat du LLM pour la generation d un compte rendu de passation. */
public record ReportGenerationResult(
        String summary,
        List<String> strengths,
        List<String> weaknesses,
        Recommendation recommendation,
        String llmProvider,
        String llmModel,
        int tokensUsed,
        BigDecimal costEur) {

    /** Donnees d entree consolidees envoyees au LLM. */
    public record Input(
            String candidateLabel,
            String profileCode,
            BigDecimal globalScore,
            int qcmPassed, int qcmTotal,
            int codePassed, int codeTotal,
            int casPassed, int casTotal,
            List<QuestionSnapshot> questions) {}

    public record QuestionSnapshot(
            String type,
            String statement,
            int difficulty,
            BigDecimal score,
            String gradingExplanation) {}
}
