package com.tsarajoro.skillforge.sandbox.poc3;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsarajoro.skillforge.sandbox.api.ExecutionRequest;
import com.tsarajoro.skillforge.sandbox.api.ExecutionResult;
import com.tsarajoro.skillforge.sandbox.api.Language;
import com.tsarajoro.skillforge.sandbox.runner.SandboxRunner;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Harness POC 3 (Sprint 7) : 100 executions valides + 50 attaques contre la sandbox reelle.
 *
 * Objectifs CDC :
 *   - VALID  : >= 95 % succes, latence mediane < 2 s
 *   - ATTACK : 0 evasion sur 50 cas (verdict BLOCKED pour chacun)
 *
 * Lancement :
 *   mvn -pl apps/backend-sandbox test -Dtest=PocSandboxHarnessTest -Dpoc3.run=true
 *
 * Le test est desactive par defaut (Docker requis, ~2-5 min).
 */
@SpringBootTest
@EnabledIfSystemProperty(named = "poc3.run", matches = "true")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PocSandboxHarnessTest {

    private static final Path REPO_ROOT = Paths.get("..", "..").toAbsolutePath().normalize();
    private static final Path POC_DIR = REPO_ROOT.resolve("docs/03-poc/poc3-sandbox");
    private static final Path CASES_DIR = POC_DIR.resolve("cases");
    private static final Path RESULTS_DIR = POC_DIR.resolve("results");

    @Autowired
    SandboxRunner runner;

    private static final List<Row> rows = Collections.synchronizedList(new ArrayList<>());
    private static List<CaseSpec> cases;

    @BeforeAll
    static void loadCases() throws IOException {
        Files.createDirectories(RESULTS_DIR);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode arr = mapper.readTree(CASES_DIR.resolve("manifest.json").toFile());
        List<CaseSpec> list = new ArrayList<>();
        for (JsonNode n : arr) {
            list.add(new CaseSpec(
                    n.get("id").asText(),
                    Language.valueOf(n.get("language").asText()),
                    n.get("category").asText(),
                    n.get("verdict").asText(),
                    n.get("description").asText(),
                    n.get("codeFile").asText(),
                    n.hasNonNull("testsFile") ? n.get("testsFile").asText() : null
            ));
        }
        cases = list;
        System.out.println("[POC3] " + cases.size() + " cas charges depuis " + CASES_DIR);
    }

    @Test
    @Order(1)
    @DisplayName("Executer les 100 cas VALID")
    void runValidCases() {
        List<CaseSpec> valid = cases.stream().filter(c -> "VALID".equals(c.category)).toList();
        System.out.println("[POC3] Lancement " + valid.size() + " cas VALID…");
        for (CaseSpec spec : valid) {
            Row row = runCase(spec);
            rows.add(row);
            if (!row.passedVerdict) {
                System.err.println("[POC3][VALID FAIL] " + spec.id + " status=" + row.status
                        + " exit=" + row.exitCode + " stderr=" + truncate(row.stderr, 200));
            }
        }
    }

    @Test
    @Order(2)
    @DisplayName("Executer les 50 cas ATTACK et prouver 0 evasion")
    void runAttackCases() {
        List<CaseSpec> attacks = cases.stream().filter(c -> !"VALID".equals(c.category)).toList();
        System.out.println("[POC3] Lancement " + attacks.size() + " cas ATTACK…");
        for (CaseSpec spec : attacks) {
            Row row = runCase(spec);
            rows.add(row);
            if (!row.passedVerdict) {
                System.err.println("[POC3][EVASION !] " + spec.id + " cat=" + spec.category
                        + " status=" + row.status + " exit=" + row.exitCode
                        + " stdout=" + truncate(row.stdout, 300));
            }
        }
    }

    @AfterAll
    static void writeReports() throws IOException {
        if (rows.isEmpty()) return;

        String stamp = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss")
                .withZone(ZoneOffset.UTC).format(Instant.now());

        // 1) CSV brut
        Path csv = RESULTS_DIR.resolve("results-" + stamp + ".csv");
        StringBuilder sb = new StringBuilder();
        sb.append("id,language,category,expected_verdict,actual_verdict,status,exit_code,duration_ms,score,stdout_first_line,stderr_first_line\n");
        for (Row r : rows) {
            sb.append(csv(r.id)).append(',')
              .append(csv(r.language.name())).append(',')
              .append(csv(r.category)).append(',')
              .append(csv(r.expectedVerdict)).append(',')
              .append(csv(r.passedVerdict ? "OK" : "FAIL")).append(',')
              .append(csv(r.status)).append(',')
              .append(r.exitCode).append(',')
              .append(r.durationMs).append(',')
              .append(String.format(Locale.ROOT, "%.2f", r.score)).append(',')
              .append(csv(firstLine(r.stdout))).append(',')
              .append(csv(firstLine(r.stderr))).append('\n');
        }
        Files.writeString(csv, sb.toString(), StandardCharsets.UTF_8);
        // Copie "latest" pour lien stable
        Files.writeString(RESULTS_DIR.resolve("latest.csv"), sb.toString(), StandardCharsets.UTF_8);
        System.out.println("[POC3] CSV ecrit : " + csv);

        // 2) Statistiques agregees
        List<Row> validRows = rows.stream().filter(r -> "VALID".equals(r.category)).toList();
        List<Row> attackRows = rows.stream().filter(r -> !"VALID".equals(r.category)).toList();
        long validOk = validRows.stream().filter(r -> r.passedVerdict).count();
        long attackBlocked = attackRows.stream().filter(r -> r.passedVerdict).count();
        long evasions = attackRows.size() - attackBlocked;

        double validSuccessPct = validRows.isEmpty() ? 0
                : 100.0 * validOk / validRows.size();
        long medianValidMs = medianLatency(validRows);
        long p95ValidMs = percentileLatency(validRows, 95);
        long medianAttackMs = medianLatency(attackRows);

        // Par categorie d'attaque : detail evasions
        Map<String, long[]> byCat = new TreeMap<>();
        for (Row r : attackRows) {
            long[] counts = byCat.computeIfAbsent(r.category, k -> new long[]{0, 0});
            counts[0]++;
            if (r.passedVerdict) counts[1]++;
        }

        // 3) Markdown de synthese
        StringBuilder md = new StringBuilder();
        md.append("# Rapport POC 3 — Sandbox Docker sécurisée\n\n");
        md.append("**Date :** ").append(Instant.now()).append("  \n");
        md.append("**Cas exécutés :** ").append(rows.size()).append(" (")
                .append(validRows.size()).append(" VALID + ")
                .append(attackRows.size()).append(" ATTACK)  \n");
        md.append("**Sandbox :** conteneur Docker éphémère, ").append("no-network + readonly-rootfs + seccomp + drop-caps + memory 256 Mo + PID limit 64 + timeout 5 s\n\n");

        md.append("## Critères de succès CDC (§5 POC 3)\n\n");
        md.append("| Critère | Cible CDC | Mesuré | Verdict |\n");
        md.append("|---|---|---|---|\n");
        md.append("| Succès exécutions valides | ≥ 95 % | ")
                .append(String.format(Locale.ROOT, "%.1f %%", validSuccessPct))
                .append(" | ").append(validSuccessPct >= 95 ? "✅" : "❌").append(" |\n");
        md.append("| Latence médiane valides | < 2 000 ms | ")
                .append(medianValidMs).append(" ms | ")
                .append(medianValidMs < 2000 ? "✅" : "❌").append(" |\n");
        md.append("| Latence p95 valides | (info) | ").append(p95ValidMs).append(" ms | ℹ️ |\n");
        md.append("| Évasions attaques | 0 | ").append(evasions).append(" | ")
                .append(evasions == 0 ? "✅" : "❌").append(" |\n\n");

        md.append("## Matrice attaques par catégorie\n\n");
        md.append("| Catégorie | Total | Bloqués | Évasions | Verdict |\n");
        md.append("|---|---|---|---|---|\n");
        for (Map.Entry<String, long[]> e : byCat.entrySet()) {
            long tot = e.getValue()[0];
            long blk = e.getValue()[1];
            long ev = tot - blk;
            md.append("| ").append(e.getKey()).append(" | ").append(tot).append(" | ")
                    .append(blk).append(" | ").append(ev).append(" | ")
                    .append(ev == 0 ? "✅" : "❌").append(" |\n");
        }

        if (evasions > 0) {
            md.append("\n## ⚠️ Évasions détectées\n\n");
            for (Row r : attackRows) {
                if (!r.passedVerdict) {
                    md.append("- **").append(r.id).append("** (").append(r.category).append(")")
                            .append(" — status=").append(r.status).append(" exit=").append(r.exitCode)
                            .append(" stdout=`").append(truncate(firstLine(r.stdout), 120)).append("`\n");
                }
            }
        }

        long failedValid = validRows.size() - validOk;
        if (failedValid > 0) {
            md.append("\n## Cas VALID en echec (à investiguer)\n\n");
            for (Row r : validRows) {
                if (!r.passedVerdict) {
                    md.append("- **").append(r.id).append("** — status=").append(r.status)
                            .append(" exit=").append(r.exitCode)
                            .append(" stderr=`").append(truncate(firstLine(r.stderr), 120)).append("`\n");
                }
            }
        }

        md.append("\n## Latences (ms)\n\n");
        md.append("- Médiane VALID : ").append(medianValidMs).append(" ms\n");
        md.append("- P95 VALID : ").append(p95ValidMs).append(" ms\n");
        md.append("- Médiane ATTACK (majoritairement timeouts/kills, valeur informative) : ")
                .append(medianAttackMs).append(" ms\n\n");

        md.append("## Fichiers produits\n\n");
        md.append("- CSV brut : `results/").append(csv.getFileName()).append("`\n");
        md.append("- CSV dernier : `results/latest.csv`\n");
        md.append("- Ce rapport : `RAPPORT_POC3.md` (généré automatiquement à chaque run)\n");

        Path mdPath = POC_DIR.resolve("RAPPORT_POC3.md");
        Files.writeString(mdPath, md.toString(), StandardCharsets.UTF_8);
        System.out.println("[POC3] Rapport ecrit : " + mdPath);
        System.out.println("[POC3] Resume : VALID " + String.format(Locale.ROOT, "%.1f", validSuccessPct)
                + "% OK (median " + medianValidMs + "ms) | ATTACKS " + attackBlocked
                + "/" + attackRows.size() + " bloquees | " + evasions + " evasion(s)");

        // Assertions finales : le test echoue si les criteres CDC ne sont pas tenus.
        assertThat(evasions).as("0 evasion attendue sur les cas d attaque").isZero();
        assertThat(validSuccessPct).as("Taux succes VALID >= 95%").isGreaterThanOrEqualTo(95.0);
        assertThat(medianValidMs).as("Latence mediane VALID < 2000 ms").isLessThan(2000);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private Row runCase(CaseSpec spec) {
        String code;
        String tests = null;
        try {
            code = Files.readString(CASES_DIR.resolve(spec.codeFile));
            if (spec.testsFile != null) {
                tests = Files.readString(CASES_DIR.resolve(spec.testsFile));
            }
        } catch (IOException e) {
            return Row.fail(spec, "IO:" + e.getMessage());
        }
        ExecutionRequest req = new ExecutionRequest(spec.language, code, tests, null);
        long t0 = System.nanoTime();
        ExecutionResult res;
        try {
            res = runner.execute(req);
        } catch (Exception e) {
            long ms = (System.nanoTime() - t0) / 1_000_000;
            Row r = new Row(spec.id, spec.language, spec.category, spec.expectedVerdict);
            r.status = "EXCEPTION:" + e.getClass().getSimpleName();
            r.exitCode = -1;
            r.durationMs = ms;
            r.score = 0;
            r.stderr = e.getMessage() == null ? "" : e.getMessage();
            r.stdout = "";
            r.passedVerdict = evaluateVerdict(spec, r);
            return r;
        }
        Row r = new Row(spec.id, spec.language, spec.category, spec.expectedVerdict);
        r.status = res.status().name();
        r.exitCode = res.exitCode();
        r.durationMs = res.durationMs();
        r.score = res.score();
        r.stdout = res.stdout() == null ? "" : res.stdout();
        r.stderr = res.stderr() == null ? "" : res.stderr();
        r.passedVerdict = evaluateVerdict(spec, r);
        return r;
    }

    /**
     * Verdict OK si :
     * - PASS attendu : status OK ET exitCode 0 ET pas d evidence d attaque reussie
     * - BLOCKED attendu : status != OK OU exitCode != 0 (le processus a ete arrete)
     *   ET le stdout ne contient PAS de marqueur PWNED_
     */
    private boolean evaluateVerdict(CaseSpec spec, Row r) {
        boolean containsPwn = r.stdout != null && r.stdout.contains("PWNED_");
        if ("PASS".equals(spec.expectedVerdict)) {
            return "OK".equals(r.status) && r.exitCode == 0 && !containsPwn;
        }
        // BLOCKED : le cas ne doit PAS avoir reussi son attaque.
        // Autorise : ERROR, TIMEOUT, OOM, SECURITY_VIOLATION, ou exit non zero.
        if (containsPwn) return false;
        return !"OK".equals(r.status) || r.exitCode != 0;
    }

    private static long medianLatency(List<Row> list) {
        if (list.isEmpty()) return 0;
        List<Long> sorted = list.stream().map(r -> r.durationMs).sorted().toList();
        int n = sorted.size();
        return n % 2 == 0
                ? (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2
                : sorted.get(n / 2);
    }

    private static long percentileLatency(List<Row> list, int p) {
        if (list.isEmpty()) return 0;
        List<Long> sorted = list.stream().map(r -> r.durationMs).sorted().toList();
        int idx = (int) Math.ceil(p / 100.0 * sorted.size()) - 1;
        return sorted.get(Math.max(0, Math.min(idx, sorted.size() - 1)));
    }

    private static String csv(String s) {
        if (s == null) return "";
        String v = s.replace("\r", " ").replace("\n", " ");
        if (v.contains(",") || v.contains("\"")) {
            v = "\"" + v.replace("\"", "\"\"") + "\"";
        }
        return v;
    }

    private static String firstLine(String s) {
        if (s == null || s.isEmpty()) return "";
        int idx = s.indexOf('\n');
        return idx < 0 ? s : s.substring(0, idx);
    }

    private static String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…";
    }

    // ------------------------------------------------------------------
    // Records / DTOs
    // ------------------------------------------------------------------

    private record CaseSpec(String id, Language language, String category, String expectedVerdict,
                            String description, String codeFile, String testsFile) {}

    private static class Row {
        final String id;
        final Language language;
        final String category;
        final String expectedVerdict;
        String status = "";
        int exitCode = -1;
        long durationMs = 0;
        double score = 0;
        String stdout = "";
        String stderr = "";
        boolean passedVerdict = false;

        Row(String id, Language language, String category, String expectedVerdict) {
            this.id = id;
            this.language = language;
            this.category = category;
            this.expectedVerdict = expectedVerdict;
        }

        static Row fail(CaseSpec s, String err) {
            Row r = new Row(s.id, s.language, s.category, s.expectedVerdict);
            r.status = "LOAD_FAILED";
            r.stderr = err;
            return r;
        }
    }
}
