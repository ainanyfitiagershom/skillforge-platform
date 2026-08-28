# Diagnostic Mémoire M2 MBDS — SkillForge

**Basé sur :** plan-type MBDS 2025, remarques Gabriel Mopolo, consignes citation sources APA, consignes soutenance orale, présentation M2 MBDS, ta version en cours (`MEMOIRE-itu-MBDS-v1.docx`), exemple ANDRIANAIVOSOA (56 p.).

---

## 1. État actuel — Diagnostic honnête

### ✅ Ce qui est bon
- **Structure du plan est en place** : ton doc a bien les 10 chapitres du plan-type MBDS 2025. Aucun chapitre manquant.
- **Page de garde correcte** : logos UNS + MBDS + Tsarajoro + ITU présents, titre précis, jury nommé, mention de spécialité MBDS bonne, année 2026 OK.
- **Pagination et numérotation** semblent en place (i, ii, iii puis 1, 2, 3…).
- **Sections Résumé, Abstract, Table des matières, Liste des tableaux, Liste des figures, Glossaire** : toutes présentes en position correcte.

### ❌ Ce qui manque (c'est-à-dire quasiment tout le contenu)
Ta version est un **squelette vide** : tous les paragraphes visibles sont **le texte de consigne du plan-type recopié**. Aucun paragraphe n'est encore écrit avec ton contenu SkillForge. Concrètement :

- Résumé : **vide**
- Abstract : **vide**
- Glossaire : encore les mots d'exemple (Astéroïde, Atmosphère…) — rien de SkillForge
- Introduction : encore les puces de consigne
- Chapitre 1 Présentation stage : vide
- Chapitre 2 État de l'art : vide (juste "NE PAS CONFONDRE…")
- Chapitre 3 Étude de l'existant : vide
- Chapitre 4 Démarche projet : vide (tableau de risque encore l'exemple)
- Chapitre 5 Exigences réalisées : vide
- Chapitre 6 Architecture système : vide (figure Chrome/Firefox encore l'exemple)
- Chapitre 7 Conception : vide
- Chapitre 8 Tests : vide (2 lignes seulement)
- Chapitre 9 Conclusion : vide
- Chapitre 10 Bibliographie : encore les templates `Auteur1, auteur 2…`
- Chapitre 11 Annexes : encore la liste-type

**Verdict : 25 pages produites, ~2 pages seulement vraiment ancrées sur SkillForge (page de garde + titre). Il te reste 100 % du contenu à écrire.**

### 🎁 Bonne nouvelle
Tu as **beaucoup de matière déjà produite** dans le repo qui est directement transposable :
- `docs/01-cahier-des-charges/CAHIER_DES_CHARGES_FITIA_M2_MBDS.pdf` → Ch. 1.2, 3.3, 5
- `docs/03-poc/poc3-sandbox/RAPPORT_POC3.md` → Ch. 8 (Tests) — 150 cas, 0 évasion, chiffres solides
- `docs/03-poc/poc-owasp-zap/RAPPORT_ZAP.md` → Ch. 8 — 0 vulnérabilité OWASP Top 10
- `docs/04-tests/fiche-tests-manuels.md` → Ch. 8 — plan de tests
- `docs/GUIDE_OLLAMA.md` → argument souveraineté données Ch. 6
- Git log complet → Ch. 4.3 (Démarche projet mise en œuvre), planning réel
- Migrations Flyway V1→V7 → Ch. 7.2.3 (Modélisation données)
- Fichier `MEMORY.md` de conversations → chronologie personnelle du stage

---

## 2. Consignes clés à ne pas rater (Gabriel + Plan-type)

### Règles fermes de Gabriel
1. **40 pages max hors annexes** — les longs cahiers des charges, dossiers de conception vont en annexe.
2. **Titre précis** ← ✅ le tien est bon ("Conception et développement d'une plateforme nouvelle génération…").
3. **Numérotation obligatoire 1., 1.1, 1.1.1** — jamais A), a), 1) — ← ✅ ton doc respecte.
4. **Pagination x/n** (1/40, 2/40, etc.) — ← ⚠️ ton doc a juste "1, 2, 3…", à passer en "X/N".
5. **Introduction 1 page maximum**, se termine par un plan chapitre-par-chapitre en 1 ligne.
6. **NE PAS confondre État de l'art (concurrence) et Étude de l'existant (solution avant)** — le CDC en parle bien (HackerRank, Codility, TestGorilla, CodeSignal, Karat sont ton état de l'art).
7. **Tous les acronymes** dans un tableau **ordre alphabétique** (JWT, LLM, OCR, POC, RGPD, SPA, SQL, TLS, UML, XSS…).
8. **Bibliographie** : jamais uniquement des URL — au minimum livres, articles, docs officiels avec auteur+année.
9. **Risques** : format tableau avec `libellé | priorité | facteur contribuant | solution | statut`. Un risque = ne pas atteindre un objectif du projet (pas "être malade").
10. **Ne rapporter que sur ce que TU as fait**. Tu es seul dev — c'est simple, mais bien préciser "j'ai conçu, j'ai développé, j'ai mesuré".

### Règles fermes du Plan-type MBDS 2025
- **Résumé français ½ page** avec 6 éléments : but/nature, envergure, méthodes, résultats principaux, conclusions, mots-clés.
- **Abstract anglais** en miroir du résumé.
- **Conclusion** doit couvrir 4 parties : bilan résultats entreprise, bilan problèmes/solutions, perspectives, bilan personnel.

### Règles APA (citer ses sources)
- **Paragraphe** : `(Auteur, année, p. X)` pour citation, sans page pour paraphrase.
- **Figure** : numéro + titre + source **SOUS** la figure.
- **Tableau** : numéro + titre **AU-DESSUS**, source **EN DESSOUS** (inverse de figure).
- **Bibliographie** : ordre alphabétique, retrait suspendu, style APA cohérent partout.

---

## 3. Plan d'action — Ce que tu dois écrire, chapitre par chapitre

Voici ce qu'il faut mettre dans **chaque section** de ta version. Je te donne les points à couvrir + les sources internes SkillForge à réutiliser. Estime ~1 h par section en moyenne (certaines 30 min, d'autres 2 h).

