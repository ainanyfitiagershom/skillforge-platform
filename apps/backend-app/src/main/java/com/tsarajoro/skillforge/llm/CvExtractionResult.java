package com.tsarajoro.skillforge.llm;

import java.math.BigDecimal;
import java.util.List;

/**
 * Resultat structure de l'extraction des competences d'un CV.
 */
public record CvExtractionResult(
        List<ExtractedSkill> skills,
        String llmProvider,
        String llmModel,
        int tokensUsed,
        BigDecimal costEur) {

    public record ExtractedSkill(
            String skillCode,
            String displayName,
            SkillLevel level,
            Integer yearsOfExperience) {}

    public enum SkillLevel {
        JUNIOR, CONFIRME, SENIOR, UNKNOWN
    }
}
