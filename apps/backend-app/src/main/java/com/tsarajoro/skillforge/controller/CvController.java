package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.cv.CvUploadService;
import com.tsarajoro.skillforge.cv.CvUploadService.UploadResult;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/cv")
public class CvController {

    private final CvUploadService cvUploadService;

    public CvController(CvUploadService cvUploadService) {
        this.cvUploadService = cvUploadService;
    }

    @PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam("candidateEmail") @Email @NotBlank String candidateEmail,
            @RequestParam("candidateDisplayName") @NotBlank String candidateDisplayName,
            @RequestParam("profileCode") @NotBlank String profileCode) throws IOException {

        UploadResult result = cvUploadService.upload(
                candidateEmail,
                candidateDisplayName,
                file.getOriginalFilename(),
                file.getBytes(),
                profileCode);

        return new UploadResponse(
                result.candidateId(),
                result.cvId(),
                result.analysisId(),
                result.extraction().skills(),
                result.extraction().llmProvider(),
                result.extraction().tokensUsed(),
                result.extraction().costEur().toPlainString(),
                result.ocrFallbackRecommended());
    }

    public record UploadResponse(
            UUID candidateId,
            UUID cvId,
            UUID analysisId,
            java.util.List<com.tsarajoro.skillforge.llm.CvExtractionResult.ExtractedSkill> skills,
            String llmProvider,
            int tokensUsed,
            String costEur,
            boolean ocrFallbackRecommended) {}
}