### Résumé (½ page, 6 éléments)
- **But/nature** : Concevoir et développer une plateforme d'évaluation technique automatisée du recrutement chez Tsarajoro, entièrement assistée par IA, de l'analyse CV à la recommandation finale.
- **Envergure** : Full-stack (Spring Boot 3, React 19, Postgres 16, Docker), architecture 2 services (backend-app + backend-sandbox durci), 4 POC validés.
- **Méthodes** : Scrum sur 8 sprints de 2 semaines, multi-fournisseurs LLM (Groq, Claude, Ollama), sandbox Docker hardening (seccomp, cap-drop, no-network), audit sécurité OWASP ZAP.
- **Résultats principaux** : 150 cas de test sandbox — 0 évasion (POC 3), audit OWASP — 0 vulnérabilité, analyse CV avec niveaux JUNIOR/CONFIRME/SENIOR, statistiques discriminantes calibrées contre scipy (POC 4).
- **Conclusions** : plateforme opérationnelle en interne Tsarajoro, réduit correction manuelle >60 %, boucle amélioration continue.
- **Mots-clés** : recrutement technique, IA générative, sandbox Docker sécurisée, statistiques psychométriques, RGPD.

### Abstract (miroir anglais)
Traduction du résumé, même 6 éléments.

### Glossaire (à REFAIRE de A à Z)
Retirer Astéroïde/Atmosphère/Densité (les exemples du template). Mettre ce qui est réellement utilisé dans SkillForge :
- **Argon2id** : algorithme de hachage mot de passe recommandé OWASP 2025.
- **CAS_PRATIQUE** : type de question avec scénario + points attendus, notée par LLM.
- **JWT** : jeton d'authentification signé, standard RFC 7519.
- **LLM** : Large Language Model (Claude, GPT, Llama…).
- **Ollama** : runtime local pour LLM open-source.
- **OpenAPI** : standard de description d'API HTTP.
- **OWASP Top 10** : classement des 10 risques de sécurité web majeurs.
- **PHPUnit** : framework de tests unitaires PHP.
- **POC** : Proof of Concept, prototype de faisabilité.
- **QCM** : Question à Choix Multiples.
- **RGPD** : Règlement Général sur la Protection des Données.
- **Sandbox** : environnement d'exécution isolé et durci.
- **Seccomp** : mécanisme Linux de filtrage des appels système.
- **SPA** : Single-Page Application.
- **SSE** : Server-Sent Events.
- **TLS** : Transport Layer Security.
- Etc.

Ordre alphabétique obligatoire.

### Introduction (1 page max)
Structure demandée par Gabriel :
1. **Accroche** — chiffre marquant. Ex : *"Chez Tsarajoro, chaque recrutement technique mobilise 30 à 60 minutes de correction manuelle par candidat, multipliées par la dizaine de candidats évalués par poste."*
2. **Plan de carrière rapide** : MBDS, spécialisation IA/back-end/sécurité.
3. **Pourquoi ce stage/entreprise** : Linkuma/Tsarajoro, écosystème Malagasy dev, sujet aligné avec compétences M2.
4. **Objectifs vis-à-vis stage** : ce que tu voulais apprendre.
5. **Présentation ultra-rapide de Tsarajoro** : 1-2 phrases.
6. **Missions du stage** : concevoir, développer, valider, livrer la plateforme.
7. **Problématique** : *"Comment automatiser à la fois l'évaluation technique et la sécurité d'un test candidat sans dépendre d'un service externe payant, tout en garantissant l'intégrité des données conformément au RGPD ?"*
8. **Plan** : "Au chapitre 1 vous trouverez la présentation du stage, au chapitre 2 l'état de l'art des plateformes existantes, au chapitre 3 l'étude de l'existant chez Tsarajoro, au chapitre 4 la démarche projet Scrum, au chapitre 5 les exigences réalisées, au chapitre 6 l'architecture système, au chapitre 7 la conception, au chapitre 8 les tests et validations, puis la conclusion."

