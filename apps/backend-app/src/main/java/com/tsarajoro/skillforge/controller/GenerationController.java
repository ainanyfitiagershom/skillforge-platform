package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.generation.TestGenerationService;
import com.tsarajoro.skillforge.generation.TestGenerationService.GenerationOutput;
import com.tsarajoro.skillforge.llm.GenerationRequest;
import com.tsarajoro.skillforge.llm.GenerationRequest.TypeQuota;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tests")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class GenerationController {

    private final TestGenerationService generationService;

    public GenerationController(TestGenerationService generationService) {
        this.generationService = generationService;
    }

    @PostMapping("/generate")
    public GenerateResponse generate(@Valid @RequestBody GenerateRequest body) {
        GenerationRequest req = new GenerationRequest(
                body.profileCode(),
                body.skillCodes(),
                body.types().stream()
                        .map(t -> new TypeQuota(t.type(), t.count()))
                        .toList(),
                body.difficulty());
        GenerationOutput output = generationService.generate(req);
        return new GenerateResponse(
                output.questions().stream().map(QuestionSummary::of).toList(),
                output.llmProvider(),
                output.llmModel(),
                output.tokensUsed(),
                output.costEur());
    }

    public record GenerateRequest(
            @NotBlank String profileCode,
            @NotEmpty List<@NotBlank String> skillCodes,
            @NotEmpty List<@Valid TypeQuotaDto> types,
            @Min(1) @Max(5) int difficulty) {}

    public record TypeQuotaDto(
            @NotNull QuestionType type,
            @Min(1) @Max(20) int count) {}

    public record GenerateResponse(
            List<QuestionSummary> questions,
            String llmProvider,
            String llmModel,
            int tokensUsed,
            String costEur) {}

    public record QuestionSummary(UUID id, QuestionType type, String statement,
                                   int difficulty, String status, String jsonPayload) {
        static QuestionSummary of(Question q) {
            return new QuestionSummary(q.getId(), q.getType(), q.getStatement(),
                    q.getDifficulty(), q.getStatus().name(), q.getJsonPayload());
        }
    }
}
