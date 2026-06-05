# Plan d'exécution SkillForge — A à Z

> **Document vivant** — on coche au fur et à mesure : `[ ]` à faire / `[~]` en cours / `[x]` fait / `[!]` bloqué
> Démarrage : 11 mai 2026 — Fin (90 j ouvrables) : 11 septembre 2026

---

## PHASE 0 — Setup environnement et repo (avant Sprint 0)

### 0.1 Vérification de l'environnement local
- [x] Vérifier la version de Java installée → **21.0.10** ✓
- [x] Vérifier la version de Node installée → **20.19.5** ✓
- [x] Vérifier que pnpm est installé → **10.19.0** ✓
- [x] Vérifier la version de Maven → **3.9.13** ✓
- [x] Vérifier que Docker Engine est installé et tourne → **27.3.1** ✓
- [x] Vérifier que Docker Compose est installé → **2.32.1** ✓
- [x] Vérifier que le client psql est installé → **17.6** ✓
- [x] IDE pour Java sur ce poste : **VS Code** (IntelliJ utilisé sur le poste maison)
- [x] Vérifier que VS Code est installé → **1.96.2** ✓

### 0.2 Installation des outils manquants
- [x] Java 21 → déjà présent
- [x] Node 20 + pnpm → déjà présents
- [x] Maven → déjà présent
- [x] Docker Engine → déjà présent
- [x] IntelliJ IDEA → utilisé uniquement sur le poste maison (pas requis ici)
- [x] Installer les extensions VS Code utiles → Extension Pack for Java + Spring Boot Extension Pack + ESLint + Prettier + Tailwind CSS IntelliSense + GitLens + Docker (+ Spring Initializr, Boot Dashboard, Java Debugger, Java Test Runner, Maven, Gradle automatiquement)

### 0.3 Structure du repo (déjà commencé)
- [x] Cloner le repo `skillforge-platform`
- [x] Configurer l'identité Git locale (ainanyfitiagershom)
- [x] Créer la structure mono-repo (apps/, docs/, infra/)
- [x] Créer le `.gitignore` complet
- [x] Créer le `README.md`
- [x] Exclure `docs/01-cahier-des-charges/` du Git
- [x] Copier le cahier des charges et l'estimation en local (non versionnés)

### 0.4 Premier commit (à valider avant)
- [ ] Vérifier `git status` (rien de sensible)
- [ ] Premier commit : structure de base + .gitignore + README
- [ ] Premier push vers `origin/main`

### 0.5 Préparer docker-compose pour les services locaux
- [x] Créer `infra/docker-compose.yml` avec PostgreSQL 16
- [x] Tester `docker compose up -d` → conteneur `skillforge-postgres` healthy sur port **5434** (5432 et 5433 déjà pris)
- [x] Se connecter avec `psql` pour vérifier → PostgreSQL 16.10 OK, CRUD testé
- [x] Documenter la procédure dans le README

---

## PHASE 1 — Cadrage et état de l'art (Sprint 0)
**Estimation : 12 jours ouvrables**

### 1.1 Prise en main (1 j)
- [ ] Familiarisation avec l'environnement de dev complet
- [ ] Lecture du cahier des charges en entier
- [ ] Lecture de la fiche de stage et du plan

### 1.2 Apprentissage Spring Boot 3 + Spring Security (1 j)
- [ ] Tutoriel "Hello World" Spring Boot
- [ ] Comprendre l'architecture (Controller → Service → Repository)
- [ ] Notion de JWT, refresh tokens
- [ ] Spring Security basics

### 1.3 Apprentissage Claude API + prompt engineering (2 j)
- [ ] Créer un compte Anthropic, générer une clé API
- [ ] Premier appel à l'API en Java (avec httpie ou WebClient)
- [ ] Comprendre les schémas JSON structurés en sortie
- [ ] Comprendre le prompt caching (réduction de coût)
- [ ] Tester un mini-prompt d'extraction sur un texte simple

