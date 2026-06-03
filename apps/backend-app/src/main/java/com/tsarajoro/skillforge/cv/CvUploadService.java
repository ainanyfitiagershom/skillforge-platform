package com.tsarajoro.skillforge.cv;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.Candidate;
import com.tsarajoro.skillforge.domain.Cv;
import com.tsarajoro.skillforge.domain.CvAnalysis;
import com.tsarajoro.skillforge.llm.CvExtractionResult;
import com.tsarajoro.skillforge.llm.LlmClient;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.CvAnalysisRepository;
import com.tsarajoro.skillforge.repository.CvRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Orchestre l'upload d'un CV : enregistre le candidat (si nouveau), stocke le CV,
 * extrait le texte (PDFBox / POI), appelle le LLM pour extraire les competences,
 * et persiste le resultat de l'analyse.
 */
@Service
public class CvUploadService {

    private final CandidateRepository candidateRepo;
    private final CvRepository cvRepo;
    private final CvAnalysisRepository analysisRepo;
    private final CvParserService parser;
    private final LlmClient llmClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private final int retentionMonths;

    public CvUploadService(
            CandidateRepository candidateRepo,
            CvRepository cvRepo,
            CvAnalysisRepository analysisRepo,
            CvParserService parser,
            LlmClient llmClient,
            @Value("${skillforge.rgpd.cv-retention-months}") int retentionMonths) {
        this.candidateRepo = candidateRepo;
        this.cvRepo = cvRepo;
        this.analysisRepo = analysisRepo;
        this.parser = parser;
        this.llmClient = llmClient;
        this.retentionMonths = retentionMonths;
    }

    @Transactional
    public UploadResult upload(String candidateEmail, String candidateDisplayName,
                                String fileName, byte[] content, String profileCode) {

        Candidate candidate = candidateRepo.findByEmail(candidateEmail)
                .orElseGet(() -> candidateRepo.save(Candidate.newCandidate(candidateEmail, candidateDisplayName)));

        Cv cv = cvRepo.save(Cv.newCv(candidate.getId(), fileName, content, retentionMonths));

        CvParserService.ParseResult parsed = parser.parse(fileName, content);
        CvExtractionResult extraction = llmClient.extractSkillsFromCv(parsed.text(), profileCode);

        String skillsJson;
        try {
            skillsJson = mapper.writeValueAsString(extraction.skills());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("cannot serialize extracted skills", e);
        }

        CvAnalysis analysis = new CvAnalysis(
                UUID.randomUUID(),
                cv.getId(),
                skillsJson,
                extraction.llmProvider(),
                extraction.llmModel(),
                extraction.tokensUsed(),
                extraction.costEur(),
                OffsetDateTime.now());
        analysisRepo.save(analysis);

        return new UploadResult(
                candidate.getId(),
                cv.getId(),
                analysis.getId(),
                extraction,
                parsed.ocrFallbackRecommended());
    }

    public record UploadResult(
            UUID candidateId,
            UUID cvId,
            UUID analysisId,
            CvExtractionResult extraction,
            boolean ocrFallbackRecommended) {}
}
