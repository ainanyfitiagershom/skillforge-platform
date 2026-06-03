package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.QuestionStatus;
import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/questions")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class QuestionController {

    private final QuestionRepository repository;

    public QuestionController(QuestionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<QuestionResponse> list(@RequestParam(required = false) QuestionStatus status,
                                       @RequestParam(required = false) QuestionType type) {
        List<Question> all;
        if (status != null && type != null) {
            all = repository.findByStatusAndType(status, type);
        } else if (status != null) {
            all = repository.findByStatus(status);
        } else {
            all = repository.findAll();
        }
        return all.stream().map(QuestionResponse::of).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getOne(@PathVariable UUID id) {
        return repository.findById(id)
                .map(q -> ResponseEntity.ok(QuestionResponse.of(q)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> create(@Valid @RequestBody QuestionRequest body) {
        Question q = Question.newQuestion(
                body.type(),
                body.statement(),
                body.difficulty(),
                QuestionStatus.PENDING_REVIEW,
                body.jsonPayload());
        return ResponseEntity.status(HttpStatus.CREATED).body(QuestionResponse.of(repository.save(q)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> update(@PathVariable UUID id,
                                                    @Valid @RequestBody QuestionRequest body) {
        return repository.findById(id)
                .map(q -> {
                    q.setStatement(body.statement());
                    q.setDifficulty(body.difficulty());
                    q.setJsonPayload(body.jsonPayload());
                    if (body.status() != null) q.setStatus(body.status());
                    return ResponseEntity.ok(QuestionResponse.of(repository.save(q)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record QuestionRequest(
            @NotNull QuestionType type,
            @NotBlank String statement,
            @Min(1) @Max(5) int difficulty,
            @NotBlank String jsonPayload,
            QuestionStatus status) {}

    public record QuestionResponse(
            UUID id,
            QuestionType type,
            String statement,
            int difficulty,
            QuestionStatus status,
            int version,
            String jsonPayload) {
        public static QuestionResponse of(Question q) {
            return new QuestionResponse(q.getId(), q.getType(), q.getStatement(),
                    q.getDifficulty(), q.getStatus(), q.getVersion(), q.getJsonPayload());
        }
    }
}
