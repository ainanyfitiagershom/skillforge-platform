package com.tsarajoro.skillforge.analytics;

import java.util.List;

/** Logique pure d'analyse statistique : point-biseriale + labellisation qualite d une question. */
public class AnalyticsService {

    /** Seuils "reussite" par type de question (score >= seuil = passe). */
    public static final double THRESHOLD_QCM = 100.0;
    public static final double THRESHOLD_CODE = 75.0;
    public static final double THRESHOLD_CAS = 60.0;

    /** Volume minimum d observations avant de calculer une statistique fiable. */
    public static final int MIN_SAMPLES = 3;

    /** Bornes qualite. */
    public static final double TOO_EASY_THRESHOLD = 0.90;
    public static final double TOO_HARD_THRESHOLD = 0.10;
    public static final double POOR_DISCRIMINANT_ABS = 0.15;

    /** Verdict qualitatif pour une question. */
    public enum QuestionQuality {
        GOOD,
        TOO_EASY,
        TOO_HARD,
        POOR_DISCRIMINANT,
        INSUFFICIENT_DATA
    }

    /**
     * Correlation point-biseriale : mesure la correlation entre une variable binaire
     * (a reussi la question ou non) et une variable continue (score global de la
     * passation). Formule identique a scipy.stats.pointbiserialr(x, y).
     *
     * rpb = ((M+ - M-) / SD_total) * sqrt(p * (1 - p))
     *
     * Retourne null si les donnees sont insuffisantes ou degenerees.
     */
    public static Double computePointBiserial(List<Double> successScores, List<Double> failureScores) {
        if (successScores == null || failureScores == null) return null;
        int nSuccess = successScores.size();
        int nFailure = failureScores.size();
        int total = nSuccess + nFailure;
        if (total < MIN_SAMPLES) return null;
        if (nSuccess == 0 || nFailure == 0) return null;

        double meanSuccess = mean(successScores);
        double meanFailure = mean(failureScores);
        double sdTotal = stddevPopulation(concat(successScores, failureScores));
        if (sdTotal <= 1e-9) return null;

        double p = (double) nSuccess / total;
        double rpb = ((meanSuccess - meanFailure) / sdTotal) * Math.sqrt(p * (1.0 - p));

        if (Double.isNaN(rpb) || Double.isInfinite(rpb)) return null;
        return Math.max(-1.0, Math.min(1.0, rpb));
    }

    /** Attribue un label qualitatif a une question a partir de ses stats. */
    public static QuestionQuality classify(int usages, double difficultyIndex, Double discriminantPower) {
        if (usages < MIN_SAMPLES) return QuestionQuality.INSUFFICIENT_DATA;
        if (difficultyIndex > TOO_EASY_THRESHOLD) return QuestionQuality.TOO_EASY;
        if (difficultyIndex < TOO_HARD_THRESHOLD) return QuestionQuality.TOO_HARD;
        if (discriminantPower != null && Math.abs(discriminantPower) < POOR_DISCRIMINANT_ABS) {
            return QuestionQuality.POOR_DISCRIMINANT;
        }
        return QuestionQuality.GOOD;
    }

    /** Seuil de reussite selon le type. Insensible a la casse et au libelle exact. */
    public static double thresholdForType(String type) {
        if (type == null) return THRESHOLD_CAS;
        String t = type.toUpperCase();
        if (t.equals("QCM")) return THRESHOLD_QCM;
        if (t.equals("CODE")) return THRESHOLD_CODE;
        return THRESHOLD_CAS;
    }

    /**
     * Echappement CSV RFC 4180 : encadre par guillemets si contient guillemet,
     * virgule, saut de ligne ; les guillemets internes sont doubles.
     */
    public static String escapeCsvCell(String cell) {
        if (cell == null) return "";
        boolean needsQuoting = cell.contains(",") || cell.contains("\"")
                || cell.contains("\n") || cell.contains("\r");
        String escaped = cell.replace("\"", "\"\"");
        return needsQuoting ? "\"" + escaped + "\"" : escaped;
    }

    private static double mean(List<Double> values) {
        double sum = 0;
        for (double v : values) sum += v;
        return sum / values.size();
    }

    private static double stddevPopulation(List<Double> values) {
        int n = values.size();
        if (n == 0) return 0;
        double mu = mean(values);
        double sumSquared = 0;
        for (double v : values) {
            double diff = v - mu;
            sumSquared += diff * diff;
        }
        return Math.sqrt(sumSquared / n);
    }

    private static List<Double> concat(List<Double> a, List<Double> b) {
        java.util.ArrayList<Double> all = new java.util.ArrayList<>(a.size() + b.size());
        all.addAll(a);
        all.addAll(b);
        return all;
    }
}
