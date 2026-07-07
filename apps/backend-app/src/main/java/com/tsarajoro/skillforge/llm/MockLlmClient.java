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
                    qcmStatement(skillCode, profileCode),
                    difficulty,
                    List.of(skillCode),
                    qcmPayload(skillCode));
            case CODE -> new GeneratedQuestion(
                    QuestionType.CODE,
                    "Implementez la fonction solve(int $n): int pour retourner le double de la valeur recue.",
                    difficulty,
                    List.of(skillCode),
                    """
                    {
                      "language": "PHP",
                      "starterCode": "<?php\\n/**\\n * Double la valeur passee en parametre.\\n *\\n * @param int $n entier d entree\\n * @return int 2 * n\\n *\\n * Exemple : solve(21) doit retourner 42\\n */\\nfunction solve(int $n): int {\\n    // TODO: implementer ici\\n    return 0;\\n}\\n\\n// Exemple d appel pour debug :\\necho solve(21) . \\"\\\\n\\";",
                      "hiddenTests": "<?php\\nuse PHPUnit\\\\Framework\\\\TestCase;\\nrequire_once __DIR__ . '/solution.php';\\n\\nfinal class HiddenTest extends TestCase {\\n    public function testPositiveNumber(): void {\\n        $this->assertSame(42, solve(21));\\n    }\\n\\n    public function testZero(): void {\\n        $this->assertSame(0, solve(0));\\n    }\\n\\n    public function testNegativeNumber(): void {\\n        $this->assertSame(-10, solve(-5));\\n    }\\n}",
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

    private String qcmStatement(String skillCode, String profileCode) {
        String profile = profileCode == null || profileCode.isBlank() ? "le poste vise" : profileCode;
        return switch (skillCode) {
            case "TOOL_GIT" -> "Sur " + profile + ", quelle pratique Git limite le mieux les regressions avant fusion ?";
            case "TOOL_DOCKER" -> "Dans un projet Dockerise, quel reflexe facilite le diagnostic d'un conteneur qui ne demarre pas ?";
            case "DB_MYSQL" -> "Sur MySQL, quelle action est la plus pertinente pour optimiser une requete lente frequente ?";
            case "DB_POSTGRES" -> "Avec PostgreSQL, quel outil permet de comprendre le plan d'execution d'une requete ?";
            case "LANG_SQL" -> "Quelle clause SQL permet de filtrer les resultats apres agregation ?";
            case "FW_LARAVEL" -> "Dans Laravel, quel mecanisme centralise la validation des donnees d'une requete HTTP ?";
            case "LANG_PHP" -> "En PHP, quelle declaration permet de typer explicitement le retour d'une fonction ?";
            case "LANG_JS" -> "En JavaScript, quelle syntaxe permet d'attendre proprement le resultat d'une Promise ?";
            case "LANG_TS" -> "En TypeScript, quel element sert a decrire la forme attendue d'un objet ?";
            case "FW_VUE" -> "Dans Vue.js, quelle API permet de declarer un etat reactif dans un composant ?";
            default -> "Quelle approche est la plus adaptee pour evaluer la competence " + skillCode + " sur " + profile + " ?";
        };
    }

    private String qcmPayload(String skillCode) {
        String[] options = switch (skillCode) {
            case "TOOL_GIT" -> new String[]{
                    "Fusionner directement sur main pour aller plus vite",
                    "Ouvrir une pull request avec revue et checks automatiques",
                    "Copier les fichiers modifies dans une branche propre",
                    "Desactiver les hooks Git pendant la livraison"};
            case "TOOL_DOCKER" -> new String[]{
                    "Supprimer l'image sans lire les logs",
                    "Verifier les logs, variables d'environnement et ports exposes",
                    "Relancer la machine sans inspecter le conteneur",
                    "Monter tout le projet en volume root"};
            case "DB_MYSQL" -> new String[]{
                    "Ajouter des colonnes sans analyser la requete",
                    "Lire EXPLAIN puis ajouter un index adapte au filtre ou a la jointure",
                    "Augmenter uniquement la taille du serveur",
                    "Remplacer toutes les jointures par du code applicatif"};
            case "DB_POSTGRES" -> new String[]{
                    "VACUUM FULL sur toutes les tables a chaque requete",
                    "EXPLAIN ANALYZE",
                    "DROP INDEX puis relancer l'application",
                    "SELECT * sans condition pour comparer"};
            case "LANG_SQL" -> new String[]{
                    "WHERE",
                    "HAVING",
                    "ORDER BY",
                    "LIMIT"};
            case "FW_LARAVEL" -> new String[]{
                    "Un Form Request",
                    "Un fichier .env",
                    "Une migration",
                    "Un middleware CORS"};
            case "LANG_PHP" -> new String[]{
                    "function total(array $items): int",
                    "var total = function(items)",
                    "def total(items) -> int",
                    "total(items): number"};
            case "LANG_JS" -> new String[]{
                    "await fetchData() dans une fonction async",
                    "sleep(fetchData())",
                    "Promise.pause(fetchData)",
                    "return later fetchData()"};
            case "LANG_TS" -> new String[]{
                    "interface CandidateProfile { email: string }",
                    "schema CandidateProfile = email",
                    "className CandidateProfile email",
                    "typedef CandidateProfile email text"};
            case "FW_VUE" -> new String[]{
                    "ref() ou reactive()",
                    "useState uniquement cote serveur",
                    "setInterval()",
                    "document.querySelector()"};
            default -> new String[]{
                    "Identifier le contexte, choisir un critere mesurable, puis verifier par un exemple",
                    "Repondre uniquement par intuition",
                    "Ignorer les contraintes du projet",
                    "Changer de technologie sans diagnostic"};
        };
        return """
                {
                  "options": ["%s", "%s", "%s", "%s"],
                  "correctIndex": 1,
                  "explanation": "La bonne reponse correspond a la pratique la plus fiable dans un contexte projet."
                }
                """.formatted(escapeJson(options[0]), escapeJson(options[1]), escapeJson(options[2]), escapeJson(options[3]));
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
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
