package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Invitation;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.test.InvitationService;
import com.tsarajoro.skillforge.test.TestCompositionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tests")
@PreAuthorize("hasRole('RECRUTEUR') or hasRole('ADMIN')")
public class TestController {

    private final TestCompositionService compositionService;
    private final InvitationService invitationService;

    public TestController(TestCompositionService compositionService,
                          InvitationService invitationService) {
        this.compositionService = compositionService;
        this.invitationService = invitationService;
    }

    @PostMapping
    public ResponseEntity<TestResponse> create(@Valid @RequestBody ComposeRequest body) {
        Test test = compositionService.compose(body.name(), body.durationMinutes(), body.orderedQuestionIds());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TestResponse(test.getId(), test.getName(), test.getDurationMinutes()));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<InvitationResponse> invite(@PathVariable UUID id) {
        Invitation inv = invitationService.createForTest(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(new InvitationResponse(
                inv.getId(), inv.getToken(), inv.getExpiresAt()));
    }

    public record ComposeRequest(
            @NotBlank String name,
            @Min(5) @Max(240) int durationMinutes,
            @NotEmpty List<UUID> orderedQuestionIds) {}

    public record TestResponse(UUID id, String name, int durationMinutes) {}

    public record InvitationResponse(UUID id, String token, OffsetDateTime expiresAt) {}
}