### 1.4 Apprentissage Docker avancé (2 j)
- [ ] Bases Docker (run, build, exec, networks, volumes)
- [ ] Notion de seccomp (profile JSON)
- [ ] Notion de capabilities Linux (cap-drop=ALL)
- [ ] Notion de cgroups (memory, cpu limits)
- [ ] Tester `docker run --network none --read-only` sur un simple "echo"

### 1.5 État de l'art (2 j) — livrable rapport
- [x] Étudier HackerRank (features, prix, démo)
- [x] Étudier Codility
- [x] Étudier TestGorilla
- [x] Étudier CodeSignal
- [x] Étudier Karat
- [x] Rédiger `docs/02-conception/etat-de-lart.md` avec tableau comparatif

### 1.6 Étude de l'existant Tsarajoro (1 j)
- [x] Documenter le process recrutement actuel chez Tsarajoro
- [x] Identifier les pain points chiffrés
- [x] Rédiger `docs/02-conception/etude-existant.md`

### 1.7 Cadrage et choix V1 (1 j)
- [ ] Valider le périmètre V1 avec le tuteur entreprise (réunion à planifier)
- [x] Valider les profils cibles → DEV_PHP, INT_WORDPRESS, DEV_VUE, SEO_TECH
- [x] Lister les compétences du référentiel interne → `docs/02-conception/cadrage-v1.md`

### 1.8 Analyse et conception (2 j)
- [x] Diagramme de cas d'usage UML (recruteur + candidat + admin) (Mermaid)
- [x] Diagramme de classes UML (domaine métier) (Mermaid)
- [x] Diagrammes de séquence pour 3 flux clés (analyse CV, génération test, exécution code) (Mermaid)
- [x] MCD Merise complet (Mermaid ER)
- [x] MLD (tables + colonnes essentielles) — MPD SQL généré au Sprint 1 via Flyway
- [x] Schéma d'architecture (2 services + frontend + BDD) (Mermaid)
- [x] Rédiger `docs/02-conception/conception.md`

---

## PHASE 2 — SPRINT 1 : Socle backend (Sem 3-4)
**Estimation : 7 jours**

- [x] Initialiser le projet `apps/backend-app` (Maven Spring Boot 3.4.2)
- [x] Configurer la connexion PostgreSQL (port 5434)
- [x] Configurer Flyway pour les migrations (V1__init.sql applique avec succes)
- [x] Créer les premiers modèles JPA : User, Role (+ Candidate, Cv, CvAnalysis, Question)
- [x] Première migration Flyway (toutes les tables creees)
- [x] Endpoints REST : POST /auth/register, /auth/login, /auth/refresh (testes a 201/200)
- [x] Implémentation JWT (jjwt 0.12.6) + refresh tokens + Argon2id (avec BouncyCastle)
- [x] Spring Security : gestion des 3 rôles (admin, recruteur, candidat) + @PreAuthorize
- [x] Documentation OpenAPI 3 (springdoc 2.7.0) sur /swagger-ui.html
- [x] Tests unitaires (MockLlmClientTest : 3/3 OK)
- [ ] Premier commit Spring Boot fonctionnel (en attente du signal de Fitia)

---

## PHASE 3 — SPRINT 2 : POC 1 Analyse CV + Banque + RGPD (Sem 5-6)
**Estimation : 13 jours**

### 3.1 Parsing CV (2 j)
- [x] Intégrer Apache PDFBox dans backend-app (`CvParserService`)
- [x] Intégrer Apache POI pour les DOCX (`CvParserService`)
- [x] Tesseract (tess4j) en OCR fallback : dependance ajoutee + detection auto des PDF scannes (branchement reel a faire au besoin)
- [x] Endpoint POST /cv/upload qui retourne le texte extrait + compétences détectées

