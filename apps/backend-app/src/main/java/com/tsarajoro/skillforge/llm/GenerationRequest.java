package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.domain.QuestionType;

import java.util.List;
import java.util.UUID;

/** Parametres d'une demande de generation de questions au LLM. */
public record GenerationRequest(
        UUID candidateId,
        String profileCode,
        List<String> skillCodes,
        List<TypeQuota> types,
        int difficulty) {

    public record TypeQuota(QuestionType type, int count) {}
}