### 1. Présentation du stage

#### 1.1 Présentation de l'entreprise Tsarajoro
- Brève histoire de Tsarajoro (fondation, effectif, secteur).
- Positionnement : conseil / prestation dev / IoT ? À préciser.
- Clients types, technologies dominantes.
- Ton rôle en interne (stagiaire M2, encadré par RAVELOMANANTIANA Tahirintsoa Ulrich).

#### 1.2 Présentation du sujet et objectifs
- **Justification innovante** (Plan-type § 2.2 le demande) : d'où vient le besoin, qu'est-ce qui rend le sujet innovant.
- Récupère du CDC page 2 le contexte : correction manuelle chronophage, plateformes du marché hébergées à l'étranger (RGPD), pas adaptées à leurs profils métier internes (Dev PHP, WordPress, Vue.js, SEO).
- **Objectif général** : la plateforme SkillForge.
- **Objectifs mesurables** (repris du CDC page 3) :
  - Centraliser 100 % des évaluations techniques
  - Réduire ≥ 60 % le temps de correction dev
  - Diviser par 3 le délai candidature → décision
  - Précision analyse CV ≥ 85 %
  - Taux acceptation questions IA ≥ 75 %
- **Enjeux et risques principaux**.

### 2. État de l'art sur le sujet traité (⚠️ zone à muscler)

C'est là que le CDC est **incomplet**. Le plan-type demande une vraie étude comparative avec critères. Ce que Gabriel appelle "état de l'art = étude concurrence".

Le CDC nomme HackerRank, Codility, TestGorilla, CodeSignal, Karat mais **sans les analyser**. À toi de faire :

#### 2.1 Critères de comparaison
Table des critères que tu vas appliquer à chaque plateforme. Exemples :
- Analyse CV automatique (oui/non, techno)
- Génération de questions par IA (oui/non)
- Sandbox exécution code (langages supportés, sécurité)
- Anti-fraude (proctoring, comportemental)
- Statistiques discriminantes / analyse psychométrique
- Personnalisation profils métier
- Hébergement (France, USA, on-premise…) → **critère RGPD**
- Modèle tarifaire (par candidat / abonnement)
- Support langages (spécifiquement PHP, WordPress ?)

#### 2.2 Étude de chaque solution
Une sous-section par plateforme (HackerRank, Codility, TestGorilla, CodeSignal, Karat) : 5-10 lignes de description factuelle, en indiquant la source (site officiel, article G2, TrustRadius).

#### 2.3 Tableau comparatif
Un vrai tableau 5 colonnes (5 plateformes) × ~10 lignes (critères), avec **ta plateforme SkillForge en dernière colonne**. Ça se voit tout de suite si elle apporte du neuf.

**⚠️ Gabriel insiste** : NE PAS confondre avec l'étude de l'existant. Ici c'est la concurrence externe.

### 3. Étude de l'existant et solution envisagée

#### 3.1 Étude de l'existant
Qu'est-ce que Tsarajoro faisait **avant** SkillForge pour recruter :
- **Description externe (vision utilisateur)** : entretiens tête-à-tête + tests techniques en local ou en ligne, correction manuelle par dev seniors, feuilles de score Excel.
- **Description interne (vision dev/conception)** : pas de plateforme dédiée, dépendance à des templates Word/PDF, pas de base analytique.

#### 3.2 Critique de l'existant
Positive : simple à mettre en place, contrôle total. Négative : chronophage (30-60 min/candidat), pas standardisé, pas de traçabilité, pas de score discriminant, coûts cachés (temps dev senior).

#### 3.3 Solutions envisagées
Options que tu as considérées avant de retenir SkillForge :
- Acheter licence HackerRank / TestGorilla → écarté (coût, hébergement étranger, non adapté aux profils WordPress/SEO)
- Développer un simple gestionnaire d'exercices maison → écarté (pas d'IA, pas de valeur ajoutée POC)
- **Retenu : SkillForge**, plateforme interne complète avec IA multi-fournisseur, sandbox durcie, analytics.

#### 3.4 Objectifs principaux et livrables
- Reprendre les objectifs mesurables (§ 1.2)
- Livrables : cahier des charges (annexe 1), plateforme (repo Git), 4 rapports POC, docs de tests, mémoire.

### 4. Démarche projet

#### 4.1 Principes de la démarche projet