### 3.2 Prompt d'extraction des compétences (2 j)
- [x] Définir le schéma JSON strict de sortie (`CvExtractionResult`)
- [x] Écrire le prompt d'extraction dans `OpenAiLlmClient`
- [x] Client HTTP vers OpenAI (`OpenAiLlmClient`) + Claude squelette (`ClaudeLlmClient`)
- [x] Parser et valider la réponse JSON (Jackson)

### 3.3 POC 1 (3 j) — livrable rapport
- [x] Protocole + dossier `docs/03-poc/poc-01-analyse-cv.md` redige
- [ ] Collecter 30 CV réels Tsarajoro (a faire avec le tuteur entreprise)
- [ ] Construire un jeu de test avec compétences attendues (vérité terrain)
- [ ] Exécuter le pipeline reel sur OpenAI (en attente de la cle API)
- [ ] Mesurer la précision (cible ≥ 85 %)
- [ ] Mesurer la latence (cible < 15 s par CV)
- [x] Tests unitaires du mock (3/3 OK) prouvent que la chaine fonctionne

### 3.4 Mapping référentiel (1 j)
- [x] Définir le référentiel de compétences interne (`docs/02-conception/cadrage-v1.md` + dictionnaire dans `MockLlmClient`)
- [x] Mapping IA → référentiel via codes stables (`LANG_PHP`, `FW_LARAVEL`, etc.)

### 3.5 Banque de questions (3 j)
- [x] Modèles JPA : Question (+ enums QuestionType, QuestionStatus)
- [x] CRUD endpoints (POST/GET/PUT/DELETE /questions) testes 201/200
- [x] Classification multi-critères (type, difficulté, status, JSON payload)
- [ ] Import / export CSV / JSON (a faire dans une iteration ulterieure)
- [x] Versioning simple (champ `version` auto-incremente a chaque modification)

### 3.6 RGPD (2 j)
- [x] Endpoint admin "droit à l'oubli" (`DELETE /rgpd/candidates/{id}`)
- [x] Job Spring @Scheduled : purge automatique quotidienne a 03:00 (`RgpdService.purgeExpiredCvs`)
- [x] Champ `purge_at` calcule a l'upload (now + 12 mois)
- [ ] UI consentement explicite avant upload CV (a faire au Sprint 3 cote frontend)
- [x] Endpoint manuel `POST /rgpd/purge-expired-cvs` pour declenchement a la demande

---

## PHASE 4 — SPRINT 3 : POC 2 Génération adaptative + UI recruteur (Sem 7-8)
**Estimation : 11 jours**

### 4.1 Prompts de génération (3 j)
- [x] Prompt QCM (avec distracteurs plausibles) dans `OpenAiLlmClient.generateQuestions`
- [x] Prompt exercice de code (avec tests cachés)
- [x] Prompt cas pratique (mini-scénario métier)
- [x] Mock generator (`MockLlmClient.generateQuestions`) qui produit les 3 types
- [x] Squelette Claude (`ClaudeLlmClient.generateQuestions`)

### 4.2 Endpoint de génération (2 j)
- [x] POST /tests/generate (compétences + profil + nb questions par type + difficulté)
- [x] Validation Jakarta (skillCodes notEmpty, difficulty 1-5, count 1-20)
- [x] Stockage des questions en statut `pending_review`
- [x] Tracking tokens consommés + coût (champ `tokensUsed`, `costEur`)
- [ ] Prompt caching (à activer côté Claude quand `ClaudeLlmClient` sera finalisé)

### 4.3 POC 2 (3 j) — livrable rapport
- [x] Protocole rédigé : `docs/03-poc/poc-02-generation.md`
- [ ] Générer 100 questions sur 5 compétences cibles (a faire avec cle OpenAI/Claude)
- [ ] Faire valider par 2-3 développeurs seniors (a planifier avec tuteur)
- [ ] Mesurer le taux d'acceptation (cible ≥ 75 %)
- [ ] Mesurer le coût moyen par question (cible ≤ 0,02 €)

