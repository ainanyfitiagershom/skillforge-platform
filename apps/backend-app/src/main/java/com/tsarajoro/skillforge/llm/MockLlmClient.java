package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.llm.CvExtractionResult.ExtractedSkill;
import com.tsarajoro.skillforge.llm.CvExtractionResult.SkillLevel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Implementation de developpement : extrait les competences en cherchant des mots-cles
 * dans le texte du CV. Pas d'appel reseau, gratuit, deterministe — utile pour les tests
 * et pour developper l'interface sans dependre d'une cle API.
 */
@Component
@ConditionalOnProperty(name = "skillforge.llm.provider", havingValue = "mock", matchIfMissing = true)
public class MockLlmClient implements LlmClient {

    // Dictionnaire de detection : mot-cle -> (code competence, libelle).
    private static final Map<String, String[]> KEYWORDS = Map.ofEntries(
            Map.entry("php",        new String[]{"LANG_PHP", "PHP"}),
            Map.entry("javascript", new String[]{"LANG_JS", "JavaScript"}),
            Map.entry("typescript", new String[]{"LANG_TS", "TypeScript"}),
            Map.entry("html",       new String[]{"LANG_HTML", "HTML 5"}),
            Map.entry("css",        new String[]{"LANG_CSS", "CSS 3"}),
            Map.entry("sql",        new String[]{"LANG_SQL", "SQL"}),
            Map.entry("laravel",    new String[]{"FW_LARAVEL", "Laravel"}),
            Map.entry("symfony",    new String[]{"FW_SYMFONY", "Symfony"}),
            Map.entry("vue",        new String[]{"FW_VUE", "Vue.js"}),
            Map.entry("nuxt",       new String[]{"FW_NUXT", "Nuxt"}),
            Map.entry("react",      new String[]{"FW_REACT", "React"}),
            Map.entry("tailwind",   new String[]{"FW_TAILWIND", "Tailwind CSS"}),
            Map.entry("wordpress",  new String[]{"CMS_WP", "WordPress"}),
            Map.entry("mysql",      new String[]{"DB_MYSQL", "MySQL"}),
            Map.entry("mariadb",    new String[]{"DB_MARIADB", "MariaDB"}),
            Map.entry("postgres",   new String[]{"DB_POSTGRES", "PostgreSQL"}),
            Map.entry("seo",        new String[]{"SEO_ONPAGE", "SEO on-page"}),
            Map.entry("netlinking", new String[]{"SEO_NETLINKING", "Netlinking"}),
            Map.entry("git",        new String[]{"TOOL_GIT", "Git"}),
            Map.entry("docker",     new String[]{"TOOL_DOCKER", "Docker"}),
            Map.entry("composer",   new String[]{"TOOL_COMPOSER", "Composer"}),
            Map.entry("npm",        new String[]{"TOOL_NPM", "npm / pnpm"}));

    @Override
    public CvExtractionResult extractSkillsFromCv(String cvText, String profileCode) {
        String lower = cvText.toLowerCase(Locale.ROOT);
        List<ExtractedSkill> found = new ArrayList<>();
        for (var entry : KEYWORDS.entrySet()) {
            if (lower.contains(entry.getKey())) {
                String code = entry.getValue()[0];
                String name = entry.getValue()[1];
                SkillLevel level = guessLevel(lower, entry.getKey());
                Integer years = guessYears(lower, entry.getKey());
                found.add(new ExtractedSkill(code, name, level, years));
            }
        }
        return new CvExtractionResult(found, providerName(), "mock-keyword-v1", 0, BigDecimal.ZERO);
    }

    private SkillLevel guessLevel(String text, String keyword) {
        if (text.contains("senior") && near(text, keyword, "senior")) return SkillLevel.SENIOR;
        if (text.contains("confirme") || text.contains("intermediate")) return SkillLevel.CONFIRME;
        if (text.contains("junior")) return SkillLevel.JUNIOR;
        return SkillLevel.UNKNOWN;
    }

    private Integer guessYears(String text, String keyword) {
        int idx = text.indexOf(keyword);
        if (idx < 0) return null;
        int start = Math.max(0, idx - 40);
        int end = Math.min(text.length(), idx + keyword.length() + 40);
        String window = text.substring(start, end);
        for (String token : window.split("[^0-9]+")) {
            if (!token.isEmpty()) {
                try {
                    int n = Integer.parseInt(token);
                    if (n >= 1 && n <= 30) return n;
                } catch (NumberFormatException ignored) {
                    // ignore
                }
            }
        }
        return null;
    }

    private boolean near(String text, String a, String b) {
        int ia = text.indexOf(a);
        int ib = text.indexOf(b);
        return ia >= 0 && ib >= 0 && Math.abs(ia - ib) < 100;
    }

    @Override
    public String providerName() {
        return "mock";
    }
}