##### 4.1.1 Activités d'ingénierie logicielle
Exigences (cahier des charges) → conception (UML, MCD) → codage (Java + TypeScript) → tests unitaires (JUnit, Vitest) → tests d'intégration (Testcontainers) → tests sécurité (OWASP ZAP, harness POC 3) → tests charge (k6, prévu Sprint 7). Toutes les activités sauf k6 ont été réalisées **par toi seul**.

##### 4.1.2 Méthode de gestion de projet
**Scrum**, 8 sprints de 2 semaines. Backlog produit dans le CDC. Sprint planning en début de sprint, sprint review async (démo au tuteur Linkuma). Pas de daily standup formel (équipe = 1 personne + tuteur).

Ton rôle : **Product Owner + Développeur + Tech Lead** (contexte stage solo).

##### 4.1.3 Rôles et responsabilités
- **Client** : Tsarajoro
- **Encadreur pro** : Tahirintsoa Ulrich RAVELOMANANTIANA (validation Sprint reviews, priorisation)
- **Encadreur école** : (à préciser)
- **Toi** : conception, dev, tests, documentation

##### 4.1.4 Outils
IntelliJ IDEA + VS Code, Git (compte perso `ainanyfitiagershom`), GitHub, Maven, pnpm, Vite, Docker Desktop, Postman, Swagger UI, Mermaid pour diagrammes. Préciser ton rôle : tu as choisi ces outils toi-même.

##### 4.1.5 Gestion de la configuration
Repo Git `skillforge-platform` avec structure :
- `apps/backend-app/` — Spring Boot API principale
- `apps/backend-sandbox/` — service sandbox isolé
- `apps/frontend-web/` — React SPA
- `docs/01-cahier-des-charges/` — CDC
- `docs/02-conception/` — MCD, diagrammes
- `docs/03-poc/` — 4 rapports POC
- `docs/04-tests/` — plans et fiches de tests
- `infra/` — docker-compose, seccomp

Règles de nommage : Java classes PascalCase, packages `com.tsarajoro.skillforge.*`, tables snake_case, migrations Flyway `V{n}__{description}.sql`.

Sauvegardes : commits Git compte perso, ~40 commits environ (à vérifier `git log --oneline | wc -l`).

#### 4.2 Contraintes et risques
Tableau au format Gabriel :

| N° | Risque | Priorité | Facteur contribuant | Solution proposée | Statut |
|---|---|---|---|---|---|
| R1 | Sandbox Docker non sécurisée | Critique | Peu d'expérience seccomp | POC 3 dédié (150 cas d'attaque) | ✅ Réalisé, 0 évasion |
| R2 | Génération IA questions non fiable | Moyen | Bug JSON tronqué Groq | Auto-repair JSON + prompt compact + LLM alternatif Ollama | ✅ Résolu |
| R3 | Précision analyse CV insuffisante | Moyen | Formats hétérogènes | OCR Tesseract fallback pour PDF scannés | ✅ En place |
| R4 | GitHub Models retiré fin 2026 | Élevé | Décision GitHub | Bascule sur Groq + Ollama (multi-fournisseur) | ✅ Résolu |
| R5 | Retard validation tuteur | Critique (Gabriel R4) | Emploi du temps Ulrich | Reviews bi-mensuelles planifiées | 🔄 En cours |
| R6 | Fuite de code candidat vers API externe (RGPD) | Élevé | Dépendance LLM SaaS | Support Ollama local (souverain) | ✅ Résolu |
| R7 | Coûts API LLM trop élevés | Faible | Volume passations | Prompt caching Claude, mock mode, provider gratuit Groq | ✅ Contrôlé |

#### 4.3 Démarche projet mise en œuvre
Récap des 8 sprints (repris du CDC page 12 avec **statut réel**) :
| Sprint | Contenu | Statut | Vélocité |
|---|---|---|---|
| S0 | Cadrage, état de l'art, existant | 100 % | — |
| S1 | Conception (UML, MCD, archi), MVP backend | 100 % | X SP |
| S2 | POC 1 Analyse CV + banque questions + RGPD | 100 % | X SP |
| S3 | POC 2 Génération adaptative + UI recruteur | 100 % | X SP |
| S4 | POC 3 Sandbox sécurisée + UI candidat | 100 % | X SP |
| S5 | Auto-grading code + compte-rendu IA + anti-fraude | 100 % | X SP |
| S6 | POC 4 Statistiques + boucle amélioration + dashboard | 100 % | X SP |
| S7 | Tests sécurité (ZAP, POC 3 renforcé), charge (k6) | En cours | X SP |
| S8 | Recette, documentation, mise en production | Planifié | — |

Mettre un diagramme de Gantt (macro) en une page.

#### 4.4 Planification (à toi de préciser)
Diagramme de Gantt macro (une image) avec les 8 sprints + tes tâches personnelles. **Comparaison planning initial vs planning réalisé** (Gabriel insiste sur les écarts).