### 4.4 Frontend recruteur (2 j)
- [x] Initialiser `apps/frontend-web` (Vite 6 + React 19 + TS + Tailwind 3 + composants UI custom)
- [x] Client API typé (`src/lib/api.ts`) + gestion JWT en localStorage
- [x] Page login + gestion erreurs
- [x] Layout principal (sidebar avec navigation + bouton logout)
- [x] Route guard `ProtectedRoute` (verifie JWT + role)
- [x] Page "Tableau de bord"
- [x] Page "Nouveau test" : upload CV → skills détectées (cliquables) → génération
- [x] Page "Revoir les questions" : liste filtrée PENDING_REVIEW + accept/reject/edit/delete + modal edition
- [x] Proxy Vite `/api/*` → `http://localhost:8090` teste OK
- [x] Build production OK (`pnpm build` → 305 KB JS, 12 KB CSS)

### 4.5 Lien candidat (1 j)
- [x] Modèle Invitation (UUID + token + expires_at + used)
- [x] Endpoint POST /tests/{id}/invite (génère lien + TTL 24h par défaut)
- [x] Endpoint GET /invitations/{token} **PUBLIC** (whitelist Spring Security)
- [x] Sanitization payload candidat (correctIndex + hiddenTests retirés)
- [x] Gestion statuts : VALID, EXPIRED, ALREADY_USED, UNKNOWN → 410 Gone

---

## PHASE 5 — SPRINT 4 : POC 3 Sandbox + UI candidat (Sem 9-10)
**Estimation : 11 jours**

### 5.1 Images Docker durcies (3 j)
- [x] Image PHP 8.3 minimale avec PHPUnit → `infra/sandbox/php8.3/Dockerfile`
- [x] Image Node 20 minimale avec Jest → `infra/sandbox/node20/Dockerfile`
- [x] Profil seccomp custom → `infra/sandbox/seccomp/skillforge-seccomp.json`
- [x] Configuration cgroups (memory + cpu + pids-limit) → appliquee au runtime par SandboxRunner

### 5.2 Service Sandbox (3 j)
- [x] Initialiser `apps/backend-sandbox` (Spring Boot, port 8091)
- [x] Endpoint `POST /sandbox/execute` avec validation Jakarta + filtre `X-Internal-Key`
- [x] Implementation avec Docker Java API : tous les flags de durcissement (`--network none`, `--read-only`, `--user 1001`, `--cap-drop=ALL`, seccomp, `no-new-privileges`)
- [x] Gestion des timeouts (5 s par defaut) + kill auto + statut `TIMEOUT`
- [x] Capture stdout, stderr (tronques 64 Ko), exit code, duree, `OOMKilled`
- [x] Parsing PHPUnit / Jest pour scoring (tests unitaires inclus)
- [x] Cleanup conteneur + workdir temp en `finally`
- [ ] Tests d'integration avec Testcontainers (a faire en S7 audit complet)

### 5.3 POC 3 (3 j) — livrable rapport
- [x] Doc protocole `docs/03-poc/poc-03-sandbox.md` (100 valides + 30 attaques + criteres)
- [ ] Preparer 100 executions valides (50 PHP + 50 JS) — peut etre genere par GitHub Models
- [ ] Preparer 30 cas d'attaque (fork bomb, reseau, FS, escalade, OOM, timeout)
- [ ] Construire les images Docker localement (`docker build`)
- [ ] Executer et mesurer (latence < 2 s, 0 evasion)
- [ ] Validation par M. Tsinjo (Cybersecurite)

