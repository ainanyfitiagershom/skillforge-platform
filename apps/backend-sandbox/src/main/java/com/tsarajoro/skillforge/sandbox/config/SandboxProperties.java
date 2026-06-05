package com.tsarajoro.skillforge.sandbox.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

/**
 * Configuration de la sandbox.
 *
 * Lue depuis application.yml sous le prefixe 'skillforge.sandbox'.
 */
@ConfigurationProperties(prefix = "skillforge.sandbox")
public record SandboxProperties(
        String internalKey,
        String dockerHost,
        int memoryMb,
        double cpus,
        int pidsLimit,
        int timeoutSeconds,
        long maxStdoutBytes,
        String seccompProfilePath,
        Map<String, String> runtimes
) {}
