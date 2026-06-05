package com.tsarajoro.skillforge.sandbox.web;

import com.tsarajoro.skillforge.sandbox.api.ExecutionRequest;
import com.tsarajoro.skillforge.sandbox.api.ExecutionResult;
import com.tsarajoro.skillforge.sandbox.runner.SandboxRunner;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sandbox")
public class SandboxController {

    private final SandboxRunner runner;

    public SandboxController(SandboxRunner runner) {
        this.runner = runner;
    }

    @PostMapping("/execute")
    public ResponseEntity<ExecutionResult> execute(@Valid @RequestBody ExecutionRequest request) {
        return ResponseEntity.ok(runner.execute(request));
    }
}