### 5.4 Frontend candidat (2 j)
- [x] Entites JPA `Passation`, `Answer` + repositories
- [x] `SandboxApiClient` cote backend-app + `CandidatePassationService`
- [x] Endpoints publics `/candidate/passations/*` (whitelist Spring Security)
- [x] Route `/candidate/passation/:token` : welcome + saisie email/nom
- [x] Page de passation : QCM (radio), CODE (Monaco), CAS_PRATIQUE (textarea)
- [x] Composant `CodeEditor` Monaco (theme sync light/dark, PHP + JS)
- [x] Bouton "Executer" → POST `/candidate/.../run-code` → backend-app → backend-sandbox
- [x] Affichage stdout/stderr/score apres execution
- [x] Sauvegarde automatique (debouncee 1 s textarea, immediate QCM)
- [x] Chronometre global (mm:ss) + barre de progression
- [x] Page de fin (`CandidateDonePage`) avec score indicatif

---

## PHASE 6 — SPRINT 5 : Notation auto + Compte rendu IA + Anti-fraude (Sem 11-12)
**Estimation : 9 jours**

### 6.1 Auto-grading code (2 j)
- [ ] Wrapper PHPUnit (récupère taux de tests passés)
- [ ] Wrapper Jest pour JavaScript
- [ ] Service de scoring gradué

### 6.2 Notation QCM et cas pratiques (2 j)
- [ ] Notation auto des QCM
- [ ] Évaluation des cas pratiques par IA (Claude juge la réponse)
- [ ] Calcul du score global pondéré

### 6.3 Compte rendu IA (2 j)
- [ ] Prompt de synthèse (forces, faiblesses, recommandation)
- [ ] Endpoint POST /passations/{id}/generate-report
- [ ] Export PDF côté frontend (jsPDF)