#### 4.5 Budget du projet
Uniquement les coûts liés à toi (Gabriel :"les entreprises ne veulent pas donner les coûts complets") :
- Ton salaire stagiaire × 4 mois
- Machine dev (portable perso ou fourni)
- Licences (rien, tout open source)
- **APIs LLM** : ~5 € en tests OpenAI/Claude au total, 0 € Groq/Ollama
- Docker Desktop (gratuit en usage personnel)
- **Total ~X k€**

### 5. Exigences réalisées (vision utilisateur)

Cahier des charges complet en annexe. Ici tu retiens **3-4 use cases représentatifs** (Gabriel : "si tu as 20 use cases, décris 3 ou 4 dans le rapport, reste en annexe").

Utilise plutôt des **User Stories Scrum** (autorisé par Gabriel), format :
> "En tant que **[rôle]**, je veux **[action]** afin de **[bénéfice]**."

#### 5.1 Cas d'utilisation (User Stories principales)

##### 5.1.1 US-01 : Analyse automatique du CV candidat
- **En tant que** recruteur, **je veux** téléverser le CV du candidat en PDF ou DOCX **afin de** obtenir automatiquement la liste des compétences déclarées avec leur niveau estimé.
- Préconditions : recruteur connecté, CV taille < 10 Mo, format supporté.
- Postconditions : entité `cv_analyses` en base avec compétences + niveaux + provider LLM utilisé.
- Erreurs : format non supporté (415), CV illisible (fallback OCR Tesseract), LLM indisponible (400 + retry manuel).
- **Diagramme de séquence** UML (niveau système, boîte noire) : recruteur → frontend → API `/cv/upload` → PDFBox/POI/Tesseract → LLM → base.
- Capture d'écran : page "Nouveau test" avec badge provider + compétences détectées.

##### 5.1.2 US-02 : Génération adaptative du test technique
##### 5.1.3 US-03 : Passation candidat sécurisée (avec code d'accès UX-01)
##### 5.1.4 US-04 : Notation automatique et compte-rendu IA

(Les autres user stories → annexe complète)

#### 5.2 Exigences non fonctionnelles

| Catégorie | Exigence | Métrique |
|---|---|---|
| Utilisabilité | Interface responsive light/dark, palette cohérente | Testé Chrome/Firefox mobile + desktop |
| Performance | Analyse CV | < 15 s (CDC), mesuré ~5-10 s avec Groq |
| Performance | Génération test | < 30 s (CDC), mesuré ~10-20 s |
| Performance | Exécution sandbox | < 5 s timeout, médiane mesurée 330 ms (POC 3) |
| Robustesse | Disponibilité | ≥ 99 % (CDC) |
| Capacité | Candidats simultanés | 20 (CDC), à mesurer avec k6 en Sprint 7 |
| Sécurité | OWASP Top 10 audit | 0 vulnérabilité High/Medium/Low (mesuré ZAP) |
| Sécurité | Sandbox 0 évasion | 50 cas d'attaque, 0 réussie (POC 3) |
| Sécurité | Auth | JWT + Argon2id, TLS 1.3 en prod |
| RGPD | Consentement explicite | Checkbox candidat avant démarrage |
| RGPD | Purge CV | Automatique après 12 mois |

#### 5.3 Interfaces détaillées

