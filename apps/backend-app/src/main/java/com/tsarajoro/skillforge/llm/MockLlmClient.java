package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.domain.QuestionType;
import com.tsarajoro.skillforge.llm.CvExtractionResult.ExtractedSkill;
import com.tsarajoro.skillforge.llm.CvExtractionResult.SkillLevel;
import com.tsarajoro.skillforge.llm.QuestionGenerationResult.GeneratedQuestion;
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
    public QuestionGenerationResult generateQuestions(GenerationRequest request) {
        List<GeneratedQuestion> generated = new ArrayList<>();
        // Pour chaque type demande, on genere `count` questions factices coherentes.
        for (var quota : request.types()) {
            for (int i = 1; i <= quota.count(); i++) {
                String skillCode = pickSkill(request.skillCodes(), i);
                generated.add(buildMockQuestion(quota.type(), i, request.difficulty(),
                        request.profileCode(), skillCode));
            }
        }
        return new QuestionGenerationResult(generated, providerName(), "mock-generator-v1",
                0, BigDecimal.ZERO);
    }

    private String pickSkill(List<String> skills, int index) {
        if (skills == null || skills.isEmpty()) {
            return "LANG_PHP";
        }
        return skills.get((index - 1) % skills.size());
    }

    private GeneratedQuestion buildMockQuestion(QuestionType type, int index, int difficulty,
                                                 String profileCode, String skillCode) {
        return switch (type) {
            case QCM -> new GeneratedQuestion(
                    QuestionType.QCM,
                    "[MOCK QCM " + index + "] Question sur " + skillCode + " pour profil " + profileCode,
                    difficulty,
                    List.of(skillCode),
                    """
                    {
                      "options": ["Reponse A", "Reponse B (correcte)", "Reponse C", "Reponse D"],
                      "correctIndex": 1,
                      "explanation": "Generation factice pour developpement / tests."
                    }
                    """);
            case CODE -> new GeneratedQuestion(
                    QuestionType.CODE,
                    "[MOCK CODE " + index + "] Vous devez implementer une fonction utilitaire en " + skillCode + ". Completez le squelette ci-dessous.",
                    difficulty,
                    List.of(skillCode),
                    """
                    {
                      "language": "PHP",
                      "starterCode": "<?php\\n/**\\n * Double la valeur passee en parametre.\\n *\\n * @param int $n entier d entree\\n * @return int 2 * n\\n *\\n * Exemple : solve(21) doit retourner 42\\n */\\nfunction solve(int $n): int {\\n    // TODO: implementer ici\\n    return 0;\\n}\\n\\n// Exemple d appel pour debug :\\necho solve(21) . \\"\\\\n\\";",
                      "hiddenTests": "<?php\\nassert(solve(21) === 42, 'Test 1: solve(21)');\\nassert(solve(0) === 0, 'Test 2: solve(0)');\\nassert(solve(-5) === -10, 'Test 3: solve(-5)');\\necho 'OK';",
                      "explanation": "Generation factice : il suffit de retourner $n * 2."
                    }
                    """);
            case CAS_PRATIQUE -> new GeneratedQuestion(
                    QuestionType.CAS_PRATIQUE,
                    "[MOCK CAS " + index + "] Vous arrivez sur un projet utilisant " + skillCode + " ...",
                    difficulty,
                    List.of(skillCode),
                    """
                    {
                      "scenario": "Decrire les etapes que vous suivriez pour diagnostiquer le probleme.",
                      "expectedAnswerPoints": ["Analyser les logs", "Verifier la configuration", "Reproduire en local"],
                      "explanation": "Generation factice."
                    }
                    """);
        };
    }

    @Override
    public CasGradingResult gradeCasPratique(String scenario, java.util.List<String> expectedPoints, String candidateAnswer) {
        int len = candidateAnswer == null ? 0 : candidateAnswer.trim().length();
        BigDecimal score;
        String explanation;
        if (len < 30) {
            score = new BigDecimal("30.00");
            explanation = "[MOCK] Reponse trop courte (" + len + " caracteres). Le candidat n a pas developpe son raisonnement.";
        } else if (len < 200) {
            score = new BigDecimal("65.00");
            explanation = "[MOCK] Reponse correcte mais incomplete. " + (expectedPoints == null ? 0 : expectedPoints.size()) + " points etaient attendus.";
        } else {
            score = new BigDecimal("85.00");
            explanation = "[MOCK] Reponse detaillee et structuree, le candidat couvre l essentiel des points attendus.";
        }
        return new CasGradingResult(score, explanation, providerName(), "mock-judge-v1", 0, BigDecimal.ZERO);
    }

    @Override
    public ReportGenerationResult generateReport(ReportGenerationResult.Input input) {
        BigDecimal score = input.globalScore() == null ? BigDecimal.ZERO : input.globalScore();
        com.tsarajoro.skillforge.domain.Recommendation reco;
        String summary;
        java.util.List<String> strengths;
        java.util.List<String> weaknesses;

        if (score.compareTo(new BigDecimal("75")) >= 0) {
            reco = com.tsarajoro.skillforge.domain.Recommendation.HIRE;
            summary = "[MOCK] " + input.candidateLabel() + " obtient un score solide de " + score
                    + "/100 sur le profil " + input.profileCode() + ". Le candidat maitrise les fondamentaux et resout les exercices techniques avec efficacite.";
            strengths = java.util.List.of(
                    "Bonne maitrise des QCM (" + input.qcmPassed() + "/" + input.qcmTotal() + ")",
                    "Resolution efficace des exercices CODE",
                    "Raisonnement structure dans les cas pratiques");
            weaknesses = java.util.List.of(
                    "Quelques approximations sur les questions de difficulte 4-5",
                    "Marge de progression sur l optimisation");
        } else if (score.compareTo(new BigDecimal("50")) >= 0) {
            reco = com.tsarajoro.skillforge.domain.Recommendation.INTERVIEW;
            summary = "[MOCK] " + input.candidateLabel() + " obtient un score moyen de " + score
                    + "/100 sur le profil " + input.profileCode() + ". Le candidat a des bases mais des lacunes a explorer en entretien.";
            strengths = java.util.List.of(
                    "Bonne comprehension des concepts QCM",
                    "Capacite a structurer une reponse ecrite");
            weaknesses = java.util.List.of(
                    "Difficultes a finaliser les exercices CODE",
                    "Manque de profondeur sur les cas pratiques",
                    "Score CODE : " + input.codePassed() + "/" + input.codeTotal());
        } else {
            reco = com.tsarajoro.skillforge.domain.Recommendation.REJECT;
            summary = "[MOCK] " + input.candidateLabel() + " obtient un score insuffisant de " + score
                    + "/100 sur le profil " + input.profileCode() + ". Niveau technique en-dessous des attentes pour le poste.";
            strengths = java.util.List.of(
                    "Bonne volonte dans la redaction des reponses ouvertes");
            weaknesses = java.util.List.of(
                    "Echec sur la majorite des QCM (" + input.qcmPassed() + "/" + input.qcmTotal() + ")",
                    "Aucun exercice CODE finalise",
                    "Compreneur partielle des cas pratiques");
        }

        return new ReportGenerationResult(
                summary, strengths, weaknesses, reco,
                providerName(), "mock-report-v1", 0, BigDecimal.ZERO);
    }

    @Override
    public String providerName() {
        return "mock";
    }
}
