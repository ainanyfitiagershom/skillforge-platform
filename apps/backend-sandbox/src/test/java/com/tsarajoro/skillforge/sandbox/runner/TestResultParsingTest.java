package com.tsarajoro.skillforge.sandbox.runner;

import com.tsarajoro.skillforge.sandbox.api.Language;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests du parsing des sorties PHPUnit et Jest (sans Docker, juste la regex).
 *
 * On invoque la methode privee via reflection pour ne pas exposer une
 * methode interne en API publique uniquement pour les tests.
 */
class TestResultParsingTest {

    private final SandboxRunner runner = new SandboxRunner(null, null);

    private int[] invokeParse(Language lang, String stdout, String stderr) throws Exception {
        Method m = SandboxRunner.class.getDeclaredMethod(
                "parseTestResults", Language.class, String.class, String.class);
        m.setAccessible(true);
        return (int[]) m.invoke(runner, lang, stdout, stderr);
    }

    // ---------- PHPUnit ----------

    @Test
    void parsesPhpUnitAllPassed() throws Exception {
        String out = """
                PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

                ........                                                            8 / 8 (100%)

                Time: 00:00.012, Memory: 8.00 MB

                OK (8 tests, 12 assertions)
                """;
        int[] r = invokeParse(Language.PHP, out, "");
        assertThat(r).containsExactly(8, 8);
    }

    @Test
    void parsesPhpUnitWithFailures() throws Exception {
        String out = """
                PHPUnit 11.0.0 by Sebastian Bergmann.

                F.F.....                                                            8 / 8 (100%)

                Time: 00:00.018
                Tests: 8, Assertions: 12, Failures: 2
                """;
        int[] r = invokeParse(Language.PHP, out, "");
        assertThat(r).containsExactly(6, 8);
    }

    @Test
    void phpUnitNoMatchReturnsZeros() throws Exception {
        int[] r = invokeParse(Language.PHP, "random garbage output", "");
        assertThat(r).containsExactly(0, 0);
    }

    // ---------- Jest ----------

    @Test
    void parsesJestAllPassed() throws Exception {
        String out = """
                PASS  ./hidden.test.js
                  ✓ solves basic case (3 ms)
                  ✓ solves edge case (1 ms)

                Test Suites: 1 passed, 1 total
                Tests:       2 passed, 2 total
                Snapshots:   0 total
                Time:        0.5 s
                """;
        int[] r = invokeParse(Language.JS, out, "");
        assertThat(r).containsExactly(2, 2);
    }

    @Test
    void parsesJestWithFailures() throws Exception {
        String out = """
                FAIL  ./hidden.test.js
                  ✓ solves basic case
                  ✕ solves edge case

                Tests:       1 failed, 1 passed, 2 total
                """;
        int[] r = invokeParse(Language.JS, out, "");
        assertThat(r).containsExactly(1, 2);
    }

    @Test
    void jestNoMatchReturnsZeros() throws Exception {
        int[] r = invokeParse(Language.JS, "no tests ran", "");
        assertThat(r).containsExactly(0, 0);
    }
}