##### 5.3.1 IHM (captures d'écran commentées)
3-5 écrans clés, chaque écran + description :
1. Landing page recruteur
2. `/app/new-test` — upload CV et génération
3. `/app/review` — validation questions (inbox intelligent)
4. Page candidat welcome (identité verrouillée + code d'accès UX-01)
5. Page candidat passation (Monaco Editor + chrono + anti-fraude)
6. Page candidat done (score + bannière ambre si mock)
7. Dashboard analytique recruteur

##### 5.3.2 Interfaces avec d'autres systèmes
- LLM externe : API OpenAI-compatible (`/v1/chat/completions`) pour OpenAI, Claude, Groq, Ollama (URL configurable via `.env`).
- SMTP : Mailpit en dev, SMTP recruteur en prod (via `spring-boot-starter-mail`).
- Docker Daemon : sandbox utilise l'API Docker Java pour lancer les conteneurs éphémères.
- Postgres 16 : JPA + Flyway pour migrations schema.

### 6. Architecture(s) système

Architecture 2 vues comme demandé par le plan-type :

**Architecture logicielle** : deux services Spring Boot séparés (backend-app port 8090, backend-sandbox port 8091), frontend React unique. Isolation par enjeu de sécurité : la sandbox n'a pas accès à la base ni aux users.

**Architecture technique** : diagramme avec composants (nav → traefik → SPA React → backend-app → Postgres + LLM externe + backend-sandbox → Docker daemon).

Insérer 2 diagrammes (draw.io ou Mermaid). **Justifier** le choix 2 services (sécurité) et positionner **ta contribution** (100 % — projet solo).

### 7. Conception du système logiciel (vision développeur)

#### 7.1 Plate-forme technique
- **OS** : Linux (dev + prod)
- **Runtime backend** : JVM 21 (Java 21)
- **Framework backend** : Spring Boot 3.4 + Spring Security 6 + Spring Data JPA
- **Runtime sandbox** : Docker Engine + images Alpine PHP 8.3 / Node 20
- **Runtime frontend** : Node 20 + Vite 6 + React 19 + TypeScript 5
- **Base de données** : PostgreSQL 16-alpine
- **Reverse proxy** (prod) : Traefik ou Nginx

#### 7.2 Conception du logiciel développé

##### 7.2.1 Conception du code source
- Structure `com.tsarajoro.skillforge.<module>` : `auth`, `cv`, `generation`, `candidate`, `report`, `analytics`, `mail`, `sandbox`, `llm`, `security`, `exception`.
- Un package = un domaine métier (bounded context).
- Injections via constructeur, jamais field injection.
- Pas d'inheritance profonde, préférence pour composition + records.
- Nommage : Service = logique métier, Controller = HTTP, Repository = persistence.

##### 7.2.2 Le code source — vue statique
Diagramme des packages backend-app avec relations (fait avec IntelliJ ou plantuml). Mentionner 2-3 packages importants avec exemples de classes clés :
- `llm.LlmClient` (interface) + 5 implémentations (Mock, OpenAI, Claude, Groq, Ollama).
- `candidate.CandidatePassationService` (cœur métier).
- `sandbox.SandboxRunner` (durcissement Docker).

##### 7.2.3 Modélisation des données
**MCD Merise** (ou diagramme de classes UML) :
- Users, roles
- Candidates, cvs, cv_analyses (compétences extraites)
- Tests, questions, question_composition
- Invitations (avec `access_code` V6/V7)
- Passations, answers, fraud_events
- Reports

Montre l'évolution via migrations : V1 init, V2 test↔candidate, V3 answer details, V4 report LLM meta, V5 fraud, V6 access_code, V7 backfill+NOT NULL.

##### 7.2.4 Réalisation d'un cas d'utilisation
Choisis US-03 (passation candidat) et fais un **diagramme de séquence boîte blanche** : Frontend → API `/candidate/passations/start` → `CandidatePassationService` → vérif code d'accès + JWT + rate limiter → `PassationRepository.save`. Ça montre la vraie mécanique interne.

##### 7.2.5 Les composants et leur déploiement
- Backend-app : JAR fat lancé via `java -jar` ou `mvn spring-boot:run` en dev, image Docker multi-stage en prod
- Backend-sandbox : idem, port 8091
- Frontend : build statique Vite servi par Nginx en prod, `pnpm dev` en local
- Postgres : conteneur Docker officiel + volume persistant `skillforge_pgdata`
- Mailpit / Ollama : conteneurs Docker via `infra/docker-compose.yml`

### 8. Tests du système logiciel

⚠️ Section particulièrement importante pour ton mémoire : **c'est ton point fort**. Décrire les 3 niveaux :

#### 8.1 Tests fonctionnels
- Fiche de tests manuels 100+ scénarios (docs/04-tests/fiche-tests-manuels.md).
- Passes de recette avec 2 retours bugs corrigés (BUG-01 mock CAS, UX-01 code d'accès).

#### 8.2 Tests unitaires + intégration
- JUnit 5 + AssertJ + Testcontainers (backend)
- Vitest + Testing Library (frontend, à confirmer)
- Couverture : X % (à mesurer avec `mvn jacoco:report`)

#### 8.3 Tests sécurité
**Ta grande force pour le jury M2**. Trois sous-sections chiffrées :

##### 8.3.1 POC 3 — Sandbox Docker sécurisée
Reprendre `RAPPORT_POC3.md` :
- 150 cas de test (100 valides + 50 attaques × 7 catégories : fork-dos, network, fs-read, fs-write, memory, escape, bonus)
- Résultats : 100 % succès valides, médiane 330 ms, **0 évasion / 50 attaques**
- Matrice par catégorie
- Reproductible : `mvn test -Dpoc3.run=true`

##### 8.3.2 Audit OWASP Top 10 (ZAP)
Reprendre `RAPPORT_ZAP.md` :
- Baseline scan + full scan actif (payloads SQLi, XSS, path traversal, command injection…)
- 11 itérations de correction (17 findings initiaux → **0 vulnérabilité High/Medium/Low**)
- Matrice OWASP Top 10 (A01→A10)
- Corrections appliquées : 6 headers HTTP sécurité (CSP, HSTS, X-Frame, etc.) + 6 handlers d'exception génériques.

##### 8.3.3 Autres mesures sécurité
- Rate limiting sur code d'accès (5 échecs → lock 15 min)
- `MessageDigest.isEqual` constant-time pour comparaison code
- Argon2id (paramètres OWASP 2025)
- Ollama local = pas de fuite de données candidat vers un LLM externe

#### 8.4 Tests performance (à réaliser Sprint 7 ou faire en annexe si pas fait)
- k6 : simulation 20 candidats simultanés (chiffre CDC)
- Mesure latences API + sandbox

### 9. Conclusion générale (Gabriel + plan-type)

4 parties obligatoires :

#### 9.1 Bilan des résultats obtenus pour l'entreprise
- Livrables : plateforme complète (backend, frontend, sandbox, docs), 4 rapports POC, script recette, guide déploiement.
- Statut : **En cours de recette** avant mise en production Sprint 8.
- Chiffres : ~15 000 lignes de code Java + TypeScript (à mesurer avec `cloc`), 40 commits Git, 7 migrations DB, 4 POC validés.

#### 9.2 Bilan des problèmes rencontrés et solutions
- **Retrait GitHub Models fin 2026** → bascule Groq + ajout Ollama (multi-fournisseur).
- **JSON tronqué par LLM** → auto-repair côté service + prompt compact.
- **Race condition double-clic** → catch DataIntegrityViolationException → 409.
- **Bug notation CAS mock** (BUG-01 recette) → plafonner scores mock < seuil réussite.
- **Usurpation identité candidat** (UX-01 recette) → verrouillage identité + code d'accès à 6 chiffres.

#### 9.3 Perspectives du projet
- **Sprint 7 (en cours)** : finaliser k6 tests charge, RBAC vérif droits par rôle.
- **Sprint 8** : mise en production sur infrastructure interne Tsarajoro.
- **V2** : proctoring vision (webcam), tests adaptatifs IRT, intégration ATS externe, SSO interne, langages sandbox additionnels (Python, Java).
- **Boucle amélioration continue** : déprioriser auto les questions à faible pouvoir discriminant via LLM.

#### 9.4 Bilan personnel
Que t'a apporté ce stage. Sois honnête et concret :
- Approfondissement Spring Security, Docker durcissement, sandboxing.
- Découverte multi-fournisseur LLM et LLM local (Ollama).
- Méthodologie POC + validation chiffrée (démarche scientifique).
- Sécurité offensive (OWASP ZAP, harness d'attaques).
- Statistique psychométrique (point-bisériale, indice difficulté).
- Confrontation à un vrai retrait d'API en production (GitHub Models).
- **Autonomie** : gestion projet solo, ownership du produit du CDC à la livraison.

### 10. Références et Bibliographie

⚠️ Gabriel dit clairement : "une liste d'URLs seule est sans intérêt". Il faut varier les types.

Structure de base à produire (~15-25 entrées), style APA :

**Livres / Ouvrages** :
- OWASP Foundation. (2025). *OWASP Top 10 – 2025 Edition*.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2ᵉ éd.). Addison-Wesley.

**Articles / Standards** :
- Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. RFC 7519, IETF.
- Biryukov, A., Dinu, D., & Khovratovich, D. (2016). Argon2: New Generation of Memory-Hard Functions for Password Hashing. *IEEE EuroS&P*.

**Documentation officielle** (avec date de consultation) :
- Spring Boot Team. (2025). *Spring Boot 3.4 Reference Documentation*. Consulté le [date], sur https://docs.spring.io/spring-boot/
- Docker Inc. (2025). *Docker security — seccomp*. Consulté le [date], sur https://docs.docker.com/engine/security/seccomp/

**Mémoires / Thèses** :
- ANDRIANAIVOSOA, T. (2023). *Participation au développement du système de gestion des solutions de mobilités en Île-de-France* [Mémoire de Master 2, ITU / MBDS].

**Rapports POC internes** :
- GERSHOM, F. (2026). *Rapport POC 3 — Sandbox Docker sécurisée SkillForge*. Rapport interne Tsarajoro.
- GERSHOM, F. (2026). *Rapport OWASP ZAP — Audit SkillForge*. Rapport interne Tsarajoro.

### 11. Annexes

**Annexe 1** : Cahier des charges complet (le PDF `CAHIER_DES_CHARGES_FITIA_M2_MBDS.pdf` du repo)
**Annexe 2** : MCD complet + diagramme de classes UML
**Annexe 3** : Dossier technique — extraits de code clés commentés (SandboxRunner, GroqLlmClient, verifyAccessCode)
**Annexe 4** : User Stories complètes (celles pas décrites en 5.1)
**Annexe 5** : Fiche de tests manuels complète
**Annexe 6** : Diagramme de Gantt détaillé
**Annexe 7** : Rapport POC 3 complet (`RAPPORT_POC3.md`)
**Annexe 8** : Rapport OWASP ZAP complet (`RAPPORT_ZAP.md`)
**Annexe 9** : Guide d'installation Ollama (`GUIDE_OLLAMA.md`)

---

## 4. Ordre recommandé pour écrire (priorité descendante)

Vu qu'il te reste ~2 mois avant octobre 2026 :

### Semaine 1 (facile, ~10 h)
1. **Chapitre 1** — Présentation stage + § entreprise (tu connais Tsarajoro par cœur)
2. **§ 1.2** — Sujet et objectifs (copier-adapter du CDC)
3. **Glossaire** (30 min, liste alphabétique)
4. **Introduction** (1 page)
5. **Résumé + Abstract** (½ page chacun)

### Semaine 2 (moyen, ~15 h)
6. **Chapitre 2** — État de l'art (recherche à faire sur HackerRank/Codility/…)
7. **Chapitre 3** — Étude de l'existant (tu sais ce que faisait Tsarajoro avant)
8. **Chapitre 4** — Démarche projet (git log te donne beaucoup)

### Semaine 3 (technique, ~15 h)
9. **Chapitre 6** — Architecture (2 diagrammes + explications)
10. **Chapitre 7** — Conception (MCD, packages, séquence)

### Semaine 4 (le morceau valorisant, ~20 h)
11. **Chapitre 5** — Exigences (User Stories + captures écran)
12. **Chapitre 8** — Tests (juste synthétiser `RAPPORT_POC3.md` + `RAPPORT_ZAP.md`, gros bonus jury)

### Semaine 5 (finalisation, ~10 h)
13. **Chapitre 9** — Conclusion
14. **Chapitre 10** — Bibliographie (compiler les sources au fur et à mesure)
15. **Annexes**
16. **Relecture** — cohérence numérotation, pagination, figures/tableaux/sources.

### Semaine 6 — Marge tuteur
17. Envoi 1 semaine avant deadline à tuteur pro + école pour correction.
18. Ajustements finaux.

### Semaine 7 — Slides soutenance
19. **~20 slides** pour 20 min d'exposé (voir consignes soutenance).
20. Répétition orale (2-3 passes).

---

## 5. Points d'alerte

- **Pagination** : passe en `1/40`, `2/40` etc. (Gabriel insiste).
- **Retirer TOUTES les "NOTES IMPORTANTES à supprimer sur le rapport final"** en rouge dans ton doc.
- **Tableau des acronymes** obligatoire (Gabriel : "je dis bien tous les acronymes", ordre alphabétique).
- **Introduction 1 page max** — pas 2, pas 3.
- **Résumé ½ page max** — pas 1 page.
- **40 pages max hors annexes** — si ton doc dépasse, déplace en annexe.
- **Retirer les figures/tableaux d'exemple** (Chrome/Firefox, Position Jan '14).
- **Envoi 1 semaine avant deadline** aux 2 tuteurs (Gabriel rappelle ça).
- **Style APA cohérent** : (Auteur, année, p. X) partout, figures/tableaux avec source, biblio ordre alphabétique retrait suspendu.

---

## 6. Soutenance orale (à préparer une fois le mémoire finalisé)

**30 min = 20 exposé + 10 questions**, en présentiel ITU octobre 2026.

Plan des slides (extrait consignes) :
1. Page de titre (sujet, toi, tuteurs)
2. Plan général exposé
3. Contexte + problématique + enjeux
4. Présentation Tsarajoro rapide
5. Mission et objectifs
6. Existant → besoin détaillé → justification solution
7. Gestion projet, planning, outils, techno
8. Réalisation — résultats principaux
9. Validation & tests — comparer aux objectifs initiaux
10. Retour gestion projet — planning constaté, risques, difficultés
11. Ressources entreprise + rôle équipe + rapports humains
12. Livrables laissés à l'entreprise
13. Bilan entreprise : besoin ? exploitation ? perspectives ?
14. Bilan personnel
15. Fin + questions

Beaucoup de captures d'écran + démo en vidéo (5-10 s par écran clé).

---

## 7. Ce que tu as déjà en atout (rassurant)

- **Titre validé et précis** ✅
- **Structure du plan bien copiée** ✅
- **CDC complet et validé** ✅ (bonus : signé par ton tuteur pro)
- **4 POC réellement produits avec mesures chiffrées** ✅ — c'est rare et ça impressionnera le jury
- **Rapports POC 3 et ZAP rédigés** — juste à synthétiser dans le chapitre 8
- **~40 commits Git compte perso** avec messages propres — traçabilité Scrum solide
- **Guide Ollama** — démontre ta maturité sur les enjeux souveraineté / RGPD

**Le plus dur est fait techniquement**. Ce qui reste, c'est de **raconter** le projet dans le format académique attendu.

Tu peux commencer par le chapitre 1 (Présentation stage) ce soir, c'est le plus simple et ça te met en confiance.

---

*Document généré le 2026-08-28 à partir du plan-type MBDS 2025, des remarques Gabriel Mopolo, du guide APA, des consignes soutenance, de la présentation M2 MBDS 2025, de ta version en cours et de l'exemple ANDRIANAIVOSOA.*
