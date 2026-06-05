package com.tsarajoro.skillforge.sandbox.web;

import com.tsarajoro.skillforge.sandbox.config.SandboxProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * Filtre simple : exige le header X-Internal-Key avec la cle partagee
 * entre backend-app et backend-sandbox.
 *
 * Endpoints publics : /actuator/health, /actuator/info, /v3/api-docs/*, /swagger-ui/*
 */
@Component
public class InternalKeyFilter extends OncePerRequestFilter {

    private static final Set<String> PUBLIC_PREFIXES = Set.of(
            "/actuator/health",
            "/actuator/info",
            "/v3/api-docs",
            "/swagger-ui"
    );

    private final SandboxProperties props;

    public InternalKeyFilter(SandboxProperties props) {
        this.props = props;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (isPublic(path)) {
            chain.doFilter(request, response);
            return;
        }
        String key = request.getHeader("X-Internal-Key");
        if (key == null || !key.equals(props.internalKey())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"missing or invalid X-Internal-Key\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean isPublic(String path) {
        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }
}
