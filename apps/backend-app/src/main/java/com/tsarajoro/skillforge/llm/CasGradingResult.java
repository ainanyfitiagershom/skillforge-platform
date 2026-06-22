package com.tsarajoro.skillforge.llm;

import java.math.BigDecimal;

/** Resultat du LLM-as-judge pour une question CAS_PRATIQUE. */
public record CasGradingResult(
        BigDecimal score,
        String explanation,
        String llmProvider,
        String llmModel,
        int tokensUsed,
        BigDecimal costEur) {}
