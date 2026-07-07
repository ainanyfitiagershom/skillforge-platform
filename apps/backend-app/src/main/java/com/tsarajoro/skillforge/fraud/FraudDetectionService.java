package com.tsarajoro.skillforge.fraud;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.domain.FraudEvent;
import com.tsarajoro.skillforge.domain.FraudEventType;
import com.tsarajoro.skillforge.domain.Passation;
import com.tsarajoro.skillforge.repository.FraudEventRepository;
import com.tsarajoro.skillforge.repository.PassationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Detection anti-fraude : enregistre les evenements + calcule un score agrege pondere. */
@Service
public class FraudDetectionService {

    private static final Logger log = LoggerFactory.getLogger(FraudDetectionService.class);

    private static final Map<FraudEventType, Integer> WEIGHTS = Map.of(
            FraudEventType.FOCUS_LOSS, 25,
            FraudEventType.PASTE_SUSPICIOUS, 30,
            FraudEventType.FAST_ANSWER, 20,
            FraudEventType.DEVTOOLS_OPEN, 10);

    private static final int MAX_EVENTS_PER_PASSATION = 100;
    private static final int SCORE_CAP = 100;

    private final FraudEventRepository eventRepo;
    private final PassationRepository passationRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public FraudDetectionService(FraudEventRepository eventRepo, PassationRepository passationRepo) {
        this.eventRepo = eventRepo;
        this.passationRepo = passationRepo;
    }

    /** Enregistre un evenement + recalcule le score de la passation. Silencieux si echec. */
    @Transactional
    public void recordEvent(UUID passationId, FraudEventType type, String metadataJson) {
        try {
            Passation p = passationRepo.findById(passationId).orElse(null);
            if (p == null) {
                log.warn("Fraud: passation introuvable id={}", passationId);
                return;
            }
            if (p.getSubmittedAt() != null) {
                log.warn("Fraud: tentative d ajout d event sur passation deja soumise id={}", passationId);
                return;
            }
            if (eventRepo.countByPassationId(passationId) >= MAX_EVENTS_PER_PASSATION) {
                log.warn("Fraud: plafond de {} events atteint pour passation {}, event ignore",
                        MAX_EVENTS_PER_PASSATION, passationId);
                return;
            }

            String cleanMetadata = sanitizeMetadata(metadataJson);
            eventRepo.save(FraudEvent.newEvent(passationId, type, cleanMetadata));

            List<FraudEvent> all = eventRepo.findByPassationIdOrderByOccurredAtAsc(passationId);
            int score = computeScore(all);
            p.setFraudRiskScore(score);
            passationRepo.save(p);
        } catch (Exception e) {
            log.warn("Fraud: echec recordEvent pour passation {} ({})", passationId, e.getMessage());
        }
    }

    /** Calcul deterministe du score pondere plafonne a 100. Testable en unitaire. */
    public int computeScore(List<FraudEvent> events) {
        if (events == null || events.isEmpty()) return 0;
        int total = 0;
        for (FraudEvent e : events) {
            Integer w = WEIGHTS.get(e.getEventType());
            if (w != null) total += w;
        }
        return Math.min(total, SCORE_CAP);
    }

    @Transactional(readOnly = true)
    public List<FraudEvent> listByPassation(UUID passationId) {
        return eventRepo.findByPassationIdOrderByOccurredAtAsc(passationId);
    }

    private String sanitizeMetadata(String raw) {
        if (raw == null || raw.isBlank()) return "{}";
        try {
            return mapper.writeValueAsString(mapper.readTree(raw));
        } catch (Exception e) {
            log.warn("Fraud: metadata JSON invalide ({}), stockage vide", e.getMessage());
            return "{}";
        }
    }
}
