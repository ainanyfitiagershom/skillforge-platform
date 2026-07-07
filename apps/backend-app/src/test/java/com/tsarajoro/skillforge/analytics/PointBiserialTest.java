package com.tsarajoro.skillforge.analytics;

import com.tsarajoro.skillforge.analytics.AnalyticsService.QuestionQuality;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Valide le calcul du pouvoir discriminant (correlation point-biseriale) et
 * l attribution du label qualitatif. Reference : scipy.stats.pointbiserialr().
 *
 * Chaque cas est explicite avec le calcul manuel + la valeur scipy attendue.
 */
class PointBiserialTest {

    private static final double EPSILON = 1e-3;

    @Test
    void perfectlyDiscriminantQuestion() {
        // scipy.stats.pointbiserialr([1,1,1,0,0,0], [90,80,85,50,45,40]) -> 0.97980
        List<Double> success = List.of(90.0, 80.0, 85.0);
        List<Double> failure = List.of(50.0, 45.0, 40.0);
        Double rpb = AnalyticsService.computePointBiserial(success, failure);

        assertThat(rpb).isNotNull();
        assertThat(rpb).isCloseTo(0.97980, org.assertj.core.data.Offset.offset(EPSILON));
    }

    @Test
    void antiDiscriminantQuestion() {
        // Les mauvais candidats reussissent, les bons echouent : correlation negative.
        List<Double> success = List.of(50.0, 45.0, 40.0);
        List<Double> failure = List.of(90.0, 80.0, 85.0);
        Double rpb = AnalyticsService.computePointBiserial(success, failure);

        assertThat(rpb).isNotNull();
        assertThat(rpb).isCloseTo(-0.97980, org.assertj.core.data.Offset.offset(EPSILON));
    }

    @Test
    void mixedRealisticCase() {
        // Cas realiste calcule ci-dessous.
        // scipy.stats.pointbiserialr([1,1,0,0,1,0], [85,72,55,40,90,60]) -> ~0.8851
        // M+ = (85+72+90)/3 = 82.33
        // M- = (55+40+60)/3 = 51.67
        // mean total = 67
        // variance pop = ((85-67)^2 + (72-67)^2 + (55-67)^2 + (40-67)^2 + (90-67)^2 + (60-67)^2) / 6
        //              = (324 + 25 + 144 + 729 + 529 + 49) / 6 = 300
        // SD = sqrt(300) = 17.3205
        // p = 3/6 = 0.5
        // rpb = ((82.33 - 51.67) / 17.3205) * sqrt(0.25) = 1.7702 * 0.5 = 0.8851
        List<Double> success = List.of(85.0, 72.0, 90.0);
        List<Double> failure = List.of(55.0, 40.0, 60.0);
        Double rpb = AnalyticsService.computePointBiserial(success, failure);

        assertThat(rpb).isNotNull();
        assertThat(rpb).isCloseTo(0.8851, org.assertj.core.data.Offset.offset(EPSILON));
    }

    @Test
    void tooFewSamplesReturnsNull() {
        List<Double> success = List.of(90.0);
        List<Double> failure = List.of(40.0);
        assertThat(AnalyticsService.computePointBiserial(success, failure)).isNull();
    }

    @Test
    void degenerateAllPassReturnsNull() {
        // Tout le monde reussit -> aucun echec, correlation indefinie.
        List<Double> success = List.of(85.0, 72.0, 90.0, 88.0);
        List<Double> failure = List.of();
        assertThat(AnalyticsService.computePointBiserial(success, failure)).isNull();
    }

    @Test
    void classifyTooEasyWhenAlmostAllPass() {
        // p = 0.95 > 0.90
        QuestionQuality label = AnalyticsService.classify(20, 0.95, 0.5);
        assertThat(label).isEqualTo(QuestionQuality.TOO_EASY);
    }

    @Test
    void classifyPoorDiscriminant() {
        // p = 0.5 (bien equilibre) mais rpb quasi nul
        QuestionQuality label = AnalyticsService.classify(10, 0.5, 0.05);
        assertThat(label).isEqualTo(QuestionQuality.POOR_DISCRIMINANT);
    }

    @Test
    void classifyGoodQuestion() {
        QuestionQuality label = AnalyticsService.classify(15, 0.6, 0.4);
        assertThat(label).isEqualTo(QuestionQuality.GOOD);
    }

    @Test
    void classifyInsufficientDataBelowMinSamples() {
        QuestionQuality label = AnalyticsService.classify(2, 0.5, 0.5);
        assertThat(label).isEqualTo(QuestionQuality.INSUFFICIENT_DATA);
    }

    @Test
    void thresholdMatchesTypeIgnoringCase() {
        assertThat(AnalyticsService.thresholdForType("QCM")).isEqualTo(100.0);
        assertThat(AnalyticsService.thresholdForType("qcm")).isEqualTo(100.0);
        assertThat(AnalyticsService.thresholdForType("CODE")).isEqualTo(75.0);
        assertThat(AnalyticsService.thresholdForType("CAS_PRATIQUE")).isEqualTo(60.0);
        assertThat(AnalyticsService.thresholdForType(null)).isEqualTo(60.0);
    }

    @Test
    void csvEscapeQuotingRules() {
        assertThat(AnalyticsService.escapeCsvCell("simple")).isEqualTo("simple");
        assertThat(AnalyticsService.escapeCsvCell("avec, virgule")).isEqualTo("\"avec, virgule\"");
        assertThat(AnalyticsService.escapeCsvCell("il a dit \"bonjour\""))
                .isEqualTo("\"il a dit \"\"bonjour\"\"\"");
        assertThat(AnalyticsService.escapeCsvCell("multi\nligne")).isEqualTo("\"multi\nligne\"");
        assertThat(AnalyticsService.escapeCsvCell(null)).isEqualTo("");
    }
}
