# Questions probables du jury — soutenance SkillForge

Document de préparation à la soutenance. Trois parties :

1. **La logique de l'application** : fiche pour comprendre comment SkillForge fonctionne de bout en bout.
2. **Questions-réponses probables** : 60 questions classées par thème, chaque réponse est courte (15-30 secondes à l'oral).
3. **Glossaire exhaustif** : tous les termes techniques du mémoire et des slides, expliqués simplement.

---

# Partie 1 — Fiche logique de l'application

## Vue d'ensemble en 5 phrases

SkillForge est une plateforme web interne qui aide le recrutement technique chez Tsarajoro. Elle est composée de trois éléments : un **frontend React** côté navigateur, un **backend Spring Boot** côté serveur, et une **sandbox Docker** séparée qui exécute le code candidat. Elle intègre **six fournisseurs d'IA** interchangeables pour analyser les CV, générer les tests et noter les réponses. Chaque étape est validée par un humain, selon le principe : **l'IA propose, le recruteur décide**. La sécurité repose sur une sandbox durcie testée contre **50 scénarios d'attaque**, avec zéro évasion observée.

## Le parcours complet, étape par étape

### Étape 1 — Le recruteur ouvre la plateforme

Il se connecte avec son email et son mot de passe. Le backend vérifie le mot de passe (haché avec BCrypt), génère un JWT (jeton d'authentification signé) et le renvoie au navigateur. Toutes les requêtes suivantes transportent ce JWT.

### Étape 2 — Création d'une évaluation

Le recruteur :
- Saisit le nom et l'email du candidat
- Choisit un profil cible (ex : « Développeur PHP »)
- Importe le CV du candidat (PDF ou DOCX)

Le backend enregistre le candidat, enregistre le CV (brut dans la table `cvs`), et déclenche l'analyse IA.

### Étape 3 — Analyse du CV par l'IA

Le backend appelle le fournisseur IA actif (OpenAI gpt-4o-mini par défaut) via l'interface `LlmClient`. Le prompt demande d'extraire les compétences techniques et de les classer par niveau estimé. L'IA renvoie un JSON structuré :

```json
{
  "skills": [
    { "code": "LANG_PHP", "level": 4 },
    { "code": "FW_LARAVEL", "level": 3 },
    ...
  ]
}
```

Le backend enregistre les compétences dans la table `cv_analyses` et renvoie la liste au frontend.

### Étape 4 — Validation des compétences

Le recruteur voit la liste des compétences détectées. Il peut :
- Les corriger (changer le niveau)
- En supprimer
- En ajouter

Cette étape est importante : **l'IA n'est jamais seule à décider des compétences du candidat.**

### Étape 5 — Génération du test

Le recruteur demande la génération. Le backend construit un prompt qui dit à l'IA de produire par exemple « 5 QCM, 2 exercices de code et 2 cas pratiques » adaptés au profil et aux compétences validées. L'IA renvoie un JSON contenant les questions. Chaque question est enregistrée dans la table `questions` avec un statut `PENDING_REVIEW`.

### Étape 6 — Revue et validation des questions par le recruteur

Le recruteur voit toutes les questions générées. Pour chacune, il peut :
- Approuver (statut passe à `APPROVED`)
- Modifier le texte
- Supprimer (statut passe à `ARCHIVED`)

Seules les questions `APPROVED` partent au candidat. Les autres restent dans la banque pour un usage futur.

### Étape 7 — Envoi de l'invitation

Le backend crée une `invitation` qui contient :
- Un lien unique
- Un code à six chiffres aléatoire
- Une date d'expiration

Le mail est envoyé via Resend (HTTPS, Render bloque SMTP). Le candidat reçoit le lien et le code.

### Étape 8 — Accès candidat

Le candidat ouvre le lien dans son navigateur. On lui demande son code à six chiffres. Il coche son consentement RGPD. Il voit la liste des questions.

### Étape 9 — Passation du test

Le candidat répond :
- QCM : il choisit une option
- Code : il écrit du code dans un éditeur Monaco, il clique sur « Exécuter »
- Cas pratique : il rédige un texte

Pendant la passation, un listener JavaScript dans le navigateur détecte les signaux anti-fraude et les envoie au backend : copier-coller volumineux, sortie d'onglet, réponse trop rapide, ouverture des DevTools.

### Étape 10 — Exécution du code dans la sandbox

Quand le candidat clique sur « Exécuter » :
1. Le frontend envoie le code au backend via `/api/passation/execute`
2. Le backend transmet au service sandbox via `POST /sandbox/execute` (header `X-Internal-Key` pour authentifier)
3. Le service sandbox lance un conteneur Docker éphémère avec le code du candidat
4. Le conteneur a tous les garde-fous : seccomp, cap-drop, network-none, readonly-rootfs, 256 Mo RAM max, 5 secondes timeout, user 1001
5. À la fin, le conteneur est détruit, et le résultat (stdout, stderr, exit code, score) est renvoyé

Si l'exercice a des tests cachés, Jest (JS) ou PHPUnit (PHP) les exécute et le score est calculé automatiquement.

### Étape 11 — Soumission finale

Quand le candidat clique sur « Soumettre », la passation est verrouillée. Plus aucune modification possible.

### Étape 12 — Correction automatique

Le backend corrige :
- QCM : comparaison avec la réponse attendue (déterministe)
- Code : score issu des tests cachés (déterministe)
- Cas pratique : l'IA note en comparant la réponse aux points attendus définis par le recruteur (non déterministe)

Un score global est calculé.

### Étape 13 — Génération du rapport

Le backend appelle l'IA pour générer :
- Un résumé exécutif
- Les points forts
- Les points faibles
- Une recommandation (HIRE, INTERVIEW, REJECT)

Le rapport est enregistré dans la table `reports` et affiché au recruteur.

### Étape 14 — Consultation côté recruteur

Le recruteur voit :
- Le score global
- Le détail par question
- La synthèse IA (modifiable)
- Les événements anti-fraude détectés
- Le score de fraude agrégé (0 à 100)

Il peut exporter en PDF.

### Étape 15 — Tableau de bord analytique

Au-delà d'un candidat, le recruteur a un tableau de bord qui montre :
- Toutes les évaluations en cours
- Les scores moyens par compétence
- Les questions les plus discriminantes (via le coefficient point-bisériale)

---

## Logique de sécurité en 3 niveaux

### Niveau 1 — Frontend / Backend
- JWT pour l'authentification recruteur
- Code à six chiffres pour l'accès candidat
- Limitation des tentatives sur les codes incorrects
- Consentement RGPD affiché avant toute collecte

### Niveau 2 — Communication backend / sandbox
- Appel API interne avec header secret `X-Internal-Key`
- Pas d'accès direct possible depuis l'extérieur à la sandbox

### Niveau 3 — Isolation du code candidat
Sept barrières combinées :
1. **seccomp** : filtre les appels système autorisés
2. **cap-drop=ALL** : retire toutes les capabilities Linux
3. **network=none** : pas de carte réseau
4. **readonly-rootfs** : système de fichiers en lecture seule
5. **memory=256m** : limite mémoire
6. **pids-limit=64** : limite le nombre de processus
7. **user 1001** : exécution sans privilèges root
8. **timeout 5s** : interruption après 5 secondes
9. **PHP spécifique** : `open_basedir`, `disable_functions`, `allow_url_fopen=Off`
10. **Node spécifique** : `--experimental-permission` avec `--allow-fs-read` restreint à `/work` et `/usr`

Même si une barrière cédait, les autres contiennent.

---

## Logique de l'anti-fraude

Un listener JavaScript dans le navigateur candidat écoute 4 types d'événements :

| Événement | Déclencheur | Poids |
|---|---|---|
| `FOCUS_LOSS` | Changement d'onglet > 1 seconde | 25 points |
| `PASTE_SUSPICIOUS` | Copier-coller de plus de 50 caractères | 30 points |
| `FAST_ANSWER` | Réponse de plus de 300 caractères en moins de 5 secondes | 20 points |
| `DEVTOOLS_OPEN` | Ouverture des DevTools détectée | 10 points |

Chaque événement est envoyé au backend qui l'enregistre dans la table `fraud_events`. Le score agrégé est plafonné à 100.

**Important** : ces signaux ne condamnent pas le candidat, ils alimentent un indicateur de risque que le recruteur consulte pour décider s'il doit creuser en entretien.

---

## Logique multi-fournisseurs IA

L'interface `LlmClient` (Java) définit 4 méthodes :

```java
public interface LlmClient {
    CvExtractionResult extractSkillsFromCv(String cvText, String profileCode);
    QuestionGenerationResult generateQuestions(GenerationRequest request);
    CasGradingResult gradeCasPratique(String scenario, List<String> expectedPoints, String candidateAnswer);
    ReportGenerationResult generateReport(ReportGenerationResult.Input input);
    String providerName();
}
```

Six implémentations existent :
- `OpenAiLlmClient` (principal, GPT-4o-mini)
- `GroqLlmClient` (secours)
- `GeminiLlmClient` (secours)
- `ClaudeLlmClient` (secours)
- `GitHubModelsLlmClient` (secours)
- `OllamaLlmClient` (local, pour souveraineté des données)

Le choix se fait via la variable d'environnement `LLM_PROVIDER`. Pour passer de OpenAI à Groq, on change juste cette variable et on redémarre le backend. **Zéro ligne de code métier modifiée.**

C'est cette abstraction qui a permis la bascule GitHub Models → OpenAI en moins d'une heure quand GitHub Models a changé ses conditions.

---

## Modèle de données simplifié

11 tables principales :

```
users          : comptes recruteur/admin/candidat
profiles       : profils métiers (Dev PHP, Dev Full Stack...)
skills         : compétences techniques (LANG_PHP, FW_LARAVEL...)
candidates     : personnes évaluées
cvs            : fichiers CV déposés
cv_analyses    : résultats extraction IA
questions      : banque de questions
tests          : tests générés pour un candidat
invitations    : liens envoyés au candidat
passations     : sessions de passation
answers        : réponses du candidat
reports        : rapports IA
fraud_events   : signaux anti-fraude
```

Un **candidat** peut avoir plusieurs **CV**, plusieurs **tests**, plusieurs **passations**. Une **passation** contient plusieurs **réponses** et plusieurs **événements anti-fraude**. Un **test** est composé de plusieurs **questions** via la table de liaison `test_compositions`.

Détails complets en Annexe 1 (modèle physique) et Annexe 6 (dictionnaire des données).

---


# Partie 1 bis — Termes techniques propres au projet SkillForge

Les définitions ci-dessous concernent les éléments **spécifiques à l'architecture SkillForge**. Les concepts génériques (seccomp, Docker, JWT, etc.) sont dans le glossaire en partie 3.

## Composants et services

### SkillForge
Nom du projet et de la plateforme. Vient de l'anglais « forger les compétences ». Pas un acronyme.

### backend-app
Le service principal de SkillForge, écrit en Spring Boot 3 et Java 21. Gère l'authentification, les CV, les candidats, les évaluations, la banque de questions, les passations, et la génération de rapports. S'exécute sur le port 8090 en local, hébergé sur Render en préproduction.

### backend-sandbox
Service séparé, également en Spring Boot, dédié uniquement à l'exécution isolée du code candidat. S'exécute sur le port 8091 en local. Expose un seul endpoint : `POST /sandbox/execute`.

### frontend-web
Application web React + TypeScript + Vite, qui propose deux parcours : espace recruteur (connexion requise) et espace candidat (accès par lien unique + code 6 chiffres). Port 5173 en local, hébergée sur Vercel en préproduction.

### Sandbox durcie
Expression désignant la combinaison des 7 flags Docker + le profil seccomp personnalisé + les restrictions PHP ou Node, qui ensemble garantissent l'isolation du code candidat.

### LlmClient
Interface Java au cœur de l'abstraction multi-fournisseurs IA de SkillForge. Déclare les 4 méthodes que doit implémenter chaque fournisseur IA : extraire les compétences d'un CV, générer des questions, noter un cas pratique, générer un rapport.

### MockLlmClient
Implémentation de LlmClient qui ne fait aucun appel réseau, utilisée en développement local et dans certains tests unitaires. Elle extrait les compétences par heuristiques simples sur le texte du CV (si « PHP » apparaît, elle extrait `LANG_PHP`).

### SandboxRunner
Classe Java dans `backend-sandbox` qui orchestre l'exécution Docker : création du conteneur, montage du code candidat, capture stdout/stderr, suppression du conteneur à la fin.

### InternalKeyFilter
Filtre Spring Security qui protège l'endpoint `POST /sandbox/execute`. Vérifie le header `X-Internal-Key` et bloque toute requête sans la bonne clé.

### FraudDetectionService
Service côté backend qui agrège les événements anti-fraude envoyés par le frontend candidat et calcule un score pondéré de 0 à 100.

### AnalyticsService
Service qui calcule la qualité statistique des questions (corrélation point-bisériale, taux de réussite) à partir des réponses accumulées en base.

### CandidatePassationService
Service qui gère tout le parcours candidat : accès avec code 6 chiffres, chargement des questions, enregistrement des réponses, exécution de code, soumission finale.

### TestGenerationService
Service qui construit le prompt de génération et appelle le LlmClient pour produire les questions. Il fournit aussi des « tests cachés par défaut » quand le LLM ne produit pas de tests pour un exercice de code.

## Fichiers de configuration importants

### application.yml
Fichier Spring Boot principal du backend-app, dans `apps/backend-app/src/main/resources/`. Contient la configuration de la base PostgreSQL, du fournisseur LLM actif, du SMTP, et des variables d'environnement nécessaires.

### skillforge-seccomp.json
Profil seccomp personnalisé pour la sandbox, dans `infra/sandbox/seccomp/`. Liste explicitement les appels système autorisés et refuse tout le reste par défaut.

### skillforge-php.ini
Configuration PHP durcie, dans `infra/sandbox/php8.3/`. Contient `open_basedir`, `disable_functions`, `allow_url_fopen=Off`, et limites `memory_limit` + `max_execution_time`.

### Dockerfile (sandbox PHP)
Dans `infra/sandbox/php8.3/`. Image PHP 8.3 Alpine minimale, qui installe PHPUnit et applique le `skillforge-php.ini`.

### Dockerfile (sandbox Node)
Dans `infra/sandbox/node20/`. Image Node 20 Alpine, qui installe Jest globalement.

### V1 à V7 (migrations Flyway)
Fichiers SQL numérotés dans `apps/backend-app/src/main/resources/db/migration/`. Chaque fichier représente une évolution du schéma de base PostgreSQL. Flyway les applique en ordre à chaque démarrage du backend.

## Enums et statuts métier

### Types de question
Trois valeurs possibles pour une question :
- **QCM** : question à choix multiples avec une bonne réponse unique
- **CODE** : exercice de programmation (PHP ou JS) avec tests cachés automatiques
- **CAS_PRATIQUE** : question ouverte où le candidat rédige du texte libre, noté par le LLM

### Statuts d'une question (banque)
Quatre valeurs :
- **PENDING_REVIEW** : générée par l'IA, en attente de validation
- **APPROVED** : validée par le recruteur, utilisable dans un test
- **REJECTED** : rejetée par le recruteur, exclue
- **ARCHIVED** : supprimée du catalogue actif

### Statut d'exécution sandbox
Cinq valeurs possibles pour un run du code candidat :
- **OK** : exécution terminée avec exit code 0
- **TIMEOUT** : dépassement des 5 secondes, SIGKILL
- **OOM** : dépassement des 256 Mo de RAM, OOM-kill Docker
- **ERROR** : exit code non nul, erreur applicative
- **SECURITY_VIOLATION** : tentative détectée par seccomp (code candidat refusé)

### Rôles utilisateur
Trois rôles définis dans la table `users` :
- **ADMIN** : accès complet, pour l'administrateur de la plateforme
- **RECRUTEUR** : accès au tableau de bord recruteur
- **CANDIDAT** : accès uniquement via un lien d'invitation (pas de login direct)

### Recommandations IA (rapport)
Trois valeurs possibles pour la recommandation générée par l'IA à la fin de la passation :
- **HIRE** : recommandation d'embauche
- **INTERVIEW** : à approfondir en entretien
- **REJECT** : non recommandé

Important : cette recommandation est **indicative**. La décision finale reste humaine.

## Événements anti-fraude

### FOCUS_LOSS
Événement envoyé quand le candidat passe sur un autre onglet pendant plus d'une seconde. Poids = 25.

### PASTE_SUSPICIOUS
Événement envoyé quand le candidat colle plus de 50 caractères d'un coup. Poids = 30.

### FAST_ANSWER
Événement envoyé quand le candidat soumet une réponse de plus de 300 caractères en moins de 5 secondes. Poids = 20.

### DEVTOOLS_OPEN
Événement envoyé quand le navigateur candidat ouvre les DevTools (différence `window.outerHeight - window.innerHeight` > 160 pixels). Poids = 10.

### Score de risque
Somme pondérée des événements, plafonnée à 100. Un score >= 75 signale « risque élevé — à vérifier ».

## Codes compétences et profils

### LANG_PHP, LANG_JS, LANG_PYTHON
Codes identifiant les langages de programmation dans la table `skills`.

### FW_LARAVEL, FW_SPRING, FW_REACT
Codes identifiant les frameworks dans la table `skills`.

### DB_MYSQL, DB_POSTGRES, DB_MONGO
Codes identifiant les systèmes de base de données dans la table `skills`.

### DEV_PHP, DEV_FULLSTACK, DEV_DATA
Codes identifiant les profils métiers dans la table `profiles`. Chaque profil est lié à un ensemble de compétences via la table `profile_skills`.

## Protocoles internes

### POST /sandbox/execute
Endpoint HTTP interne de la sandbox, appelé uniquement par le backend-app. Prend en entrée `{language, userCode, hiddenTests, timeoutSeconds}` et retourne `{status, exitCode, stdout, stderr, durationMs, testsPassed, testsTotal, score}`.

### GET /actuator/health
Endpoint Spring Boot Actuator qui renvoie `{"status": "UP"}` si le service est en ligne. Utilisé pour les sondes de santé Render et par ngrok.

### POST /auth/login
Endpoint du backend-app qui vérifie les identifiants recruteur (email + mot de passe) et renvoie un JWT.

### POST /passation/execute
Endpoint du backend-app qui reçoit le code candidat depuis le navigateur et le transmet à la sandbox interne via `POST /sandbox/execute`.

### POST /fraud/event
Endpoint du backend-app qui reçoit un événement anti-fraude depuis le listener JavaScript du navigateur candidat.

## Harness et tests spécifiques

### Harness POC 3
Suite de 150 scénarios (100 valides + 50 attaques) qui testent la sandbox de bout en bout avec un vrai conteneur Docker. Implémenté dans la classe `PocSandboxHarnessTest`. Désactivé par défaut dans la CI, activable avec `mvn test -Dpoc3.run=true`.

### 50 scénarios ATTACK
Répartis en 7 catégories : évasion (8), déni de service par explosion de processus (8), lecture fichiers (8), écriture fichiers (8), épuisement mémoire (8), accès réseau (8), bonus (2).

### 100 scénarios VALID
Code légitime varié (algo classiques, calculs, parsing JSON) qui doit s'exécuter sans erreur dans la sandbox pour prouver que les protections ne gênent pas le code normal.

### RAPPORT_POC3.md
Rapport Markdown généré automatiquement par le harness à chaque exécution. Contient les résultats des 150 scénarios et la mesure de performance (évasions, taux de succès VALID, médiane de latence).

## Terminologie métier Tsarajoro

### Recruteur
Développeur senior de l'équipe Full Stack qui pilote le recrutement d'un nouveau candidat. Rôle utilisateur principal de SkillForge.

### Candidat
Personne externe à Tsarajoro qui postule à un poste technique et passe une évaluation.

### Encadreur professionnel
Chef de projet Tsarajoro qui a encadré le stage : M. Ulrich Ravelomanantiana.

### Préproduction
Environnement de déploiement actuel sur Vercel + Render + Supabase. Utilisé pour les tests en interne avant déploiement sur l'infrastructure Tsarajoro.

### Déploiement interne
Perspective principale post-stage : migration de la préproduction vers les serveurs physiques ou cloud internes de Tsarajoro, pour que les données candidats restent dans l'entreprise.

### Évaluation
Processus complet depuis la création par le recruteur jusqu'au rapport final consulté par le recruteur. Englobe le CV, le test généré, la passation candidat, la correction, le rapport.

### Passation
Session concrète pendant laquelle un candidat répond au test, dans son navigateur. Démarre à l'ouverture du lien, se termine à la soumission.

### Banque de questions
Table `questions` qui accumule toutes les questions générées, validées ou rejetées. Au fil du temps, le recruteur peut réutiliser les questions `APPROVED` dans de nouveaux tests.

### Compte rendu
Synthèse finale générée par l'IA à la fin de la correction, consultable et exportable en PDF par le recruteur. Contient score global, forces, faiblesses, recommandation, et traces anti-fraude.

---

# Partie 2 — Questions-réponses probables

## A. Questions sur le projet et son positionnement

### A1 — « En une phrase, qu'est-ce que fait SkillForge et pourquoi vous l'avez développé ? »
> SkillForge est une plateforme web interne qui automatise l'évaluation technique des candidats chez Tsarajoro, du CV au rapport final, en gardant la validation humaine à chaque étape. Elle existe parce qu'une évaluation coûtait auparavant 3 heures par candidat et que les tests n'étaient pas uniformes selon le recruteur.

### A2 — « Qu'est-ce qui différencie SkillForge des plateformes comme HackerRank ou Codility ? »
> Trois choses. L'enchaînement complet CV → compétences → test généré sur mesure, pas uniquement l'exécution de code. Une solution interne, donc les données candidats restent chez Tsarajoro à terme. Et une architecture multi-fournisseurs d'IA avec six implémentations interchangeables.

### A3 — « Pourquoi avoir développé en interne plutôt que d'acheter HackerRank ou Codility ? »
> Trois raisons. Les plateformes du marché coûtent entre 924 et 1 200 dollars par an. Elles ne font pas l'enchaînement analyse CV → génération test personnalisé. Et une solution interne garantit que les données candidats restent sur l'infrastructure Tsarajoro après migration.

### A4 — « 3 heures par candidat, d'où vient ce chiffre ? »
> D'un entretien avec M. Ulrich Ravelomanantiana, chef de projet et encadreur professionnel. Il est détaillé en section 1.2 : environ 1h30 pour préparer le test, 1h pour la correction manuelle, 30 minutes pour l'analyse. C'est une estimation terrain, pas une mesure instrumentée.

### A5 — « Combien de recrutements techniques Tsarajoro fait par an ? »
> 20 à 30 candidats évalués par an selon les profils recherchés. Source : encadreur professionnel.

### A6 — « Vous avez travaillé seul ou en équipe ? »
> Seul sur le développement, encadré par M. Ulrich Ravelomanantiana côté entreprise. L'équipe de développement Full Stack à Madagascar compte 8 personnes au total, mais le projet SkillForge est individuel.

### A7 — « Combien de temps ça a duré ? »
> 4 mois, du 11 mai au 11 septembre 2026, soit 90 jours effectifs répartis en un sprint 0 de cadrage et 8 sprints de 7 à 13 jours.

### A8 — « Est-ce que SkillForge est déjà utilisé en vrai chez Tsarajoro ? »
> La plateforme est actuellement en préproduction sur Vercel et Render, et elle a été testée en interne par des recruteurs sur des évaluations réelles. Le déploiement en production sur l'infrastructure interne Tsarajoro est la perspective principale post-stage.

### A9 — « Est-ce que vous pensez que l'IA peut remplacer un recruteur technique ? »
> Non, et c'est le fil rouge du projet. L'IA accélère les tâches répétitives : analyse de CV, génération de questions, calcul de scores. Mais la décision finale est prise par le recruteur après avoir validé le travail de l'IA à chaque étape. Les biais algorithmiques documentés par Raghavan et par Bogen rendent indispensable cette supervision humaine.

### A10 — « Si vous deviez refaire ce projet, que feriez-vous différemment ? »
> Je constituerais un jeu de CV annotés dès le début pour pouvoir chiffrer scientifiquement la qualité d'extraction de l'IA. C'est la seule limite rédactionnelle du mémoire : je peux dire que ça marche, mais pas à quel point précisément.

---

## B. Questions sur l'IA et les LLM

### B1 — « À quels moments précis intervient l'IA dans votre plateforme ? »
> Trois moments. Analyse du CV, où elle extrait les compétences. Génération du test, où elle produit QCM, exercices de code et cas pratiques. Correction, où elle note les cas pratiques en texte libre et génère la synthèse finale. À chaque étape, le recruteur valide avant de passer à la suite.

### B2 — « Vous avez intégré six fournisseurs d'IA. Pourquoi ? »
> Pour éviter la dépendance à un fournisseur unique. L'abstraction LlmClient permet de changer de fournisseur par simple variable d'environnement, sans toucher au code métier. Utile en pratique : GitHub Models a changé ses conditions pendant le projet, j'ai basculé sur OpenAI en moins d'une heure.

### B3 — « Lequel est votre fournisseur principal et pourquoi ? »
> OpenAI gpt-4o-mini. Choisi pour sa stabilité, sa qualité d'extraction sur les CV et son rapport qualité-prix. Groq, Google Gemini, Anthropic Claude et GitHub Models sont intégrés comme secours. Ollama tourne en local et sert d'alternative souveraine.

### B4 — « Donnez-nous un exemple de prompt renforcé et montrez comment il était avant. »
> Au début, mon prompt pour la génération était du type « Génère 5 questions sur PHP ». L'IA produisait du texte libre, parfois sans réponse correcte identifiable, parfois en mélangeant les niveaux de difficulté.
>
> Le prompt renforcé actuel commence par : *« Tu es un expert RH technique et créateur de tests d'évaluation. Réponds UNIQUEMENT en JSON au format suivant… »* suivi d'un schéma complet qui impose les champs type (QCM, CODE ou CAS_PRATIQUE), statement (énoncé), difficulty (entier 1 à 5), targetSkillCodes (compétences cibles), et jsonPayload (contenu structuré différent selon le type).
>
> Résultat : les questions arrivent dans un format parsable, elles ont toujours une réponse correcte identifiable, un niveau chiffré, et une compétence rattachée. Le recruteur valide en un coup d'œil.

### B5 — « Comment mesurez-vous la qualité de l'IA ? »
> En préproduction, sur 189 questions générées, 56 ont été approuvées et aucune n'a été rejetée. Mais c'est un indicateur indirect. Je n'ai pas de jeu de référence annoté pour calculer précision et rappel au sens scientifique. C'est le chantier prioritaire post-stage, mentionné en section 8.5.

### B6 — « Que se passe-t-il si le fournisseur d'IA tombe en panne ? »
> La plateforme bascule vers un autre fournisseur par changement d'une variable d'environnement. L'interface LlmClient garantit que tous les fournisseurs ont la même signature de méthodes. La logique métier ne change pas.

### B7 — « Est-ce que l'IA peut inventer des choses ? Comment vous gérez les hallucinations ? »
> Oui, c'est un risque réel des LLM. Deux parades. D'abord, le prompt force un format JSON strict avec des champs typés : difficulté entre 1 et 5, type parmi 3 valeurs, compétences prises dans une liste fournie. Ensuite, le recruteur valide chaque question avant envoi au candidat. C'est le principe « l'IA propose, le recruteur décide ».

### B8 — « Comment vous choisissez quel modèle utiliser ? »
> C'est configuré via la variable `LLM_PROVIDER` au démarrage du backend. Pour la production, on utilise OpenAI gpt-4o-mini. Pour les tests locaux sans internet, on peut passer sur Ollama avec Qwen 2.5-7B. Pour une alternative sans quota, Groq.

### B9 — « Pourquoi JSON pour les réponses de l'IA ? »
> Parce que c'est parsable sans ambiguïté. Si l'IA renvoyait du texte libre, il faudrait un parseur fragile pour extraire les champs. En JSON strict, un objet mal formé est détecté immédiatement et on peut relancer la génération.

### B10 — « Qu'est-ce que l'évaluation des LLM par HELM ? »
> HELM (Holistic Evaluation of Language Models) est un framework académique de Liang et Bommasani qui propose une évaluation multidimensionnelle des LLM, pas seulement sur la précision mais aussi sur la robustesse, les biais, l'efficacité. SkillForge ne l'utilise pas pour mesurer ses propres sorties, mais HELM est cité en bibliographie comme référence pour la question de l'évaluation IA.

### B11 — « Combien ça coûte à faire tourner l'IA ? »
> Pendant le stage, environ 10 euros d'API OpenAI pour 22 CV analysés et 189 questions générées. Soit moins de 0,05 euro par candidat. Les autres fournisseurs ont des quotas gratuits suffisants pour les tests. Ollama est gratuit mais consomme de la RAM locale.

---

## C. Questions sur la sécurité et la sandbox

### C1 — « Un candidat peut écrire n'importe quel code. Qu'est-ce qui empêche d'attaquer votre serveur ? »
> Sept barrières combinées dans un conteneur Docker : filtrage des appels système via seccomp, suppression de toutes les capabilities Linux, aucune carte réseau, système de fichiers en lecture seule, limite mémoire 256 Mo, limite 64 processus, timeout 5 secondes, exécution sous un utilisateur non privilégié. Même si une barrière cédait, les autres contiennent.

### C2 — « À quoi sert concrètement seccomp dans votre projet et comment l'avez-vous intégré ? »
> Seccomp est un mécanisme du noyau Linux qui filtre les appels système autorisés à un processus. J'ai écrit un profil JSON personnalisé qui liste explicitement les appels système autorisés, par défaut en bloquant tous les autres. Au démarrage du conteneur sandbox, Docker reçoit le flag `--security-opt seccomp=skillforge-seccomp.json`. Résultat : des appels comme `socket` pour ouvrir une connexion réseau ou `ptrace` pour injecter du code sont refusés par le noyau avec un code EPERM, avant même d'atteindre le programme. Le profil est dans `infra/sandbox/seccomp/skillforge-seccomp.json`.

### C3 — « Vous dites 0 évasion sur 50 scénarios d'attaque. Détaillez. »
> J'ai préparé un harness de test qui joue 50 scénarios d'attaque répartis en 7 catégories : évasion de sandbox (8), déni de service par explosion de processus (8), lecture de fichiers sensibles (8), écriture de fichiers (8), épuisement mémoire (8), accès réseau (8), scénarios bonus (2). Chaque scénario tente une attaque différente, par exemple lire `/etc/passwd`, lancer un fork bomb, ouvrir une connexion HTTP, allouer 512 Mo. Les 50 ont été bloqués par les défenses sandbox. Le détail est en Annexe 7.

### C4 — « Comment on reproduit ces tests ? »
> Le harness est une classe Java `PocSandboxHarnessTest`, désactivée par défaut dans la CI. Elle s'active avec la commande `mvn test -Dpoc3.run=true`. Elle démarre un vrai conteneur Docker, joue les 50 scénarios ATTACK et 100 VALID, et produit deux rapports : `RAPPORT_POC3.md` et un fichier CSV horodaté.

### C5 — « Et si une attaque n'est pas dans vos 50 scénarios ? »
> C'est une limite réelle. Les 50 scénarios couvrent les catégories classiques mais ne constituent pas une preuve d'invulnérabilité absolue. C'est pour ça que la plateforme combine plusieurs barrières indépendantes et non une seule. L'évolution des attaques connues peut être suivie et le harness enrichi au fur et à mesure.

### C6 — « Vous auriez pu utiliser gVisor ou Firecracker. Pourquoi Docker ? »
> Trois raisons documentées en Tableau 2. L'adéquation avec les compétences existantes dans l'équipe. La maturité de l'écosystème Docker avec un profil seccomp documenté. Et un coût d'intégration raisonnable. gVisor et Firecracker auraient apporté une isolation plus forte mais au prix d'une complexité disproportionnée pour le périmètre du stage.

### C7 — « Comment la sandbox PHP se protège-t-elle ? »
> PHP a des mécanismes propres. J'ai configuré un fichier `php.ini` durci qui désactive les fonctions dangereuses : `shell_exec`, `system`, `exec`, `passthru`, `proc_open`, `popen`, `pcntl_fork`. Il active aussi `open_basedir=/work` qui empêche PHP de lire des fichiers hors de `/work`, et `allow_url_fopen=Off` qui bloque les wrappers réseau. Ces mécanismes complètent les barrières Docker.

### C8 — « Comment la sandbox JavaScript se protège-t-elle ? »
> Node 20 introduit le Permission Model, activé avec `--experimental-permission`. On autorise explicitement la lecture dans `/work` et `/usr` seulement. Les lectures ailleurs (ex : `/etc/passwd`) sont refusées avec un code `ERR_ACCESS_DENIED`. L'écriture est autorisée uniquement dans `/work`. Les tests Jest tournent avec cette protection active.

### C9 — « Qu'est-ce que cap-drop ? »
> `cap-drop=ALL` est un flag Docker qui retire toutes les capabilities Linux au conteneur. Par défaut, un processus root peut avoir des droits spéciaux comme monter des systèmes de fichiers, charger des modules kernel, modifier le réseau. Avec `cap-drop=ALL`, ces droits sont tous retirés. Même si le code candidat devenait root (impossible chez nous puisqu'il tourne sous user 1001), il n'aurait aucun droit système particulier.

### C10 — « Qu'est-ce que readonly-rootfs ? »
> `--read-only` est un flag Docker qui monte le système de fichiers racine du conteneur en lecture seule. Impossible d'écrire sur disque, impossible de créer ou modifier un fichier système. Seule une tmpfs explicite (ex : `/work`) est writable. Même si une attaque réussissait à passer, elle ne pourrait pas laisser de trace persistante.

### C11 — « Qu'est-ce que network-none ? »
> `--network=none` est un flag Docker qui lance le conteneur sans aucune interface réseau. Aucun paquet IP ne peut sortir ou entrer, pas de résolution DNS possible. Même si le code candidat tentait un `curl` vers un serveur externe, il échouerait avec `EAI_AGAIN`.

### C12 — « Comment vous protégez le mot de passe des utilisateurs ? »
> Les mots de passe sont hachés avec BCrypt (facteur de coût 10) avant d'être enregistrés en base. Impossible de récupérer le mot de passe en clair même avec un accès complet à la base. La vérification à la connexion compare un nouveau hash avec le hash stocké.

### C13 — « Quels tests de sécurité vous avez faits à part la sandbox ? »
> Un scan OWASP ZAP contre la préproduction, qui parcourt l'application comme un navigateur et teste les vulnérabilités du Top 10 OWASP. Après plusieurs corrections, le résultat final : aucune alerte de niveau élevé, moyen ou faible. Ça ne veut pas dire absence totale de vulnérabilités, ça veut dire que celles testées par ZAP ne sont pas trouvées.

### C14 — « Vous avez pensé à l'anti-fraude côté candidat ? »
> Oui. Un listener JavaScript dans le navigateur candidat détecte 4 signaux : sortie d'onglet, copier-coller volumineux (plus de 50 caractères), réponse anormalement rapide (plus de 300 caractères en moins de 5 secondes), ouverture des DevTools. Chaque signal est pondéré et agrégé en un score sur 100. Ces signaux n'empêchent pas le candidat de passer son test, ils alimentent un indicateur de risque consulté par le recruteur.

### C15 — « Pourquoi un timeout de 5 secondes et pas plus ? »
> Parce que les exercices de code candidat sont des exercices courts : un palindrome, une somme de tableau, une factorielle. 5 secondes suffisent largement. Un code qui dépasse 5 secondes est soit une boucle infinie, soit une tentative de déni de service. Le timeout wall-clock protège la plateforme sans gêner les cas légitimes.

### C16 — « Pourquoi 256 Mo de RAM et pas plus ? »
> Même logique. Un exercice légitime ne consomme pas plus de quelques dizaines de Mo. 256 Mo laisse de la marge pour Node et Jest qui ont un coût fixe. Un code qui tente d'allouer 512 Mo est soit un bug, soit une attaque. La limite force OOM-kill avant que l'hôte soit affecté.

---

## D. Questions sur l'architecture et la conception

### D1 — « Pourquoi avoir séparé le backend principal et la sandbox ? »
> Pour que l'exécution du code candidat soit isolée du reste. Le backend principal manipule les données métier et doit rester stable. La sandbox exécute du code non maîtrisé, elle doit pouvoir planter sans affecter l'application. Les deux communiquent via API REST interne protégée par un header `X-Internal-Key`.

### D2 — « Expliquez votre pile technique en deux phrases. »
> Côté serveur, Spring Boot 3 en Java 21 pour le backend, PostgreSQL 16 pour la base, et un service sandbox séparé qui pilote Docker. Côté navigateur, React 19 avec TypeScript et Vite 6.

### D3 — « Comment déployez-vous la plateforme ? »
> Pour la préproduction, le frontend est sur Vercel et le backend sur Render. La base est hébergée sur Supabase. Les mails sont envoyés via Resend (HTTPS, pour contourner le blocage SMTP de Render). La perspective principale post-stage est le déploiement sur l'infrastructure interne de Tsarajoro.

### D4 — « Pourquoi Spring Boot plutôt que Django ou Node.js ? »
> Comparaison selon la maturité, les compétences disponibles et le coût. Spring Boot a été retenu pour l'adéquation avec les compétences Java de l'équipe, la robustesse applicative, et un écosystème mature pour l'authentification et JPA. Node.js aurait été équivalent sur la maturité, moins robuste pour les traitements métiers synchrones. Détails en Annexe 11.

### D5 — « Pourquoi PostgreSQL et pas MongoDB ? »
> Besoin relationnel strict : les candidats, les tests, les passations, les réponses ont des relations fortes exprimables en SQL. PostgreSQL supporte aussi JSONB pour les données flexibles comme les options de QCM, donc on garde le relationnel sans sacrifier la flexibilité. MongoDB aurait imposé un schéma plus souple mais moins de garanties sur l'intégrité référentielle.

### D6 — « Pourquoi React et pas Angular ou Vue ? »
> Trois raisons. L'adoption marché, qui facilite le recrutement de développeurs à l'avenir. L'écosystème TypeScript natif. Et la flexibilité de l'approche composants pour un frontend qui évolue.

### D7 — « Comment vous gérez les migrations de base de données ? »
> Avec Flyway. Chaque évolution du schéma est enregistrée dans un fichier SQL versionné (V1, V2, V3...). Au démarrage du backend, Flyway applique les migrations manquantes. SkillForge compte 7 migrations numérotées V1 à V7.

### D8 — « Pourquoi des UUID et pas des ID numériques ? »
> Les UUID sont impossibles à deviner. Un ID numérique séquentiel (1, 2, 3...) permettrait à un candidat de deviner les IDs d'autres passations. Avec un UUID (16 octets aléatoires), c'est computationnellement impossible. En plus, pas de collision entre bases distribuées.

### D9 — « Comment communique le frontend avec le backend ? »
> Via API REST sous HTTPS. Le frontend React envoie des requêtes HTTP (GET, POST, PUT, DELETE) au backend Spring Boot. Les données sont échangées en JSON. L'authentification se fait avec un JWT transporté dans le header `Authorization: Bearer <token>`.

### D10 — « Comment communique le backend avec la sandbox ? »
> API REST interne, mais via un endpoint protégé par un header `X-Internal-Key` qui contient une clé secrète partagée. Le backend envoie le code candidat en JSON à `POST /sandbox/execute`, et la sandbox renvoie le résultat (stdout, stderr, exit code, tests passés). Si le header est absent ou faux, la sandbox renvoie 401.

### D11 — « Et le modèle de données ? »
> 16 tables au total. Les principales sont : users (comptes), candidates (candidats), cvs (fichiers CV), cv_analyses (extraction IA), tests (tests générés), questions (banque), invitations (liens envoyés), passations (sessions), answers (réponses), reports (rapports IA), fraud_events (événements anti-fraude). Les relations suivent le parcours : un candidat a plusieurs CV, chaque CV a une analyse, un test est composé de plusieurs questions, une invitation déclenche une passation, une passation contient plusieurs réponses. Détails en Annexe 1 et Annexe 6.

### D12 — « Vous avez utilisé des bibliothèques open source. Comment vous assurez leur sécurité ? »
> Les dépendances sont déclarées dans `pom.xml` (backend) et `package.json` (frontend). Les versions sont figées. Un scan automatique périodique via Dependabot sur GitHub remonte les vulnérabilités connues. Les corrections sont intégrées rapidement si elles concernent une dépendance utilisée en production.

---

## E. Questions sur la démarche et le projet

### E1 — « Comment vous avez organisé le travail sur 4 mois ? »
> Scrum solo adapté. Un sprint 0 de cadrage de 12 jours, puis 8 sprints de 7 à 13 jours, suivis d'une phase tests et livraison. Au total 90 jours effectifs, soit une vélocité moyenne de 8,9 jours par sprint. Suivi hebdomadaire avec mon encadreur professionnel.

### E2 — « Vous avez eu des écarts par rapport au planning ? »
> Quatre écarts documentés en section 4.3.5. Anti-fraude anticipée du sprint 5 au sprint 4. Harness sandbox étendu de 30 à 50 scénarios. Bascule GitHub Models vers OpenAI quand les conditions ont évolué. Intégration Ollama comme fournisseur local pour la souveraineté.

### E3 — « Difficulté la plus marquante ? »
> L'exécution isolée du code JavaScript. Entre le Permission Model de Node 20, les subtilités de Jest avec Babel, et les flags Docker à combiner, il a fallu plusieurs itérations pour arriver à une configuration qui bloque les attaques tout en laissant le code légitime s'exécuter.

### E4 — « Qu'est-ce qui reste à faire après ce stage ? »
> Quatre perspectives. Court terme : déploiement sur l'infrastructure interne Tsarajoro. Moyen terme : extension à d'autres langages (Go, Rust, C#), jeu de référence annoté pour chiffrer la qualité IA, intégration avec un ATS. Perspectives détaillées en section 9.3.

### E5 — « Vous avez utilisé des outils de gestion de projet ? »
> Oui. GitHub pour le code et les issues, GanttProject pour le diagramme de Gantt prévisionnel, et un fichier texte de suivi local pour les tâches journalières. Tableau des outils complets en Annexe 5.

### E6 — « Vous avez fait des revues de code ? »
> Avec un développeur solo, pas de revue croisée systématique. En revanche, chaque commit passe par la CI GitHub Actions qui exécute les tests JUnit automatiquement. Les prompts et choix d'architecture étaient validés en point hebdo avec l'encadreur professionnel.

### E7 — « Combien de commits sur le projet ? »
> Plusieurs centaines, répartis en commits atomiques suivant la convention Conventional Commits (feat, fix, docs, chore, refactor). L'historique Git retrace l'évolution par domaine fonctionnel.

### E8 — « Qu'est-ce que Scrum apporte à un développeur solo ? »
> La discipline des sprints courts avec objectifs mesurables, même sans équipe. Chaque sprint se termine par une démo informelle à l'encadreur et une rétrospective. Ça force à boucler les fonctionnalités plutôt que de les laisser traîner.

### E9 — « Pourquoi 8 sprints et pas 10 ou 12 ? »
> Le découpage initial a été fait avec l'encadreur en début de stage, selon les grandes fonctionnalités à livrer : cadrage, analyse CV, génération test, passation, correction, dashboard, tests, recette. 8 sprints couvrent le périmètre sans sur-découpage. Le détail est au Tableau 8.

### E10 — « Vous avez eu un budget pour le projet ? »
> Oui, 1 050 000 ariary au total : 1 000 000 de prime projet versés par Tsarajoro à la livraison, et 50 000 pour les API OpenAI pendant les tests. Détail en Tableau 9.

---

## F. Questions sur les tests et les résultats

### F1 — « Vous dites 27 tests JUnit, tous validés. Détaillez. »
> 27 méthodes `@Test` réparties sur 5 classes. 24 tests unitaires qui vérifient le calcul de la corrélation point-bisériale, le score anti-fraude, l'extraction par le client mock, le parseur de résultats sandbox. 2 tests d'intégration qui pilotent un conteneur Docker réel via le harness POC 3, désactivés par défaut dans la CI. 1 jeu paramétré. Tous passent. Détails en Annexe 7.

### F2 — « Et le test de charge k6, racontez. »
> 20 utilisateurs virtuels simultanés pendant 60 secondes, scénario incluant login recruteur, création d'évaluation, génération de questions, exécution de code dans la sandbox. 707 requêtes, 117 itérations, 823 vérifications toutes passées, 0 pour cent d'erreur. Le p95 est à 4,37 secondes, en dessous de la cible de 6 secondes. Tableau 14.

### F3 — « OWASP ZAP, qu'avez-vous testé ? »
> Scan automatique de l'application en préproduction. Parcourt comme un navigateur, teste injections SQL, XSS, mauvaise configuration, exposition de données sensibles, et d'autres catégories du Top 10 OWASP. Après plusieurs corrections, le résultat final : aucune alerte de niveau élevé, moyen ou faible.

### F4 — « Vos tests fonctionnels sont manuels. Pourquoi pas automatisés ? »
> Pour cette v1, tests manuels sur six parcours principaux. Automatiser en Playwright ou Cypress représente un investissement de plusieurs jours que je n'ai pas pu caser dans le stage. C'est un chantier identifié post-stage.

### F5 — « Pourquoi 90 pour cent pour l'Analyse CV dans le Tableau 15 ? »
> Parce que l'extraction est fonctionnelle et validée en préproduction par le recruteur, mais contrairement aux modules déterministes, elle dépend d'un modèle IA dont le comportement n'est pas identique à chaque exécution. Je n'ai pas constitué de jeu de CV annotés pour mesurer scientifiquement la précision. 90 pour cent reflète ma confiance pratique sans prétendre une mesure chiffrée.

### F6 — « Qu'est-ce que la corrélation point-bisériale ? »
> C'est une mesure statistique de la qualité discriminante d'une question. Pour chaque question, on compare le taux de réussite des candidats forts (top 30 pour cent du score global) et des candidats faibles (bottom 30 pour cent). Si les forts réussissent beaucoup plus souvent que les faibles, la question discrimine bien (coefficient proche de +1). Si c'est inversé ou proche de zéro, la question est à revoir.

### F7 — « Comment vous testez la sandbox en continu ? »
> Le harness POC 3 est désactivé dans la CI classique parce qu'il prend plusieurs minutes et nécessite Docker. En revanche, on peut le lancer manuellement avec `mvn test -Dpoc3.run=true` avant chaque release. Les 150 scénarios (100 valides + 50 attaques) sont rejoués et un rapport est produit.

### F8 — « Pourquoi certains tests sont désactivés dans la CI ? »
> Les 2 tests d'intégration de `PocSandboxHarnessTest` démarrent un vrai conteneur Docker, exécutent 150 scénarios et prennent plusieurs minutes. Les inclure dans chaque build CI ralentirait l'intégration continue sans valeur ajoutée au quotidien. Ils sont activables à la demande avec `-Dpoc3.run=true`.

---

## G. Questions juridiques et éthiques

### G1 — « Comment vous respectez le RGPD ? »
> Trois mesures principales. Consentement explicite demandé au candidat avant toute collecte de données. Purge automatique des CV à 12 mois. Possibilité pour le candidat de demander la suppression de ses données via l'encadreur. La question du transfert vers l'IA cloud est traitée par l'alternative Ollama locale. Détails en section 2.3 et bibliographie [13] (RGPD) et [15] (AI Act).

### G2 — « Quel régime juridique s'applique à SkillForge ? »
> Trois textes selon le contexte. Le RGPD pour les candidats UE. La Loi 2014-038 pour les candidats résidant à Madagascar. L'AI Act européen (2024) pour les systèmes d'IA à risque élevé, catégorie dans laquelle rentre l'évaluation de candidats. Les trois sont cités en section 2.3.

### G3 — « Est-ce que l'IA peut discriminer un candidat ? »
> Oui, c'est un risque reconnu. Raghavan et Bogen l'ont documenté. SkillForge limite ce risque de trois manières. Le recruteur valide les compétences détectées. Le recruteur valide les questions avant envoi. La décision finale est 100 pour cent humaine. L'IA est un assistant, pas un décideur.

### G4 — « Comment vous auditez la décision prise sur un candidat ? »
> Toutes les étapes sont tracées en base. Le CV original, les compétences extraites, les questions générées (avec leur statut validation), les réponses du candidat, la synthèse IA, la décision finale du recruteur. En cas de contestation, on peut reconstituer la chaîne de décision.

### G5 — « Qu'est-ce que l'AI Act ? »
> Règlement européen de 2024 qui classifie les systèmes d'IA par niveau de risque. L'évaluation de candidats est classée « risque élevé », ce qui impose transparence, supervision humaine, documentation, et traçabilité. SkillForge respecte ces exigences via la validation humaine à chaque étape et la tracabilité en base.

---

## H. Questions personnelles et conclusion

### H1 — « Qu'est-ce que vous avez appris pendant ce stage ? »
> Trois choses marquantes. La sécurité applicative concrète (seccomp, cap-drop, Permission Model). L'ingénierie de prompts pour la génération de contenu structuré. L'architecture orientée domaines, avec des abstractions comme LlmClient qui permettent de changer de fournisseur sans toucher au code métier.

### H2 — « Si vous recommenciez, que feriez-vous différemment ? »
> Je constituerais un jeu de CV annotés dès le début pour pouvoir chiffrer scientifiquement la qualité de l'IA. Faute de ça, je peux dire que ça marche, mais pas à quel point précisément.

### H3 — « Quelle est votre contribution personnelle au projet ? »
> J'ai conçu l'architecture, développé l'intégralité du backend et du frontend, intégré les six fournisseurs d'IA via LlmClient, écrit le profil seccomp personnalisé, préparé le harness des 50 scénarios d'attaque. L'encadreur m'a aidé sur la définition du besoin, le suivi hebdo des sprints, et la validation des choix métiers.

### H4 — « Est-ce que vous avez atteint les objectifs du stage ? »
> Oui, les cinq objectifs principaux sont atteints. Analyse automatique de CV fonctionnelle. Génération adaptative produit QCM, code et cas pratiques. Passation sécurisée du candidat. Correction automatique avec score et rapport. Sandbox testée avec 0 évasion sur 50 scénarios. Tableau 15.

### H5 — « Qu'est-ce que ce stage vous apporte dans votre parcours M2 MBDS ? »
> Il combine les trois axes de la spécialité : Mobiquité (plateforme web multi-canal), Bases de Données (modèle relationnel + JSONB + migrations Flyway), Intégration de Systèmes (orchestration backend/frontend/sandbox/LLM/mail). C'est un projet transverse qui mobilise l'ensemble des enseignements du M2.

### H6 — « Vos perspectives professionnelles ? »
> Je continue à développer les compétences acquises pendant ce stage : sécurité applicative, intégration IA, architecture distribuée. L'opportunité de prolonger chez Tsarajoro pour accompagner le déploiement production serait une suite naturelle.

---

## I. Questions techniques pointues (si on vous pose)

### I1 — « Pourquoi JWT et pas des sessions côté serveur ? »
> JWT permet un backend stateless : le serveur n'a pas besoin de stocker la session en mémoire ou en base. Le token transporte lui-même l'identité et les droits. Avantage : scalabilité horizontale facile. Inconvénient : révoquer un token avant son expiration nécessite une liste noire. SkillForge accepte ce compromis car la durée de vie des tokens est courte.

### I2 — « Comment vous générez le code à six chiffres ? »
> Six chiffres aléatoires via `SecureRandom` (générateur cryptographique sécurisé, pas `Math.random()` qui est prédictible). Enregistré en base dans la table `invitations`. Vérification côté backend avec limite de tentatives et verrouillage temporaire après plusieurs échecs.

### I3 — « Pourquoi BCrypt pour les mots de passe et pas SHA-256 ? »
> SHA-256 est trop rapide, ce qui facilite les attaques par force brute. BCrypt est volontairement lent (facteur de coût configurable), ce qui ralentit les attaquants. En plus, BCrypt intègre un sel aléatoire par mot de passe, ce qui empêche les attaques par table arc-en-ciel.

### I4 — « Comment Jest sait quels tests exécuter sur le code candidat ? »
> Le recruteur fournit des « tests cachés » en JavaScript au moment où il valide l'exercice. Le backend transmet ces tests au service sandbox avec le code candidat. Le sandbox lance Jest avec un `jest.config.js` qui pointe sur le fichier `hidden.test.js`. Les résultats sont parsés avec une regex, et le score est calculé en pourcentage de tests passés.

### I5 — « Comment vous forcez le JSON strict dans les réponses IA ? »
> Deux leviers. Le prompt système dit explicitement « Réponds UNIQUEMENT en JSON au format suivant » avec un schéma complet. Et pour OpenAI, j'utilise le paramètre `response_format: json_object` qui active le mode « JSON mode » de l'API. Si l'IA renvoie quand même du non-JSON, un parseur côté backend détecte l'erreur et relance la génération.

### I6 — « Pourquoi Flyway et pas Liquibase ? »
> Flyway est plus simple : fichiers SQL purs numérotés V1, V2, V3. Pas de langage descriptif intermédiaire. Pour un projet solo avec un schéma qui évolue modestement, Flyway suffit largement. Liquibase apporte des fonctionnalités avancées (changelog XML, rollback) que je n'ai pas besoin ici.

### I7 — « Vous utilisez des caches ? »
> Pas de cache applicatif complexe pour cette v1. PostgreSQL a son propre cache de requêtes, Hikari gère le pool de connexions, et le navigateur cache les ressources statiques. L'ajout d'un cache Redis pour les sessions ou les réponses LLM fréquentes est un chantier identifié post-stage.

### I8 — « Comment vous gérez les erreurs côté backend ? »
> Un `GlobalExceptionHandler` Spring Boot capture toutes les exceptions non traitées et renvoie une réponse JSON structurée avec un code HTTP approprié (400, 401, 404, 500...). Les logs incluent le stacktrace complet pour le debug, mais la réponse au client ne contient qu'un message générique pour éviter la fuite d'informations.

### I9 — « Et côté frontend ? »
> Un wrapper `axios` capture les erreurs HTTP et affiche un toast (notification) à l'utilisateur. Les erreurs 401 déclenchent une redirection vers le login. Les erreurs 500 affichent un message « Erreur inattendue, réessayez ». Le code d'erreur backend n'est jamais exposé tel quel au candidat.

### I10 — « Pourquoi Monaco Editor pour l'éditeur de code candidat ? »
> C'est l'éditeur embarqué de VSCode, donc une expérience familière pour tout développeur. Il supporte la coloration syntaxique PHP et JavaScript, l'auto-indentation, et le pliage de code. Alternative possible : CodeMirror, un peu plus léger mais moins fourni en features.

### I11 — « Comment vous gérez les uploads de CV volumineux ? »
> Limite backend à 5 Mo par fichier (configurable via Spring Boot). Vérification du type MIME côté backend (pas de confiance dans le header envoyé par le navigateur). Le fichier est stocké en base dans une colonne BYTEA. Une purge planifiée supprime les CV de plus de 12 mois pour conformité RGPD.

### I12 — « Combien de requêtes par seconde la plateforme supporte ? »
> Le test k6 avec 20 utilisateurs virtuels donne un throughput d'environ 12 requêtes par seconde en moyenne. Pour SkillForge où l'usage est 20 à 30 candidats par an, c'est largement suffisant. La charge réelle en production serait bien inférieure.

---

# Partie 3 — Glossaire exhaustif

Tous les termes qui apparaissent dans les slides et le mémoire, classés par thème.

## Sécurité et sandbox

### Seccomp
Mécanisme du noyau Linux qui filtre les appels système autorisés à un processus. Dans SkillForge, un profil JSON personnalisé bloque par défaut tous les appels dangereux (socket, ptrace, mount, etc.) et n'autorise que ceux nécessaires à l'exécution du code candidat. Référence [12].

### Sandbox
Environnement isolé dédié à l'exécution contrôlée du code candidat, construit sur Docker. Combine seccomp, cap-drop, no-network, readonly-rootfs, limite mémoire, timeout, user non privilégié.

### Docker
Technologie de conteneurisation qui lance des applications dans des « conteneurs » isolés, plus légers que des machines virtuelles. Chaque exécution de code candidat se fait dans un conteneur Docker éphémère. Référence [4] et [11].

### Conteneur Docker
Instance isolée d'une image Docker, qui tourne comme un processus sur l'hôte mais avec son propre espace de noms (namespaces) : filesystem, réseau, processus, utilisateurs. Léger (démarre en millisecondes) et éphémère.

### Capabilities Linux
Permissions granulaires du noyau Linux qui remplacent le modèle binaire root/non-root. Exemples : CAP_NET_ADMIN (gestion réseau), CAP_SYS_ADMIN (administration système), CAP_DAC_READ_SEARCH (lecture de tout fichier). SkillForge retire toutes les capabilities avec `--cap-drop=ALL`.

### cap-drop
Flag Docker qui supprime les capabilities Linux au conteneur. `--cap-drop=ALL` les retire toutes.

### network=none
Flag Docker qui lance le conteneur sans aucune interface réseau. Aucun paquet ne peut sortir ni entrer.

### readonly-rootfs
Flag Docker qui monte le filesystem racine en lecture seule. Impossible d'écrire sur disque sauf dans des tmpfs explicites.

### tmpfs
Système de fichiers en RAM, volatile (perdu au redémarrage du conteneur). Utilisé pour `/work` (dossier writable du candidat) et `/tmp` (cache Jest).

### SIGKILL
Signal Unix numéro 9 qui tue un processus sans possibilité d'ignorer. Envoyé par Docker quand le timeout de 5 secondes expire. Exit code associé : 137.

### fork bomb
Attaque qui crée des processus en cascade exponentielle (chaque processus en crée deux, etc.) pour saturer le système. Bloqué dans SkillForge par la limite `--pids-limit=64`.

### Permission Model (Node 20)
Nouvelle fonctionnalité de Node.js 20 (expérimentale) qui restreint les accès au filesystem aux dossiers autorisés via `--allow-fs-read` et `--allow-fs-write`. SkillForge l'active avec `--experimental-permission`.

### open_basedir
Directive PHP qui restreint les fichiers accessibles aux chemins listés. SkillForge configure `open_basedir=/work`.

### disable_functions
Directive PHP qui désactive certaines fonctions dangereuses. SkillForge désactive `shell_exec`, `system`, `exec`, `passthru`, `proc_open`, `popen`, `pcntl_fork`.

### allow_url_fopen
Directive PHP qui autorise les wrappers réseau dans les fonctions comme `file_get_contents()`. SkillForge la désactive avec `allow_url_fopen=Off`.

### seccomp JSON profile
Fichier JSON qui liste les appels système autorisés et interdits pour un processus. SkillForge utilise `skillforge-seccomp.json` dans `infra/sandbox/seccomp/`.

### OWASP
Open Worldwide Application Security Project, fondation à but non lucratif qui publie des référentiels de sécurité web.

### OWASP ZAP
Zed Attack Proxy, outil open source d'OWASP qui scanne une application web pour trouver des vulnérabilités.

### OWASP Top 10
Classement des 10 catégories de risques web les plus critiques, publié par OWASP. Référence [10].

### OWASP ASVS
Application Security Verification Standard, référentiel OWASP qui décrit 300+ exigences de sécurité applicative. Référence [5].

## IA et LLM

### LLM
Large Language Model, modèle d'intelligence artificielle entraîné à produire du texte à partir d'un prompt. Exemples : GPT-4, Claude, Gemini, Qwen.

### LlmClient
Interface Java qui abstrait le fournisseur IA. Toute la logique métier appelle `LlmClient.generateQuestions()` sans savoir quel fournisseur est actif.

### Prompt
Instruction en langage naturel envoyée à un LLM. Un bon prompt est précis, structuré, et impose un format de réponse strict (ex : JSON).

### JSON mode / Structured Output
Fonctionnalité des API LLM qui force la réponse à être un objet JSON valide, selon un schéma optionnel. OpenAI, Groq et Gemini le supportent via le paramètre `response_format: json_object`.

### Hallucination
Phénomène où un LLM invente des informations plausibles mais fausses. SkillForge limite ce risque par un prompt strict et la validation humaine.

### Context window
Nombre maximum de tokens qu'un LLM peut traiter en une seule requête (prompt + réponse). GPT-4o-mini : 128k tokens. Qwen 3 : 131k tokens.

### Token
Unité de base manipulée par un LLM, environ 4 caractères en moyenne. Les coûts d'API sont facturés au nombre de tokens d'entrée et de sortie.

### Temperature
Paramètre d'un LLM qui contrôle l'aléa dans la génération. Température basse (0) = sortie plus déterministe. Température haute (1) = sortie plus créative. SkillForge utilise 0 à 0.3 pour la génération de questions, car on veut de la reproductibilité.

### HELM
Holistic Evaluation of Language Models, framework académique d'évaluation multidimensionnelle des LLM. Référence [16].

### Fine-tuning
Processus d'adaptation d'un LLM généraliste à un domaine spécifique en l'entraînant sur des données ciblées. SkillForge ne fait pas de fine-tuning, il utilise les LLM généralistes avec un prompt engineering soigné.

### RAG (Retrieval-Augmented Generation)
Technique qui enrichit un prompt avec des documents récupérés dynamiquement. SkillForge n'utilise pas de RAG pour cette v1.

## Backend / langages

### Spring Boot
Framework Java open source pour construire des applications web rapidement. Version 3 utilisée dans SkillForge.

### Spring Security
Module Spring pour l'authentification et l'autorisation. Gère JWT, BCrypt, filtres de sécurité HTTP.

### JPA
Java Persistence API, spécification Java pour l'accès aux bases relationnelles. Utilisée via Spring Data JPA.

### Hibernate
Implémentation la plus connue de JPA. Mappe les objets Java (entities) aux tables SQL.

### JUnit 5
Framework Java standard pour écrire des tests automatisés. 27 tests JUnit dans SkillForge.

### AssertJ
Bibliothèque Java d'assertions fluentes utilisée avec JUnit. Syntaxe `assertThat(x).isEqualTo(y)`.

### Mockito
Bibliothèque Java pour créer des mocks (objets simulés) dans les tests unitaires. Pas utilisée massivement dans SkillForge (tests directs sur les services).

### HikariCP
Pool de connexions JDBC haute performance, utilisé par défaut par Spring Boot.

### Maven
Outil de build Java. Gère les dépendances via `pom.xml`.

### JDK 21
Java Development Kit version 21, release LTS d'octobre 2023. Apporte les virtual threads, le pattern matching, etc.

### BCrypt
Algorithme de hachage conçu pour les mots de passe. Lent intentionnellement, intègre un sel aléatoire par mot de passe.

### JWT
JSON Web Token, format de token signé qui transporte l'identité d'un utilisateur. Utilisé pour l'authentification stateless.

### SecureRandom
Classe Java pour générer des nombres aléatoires cryptographiquement sécurisés. Utilisée pour les codes à six chiffres des invitations.

## Base de données

### PostgreSQL
Système de gestion de base de données relationnelle open source. Version 16 dans SkillForge.

### JSONB
Type de colonne PostgreSQL qui stocke du JSON sous forme binaire indexée. Utilisé pour les options de QCM, cas de tests, métadonnées d'événements.

### UUID
Universally Unique Identifier, identifiant unique sur 128 bits. Utilisé comme clé primaire de toutes les tables.

### Clé primaire (PK)
Identifiant unique d'une ligne dans une table.

### Clé étrangère (FK)
Référence d'une table vers la clé primaire d'une autre table. Maintient l'intégrité référentielle.

### ON DELETE CASCADE
Clause SQL qui supprime automatiquement les lignes liées quand on supprime une ligne référencée.

### Flyway
Outil de migrations de base de données. Chaque évolution est un fichier SQL versionné (V1, V2, V3...).

### Migration
Script SQL qui modifie le schéma d'une base (créer une table, ajouter une colonne, etc.).

### Supabase
Service cloud qui héberge PostgreSQL managé. Utilisé pour la préproduction SkillForge.

### Hikari connection-init-sql
Mécanisme Spring Boot pour exécuter du SQL à chaque nouvelle connexion. Utilisé dans SkillForge pour poser le `search_path` sur `skillforge`.

### search_path
Variable PostgreSQL qui liste les schémas où chercher une table. SkillForge pose `search_path=skillforge, public` pour accéder aux tables sans préfixer.

### Schéma SQL
Espace de noms dans une base PostgreSQL. SkillForge met toutes ses tables dans le schéma `skillforge`.

## Frontend

### React
Bibliothèque JavaScript open source développée par Meta pour construire des interfaces utilisateur. Version 19 dans SkillForge.

### TypeScript
Surcouche typée de JavaScript. Permet de détecter les erreurs à la compilation plutôt qu'à l'exécution.

### Vite
Outil de build moderne pour applications web. Plus rapide que Webpack. Version 6 dans SkillForge.

### SPA (Single Page Application)
Application web monopage qui charge le HTML une fois puis navigue via JavaScript sans recharger. React est utilisé pour construire des SPA.

### Monaco Editor
Éditeur de code embarqué, c'est l'éditeur de VSCode. Utilisé dans SkillForge pour l'édition du code candidat.

### Tailwind CSS
Framework CSS utility-first. Permet de styliser via des classes atomiques (`flex`, `p-4`, `text-blue-500`).

### Clipboard API
API JavaScript du navigateur pour accéder au presse-papier. Utilisée pour copier le code d'invitation et détecter les copier-coller.

### DevTools
Outils de développement intégrés au navigateur (F12). Détectés par SkillForge via la différence `window.outerHeight - window.innerHeight`.

## Tests

### Jest
Framework JavaScript équivalent à JUnit, utilisé par la sandbox pour exécuter les tests cachés des exercices JS.

### PHPUnit
Framework PHP équivalent à JUnit, utilisé par la sandbox pour les exercices PHP.

### Babel
Transpileur JavaScript, utilisé par Jest par défaut. SkillForge désactive Babel avec `transform: {}` dans la config Jest pour éviter des problèmes avec le Permission Model.

### k6
Outil de test de charge open source. Simule plusieurs utilisateurs en parallèle avec un script JavaScript.

### p95
95ᵉ percentile. Pour un test de charge, c'est la valeur sous laquelle se situent 95 pour cent des mesures.

### VU (Virtual User)
Utilisateur virtuel dans un test k6. Chaque VU exécute le scénario en parallèle.

### Point-biserial
Coefficient de corrélation statistique utilisé pour évaluer la qualité discriminante d'une question : les candidats forts la réussissent-ils plus souvent que les faibles ?

## Infrastructure et déploiement

### Vercel
Service cloud spécialisé dans l'hébergement de frontends web. Utilisé pour React de SkillForge.

### Render
Service cloud équivalent à Heroku. Héberge le backend Spring Boot de SkillForge.

### Resend
Fournisseur d'envoi de courriels par HTTPS. Utilisé parce que Render bloque les ports SMTP classiques.

### SMTP
Simple Mail Transfer Protocol. Protocole d'envoi d'emails via les ports 25, 465, 587.

### Mailpit
Serveur SMTP de développement qui capture les mails envoyés dans une interface web. Utilisé en dev local SkillForge.

### ngrok
Outil qui expose un service local sur Internet via un tunnel HTTPS. Utilisé pour que Render puisse appeler la sandbox tournant en local.

### Ollama
Serveur local qui exécute des LLM open source (ex : Qwen 2.5, Llama 3). Permet de garder les données sans transfert cloud.

### CI/CD
Continuous Integration / Continuous Deployment. SkillForge utilise GitHub Actions pour la CI (tests automatiques à chaque push).

### GitHub Actions
Service CI/CD intégré à GitHub. Exécute des workflows définis en YAML.

### GanttProject
Logiciel open source de diagramme de Gantt. Utilisé pour le planning prévisionnel du projet.

### DBSchema
Outil de modélisation de bases de données. Utilisé pour produire le modèle physique en Annexe 1.

### Mermaid
Langage de description de diagrammes textuels (séquence, flowchart, ER). Utilisé pour les diagrammes du mémoire.

## Protocoles et APIs

### REST (API REST)
Representational State Transfer, style d'architecture d'API web basé sur HTTP (GET, POST, PUT, DELETE) et JSON.

### HTTP
HyperText Transfer Protocol, protocole d'échange du web.

### HTTPS
HTTP sécurisé via TLS. Toutes les communications SkillForge sont en HTTPS en production.

### JSON
JavaScript Object Notation, format texte structuré pour les échanges de données.

### API endpoint
URL précise d'une API. Exemple : `POST /sandbox/execute`.

### X-Internal-Key
Header HTTP personnalisé utilisé par SkillForge pour authentifier les appels backend → sandbox.

### CORS
Cross-Origin Resource Sharing. Mécanisme navigateur qui restreint les requêtes vers des domaines différents. SkillForge configure CORS pour autoriser le frontend Vercel à appeler le backend Render.

### Rate limiting
Limitation du nombre de requêtes par unité de temps pour un même client. SkillForge limite les tentatives sur le code à six chiffres candidat.

## Méthodologie

### Scrum
Méthode agile de gestion de projet basée sur des sprints courts avec livraisons régulières. SkillForge utilise un Scrum solo adapté.

### Sprint
Dans Scrum, période de travail courte (7 à 13 jours chez SkillForge) avec un objectif précis.

### Backlog
Liste priorisée des fonctionnalités à développer. 15 User Stories dans SkillForge (Tableau 6).

### User Story
Expression d'un besoin fonctionnel du point de vue d'un utilisateur. Format : « En tant que X, je souhaite Y afin de Z ».

### Cas d'utilisation (CU)
Formalisation UML d'une interaction entre un acteur et le système. 14 CU dans SkillForge (Tableau 10).

### Diagramme UML
Unified Modeling Language, notation standard pour décrire la structure et le comportement d'un système.

### Diagramme de cas d'utilisation
Vue globale des interactions acteurs/système. Figure 3.

### Diagramme d'activités
Flux d'actions successives entre acteurs. Figure 4.

### Diagramme d'états
États successifs d'un objet (ici la passation) et transitions. Figure 5.

### Diagramme de séquence
Échanges de messages dans le temps entre acteurs. Figure 21 (boîte noire) et Figure 11 (interne).

### MCD (Modèle Conceptuel de Données)
Vue abstraite des entités métier et de leurs relations, sans détails techniques. Figure 22.

### MPD (Modèle Physique de Données)
Schéma concret des tables SQL avec colonnes et clés. Figure 12.

### Conventional Commits
Convention de nommage des messages de commit Git : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, etc.

### Dependabot
Service GitHub qui surveille les dépendances d'un projet et propose des mises à jour en cas de vulnérabilité connue.

## Juridique

### RGPD
Règlement Général sur la Protection des Données, règlement européen 2016/679. S'applique aux candidats UE. Référence [13].

### AI Act
Règlement européen 2024/1689 sur l'intelligence artificielle. S'applique à SkillForge en tant que système d'IA à risque élevé. Référence [15].

### Loi 2014-038 (Madagascar)
Loi malgache sur la protection des données personnelles. S'applique aux candidats résidant à Madagascar. Référence [14].

### CMIL
Commission Malgache de l'Informatique et des Libertés. Autorité de contrôle du traitement des données personnelles à Madagascar.

### Consentement explicite
Accord libre, spécifique, éclairé et univoque de la personne concernée. Case à cocher dans SkillForge avant toute collecte.

### Données personnelles
Toute information se rapportant à une personne identifiée ou identifiable. CV et résultats d'évaluation sont des données personnelles.

### Purge automatique
Suppression planifiée de données après une durée définie. SkillForge purge les CV à 12 mois.

## Divers

### M2 MBDS
Master 2 Mobiquité, Bases de Données et Intégration de Systèmes, spécialité de l'Université Côte d'Azur en partenariat avec l'ITU Antananarivo.

### MGA
Code ISO 4217 de l'ariary malgache, monnaie de Madagascar.

### POC
Proof Of Concept, prototype rapide pour valider une faisabilité. SkillForge n'utilise plus ce terme dans le mémoire (remplacé par « Sprint 1 - Conception »).

### CV
Curriculum Vitae, document résumant le parcours d'un candidat.

### QCM
Questionnaire à Choix Multiples.

### IHM / UI
Interface Homme-Machine / User Interface. Partie visible et interactive d'une application.

### ATS
Applicant Tracking System, logiciel RH qui gère les candidatures. SkillForge prévoit une intégration ATS en perspective.

---

# Conseils pour les questions pièges

## Si vous ne savez pas répondre
Dites-le honnêtement : *« Je ne sais pas précisément, mais ma piste serait X. Je vérifierai après la soutenance. »* Mieux que d'inventer.

## Si on vous pose une question trop longue
Reformulez : *« Si je comprends bien, vous me demandez X ? »* Laisse du temps à réfléchir, évite de répondre à côté.

## Si on vous conteste un choix
Reconnaissez l'alternative : *« Oui, X aurait été possible. J'ai choisi Y pour trois raisons : A, B, C. Mais X serait pertinent dans un contexte différent. »* Montre que vous avez réfléchi.

## Si on cite un terme que vous ne connaissez pas
Demandez précision : *« Pouvez-vous préciser ce que vous entendez par ce terme dans ce contexte ? »* Laisse le temps de reconnecter avec un vocabulaire que vous maîtrisez.

## Les trois phrases à prononcer nettement au moins une fois
- *« L'IA propose, le recruteur décide. »*
- *« Zéro évasion sur 50 scénarios d'attaque. »*
- *« Le déploiement sur l'infrastructure interne de Tsarajoro est la perspective principale post-stage. »*

## Les trois chiffres à retenir par cœur
- **3 heures** par candidat avant SkillForge
- **27 tests JUnit** tous validés
- **p95 à 4,37 secondes** sur 20 utilisateurs simultanés

## Les trois noms à citer sans faute
- **M. Michel Syska** (président du jury)
- **Dr Tsinjo Tony Rakotoarimalala** (membre du jury)
- **M. Ulrich Ravelomanantiana** (encadreur professionnel Tsarajoro)
