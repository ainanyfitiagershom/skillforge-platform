package com.tsarajoro.skillforge.llm;

import java.util.List;

/** Abstraction au-dessus d un fournisseur LLM (4 impls : mock, openai, github, claude). */
public interface LlmClient {

    /** Extrait les competences d un CV. */
    CvExtractionResult extractSkillsFromCv(String cvText, String profileCode);

    /** Genere un ensemble de questions adaptees au profil + competences. */
    QuestionGenerationResult generateQuestions(GenerationRequest request);

    /** Note une reponse de type CAS_PRATIQUE : retourne score 0-100 + explication. */
    CasGradingResult gradeCasPratique(String scenario, List<String> expectedPoints, String candidateAnswer);

    /** Genere un compte rendu structure post-passation (resume + forces + faiblesses + recommandation). */
    ReportGenerationResult generateReport(ReportGenerationResult.Input input);

    /** Nom du fournisseur (mock, openai, github, claude). */
    String providerName();
}
