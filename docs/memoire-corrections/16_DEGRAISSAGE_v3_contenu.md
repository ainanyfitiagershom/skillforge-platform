# Dégraissage mémoire v3 — contenu uniquement (-6,7 pages après Fix Fig11/Fig12)

Document préparé le 2026-10-06 à partir de la v3 (`MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v3.pdf`, 72 pages PDF total).

Hypothèse de départ : mise en page **figée** (12 pt corps, interligne/marges/espacements/sauts de page avant chapitres non modifiables). Les 6,7 pages à récupérer passent donc **uniquement par le contenu** : condensation, suppression de redondances, bascule en annexe, fusion de sections, transformation prudente de paragraphes en listes.

Verdict honnête en tête de document : avec les actions listées ci-dessous, le gain net attendu se situe entre **6,2 et 7,5 pages**. L'objectif 40 pages est atteignable mais la marge est **très mince** (0,0 à 0,8 page). Si l'une des actions rend moins que son estimation, le mémoire finira à **41 pages**, ce qui reste acceptable en soutenance. Si tout passe, 40 pages exactement.

---

## 0. État mesuré v3

Scan page par page du PDF v3 réalisé via `pdftotext -layout -f N -l N`. Correspondance avec la pagination affichée du mémoire (foliotation académique à partir de l'Introduction = 1).

| Chapitre | Pages PDF (physiques) | Pagination affichée | Nb pages | Compressible ? |
|---|---|---|---|---|
| Introduction | 11 | 1 | 1 | Non (déjà très courte) |
| 1 Présentation du stage | 12 – 13 | 2 – 3 | 2 | **Oui** — 1.1 et 1.2 verbeux |
| 2 État de l'art | 14 – 21 | 4 – 11 | **8** | **NON** — prof demande renforcement (zone intouchable) |
| 3 Étude de l'existant | 22 – 24 | 12 – 14 | 3 | **Oui** — 3.1.2 / 3.2 / 3.4 redondants |
| 4 Démarche projet | 25 – 37 | 15 – 27 | 13 | **Oui, partiellement** — hors Planification 4.3 (M-E7), hors Tab. 3 (risques), Tab. 5 (90 j), Tab. 6 (sprints), budget |
| 5 Exigences | 38 – 45 | 28 – 35 | 8 | **Oui, partiellement** — hors UML 5.1 (M-F2), Tab. 7 (M-F3), 5.3.2 (M-F5), Fig. 12 déjà condensée |
| 6 Architecture | 46 | 36 | 1 | Non — déjà court et tenu par 2 figures |
| 7 Conception interne | 47 – 52 | 37 – 42 | 6 | **Oui, partiellement** — hors extraits de code (M-G3), hors Fig. 12 |
| 8 Tests | 53 – 55 | 43 – 45 | 3 | **NON** — tableaux chiffrés (JUnit 27, OWASP, k6 p95 4,37 s) à préserver |
| 9 Conclusion | 56 – 58 | 46 – 48 | 3 | **Oui** — 9.4 Bilan personnel verbeux |
| **TOTAL CORPS mesuré** | 11 – 58 | 1 – 48 | **48** | |

Après le déplacement de la Figure 11 (MCD) en annexe et la condensation du texte autour de la Figure 12 (séquence) : **~46,7 pages**.
Cible imposée : **40 pages**.
Reste à retirer : **~6,7 pages** uniquement en contenu.

---

## 1. Plan proposé

Actions classées de la plus rentable à la moins rentable, avec le levier mobilisé et le risque sur la cohérence du mémoire.

| # | Action | Section | Levier | Gain estimé | Risque |
|---|---|---|---|---|---|
| 1 | Fusionner 3.1.2 + 3.2 + 3.4 (existant interne, critique, solutions envisagées) et condenser 3.3 Contraintes | 3.1.2–3.4 | C + D | 1,3 page | Faible — contenu redit depuis 1.2 et chap 2 |
| 2 | Condenser 4.1.1 à 4.1.5 (ingénierie, Scrum, rôles, outils, configuration) + basculer le tableau Outils en annexe | 4.1 | A + B + E | 1,5 page | Faible — rien de chiffré n'est perdu |
| 3 | Résumer les cas Cas-02, Cas-06 et Cas-12 (ne garder détaillés que Cas-01 et Cas-06 pour la passation) | 5.1 | B + C | 1,0 page | Moyen — vérifier que Cas-06 reste bien détaillé car il est associé à la Fig. 12 (M-G5) |
| 4 | Resserrer 5.3.1 IHM autour des figures (texte explicatif entre captures compactée) | 5.3.1 | B | 0,6 page | Faible |
| 5 | Condenser 7.1 + 7.2.1 + 7.2.2 (plateforme + organisation du code + vue statique) et déplacer la Figure 10 (packages backend) en annexe | 7.1–7.2.2 | A + B + C | 0,9 page | Faible — doublon avec 2.4 et chap 6 |
| 6 | Condenser 1.1 Entreprise et 1.2 Sujet | 1.1–1.2 | B | 0,6 page | Faible |
| 7 | Condenser 9.4 Bilan personnel (3 paragraphes au lieu de 5) | 9.4 | B | 0,3 page | Faible |
| 8 | Déplacer le Tableau 6 (traçabilité US ↔ Cas d'utilisation complet) en annexe en gardant un extrait de 4 lignes dans le corps | 5.1 | A | 0,4 page | Faible — la traçabilité complète reste consultable |
| 9 | Alléger 4.4 Budget : conserver le tableau et le total 1 050 000 MGA, supprimer les deux paragraphes d'introduction qui redisent le tableau | 4.4 | B + C | 0,3 page | Faible — chiffres préservés |
| 10 | Supprimer l'introduction redondante du chapitre 5 (3 lignes avant le tableau Cas) | 5.0 | B | 0,2 page | Faible |

**Gain total estimé : ~7,1 pages**. Marge de ~0,4 page au-dessus de la cible 40 p — mince mais présente.

Les actions 1 à 5 délivrent à elles seules **5,3 pages** et constituent le socle du dégraissage. Les actions 6 à 10 sont des finitions qui permettent d'atteindre la cible exactement.

---

## 2. Fix 1 — Fusionner 3.1.2 + 3.2 + 3.4 et condenser 3.3

### 2.1 Diagnostic

Les sections 3.1.2 (Description interne du système existant), 3.2 (Critique de l'existant) et 3.4 (Solutions envisagées) occupent actuellement de la page 22 à la page 24 (~2,5 pages). Elles redisent trois fois les mêmes constats :
- 3.1.2 : « pas de plateforme interne, informations dispersées entre CV, documents de test et retours de correction ».
- 3.2 : « préparation des tests demande du temps, hétérogénéité, pas de centralisation, pas d'exécution automatique du code ».
- 3.4 : « conserver le manuel insuffisant, plateforme externe inadaptée aux besoins, développement interne retenu ».

Chaque section ouvre et ferme son propre paragraphe de transition, ce qui gonfle l'ensemble. Le chapitre 1.2 a déjà cadré le problème et le chapitre 2 (benchmark HackerRank/Codility/TestGorilla/CoderPad) a déjà traité l'option plateforme externe. Il reste à constater l'existant, à l'évaluer et à justifier le choix.

Proposition : fusionner 3.1.2 + 3.2 en une seule section **3.1.2 Analyse de l'existant** et transformer 3.4 en 3 lignes de conclusion, puisque le benchmark coûts/fonctionnalités est déjà au chap. 2.

### 2.2 Texte actuel (extrait)

Trois blocs totalisant 2,5 pages (voir p22-24 du PDF v3). Volume : ~550 mots sur 3.1.2 + 3.2, ~310 mots sur 3.4.

### 2.3 Texte condensé prêt à coller

**3.1.2 Analyse de l'existant**

Avant SkillForge, aucune plateforme interne ne centralisait le cycle d'évaluation technique. Les informations étaient dispersées entre les CV reçus, les échanges avec les candidats, les documents de test et les retours de correction. Aucune base de données ne regroupait les candidats, les compétences, les questions, les tests, les passations et les résultats, et aucun module automatisé ne permettait d'analyser un CV, de générer un test, d'exécuter le code candidat dans un environnement isolé ou de produire un compte rendu standardisé.

Ce fonctionnement laissait aux recruteurs une grande latitude pour adapter chaque évaluation au CV et au niveau supposé du candidat, et maintenait un contrôle humain fort sur la décision finale. Il présentait cependant quatre limites : préparation chronophage à grande échelle, contenu variable d'un recruteur à l'autre rendant les comparaisons moins homogènes, correction manuelle sollicitant l'équipe technique, et absence de centralisation empêchant tout suivi ou indicateur consolidé. L'exécution automatique du code candidat, en particulier, nécessitait un environnement sécurisé qui n'existait pas.

**3.2 Contraintes du projet**

Le projet devait reposer sur des choix techniques maintenables par l'équipe Full Stack et respecter les exigences de protection des données et de non-discrimination applicables au recrutement. Les choix d'architecture, de fournisseur d'IA et d'interface restaient négociables selon les besoins. Ces contraintes ont orienté le choix d'une solution interne, du contrôle humain de l'IA et de l'isolation du code candidat.

**3.3 Solution retenue**

Trois options ont été envisagées : conserver le processus manuel en l'améliorant avec des modèles partagés, utiliser une plateforme externe du benchmark (chap. 2), ou développer une plateforme interne. La première ne répondait pas aux besoins de centralisation et de traçabilité ; la seconde (≈ 900 à 1 200 $/an) ne couvrait pas l'exploitation du CV, le référentiel interne de compétences ni la maîtrise de l'évolution ; la troisième permet d'adapter la solution aux besoins de Tsarajoro et de maîtriser données et évolution. Pour la première version de SkillForge, le coût engagé s'élève à environ **1 050 000 MGA** (prime projet), avec une consommation d'API d'IA d'environ 50 000 MGA par mois.

La solution retenue est le développement de SkillForge : analyse du CV, proposition et validation des questions, gestion de la passation, exécution du code dans une sandbox séparée et restitution des résultats.

**3.4 Objectifs principaux et livrables**

(Section conservée telle quelle en v3 : objectifs chiffrés < 15 s par CV et 0 évasion sur 50 attaques + liste des livrables.)

### 2.4 Gain estimé

Volume avant : ~2,5 pages pour 3.1.2 + 3.2 + 3.3 (contraintes) + 3.4 (solutions). Volume après : ~1,2 page. **Gain : 1,3 page**.

Rien de chiffré ne disparaît (1 050 000 MGA, 50 000 MGA/mois, 900-1 200 $/an). Les objectifs 3.4 et les livrables restent intacts (zone chiffrée protégée).

---

## 3. Fix 2 — Condenser 4.1 et déplacer le tableau Outils en annexe

### 3.1 Diagnostic

4.1 occupe actuellement de la page 25 à la page 29 (~5 pages). Les sous-sections 4.1.1 (Activités d'ingénierie), 4.1.2 (Scrum), 4.1.3 (Rôles et responsabilités), 4.1.4 (Outils) et 4.1.5 (Gestion de la configuration) comportent de nombreuses répétitions :
- « démarche itérative et incrémentale » répété 3 fois.
- 4.1.2 Scrum : les paragraphes « Au début de chaque sprint... », « À la fin des différentes itérations... », « Dans cette organisation, j'ai participé... », « Le code était versionné avec Git... » sont redondants avec 4.1.5 (gestion de la configuration).
- 4.1.3 Tableau 2 (rôles et responsabilités) + paragraphe post-tableau redit le tableau.
- 4.1.4 Tableau Outils (sans numéro) : 10 lignes dont certaines évidentes (React → interfaces, Tailwind CSS → mise en forme, Git → versionnement). Ce tableau peut passer en annexe.
- 4.1.5 Gestion de la configuration : contenu déjà présent dans 4.1.2 (branches, PR, convention commits) + 4.1.4 (GitHub Actions, Flyway).

Proposition : conserver 4.1.1 (activités) condensée, fusionner 4.1.2 + 4.1.5 en une seule section **4.1.2 Scrum et gestion de la configuration**, garder 4.1.3 avec le tableau mais supprimer le paragraphe post-tableau redondant, déplacer le tableau Outils en annexe en remplaçant par 2 phrases qui citent les 4 outils structurants (Spring Boot, React, PostgreSQL, Docker) + un renvoi à l'annexe.

### 3.2 Texte actuel (extrait)

Pages 25-29 : ~1 650 mots au total, dont le tableau Outils occupe ~250 mots sur une pleine page.

### 3.3 Texte condensé prêt à coller

**4.1.1 Activités d'ingénierie logicielle**

Le développement de SkillForge a suivi une démarche itérative et incrémentale, de l'analyse du besoin aux tests. L'analyse a identifié les utilisateurs, les fonctionnalités attendues et les deux contraintes principales : sécurité du code candidat et contrôle des contenus générés par l'IA.

La conception a défini l'architecture, le modèle de données et les flux entre frontend, backend, PostgreSQL, services d'IA et sandbox. Les échanges reposent sur des API REST ; les CV sont importés en PDF et DOCX ; les sorties des LLM sont demandées en JSON lorsque le fournisseur le permet, puis contrôlées par parsing et validations métier (aucune validation JSON Schema exhaustive à ce stade). La persistance repose sur PostgreSQL ; SkillForge ne s'intègre pas à un ATS existant et aucune reprise historique n'est prévue. Les CV sont conservés 12 mois avec purge quotidienne.

Le développement a ensuite porté sur les principaux modules : authentification, candidats, questions, analyse de CV, génération d'évaluations, parcours candidat, exécution du code, scoring et consultation des résultats. Les tests ont combiné tests unitaires, tests d'API, vérifications manuelles et contrôles spécifiques de la sandbox et des mécanismes anti-fraude.

**4.1.2 Scrum et gestion de la configuration**

La gestion du projet s'est appuyée sur Scrum, avec des sprints organisés autour des fonctionnalités prioritaires et des points réguliers avec l'encadreur professionnel pour ajuster le périmètre. J'ai participé au cadrage, à la priorisation, au découpage en tâches, à l'estimation, au développement et à la validation ; j'assurais également le suivi des corrections issues des tests.

Le code est versionné avec Git et hébergé sur GitHub sur la branche `main`. Chaque modification donne lieu à un commit suivant la convention Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `chore:`). GitHub Actions automatise l'intégration continue : compilation du backend, exécution des tests JUnit 5 et vérification du build frontend. La base PostgreSQL est gérée avec Flyway (migrations V1 à V7). Le dépôt sépare frontend, backend, sandbox et migrations ; la préproduction utilise Vercel pour le frontend et Render pour le backend.

**4.1.3 Rôles et responsabilités**

(Tableau 2 conservé.)

(Suppression du paragraphe post-tableau qui redit le tableau.) SkillForge distingue au niveau applicatif trois rôles : administrateur, recruteur et candidat. Le recruteur accède à la plateforme depuis un navigateur web ; le candidat doit disposer d'un navigateur compatible et d'une connexion stable, notamment pour les tests chronométrés. Les tests peuvent être proposés en français et en anglais. Aucune exigence spécifique d'accessibilité n'a été définie pour cette première version.

**4.1.4 Outils**

Les outils structurants du projet sont Spring Boot (API REST et orchestration), React (SPA recruteur et candidat), PostgreSQL (persistance), Docker (isolation des conteneurs d'exécution du code candidat), Git/GitHub (versionnement et dépôt distant) et GitHub Actions (CI). Les tests reposent sur JUnit 5, OWASP ZAP et k6 ; la modélisation utilise Mermaid et DBSchema ; la planification utilise GanttProject. **Le détail de chaque outil et son usage précis dans SkillForge figurent en Annexe 5.**

(Suppression des sous-sections 4.1.5 Gestion de la configuration : contenu intégré à 4.1.2 ci-dessus.)

### 3.4 Gain estimé

Volume avant : ~5 pages (p25-29). Volume après : ~3,5 pages. **Gain : 1,5 page**.

Le tableau Outils est préservé (déplacé en annexe nouvelle « Annexe 5 : Outils du projet »). Aucun chiffre ni livrable n'est perdu. La convention Conventional Commits, Flyway, GitHub Actions, Vercel/Render restent cités dans le corps.

---

## 4. Fix 3 — Résumer Cas-02, Cas-06 et Cas-12 (ne détailler qu'un cas pivot)

### 4.1 Diagnostic

5.1 occupe de la page 39 à la page 42 (~3 pages pour les 4 cas détaillés). Chaque cas suit la structure Acteur / Préconditions / Déroulement (4-5 étapes) / Erreur / Résultat. Cette structure prend 5 à 7 lignes par cas et génère beaucoup de retours à la ligne, donc du volume.

Attention : le prof demande un UML détaillé en 5.1 (M-F2) et la Fig. 12 (M-G5) illustre justement **Cas-06 (passation sécurisée)**. Il faut donc garder **Cas-06 détaillé** et condenser les 3 autres.

Proposition : garder Cas-01 (Analyser le CV) et Cas-06 (Passation sécurisée) en version détaillée ; transformer Cas-02 (Génération test) et Cas-12 (Consultation résultats) en version courte à 3-4 lignes chacun.

### 4.2 Texte actuel (extrait)

Cas-02 (~15 lignes), Cas-12 (~14 lignes) selon la structure Acteur/Préconditions/Déroulement/Erreur/Résultat.

### 4.3 Texte condensé prêt à coller

**5.1.2 Cas-02 — Génération et validation d'un test technique**

À partir du profil recherché et des compétences détectées, le recruteur lance la génération. SkillForge propose des QCM, exercices de programmation et cas pratiques, que le recruteur peut conserver, modifier ou supprimer avant de constituer le test final. En cas d'échec de génération, l'opération peut être relancée. L'IA assiste la préparation sans se substituer à la validation humaine.

**5.1.3 Cas-06 — Passation sécurisée du candidat**

(Section conservée dans sa forme détaillée actuelle : Acteur / Préconditions / Déroulement en 5 étapes / Erreur / Résultat. Ce cas est illustré par la Figure 12 au chapitre 7.)

**5.1.4 Cas-12 — Consultation des résultats**

Après la soumission du test, SkillForge corrige les différents types de questions et regroupe les résultats dans une synthèse. Le recruteur consulte les scores, les points forts et les points nécessitant une attention particulière ; le compte rendu peut être exporté en PDF. La recommandation reste une aide à l'évaluation : la décision finale relève du recruteur.

### 4.4 Gain estimé

Volume avant : ~3 pages. Volume après : ~2 pages. **Gain : 1,0 page**.

Cas-06 reste détaillé (cohérence avec Fig. 12 et M-G5). Les diagrammes UML ajoutés en v3 (Fig. 3 séquence système, Fig. 4 états de la passation — M-F2) ne sont pas touchés.

---

## 5. Fix 4 — Resserrer 5.3.1 IHM autour des figures

### 5.1 Diagnostic

5.3.1 (pages 43-44) alterne figures (Figures 3, 4, 5, 6, 7) et paragraphes explicatifs. Les paragraphes « Création d'une évaluation : le recruteur peut renseigner... », « Passation de l'évaluation : le candidat accède... », « Une fois l'accès validé, le candidat peut parcourir... » répètent partiellement les cas d'utilisation de 5.1.

Proposition : conserver les 5 figures intactes, mais remplacer chaque paragraphe d'introduction par une légende courte (une phrase) sous chaque figure.

### 5.2 Texte actuel

Paragraphes de 3-5 lignes avant chaque figure.

### 5.3 Texte condensé prêt à coller

**5.3.1 Interface Homme-Machine**

L'interface de SkillForge repose sur deux parcours : celui du recruteur, accessible après authentification, et celui du candidat, accessible depuis l'invitation reçue. Chaque utilisateur accède uniquement aux fonctionnalités de son rôle.

*Figure 3 — Interface de création d'une évaluation et d'analyse du CV.* Le recruteur renseigne le candidat et le profil recherché, importe le CV, puis vérifie les compétences détectées et leur niveau estimé avant génération du test.

*Figure 4 — Vérification et validation des questions.* (légende condensée depuis le texte actuel)

*Figure 5 — Interface de passation d'une évaluation technique.* Le candidat ouvre son invitation, saisit son code d'accès, puis parcourt les questions. L'interface s'adapte au type de question ; un éditeur de code intégré permet de saisir et d'exécuter la solution des exercices de programmation.

*Figure 6 — Exercice de programmation côté candidat.*

*Figure 7 — Consultation des résultats d'une évaluation.*

### 5.4 Gain estimé

Volume avant : ~1,5 page de texte entre figures. Volume après : ~0,9 page. **Gain : 0,6 page**.

Les 5 figures sont conservées. Les captures prennent la même place qu'avant. Seul le texte interstitiel diminue.

---

## 6. Fix 5 — Condenser 7.1 + 7.2.1 + 7.2.2 et déplacer la Figure 10 en annexe

### 6.1 Diagnostic

7.1 (Plate-forme technique), 7.2.1 (Conception du code source), 7.2.2 (Vue statique) occupent une bonne partie des pages 47-48. Elles répètent le chap. 6 (architecture) et la section 2.4 (technologies et architecture envisagée) :
- 7.1 : « Java 21, Spring Boot, Spring Security, Spring Data JPA, React 19, TypeScript, Vite 6, PostgreSQL 16, Flyway, Docker » → déjà cité en 2.4 et 4.1.4.
- 7.2.1 : « organisation par domaines fonctionnels : authentification, candidats, analyse des CV... » → liste redondante avec 4.1.1.
- 7.2.2 : « Les contrôleurs exposent les fonctionnalités, les services portent la logique métier, les repositories assurent l'accès aux données » → couche MVC/service générique sans valeur ajoutée pour un jury M2.
- Figure 10 (packages backend) : utile mais pas critique dans le corps.

Proposition : fusionner 7.1 et 7.2.1 en une seule section **7.1 Plate-forme technique et organisation du code**, supprimer 7.2.2 (la Fig. 10 passe en annexe avec sa phrase d'intro), et préserver 7.2.3 (extraits de code — M-G3) et 7.2.5 Fig. 12 (M-G5) tels quels.

### 6.2 Texte condensé prêt à coller

**7.1 Plate-forme technique et organisation du code**

Le backend repose sur Java 21 et Spring Boot (Spring Security pour l'authentification, Spring Data JPA pour l'accès aux données). Le frontend utilise React 19, TypeScript et Vite 6, et PostgreSQL 16 assure la persistance. Flyway versionne les évolutions de schéma. Docker isole l'exécution du code candidat.

Le backend est organisé par domaines fonctionnels (authentification, candidats, analyse de CV, génération d'évaluations, passations, résultats, LLM, sandbox), chacun regroupant ses contrôleurs, services et composants. Cette séparation limite les dépendances entre fonctionnalités. Les conventions Java sont appliquées (PascalCase pour les classes, camelCase pour les méthodes et variables, snake_case pour les tables). Le frontend est organisé autour des pages, composants réutilisables et services d'accès à l'API. **L'organisation détaillée des packages du backend est présentée en Annexe 5 (Figure 10).**

**7.2.2 Extraits de code représentatifs**

(Section conservée telle quelle avec l'interface LlmClient et la configuration sandbox — M-G3.)

(La sous-section 7.2.2 Vue statique est supprimée du corps ; sa Figure 10 est déplacée en Annexe 5.)

### 6.3 Gain estimé

Volume avant : ~1,5 page sur 7.1 + 7.2.1 + 7.2.2 (texte) + Figure 10 (~0,5 page). Volume après : ~1 page de texte, Figure 10 absente. **Gain : 0,9 page**.

M-G3 (extraits code LlmClient + sandbox) préservé. Fig. 12 (M-G5) préservée. Le modèle de données reste traité en 7.2.4.

---

## 7. Fix 6 — Condenser 1.1 Entreprise et 1.2 Sujet

### 7.1 Diagnostic

Les sections 1.1 et 1.2 occupent les pages 12-13 (~2 pages). Elles reprennent partiellement l'introduction (Tsarajoro, numérique, Antananarivo) et le chapitre 3 (processus manuel, 3 h par candidat).

Proposition : condenser 1.1 (passer de 3 paragraphes à 2) et 1.2 (passer de 5 paragraphes à 3), en gardant les éléments factuels (3 h par candidat, caractère innovant, sandbox).

### 7.2 Texte condensé prêt à coller

**1.1 Présentation de l'entreprise**

Tsarajoro est une entreprise malgache du numérique créée en 2019. Son activité couvre la réalisation et l'exploitation de projets web, portée par des développeurs, intégrateurs WordPress, rédacteurs et profils spécialisés en référencement et netlinking. Cette diversité de métiers permet à l'entreprise de prendre en charge les différentes étapes d'un projet numérique, de sa réalisation technique à son exploitation.

Le projet SkillForge a été réalisé au sein de l'équipe de développement Full Stack. Dans le processus de recrutement technique, les entretiens et évaluations sont suivis et validés par le chef de projet. SkillForge répond à un besoin interne de structuration de la préparation des évaluations, de réduction des tâches de correction manuelle et de facilitation de l'analyse des résultats.

**1.2 Présentation du sujet et objectifs du projet**

Le recrutement de profils techniques représente un enjeu important pour Tsarajoro : avant de sélectionner un candidat, il est nécessaire de vérifier que ses compétences correspondent au poste. La préparation, la correction et l'analyse d'une évaluation représentent une charge estimée à **3 heures par candidat** (1 h 30 préparation, 1 h correction, 30 min analyse). Cette estimation constitue la base de comparaison retenue pour apprécier l'apport de SkillForge.

SkillForge est une plateforme interne d'aide à l'évaluation technique qui accompagne le recruteur de l'analyse du CV à la consultation des résultats : identification des compétences, génération d'une évaluation adaptée, passation, correction et analyse. Son caractère innovant repose sur la personnalisation des évaluations à partir du CV et du profil recherché grâce à l'IA, avec supervision humaine : les compétences détectées et les questions générées peuvent être vérifiées, modifiées ou supprimées avant transmission au candidat. Le projet répond également à un enjeu de sécurité : certains exercices nécessitant l'exécution de code candidat, une sandbox séparée isole cette exécution du reste de l'application.

Les objectifs sont de réduire la charge des tâches manuelles, d'améliorer la cohérence des évaluations, de personnaliser les tests et de renforcer leur traçabilité. SkillForge reste un outil d'aide à la décision : le recruteur conserve la responsabilité de la validation et de la décision finale.

### 7.3 Gain estimé

Volume avant : ~2 pages. Volume après : ~1,4 page. **Gain : 0,6 page**.

Le chiffre « 3 heures par candidat » est préservé. Le caractère innovant, la sandbox et la supervision humaine restent cités.

---

## 8. Fix 7 — Condenser 9.4 Bilan personnel

### 8.1 Diagnostic

9.4 occupe environ 1 page (fin du mémoire). Les 5 paragraphes actuels incluent deux formulations proches : « Ce stage m'a placé dans une posture nouvelle... » et « Ce projet a finalement renforcé... mes compétences techniques, mon autonomie et ma capacité à conduire un projet ». De plus, le paragraphe sur l'IA et l'abstraction LlmClient redit ce que 9.2 vient de dire.

Proposition : passer de 5 à 3 paragraphes en gardant les trois domaines techniques marquants (sécurité, IA, architecture) et les remerciements.

### 8.2 Texte condensé prêt à coller

**9.4 Bilan personnel**

Ce stage m'a placé dans une posture de responsabilité : conduire un projet complet, de l'analyse du besoin aux tests, en gagnant en autonomie dans les décisions techniques tout en sollicitant l'encadreur sur les choix structurants.

Trois domaines techniques m'ont particulièrement marqué. La sécurité applicative d'abord, à travers le travail d'isolation de la sandbox et les améliorations successives de sa robustesse. L'intelligence artificielle ensuite : ce projet m'a permis d'aller au-delà d'une simple utilisation d'API pour travailler la conception des prompts, la structuration des réponses et l'abstraction entre plusieurs fournisseurs — abstraction dont l'utilité a été démontrée en pratique lors du changement de fournisseur en cours de projet. La séparation entre frontend, backend principal et service sandbox enfin m'a fait comprendre concrètement les conséquences des choix d'architecture sur la sécurité et l'évolutivité d'une application.

Je remercie Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich pour la confiance accordée et ses retours tout au long du projet, ainsi que l'ensemble de l'équipe pédagogique du Master 2 MBDS.

### 8.3 Gain estimé

Volume avant : ~1 page (5 paragraphes). Volume après : ~0,7 page (3 paragraphes). **Gain : 0,3 page**.

---

## 9. Fix 8 — Déplacer le Tableau 6 (traçabilité US ↔ Cas d'utilisation) en annexe

### 9.1 Diagnostic

Le Tableau 6 occupe à peu près une pleine page (p38). Il comporte 14 lignes mettant en correspondance les User Stories et les 14 cas d'utilisation. Cette traçabilité est précieuse pour un jury mais ne doit pas nécessairement occuper une page entière dans le corps : les 4 cas détaillés dans 5.1.1 à 5.1.4 ne concernent que US03, US05, US09 et US13.

Proposition : conserver dans le corps un extrait du Tableau 6 limité aux 4 cas détaillés (US03/Cas-01, US05/Cas-02, US09/Cas-06, US13/Cas-12), et renvoyer la version complète à 14 lignes en annexe.

### 9.2 Texte prêt à coller

**Extrait du Tableau 6 — Cas d'utilisation détaillés dans ce chapitre** (le tableau complet des 14 cas est présenté en Annexe 6)

| ID | User Story | Cas d'utilisation | Acteur principal |
|---|---|---|---|
| US03 | Importer le CV d'un candidat | Cas-01 — Analyser le CV | Recruteur |
| US05 | Générer une évaluation adaptée | Cas-02 — Générer un test adapté | Recruteur |
| US09 | Passer l'évaluation en ligne | Cas-06 — Accéder à une évaluation | Candidat |
| US13 | Consulter le compte rendu | Cas-12 — Consulter les résultats | Recruteur |

### 9.3 Gain estimé

Volume avant : ~1 page (Tableau 6 complet + diagramme Fig. 3). Volume après : ~0,6 page (extrait 4 lignes + Fig. 3). **Gain : 0,4 page**.

La traçabilité complète est préservée en annexe. Figure 3 (cas d'utilisation global) et les 4 cas détaillés restent dans le corps.

---

## 10. Fix 9 — Alléger 4.4 Budget

### 10.1 Diagnostic

4.4 occupe un peu plus d'une demi-page (p36). Elle contient 2 paragraphes d'introduction qui redisent ce que le tableau budget synthétise déjà :
- Paragraphe 1 : « Le développement de SkillForge a été réalisé en interne... prime de 1 000 000 MGA versée... Services IA 50 000 MGA... autres ressources mises à disposition. »
- Paragraphe 2 : « Le tableau ci-dessous synthétise... »

Le tableau budget suit, puis implicitement le chapitre 5 commence. Les 2 paragraphes d'intro peuvent être condensés en 2 phrases.

### 10.2 Texte condensé prêt à coller

**4.4 Budget du projet**

SkillForge a été développé en interne chez Tsarajoro dans le cadre d'un stage M2 MBDS. Le budget engagé se limite à la prime projet de 1 000 000 MGA (≈ 198 EUR) versée à la livraison et à la consommation d'API d'IA (OpenAI) d'environ 50 000 MGA (≈ 10 EUR) pour les tests ; les équipements, locaux et connexion ont été mis à disposition sans facturation spécifique.

| Poste | Description | Montant (MGA) | Montant (EUR) |
|---|---|---|---|
| Prime projet | Gratification versée par Tsarajoro à la livraison | 1 000 000 | ≈ 201,09 |
| Services IA (OpenAI) | Consommation réelle des API pour les tests | ≈ 50 000 | 10 |
| Équipements & Locaux | Matériel, réseau et locaux mis à disposition | Non facturés | — |
| **Total engagé** | | **≈ 1 050 000** | **≈ 211,09** |

Tableau — Budget effectivement engagé pour le projet SkillForge.

### 10.3 Gain estimé

Volume avant : ~0,6 page. Volume après : ~0,3 page. **Gain : 0,3 page**. Tous les chiffres préservés.

---

## 11. Fix 10 — Supprimer l'introduction redondante du chapitre 5

### 11.1 Diagnostic

L'introduction du chapitre 5 (p37) comporte 3 lignes qui redisent ce que l'intro du mémoire a déjà annoncé : « Ce chapitre présente les principales exigences fonctionnelles et non fonctionnelles réalisées dans SkillForge du point de vue des utilisateurs. Le projet ayant été conduit selon une démarche Scrum, les exigences fonctionnelles sont principalement exprimées sous forme de User Stories. »

Puis vient une mention explicite : « L'ensemble des exigences est présenté dans le backlog du projet. Afin de ne pas alourdir cette partie, quatre User Stories représentatives ont été retenues. »

Proposition : fusionner ces deux paragraphes en une seule phrase.

### 11.2 Texte condensé prêt à coller

**5. Exigences réalisées dans le projet (vision externe/utilisateur)**

Ce chapitre présente les exigences fonctionnelles et non fonctionnelles de SkillForge. Les fonctionnelles sont exprimées sous forme de User Stories et consolidées dans le backlog (Tableau 4, chap. 4) ; quatre cas d'utilisation représentatifs du parcours complet sont détaillés ci-après.

### 11.3 Gain estimé

**Gain : 0,2 page**.

---

## 12. Déplacements vers annexe proposés

Récapitulatif des éléments à basculer en annexe avec cette v3 bis.

| Élément | Origine (corps) | Destination (annexe) | Gain |
|---|---|---|---|
| Figure 11 — MCD | Déjà fait (M-E7 bis) | Annexe 1 — Modèle de données | — (déjà comptabilisé) |
| Tableau Outils (10 lignes, 4.1.4) | 4.1.4 | **Nouvelle Annexe 5 — Outils du projet** | 0,6 page |
| Figure 10 — Packages backend | 7.2.2 | **Annexe 5** (même annexe) | 0,4 page |
| Tableau 6 complet (14 US ↔ cas) | 5.1 | **Nouvelle Annexe 6 — Traçabilité User Stories ↔ Cas d'utilisation** | 0,4 page |

Les annexes existantes 1 à 4 ne sont pas touchées. On crée simplement **Annexe 5 (Outils + Figure 10)** et **Annexe 6 (Traçabilité complète)**. L'étudiant doit renuméroter en conséquence et ajouter les renvois dans la table des matières.

---

## 13. Plan B si on dépasse encore 40 pages

Si après les 10 fix précédents le corps reste à 41 pages, voici trois leviers supplémentaires activables (ordre de rentabilité décroissante).

### Plan B1 — Fusionner 4.1.4 et 4.1.5 totalement sans mentionner d'outils secondaires

Supprimer dans 4.1.4 les mentions à Mermaid, GanttProject et DBSchema (déjà en annexe), ne garder que les 6 outils structurants. **Gain : 0,2 page**.

### Plan B2 — Condenser 2.1 Démarche de l'état de l'art

Attention : zone de principe intouchable (prof demande de renforcer le chap 2). **MAIS** 2.1 (Démarche et périmètre) est une sous-section méta de 2/3 de page qui n'apporte pas de contenu scientifique nouveau. On peut la condenser à 3 phrases sans retirer de source bibliographique ni de contenu analytique. **Gain : 0,3 page**. Risque : moyen — à faire valider par l'étudiant ; une partie du chap. 2 est touchée mais sa substance scientifique est intacte.

### Plan B3 — Condenser 2.6 Qualité, tests et contraintes d'exploitation

Zone intouchable aussi, mais 2.6 est une sous-section généraliste. On peut la ramener à 1 paragraphe de 5 lignes citant OWASP, les contraintes de performance et l'exploitation. **Gain : 0,3 page**. Risque : moyen.

### Plan B4 — Supprimer les 2 paragraphes de transition entre tableau budget et chap. 5

Si le chap. 4 reste trop long, on peut terminer directement sur « Tableau — Budget engagé » sans phrase de clôture. **Gain : 0,1 page**.

**Total Plan B activable : jusqu'à 0,9 page supplémentaire**. Suffisant pour absorber une sur-estimation du Plan principal.

---

## 14. Récapitulatif chiffré

| Niveau | Détail | Gain |
|---|---|---|
| État v3 brut | 48 pages | — |
| Après fix Fig. 11 + Fig. 12 (déjà fait) | 46,7 pages | −1,3 |
| Fix 1 — 3.1.2 + 3.2 + 3.4 fusion | 45,4 | −1,3 |
| Fix 2 — 4.1 condensation + tableau Outils en annexe | 43,9 | −1,5 |
| Fix 3 — Cas-02, Cas-06, Cas-12 résumés | 42,9 | −1,0 |
| Fix 4 — 5.3.1 IHM resserrée | 42,3 | −0,6 |
| Fix 5 — 7.1 + 7.2.1 + 7.2.2 condensation + Fig. 10 en annexe | 41,4 | −0,9 |
| Fix 6 — 1.1 + 1.2 condensation | 40,8 | −0,6 |
| Fix 7 — 9.4 Bilan personnel | 40,5 | −0,3 |
| Fix 8 — Tableau 6 extrait + annexe | 40,1 | −0,4 |
| Fix 9 — 4.4 Budget allégé | 39,8 | −0,3 |
| Fix 10 — Intro chap. 5 fusionnée | 39,6 | −0,2 |
| **Objectif** | **40 pages** | — |
| Marge | 0,4 page sous la cible | |

**Résultat attendu si tous les fix sont appliqués : 39,6 à 40,5 pages selon la variabilité des rendus Word.**

Si l'estimation s'avère optimiste de ±0,5 page par fix, l'intervalle réaliste se situe entre **39,5 et 41,5 pages**. Le Plan B apporte jusqu'à 0,9 page supplémentaire pour sécuriser.

Trade-off honnête : **40 pages atteignable avec marge très mince**. Si l'étudiant veut une marge plus confortable (par exemple 38-39 pages), il devra activer tout ou partie du Plan B — ce qui touche très légèrement au chap. 2 (sections méta 2.1 ou 2.6, pas le fond scientifique).

---

## 15. Checklist finale

- [ ] Chapitre 2 (État de l'art) intact — zéro mot retiré en priorité 1
- [ ] M-F2 préservé — diagrammes UML séquence/activités + états passation en 5.1
- [ ] M-F3 préservé — Tableau 7 enrichi des exigences non fonctionnelles
- [ ] M-F5 préservé — section 5.3.2 Interfaces avec d'autres systèmes
- [ ] M-G3 préservé — extraits de code interface LlmClient + config sandbox en 7.2.3
- [ ] M-G5 préservé — Figure 12 (séquence interne de l'accès à une passation) et son texte condensé
- [ ] M-E7 préservé — section Planification 4.3 avec Figures 1, 2 et 4 écarts (non touchée)
- [ ] M-J1 préservé — biblio [13]-[17] et insertions dans 2.3 et 2.5
- [ ] M-A4 préservé — table d'acronymes et glossaire séparés
- [ ] M-J2 préservé — renvois biblio corrigés en 2.2.2
- [ ] Tableaux chiffrés préservés — budget 1 050 000 MGA (4.4), k6 p95 4,37 s (8.4), JUnit 27 (8.1), OWASP ZAP (8.3), livrables (3.4 et 9.1), risques (Tab. 3), 90 jours (Tab. 5), sprints (Tab. 6), NFR (Tab. 7)
- [ ] Fig. 11 reste en annexe uniquement (confirmé par le fix antérieur)
- [ ] Fig. 12 reste dans le corps (section 7.2.5)
- [ ] Nouvelle Annexe 5 créée (Outils + Figure 10) avec renvois dans la TOC
- [ ] Nouvelle Annexe 6 créée (Traçabilité US ↔ Cas d'utilisation complète) avec renvoi dans la TOC
- [ ] Nombre de pages corps après application des 10 fix : **~40** (cible atteinte)
- [ ] Plan B tenu en réserve si dépassement constaté
