package com.tsarajoro.skillforge.fraud;

import com.tsarajoro.skillforge.domain.FraudEvent;
import com.tsarajoro.skillforge.domain.FraudEventType;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/** Tests du calcul deterministe du score anti-fraude pondere. */
class FraudScoringTest {

    private final FraudDetectionService service = new FraudDetectionService(null, null);

    @Test
    void emptyListReturnsZero() {
        assertThat(service.computeScore(List.of())).isZero();
    }

    @Test
    void nullListReturnsZero() {
        assertThat(service.computeScore(null)).isZero();
    }

    @Test
    void singleFocusLossReturnsWeight() {
        List<FraudEvent> events = List.of(event(FraudEventType.FOCUS_LOSS));
        assertThat(service.computeScore(events)).isEqualTo(25);
    }

    @Test
    void mixedEventsAreSummed() {
        List<FraudEvent> events = List.of(
                event(FraudEventType.FOCUS_LOSS),
                event(FraudEventType.PASTE_SUSPICIOUS),
                event(FraudEventType.FAST_ANSWER),
                event(FraudEventType.DEVTOOLS_OPEN));
        // 25 + 30 + 20 + 10 = 85
        assertThat(service.computeScore(events)).isEqualTo(85);
    }

    @Test
    void scoreIsCappedAtHundred() {
        List<FraudEvent> events = List.of(
                event(FraudEventType.PASTE_SUSPICIOUS),
                event(FraudEventType.PASTE_SUSPICIOUS),
                event(FraudEventType.PASTE_SUSPICIOUS),
                event(FraudEventType.PASTE_SUSPICIOUS),
                event(FraudEventType.PASTE_SUSPICIOUS));
        // 30 * 5 = 150, plafonne a 100
        assertThat(service.computeScore(events)).isEqualTo(100);
    }

    private FraudEvent event(FraudEventType type) {
        return FraudEvent.newEvent(UUID.randomUUID(), type, "{}");
    }
}
