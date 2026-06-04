package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.domain.QuestionType;

import java.math.BigDecimal;
import java.util.List;

/**
 * Resultat d'une generation de questions par un LLM.
 *
 * Chaque question generee comprend son type, son enonce, sa difficulte, ses competences cibles,
 * et un payload JSON specifique au type :
 * - QCM : { "options": ["..."], "correctIndex": 0, "explanation": "..." }
 * - CODE : { "language": "PHP", "starterCode": "...", "hiddenTests": "...", "explanation": "..." }
 * - CAS_PRATIQUE : { "scenario": "...", "expectedAnswerPoints": ["...", "..."], "explanation": "..." }
 */
public record QuestionGenerationResult(
        List<GeneratedQuestion> questions,
        String llmProvider,
        String llmModel,
        int tokensUsed,
        BigDecimal costEur) {

    public record GeneratedQuestion(
            QuestionType type,
            String statement,
            int difficulty,
            List<String> targetSkillCodes,
            String jsonPayload) {}
}