### 6.4 Détection navigateur anti-fraude (2 j)
- [ ] Page Visibility API (changement d'onglet)
- [ ] Détection perte de focus
- [ ] Détection copier-coller suspect
- [ ] Calcul score de risque agrégé (0 à 100)
- [ ] Modèle FraudEvent en BDD
- [ ] Endpoint POST /passations/{id}/fraud-event
- [ ] Vue rapport anti-fraude pour le recruteur

---

## PHASE 7 — SPRINT 6 : POC 4 Statistiques + Boucle + Dashboard (Sem 13-14)
**Estimation : 9 jours**

### 7.1 Calculs statistiques (3 j)
- [ ] Implémenter le calcul du pouvoir discriminant (corrélation point-bisériale)
- [ ] Implémenter le calcul de l'indice de difficulté
- [ ] Calcul de la distribution des scores

### 7.2 Boucle d'amélioration continue (2 j)
- [ ] Marquage automatique des questions discriminantes
- [ ] Marquage automatique des questions inefficaces
- [ ] Priorisation des bonnes questions dans la génération IA suivante

### 7.3 POC 4 (2 j) — livrable rapport
- [ ] Générer 50 passations synthétiques
- [ ] Valider les calculs contre une implémentation Python/scipy
- [ ] Documenter l'interprétation des résultats
- [ ] Rédiger `docs/03-poc/poc-04-stats.md`

### 7.4 Tableau de bord analytique (2 j)
- [ ] Vue dashboard recruteur (candidats + scores + recommandations)
- [ ] Top des questions discriminantes (Recharts)
- [ ] Distribution des scores par compétence
- [ ] Export CSV

---

## PHASE 8 — SPRINT 7 : Tests sécurité, charge, durcissement (Sem 15-16)
**Estimation : 6 jours**

- [ ] Audit OWASP Top 10 avec OWASP ZAP
- [ ] Corrections des vulnérabilités détectées
- [ ] Rejeu des 30 cas d'attaque sandbox
- [ ] Tests de charge avec k6 (20 candidats simultanés)
- [ ] Optimisations selon les résultats de charge
- [ ] Mesure des latences API (cible 95e percentile < 500 ms)

---

## PHASE 9 — SPRINT 8 : Recette + Documentation + Production (Sem 17-18)
**Estimation : 7 jours**

### 9.1 Recette (2 j)
- [ ] Recette fonctionnelle avec les recruteurs
- [ ] Simulation candidat avec un développeur interne
- [ ] Corrections post-recette

### 9.2 Documentation (2 j)
- [ ] Guide utilisateur recruteur (création de test, validation, résultats)
- [ ] Guide utilisateur candidat (passation, conditions, RGPD)
- [ ] Documentation technique (architecture, déploiement, exploitation)

### 9.3 Mise en production (3 j)
- [ ] Pipeline GitHub Actions complet (build + tests + image Docker)
- [ ] Configuration de l'environnement de production Tsarajoro
- [ ] Déploiement initial
- [ ] Test final en production
- [ ] Formation rapide des recruteurs (1 h)

---

## PHASE 10 — Tests d'intégration cycle complet
**Estimation : 4 jours**

- [ ] Tests d'intégration : analyse CV → génération test → passation → notation → compte rendu
- [ ] Tests Testcontainers (PostgreSQL + Docker éphémères)
- [ ] Couverture ≥ 80 % du code métier (JaCoCo)

---

## PHASE 11 — Déploiement final
**Estimation : 3 jours**

- [ ] Déploiement final sur l'infra production Tsarajoro
- [ ] Stabilisation
- [ ] Monitoring (Prometheus / logs)

---

## PHASE 12 — Post-stage : Rapport + Soutenance
**Hors 90 jours — Septembre / Octobre 2026**

### 12.1 Rapport de stage (40 pages max)
- [ ] Page de garde, résumé, abstract, tables (figures, acronymes)
- [ ] Introduction
- [ ] Présentation du stage (entreprise, sujet)
- [ ] État de l'art
- [ ] Étude de l'existant et solution envisagée
- [ ] Démarche projet (Scrum, risques, planning, budget)
- [ ] Exigences réalisées (UML, IHM)
- [ ] Architecture système
- [ ] Conception logiciel
- [ ] Tests
- [ ] Conclusion (bilan, problèmes, perspectives)
- [ ] Bibliographie
- [ ] Annexes
- [ ] Numérotation x/N, plan généré automatiquement
- [ ] Relecture tuteur entreprise (1 semaine avant rendu)
- [ ] Relecture tuteur école (1 semaine avant rendu)
- [ ] Corrections
- [ ] Rendu final

### 12.2 Soutenance (≤ 20 slides, 20 min)
- [ ] Plan des slides (page de garde → questions)
- [ ] Préparation des démos en vidéo (backup au cas où le live échoue)
- [ ] Répétition 2 fois minimum
- [ ] Anticiper les questions du jury

---

## Suivi de progression

### Vélocité par sprint
| Sprint | Engagé (j) | Réalisé (j) | Vélocité | Notes |
|---|---|---|---|---|
| S0 | 12 | | | Cadrage + état de l'art |
| S1 | 7 | | | Socle backend |
| S2 | 13 | | | POC 1 + Banque + RGPD |
| S3 | 11 | | | POC 2 + UI recruteur |
| S4 | 11 | | | POC 3 + UI candidat |
| S5 | 9 | | | Auto-grading + Compte rendu + Anti-fraude |
| S6 | 9 | | | POC 4 + Stats + Dashboard |
| S7 | 6 | | | Tests sécu + charge |
| S8 | 7 | | | Recette + Doc + Prod |

### Risques actifs
| # | Risque | Statut | Action |
|---|---|---|---|
| R1 | Sandbox non sécurisée | À traiter Sprint 4 | POC validé avant dev |
| R2 | IA qualité insuffisante | À traiter Sprint 3 | Validation par devs seniors |
| R3 | Analyse CV imprécise | À traiter Sprint 2 | Tests sur 30 CV |
| R4 | Validation tuteur tardive | À traiter dès S0 | Reviews bi-mensuelles |
| R5 | Coûts API élevés | À traiter Sprint 3 | Prompt caching + quotas |
| R6 | RGPD insuffisant | À traiter Sprint 2 | Consentement + purge |
| R7 | Hétérogénéité CV | À traiter Sprint 2 | OCR + saisie manuelle |

---

