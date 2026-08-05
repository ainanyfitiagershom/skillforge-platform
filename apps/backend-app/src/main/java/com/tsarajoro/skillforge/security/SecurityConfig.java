package com.tsarajoro.skillforge.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Uniquement destine aux audits securite (OWASP ZAP) : permet a l outil
     * de scanner tous les endpoints authentifies sans avoir a maintenir
     * une auth Selenium/Zest complexe. NE JAMAIS activer en production.
     * Active via -Dskillforge.security.audit-mode=true ou SKILLFORGE_SECURITY_AUDIT_MODE=true.
     */
    @Value("${skillforge.security.audit-mode:false}")
    private boolean auditMode;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Parametres recommandes Argon2id par OWASP en 2025 :
        // saltLength=16, hashLength=32, parallelism=1, memory=19456 (KiB), iterations=2
        return new Argon2PasswordEncoder(16, 32, 1, 19456, 2);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Headers OWASP Top 10 (Security Misconfiguration) : CSP, HSTS,
                // X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
                .headers(h -> h
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                "script-src 'self'; " +
                                "style-src 'self' 'unsafe-inline'; " +
                                "img-src 'self' data:; " +
                                "connect-src 'self'; " +
                                "frame-ancestors 'none'; " +
                                "base-uri 'self'; " +
                                "form-action 'self'"))
                        .frameOptions(f -> f.deny())
                        .contentTypeOptions(c -> {})
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000))
                        .referrerPolicy(r -> r.policy(
                                ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .permissionsPolicyHeader(p -> p.policy(
                                "camera=(), microphone=(), geolocation=(), payment=()")))
                .authorizeHttpRequests(auth -> {
                    if (auditMode) {
                        // Mode audit securite : tout ouvert pour permettre a ZAP de scanner
                        // le comportement HTTP des endpoints authentifies.
                        auth.anyRequest().permitAll();
                    } else {
                        auth.requestMatchers(
                                        "/auth/**",
                                        "/invitations/**",
                                        "/candidate/**",
                                        "/v3/api-docs/**",
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/actuator/health",
                                        "/actuator/info")
                                .permitAll()
                                .anyRequest().authenticated();
                    }
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
