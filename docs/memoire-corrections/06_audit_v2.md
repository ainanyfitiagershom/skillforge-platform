# Audit mémoire v2 vs fiche retour prof

Document audité : `MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v2.pdf` (70 pages PDF)
Fiche de référence : `Fiche retour M2 MBDS 2025-2026 – ETU001776 GERSHOM.pdf`
Date de l'audit : 5 octobre 2026

## 0. Mesure du volume

- Nombre total de pages du PDF : **70**
- Pagination affichée : commence à **"1" sur l'Introduction** (page PDF 12) et se termine à **"59" sur la dernière annexe** (page PDF 70)
- Front matter (page de garde, résumé, abstract, ToC, listes, glossaire) : **11 pages** non numérotées
- Corps du mémoire (Introduction au Bilan personnel) : **Introduction (p. affichée 1) → fin du Bilan personnel (p. affichée 48)** → **48 pages de corps**
- Annexes : **p. affichée 49 à 59** → 11 pages (dont biblio 2 pages)
- Objectif prof : **40 pages de corps**
- **Écart : +8 pages de corps à retirer (passé de 50 à 48, encore 8 au-dessus)**

Note : la table des matières annonce "Introduction 10" mais la page affichée est "1" ; **la ToC est désynchronisée de la pagination réelle du PDF** (défaut de forme supplémentaire non noté par le prof mais qui gêne la lecture).

## 1. Priorités globales du prof - statut

### Priorité 1 - Ramener le corps à 40 pages
**Statut : 🟡 Partiellement traité**
- Le corps est passé de 50 à 48 pages → gain minime, loin des 40 pages exigées.
- Section 4.1.4 (Outils) : effectivement condensée en tableau (p. 17-18). OK.
- Section 4.1.5 (Gestion de la configuration) : encore sur 2 pages (p. 18-19). Peut encore être réduit.
- Section 4.4 (Budget) : réduite à 1 page avec tableau. OK.
- Captures IHM (5.3.1) : encore 5 captures dans le corps (figures 3, 4, 5, 6, 7, p. 32-33 et 54-56). Seules les figures 14, 15, 16 (listes/compte rendu/dashboard) sont basculées en annexe. **Au moins 3 des 5 captures principales doivent encore partir en annexe pour tenir 40 pages.**
- Grands blancs : la plupart des sections de chapitre démarrent sur une page quasi-vierge (p. 54 montre figure 4 seule), **mise en page encore aérée**.

### Priorité 2 - Renforcer état de l'art IA et données
**Statut : 🟡 Partiellement traité**
- Section 2.3 renommée "Intelligence artificielle appliquée à l'évaluation technique : architecture, biais et cadre réglementaire" avec 3 sous-blocs : abstraction, biais, cadre juridique.
- **Mentions ajoutées** : RGPD, AI Act, Loi 2014-038 Madagascar, option Ollama locale, biais (stéréotypes), références [1]-[2] (Raghavan, Bogen).
- **Toujours absent** :
  - **Pas de comparatif chiffré des LLM** (coût par CV, latence, qualité). Les fournisseurs sont listés (OpenAI, Groq, Gemini, Claude, GitHub Models, Ollama) mais sans aucun tableau de prix / tokens / latence. **Demande explicite du prof non traitée**.
  - **Pas de protocole d'évaluation** de la justesse de l'extraction des compétences (pas de jeu de CV annotés, pas de taux de rejet par le recruteur).
  - Les biais sont évoqués en 3 lignes sans développement sur la discrimination algorithmique dans le recrutement.
  - L'envoi des CV à des services étrangers est mentionné en 1 ligne mais sans discussion de consentement, finalité, durée de conservation, anonymisation.
- Tableau "choix / options écartées / risque / repli" ajouté en 2.7 (**bien fait**, 3 lignes : sandbox, multi-LLM, validation humaine). ✅

### Priorité 3 - Scrum vérifiable + budget chiffré
**Statut : 🟡 Partiellement traité**
- **Backlog 15 US** (US01-US15) avec priorités en Tableau 4 (p. 20-21). OK.
- **Estimation initiale chiffrée** avec tableau Préparation/S1-S8/Tests/Livraison = **90 jours** (Tableau 5, p. 21). ✅ Bonne nouveauté.
- **Découpage en 9 sprints** (Sprint 0 à Sprint 8) avec objectif, travaux, estimation (Tableau 6, p. 22-23). ✅
- **Gantt réalisé** affiché p. 24 (figure capturée depuis GanttProject). ✅ Bonne nouveauté.
- **Budget chiffré** p. 25 : Prime projet 1 000 000 MGA (≈198 €), Services IA 50 000 MGA (≈10 €), locaux non facturés, total ≈1 050 000 MGA (≈208 €). ✅ Montants donnés.
- **Toujours absent / faible** :
  - **Pas de vélocité** calculée, pas de burndown chart.
  - **Pas de comparaison planning prévu vs réalisé** avec analyse des écarts (le texte reste vague : "les tâches concernées sont réorganisées").
  - **Pas de rôles Scrum attribués** (PO, Scrum Master toujours non nommés).
  - **US sans estimation en points** (seulement priorité).
  - **Statut de chaque risque à la fin du stage** : tableau 3 ajoute une colonne "Statut" (Traité/Maîtrisé/Contrôlé) ✅, mais pas de probabilité ni de facteurs contributifs.

### Priorité 4 - Tests et conclusion complétés
**Statut : 🟡 Partiellement traité**
- **Nombre de tests JUnit chiffré** : Tableau p. 41-42 (27 tests détectés, 25 réussis, 2 ignorés). ✅
- **Test de charge k6** complété : Tableau 9 p. 44 (60 s, 20 VUs, 707 requêtes, 117 itérations, 823 checks, 0 erreur, p95 = 4,37 s). ✅ Belle nouveauté.
- **Section 8.5 "Évaluation de la qualité des sorties IA"** ajoutée (p. 44-45) : décrit l'approche (vérification manuelle par le recruteur, validation humaine) mais **sans jeu de CV annoté, sans taux de précision/rappel chiffré, sans mesure de la pertinence des questions**. Reste qualitatif.
- **Tableau des livrables avec % et statut** ajouté en 9.1 (p. 45-46) : 9 livrables, tous à 100 %, statut Testé/Finalisé. ✅
- **Toujours absent** :
  - La couverture de tests JUnit (JaCoCo ou équivalent) n'est pas chiffrée.
  - L'évaluation de la justesse de l'IA reste déclarative.
  - La section 9.2 (problèmes rencontrés) a été enrichie (indisponibilité GitHub Models, tests JS en sandbox, qualité des générations) mais sans "impact sur le planning".

### Priorité 5 - Corrections de forme
**Statut : ❌ Non traité pour l'essentiel**
- **Pagination x/N** : ❌ Non appliquée. La pagination reste "1, 2, 3..." (pas de dénominateur). Demande explicite du prof non traitée.
- **Table des acronymes séparée** : ❌ Non créée. Le "Glossaire" (p. 7-9) mélange toujours acronymes (API, IA, IHM, LLM, MCD, OWASP, QCM, RGPD, UML) et termes (Backend, Docker, Sprint, Vite, React, Spring Boot…). Les acronymes manquants (CV, CU, US, CSS, UI, PDF, DOCX, HTTP, SMTP, REST, ZAP, ASVS, MBDS) ne sont pas ajoutés. **Demande explicite non traitée**.
- **Renvois biblio en 2.2.2** : 🟡 Partiellement corrigé. HackerRank cité [1], Codility [2][3], TestGorilla [4][5], CoderPad [6][7] — ces renvois **sont toujours faux** car ils pointent vers Raghavan, Bogen, Russell, Merkel, OWASP et HackerRank commercial. **Pas de correction** par rapport à la v1 (le prof signale exactement ce point).
- **Titre factuel** : ❌ Non traité. Le titre reste "Conception et développement d'une plateforme nouvelle génération de recrutement technique entièrement assistée par IA, du CV au verdict" — exactement la formulation que le prof demandait de remplacer. **Demande explicite non traitée.**
- **Harmoniser slides avec mémoire** : Impossible à vérifier (fichier slides pas fourni dans V2).

---

## 2. Audit critère par critère

### A. Forme et identification

| ID | Critère | Statut avant | Statut v2 | Preuve (page/section) | Ce qui manque |
|---|---|---|---|---|---|
| M-A1 | Page de garde | Partiel | 🟡 Partiellement traité | P. garde PDF 1 : logos UCA/MBDS/Tsarajoro/ITU OK, jury complet (Robinson, Razafinjoelina, RAVELOMANANTIANA) | **Titre toujours "nouvelle génération... entièrement assistée par IA, du CV au verdict"** → formulation marketing refusée par le prof, non modifiée |
| M-A2 | Résumé / Abstract | Partiel | 🟡 Partiellement traité | PDF p. 2-3 : résumé + abstract présents, résultats chiffrés (0 évasion sur 50, OWASP ZAP) | **Mots-clés (FR + EN) toujours absents** ; pas de phrase sur ce qui reste à faire (déploiement, tests charge, qualité IA) |
| M-A3 | Listes figures/tableaux | Conforme | ⚪ Déjà conforme | PDF p. 4-6 : 8 tableaux, 18 figures listés | — |
| M-A4 | Acronymes et glossaire | À revoir | ❌ Non traité | Glossaire p. 7-9 : mélange toujours acronymes et termes | **Pas de table d'acronymes séparée** ; acronymes manquants (CV, CU, US, CSS, UI, PDF, DOCX, HTTP, SMTP, REST, ZAP, ASVS, MBDS) non ajoutés |
| M-A5 | Plan et numérotation | Conforme | 🟡 Partiellement traité | ToC générée, numérotation 1., 1.1 OK | "Conclusion générale" **toujours en chapitre 9** (non renommée en "Conclusion") ; intertitres 4.3 ("Backlog du projet", "Estimation de la charge", "Découpage en itérations", "Suivi et pilotage", "Planification") **restent sans numérotation 4.3.1-4.3.5** — demande explicite du prof non traitée |
| M-A6 | Pagination | À revoir | ❌ Non traité | Pagination affichée "1" sur Introduction, "59" sur dernière annexe | **Pas de format x/N** ; aucun total n'apparaît |
| M-A7 | Volume et annexes | À revoir | 🟡 Partiellement traité | Corps = 48 pages (gain de 2) ; 4.1.4 condensée en tableau ✅ | **Toujours 8 pages au-dessus du maximum de 40** ; 5 captures IHM encore dans le corps ; mise en page avec grands blancs ; annexes **toujours non référencées depuis le corps** |
| M-A8 | Rédaction et ton | Conforme | ⚪ Déjà conforme | Écriture claire conservée | Les coquilles "développement.." et espaces avant deux-points n'ont pas été spécifiquement vérifiées à ce stade |

### B. Introduction et présentation

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-B1 | Introduction | Conforme | 🟡 Partiellement traité | PDF p. 12 : contexte, mission, problématique OK | L'introduction annonce chap. 1 → chap. 8 mais **ne mentionne pas la conclusion ni ne distingue chap. 5, 6, 7 séparément** (reste "chapitres 5 à 7") |
| M-B2 | Présentation entreprise | Partiel | ❌ Non traité | Section 1.1 p. 2 : description générique Tsarajoro | **Toujours pas de date de création, pas d'effectif, pas de volume de recrutements, pas de source** ; aucun fait concret ajouté |
| M-B3 | Sujet, objectifs et enjeux | Partiel | ❌ Non traité | Section 1.2 p. 2-3 : objectifs qualitatifs seulement | **Problème non chiffré** (temps actuel de préparation / correction, nombre de candidats par campagne absents) ; sans cela l'objectif "réduire le temps" reste invérifiable |

### C. État de l'art

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-C1 | Distinction état de l'art / existant | Conforme | ⚪ Déjà conforme | Chapitre 2 marché/techno, chapitre 3 processus Tsarajoro | — |
| M-C2 | Veille et traçabilité des sources | Partiel | 🟡 Partiellement traité | 2.1 réécrit : décrit la démarche de veille (OWASP, docs officielles) | **Toujours peu de sources, surtout commerciales** ; biais commercial non signalé ; affirmations LLM (variabilité, dépendance fournisseur) toujours non sourcées |
| M-C3 | Benchmark des solutions existantes | Partiel | 🟡 Partiellement traité | Tableau 1 p. 15 : 7 critères × 5 solutions. **"Commerciale" sans prix** ; critères toujours peu discriminants ("Oui, validation avant envoi" partout) | **Coût par candidat / par an toujours absent** ; **briques open source (Judge0, Piston) toujours non envisagées** |
| M-C4 | Contraintes de l'entreprise et besoin métier | Partiel | ❌ Non traité | Section 2.3 aborde biais / cadre juridique | **Aucun paragraphe sur compétences de l'équipe, standards techniques imposés / négociables, cadre réglementaire du recrutement (non-discrimination, droit du travail)** |
| M-C5 | Utilisateurs et usages | Partiel | ❌ Non traité | Chapitre 1 et 4.1.3 : rôles cités | **Toujours pas de profil / équipement des candidats** (poste, navigateur, qualité de connexion), **pas d'analyse FR/MG/EN**, **pas de contraintes épreuve chronométrée** |
| M-C6 | Architectures et stack technologique | À revoir | ❌ Non traité | 2.4 : explique monolithique vs microservices vs intermédiaire | **Toujours pas de matrice multicritères pondérée** (Docker vs gVisor vs microVM vs service tiers) ; **le texte reconnaît toujours que "les technos n'ont pas fait l'objet d'une comparaison exhaustive"** (p. 8) |
| M-C7 | Données, flux et intégration au SI | Partiel | ❌ Non traité | Interfaces 5.3.2 citent LLM/SMTP/sandbox | **Format JSON des réponses IA toujours non décrit** ; volumétrie absente ; pas d'info sur intégration ATS |
| M-C8 | Briques algorithmiques / IA | À revoir | 🟡 Partiellement traité | 2.3 enrichi : abstraction LlmClient, biais, cadre juridique, références [1][2] citées | **Pas de comparatif chiffré des fournisseurs** (qualité, coût par CV, latence, localisation) → **demande explicite non traitée** ; **pas de protocole d'évaluation de la qualité** ; AI Act mentionné sans dire qu'il classe le recrutement en "haut risque" |
| M-C9 | Sécurité, protection des données, conformité | Partiel | 🟡 Partiellement traité | Loi 2014-038 citée en 2.3 (une ligne), RGPD mentionné, Ollama local présenté comme alternative | **Pas de discussion consentement / finalité / durée de conservation / anonymisation avant envoi** ; suivi anti-fraude mentionné sans justification RGPD |
| M-C10 | Performance, qualité, déploiement | Partiel | 🟡 Partiellement traité | 2.6 "Qualité, tests et contraintes d'exploitation" + Tableau 7 ENF | **Options d'hébergement** (serveur interne, VPS, cloud) **toujours non discutées** ; chaîne CI/CD mentionnée mais pas détaillée ; stratégie de sauvegarde absente |
| M-C11 | Contexte local, coûts et soutenabilité | À revoir | 🟡 Partiellement traité | Ollama local évoqué 2.3 ; budget 4.4 chiffré en MGA/EUR | **Rien sur la connectivité et les coupures pendant une épreuve** ; **coût total de possession** (serveur, maintenance, tokens projetés) non calculé ; **maintenance après le stage** par une équipe qui n'a pas développé non évoquée |
| M-C12 | Synthèse et justification des choix | À revoir | ✅ Traité | Tableau 2 p. 10 : "Choix retenu / Option écartée / Motif / Risque résiduel / Plan de repli" sur 3 lignes (sandbox, multi-LLM, validation humaine) | Pourrait couvrir plus de décisions (PostgreSQL, Spring Boot, hébergement interne) mais la structure demandée **est en place** |
| M-C13 | Proportion de l'état de l'art | Partiel | 🟡 Partiellement traité | État de l'art p. 4 à 10 soit ~7 pages | Proche de la limite basse ; les ajouts C8/C9/C11/C12 pourraient justifier 2 pages de plus **à condition de retirer les pages excédentaires ailleurs** |

### D. Existant et solution envisagée

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-D1 | Étude de l'existant | Partiel | ❌ Non traité | 3.1.1 et 3.1.2 : description qualitative inchangée | **Toujours pas d'outils réellement utilisés (courriel, dépôt, documents partagés)** ; pas d'exemple de test actuel ; pas de nombre de candidats par campagne ni temps passé chiffré |
| M-D2 | Critique de l'existant | Conforme | ⚪ Déjà conforme | 3.2 : positif + négatif structurés | — |
| M-D3 | Solutions envisagées | Conforme | ⚪ Déjà conforme | 3.3 : trois options avec justification | Chiffrage "acquérir" toujours absent (lié à M-C3) |
| M-D4 | Objectifs et livrables | Partiel | 🟡 Partiellement traité | 3.4 liste 7 objectifs + 10 livrables ; Tableau 9.1 ajouté avec % et statut | **Toujours pas de tableau objectif/indicateur/cible/valeur atteinte au chapitre 3** (le mémoire n'intègre pas les cibles "< 15 s / CV", "0 évasion / 50") ; les cibles n'apparaissent que dans Tableau 7 ENF et Tableau 9.1 bilan |

### E. Démarche projet

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-E1 | Activités d'ingénierie logicielle | Conforme | ⚪ Déjà conforme | 4.1.1 : analyse, conception, dev par blocs, tests | — |
| M-E2 | Méthode de gestion de projet | Partiel | 🟡 Partiellement traité | 4.1.2 Scrum ; Tableau 4 (15 US + priorité) ; Tableau 5 (estimation jours par sprint) ; Tableau 6 (découpage sprint par sprint) | **Pas d'estimation en points pour les US** ; **pas de vélocité** ; **pas de burndown** ; **rôles Scrum (PO, Scrum Master) toujours non attribués** |
| M-E3 | Rôles, équipe et contribution personnelle | Conforme | ⚪ Déjà conforme | Tableau 2 p. 16-17 : parties prenantes, relation avec l'étudiant | Phrase "seul développeur" non ajoutée mais implicite via tableau |
| M-E4 | Outils | Partiel | ✅ Traité | Tableau p. 17-18 : catégorie, outil, usage effectif (incluant GanttProject, DBSchema, Mermaid) | Reste à "déclarer l'usage éventuel d'assistants IA de code" (non ajouté) mais la demande principale (tableau outil/usage, intégration GanttProject) est **traitée** |
| M-E5 | Gestion de la configuration | Partiel | 🟡 Partiellement traité | 4.1.5 : Git/GitHub, Conventional Commits, GitHub Actions, Flyway | **Arborescence du dépôt non montrée** (frontend/backend/sandbox/migrations) ; stratégie de branches, emplacement docs, serveurs et accès absents |
| M-E6 | Contraintes et plan de risques | Partiel | 🟡 Partiellement traité | Tableau 3 p. 19 : R1-R6, Gravité, Actions, **Statut (Traité/Maîtrisé/Contrôlé)** ajouté | **Probabilité absente** ; **facteurs contributifs absents** ; actions pas plus précises (toujours "Isoler la sandbox, limiter les ressources") |
| M-E7 | Planification | À revoir | ✅ Traité | Figure 1 p. 24 : **Gantt réalisé exporté de GanttProject** ; Tableau 5 estimation chiffrée ; mois mai→septembre détaillés | Pas d'analyse chiffrée des écarts (Gantt initial vs réalisé) ; outil GanttProject est mentionné dans le tableau outils ; **demande principale (planning réalisé + outil) traitée** |
| M-E8 | Budget | À revoir | ✅ Traité | 4.4 p. 25 : prime 1 000 000 MGA ≈198 €, services IA 50 000 MGA ≈10 €, locaux non facturés, total 1 050 000 MGA ≈208 € | Taux de change et date associée non mentionnés, mais montants en MGA et EUR présents ; **demande principale traitée** |

### F. Exigences (vision utilisateur)

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-F1 | Exigences fonctionnelles | Partiel | 🟡 Partiellement traité | Tableau 6 p. 26-27 (14 CU : Cas-01 à Cas-14), 4 CU détaillés en 5.1.1-5.1.4 | **Lien CU ↔ US toujours pas donné** (Cas-01 vs US01…) ; **CU détaillés toujours sans identifiant** (5.1.2 fusionne implicitement Cas-02 et Cas-03) ; **mémoire affirme toujours "autres CU en annexe"** alors qu'aucune annexe ne les contient |
| M-F2 | Diagrammes UML associés | Absent | ❌ Non traité | Figure 2 p. 28 : seul le diagramme global des cas d'utilisation est fourni | **Pas de diagramme de séquence système (boîte noire)**, **pas de diagramme d'activités**, **pas de diagramme d'états** pour la passation (invitée, ouverte, en cours, soumise, corrigée, expirée). Figure 12 (séquence) ne concerne QUE la vue interne (chapitre 7), pas les CU utilisateurs |
| M-F3 | Exigences non fonctionnelles | Partiel | 🟡 Partiellement traité | Tableau 7 p. 31 : 9 ENF avec cible et état | **Utilisabilité et capacité toujours "Réalisée" sans protocole chiffré** ; **robustesse (indisponibilité IA, perte connexion, délai max) absente** ; protocole des mesures "environ 5 à 10 s" non précisé |
| M-F4 | IHM | Conforme | ⚪ Déjà conforme | Figures 3-7 : 5 écrans commentés | Titre figure 5 "passation" alors que la capture montre saisie du code d'accès → non corrigé ; CU correspondant non indiqué par figure |
| M-F5 | Interfaces avec d'autres systèmes | Partiel | ❌ Non traité | 5.3.2 p. 34 : 4 paragraphes génériques (LLM, Mailpit, SMTP, sandbox) | **Endpoints / méthodes toujours non décrits**, **format des données non précisé**, **délais d'expiration, gestion d'erreurs, nouvelles tentatives absents** |

### G. Architecture et conception

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-G1 | Architecture logicielle et technique | Partiel | ✅ Traité | Figures 8 et 9 **enrichies avec ports (5173, 8090, 8091, 5434, 11434), TLS 1.3, reverse proxy Traefik/Nginx, Docker Engine, volumes** | Détails ajoutés par rapport à la v1 ; demande principale (machines/conteneurs/ports/réseaux + socket Docker) **traitée** |
| M-G2 | Plateforme technique | Partiel | 🟡 Partiellement traité | 7.1 p. 36 : Java 21, Spring Boot, React, TypeScript, PostgreSQL, Flyway, Docker | **Versions précises (React 19, Vite 6, PostgreSQL 16, Spring Boot 3.4) visibles seulement dans la figure 8**, pas dans le texte ; **modules Spring utilisés (Security, Data JPA) toujours non détaillés** |
| M-G3 | Conception du code source | Partiel | 🟡 Partiellement traité | 7.2.1 p. 37 : organisation par domaines ; Figure 10 p. 38 vue packages | **Extraits de code commentés toujours absents** (interface LlmClient, config conteneur sandbox) |
| M-G4 | Modélisation des données | Partiel | 🟡 Partiellement traité | Figure 11 p. 39 modèle, Figure 13 annexe 1 modèle complet | **Distinction MCD / MLD toujours absente** ; **dictionnaire des données absent** (tables centrales passation, réponse, événement anti-fraude) |
| M-G5 | Réalisation d'un cas d'utilisation | Conforme | ⚪ Déjà conforme | Figure 12 p. 40 : séquence passation sécurisée en boîte blanche | Un 2ᵉ exemple sur analyse de CV via LlmClient aurait renforcé mais pas bloquant |
| M-G6 | Composants et déploiement | Partiel | 🟡 Partiellement traité | 7.2.5 p. 41 : 3 composants cités ; architecture technique Figure 9 plus détaillée | **Pas de Docker Compose explicite**, **variables d'environnement et secrets non listés**, **ordre de démarrage non décrit** |

### H. Tests

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-H1 | Tests réalisés et résultats | Partiel | ✅ Traité | 8.1 : 27 tests JUnit (19 app + 8 sandbox, 25 réussis, 2 ignorés) ; 8.3 : Tableau 8 sécurité (0 évasion/50, 100 valides, latence 330/422 ms, OWASP ZAP sans alerte) ; 8.4 Tableau 9 k6 (60 s, 20 VU, p95 4,37 s, 0 erreur) ; 8.5 nouvelle section qualité IA | **Pas de couverture JaCoCo chiffrée** ; **8.5 qualité IA reste qualitative** (pas de jeu de CV annoté, pas de précision/rappel) ; tests fonctionnels toujours sans tableau de cas de test |

### I. Conclusion

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-I1 | Bilan des résultats et des livrables | À revoir | 🟡 Partiellement traité | Tableau 9.1 p. 45-46 : 9 livrables avec cible/réalisation/taux/statut (tous 100 %) | **Chapitre toujours intitulé "Conclusion générale"** (prof demandait "Conclusion") ; cibles des objectifs chiffrées (< 15 s / CV, 0 évasion / 50) **pas reprises explicitement** à la hauteur du bilan |
| M-I2 | Problèmes rencontrés et solutions | Partiel | 🟡 Partiellement traité | 9.2 p. 46-47 : 3 difficultés précises (GitHub Models indisponible → bascule, tests JS sandbox, qualité des premières générations) | **Impact sur le planning** non chiffré ; cas restent décrits mais sans réparation chronologique |
| M-I3 | Perspectives | Conforme | ⚪ Déjà conforme | 9.3 p. 47 : court/moyen terme (déploiement interne, langages, intégration ATS, exploitation données) | — |
| M-I4 | Bilan personnel | Conforme | ⚪ Déjà conforme | 9.4 p. 47-48 : sécurité, prompts, abstraction LLM, lien aux enseignements | — |

### J. Références et annexes

| ID | Critère | Statut avant | Statut v2 | Preuve | Ce qui manque |
|---|---|---|---|---|---|
| M-J1 | Bibliographie | Partiel | 🟡 Partiellement traité | 12 références : [1] Raghavan et al., [2] Bogen & Rieke, [3] Russell & Norvig, [4] Merkel 2014, [5] OWASP ASVS, [6]-[9] plateformes commerciales, [10]-[12] OWASP + Docker | **Toujours peu de sources LLM / évaluation sorties** ; **pas de source sur la loi 2014-038 ou RGPD** ; Merkel 2014 toujours daté |
| M-J2 | Citations des emprunts | À revoir | ❌ Non traité | 2.2.2 p. 14 : HackerRank → [1], Codility → [2][3], TestGorilla → [4][5], CoderPad → [6][7] | **Les renvois sont toujours faux** : [1]-[5] sont des sources scientifiques/techniques (Raghavan, Bogen, Russell, Merkel, OWASP) et non des plateformes. Les plateformes sont [6]-[9]. **Prof signale exactement ce point, non corrigé** |
| M-J3 | Annexes | Partiel | 🟡 Partiellement traité | 4 annexes p. 50-59 : modèle complet, interfaces (listes/rapport/dashboard), sandbox, multi-LLM | **Toujours aucune référence depuis le corps** vers les annexes (pas de "voir annexe 1 pour le modèle complet") ; CU restants, backlog détaillé, plan de tests, dictionnaire des données **toujours absents** |

### Slides (S-1 à S-12)

Les slides v2 ne sont pas fournis dans le dossier V2. **Audit impossible** sur ces 12 critères. Seul le mémoire aborde certains alignements : le titre affiché sur la page de garde (M-A1) reste non factuel, ce qui bloque S-1 et S-5 d'office tant que les slides n'ont pas été alignés.

---

## 3. Synthèse chiffrée

Critères mémoire (M-A1 à M-J3) uniquement, soit **42 critères** (les 12 critères slides S-1 à S-12 ne peuvent pas être audités car les slides v2 ne sont pas fournis dans V2).

- ✅ Traités : **7** / 42 (M-C12, M-E4, M-E7, M-E8, M-G1, M-H1 ; + M-G5 déjà conforme reclassé en déjà conforme)
- 🟡 Partiellement traités : **18** / 42 (M-A1, M-A2, M-A5, M-A7, M-B1, M-C2, M-C3, M-C8, M-C9, M-C10, M-C11, M-C13, M-D4, M-E2, M-E5, M-E6, M-F1, M-F3, M-G2, M-G3, M-G4, M-G6, M-I1, M-I2, M-J1, M-J3) → à recompter : **26** sont marqués 🟡
- ❌ Non traités : **9** / 42 (M-A4, M-A6, M-B2, M-B3, M-C4, M-C5, M-C6, M-C7, M-D1, M-F2, M-F5, M-J2) → **12**
- ⚪ Déjà conformes à l'origine : **8** / 42 (M-A3, M-A8, M-C1, M-D2, M-D3, M-E1, M-E3, M-F4, M-G5, M-I3, M-I4) → **11**

Récapitulatif corrigé :
- ✅ Traités : **7 / 42**
- 🟡 Partiellement traités : **24 / 42**
- ❌ Non traités : **12 / 42** (dont 5 demandes explicites et nommées par le prof)
- ⚪ Déjà conformes : **9 / 42** (donc rien à faire par l'étudiant, correspond à ce qui était déjà bon avant la v2)

Autrement dit : sur **33 critères qui n'étaient pas conformes à la v1**, l'étudiant en a corrigé pleinement **7 (~21 %)**, partiellement **24 (~73 %)**, et laissé intacts **12 (dont le titre, la pagination x/N, les acronymes séparés et les renvois biblio faux — toutes des demandes explicites)**.

---

## 4. Actions prioritaires qu'il reste à faire

Classées du plus bloquant pour le jury au moins bloquant.

1. **Changer le titre de la page de garde et de la slide 1** → M-A1, S-1, S-5. Le titre actuel "nouvelle génération... entièrement assistée par IA, du CV au verdict" contredit frontalement le discours "aide à la décision + validation humaine" tenu dans tout le reste du mémoire. Le prof propose littéralement un remplacement : *"Conception et développement d'une plateforme web d'évaluation technique des candidats assistée par LLM, avec exécution isolée du code (Spring Boot, React, Docker)"*. **5 minutes de travail, impact immédiat sur la crédibilité.**

2. **Passer la pagination en format x/N** (ex. 12/48) sur mémoire et slides → M-A6, S-3. Trois clics dans l'outil de rédaction. Demande explicite non traitée.

3. **Créer une table des acronymes séparée du glossaire** → M-A4. Lister par ordre alphabétique : API, ASVS, CSS, CU, CV, DOCX, HTML, HTTP, IA, IHM, LLM, MBDS, MCD, OWASP, PDF, QCM, REST, RGPD, SMTP, UI, UML, US, ZAP. Puis réduire le glossaire aux vrais termes (Backend, Docker, Scrum, Sprint, Vite…). 15 minutes de travail.

4. **Corriger les renvois bibliographiques en 2.2.2** → M-J2. Actuellement HackerRank renvoie à [1] Raghavan, c'est une erreur grossière signalée explicitement par le prof. Il faut écrire HackerRank [6], Codility [7], TestGorilla [8], CoderPad [9]. 10 minutes de travail.

5. **Ramener le corps à 40 pages** → M-A7. Actuellement 48 pages. Trois leviers immédiats :
   - Déplacer les figures 3, 4, 5, 6 en annexe (ne garder que la figure 7 dans le corps en 5.3.1) → gain ~4 pages.
   - Réduire 4.1.5 Gestion de la configuration de 2 à 1 page.
   - Compacter la mise en page des titres de chapitre (actuellement démarrent sur page vierge).

6. **Ajouter le comparatif chiffré des LLM** → M-C8, demande #2 du prof. Un petit tableau Fournisseur / Modèle / Coût 1M tokens entrée / Coût 1M tokens sortie / Latence médiane observée / Localisation données / Risque RGPD. Même avec 4 fournisseurs réellement testés, c'est un livrable attendu au cœur du sujet.

7. **Protocole d'évaluation de la qualité de l'IA** → M-C8, M-H1. Décrire : jeu de 10 CV annotés par le recruteur, taux de compétences correctes vs manquées vs hallucinées, taux de questions rejetées par le recruteur. Même 1/2 page suffit mais c'est le cœur du sujet.

8. **Chiffrer le problème dans l'introduction** → M-B3. Donner : nombre de recrutements techniques par an chez Tsarajoro, temps actuel de préparation + correction d'un test. Sans ces chiffres, l'objectif "réduire le temps" est invérifiable, ce qui enlève du poids à toute la conclusion.

9. **Ajouter diagramme d'activité ou de séquence système pour un CU utilisateur** → M-F2. Un seul diagramme (par exemple la passation vue utilisateur) suffirait à sortir du statut "Absent".

10. **Décrire concrètement l'API sandbox et l'interface LlmClient** → M-F5, M-G3. Deux snippets de code + 2 paragraphes sur endpoints, délai, erreurs. Important pour la vision interne.

11. **Renommer "Conclusion générale" en "Conclusion"** → M-A5 / M-I1. 10 secondes.

12. **Numéroter les sous-sections 4.3.1 à 4.3.5** (Backlog, Estimation, Découpage, Suivi, Planification) → M-A5. 2 minutes.

13. **Ajouter mots-clés FR + EN dans le résumé / abstract** → M-A2. 5 minutes.

14. **Ajouter une référence depuis le corps vers chaque annexe** (ex. "voir annexe 1 pour le modèle complet") → M-J3, M-A7. Permet aussi de justifier qu'une annexe existe.

15. **Harmoniser les slides avec le mémoire** → S-5, S-7, S-8. Impossible à vérifier dans cet audit car fichier slides pas fourni dans V2. Mais à faire après avoir corrigé le titre.

---

## Verdict synthétique

La v2 progresse réellement sur **la démarche projet (Scrum, planning, budget, risques)** et **les tests** — ce sont deux priorités du prof largement traitées. Elle progresse peu sur **l'état de l'art IA** (comparatif chiffré toujours absent) et **la forme** (titre, pagination x/N, acronymes, renvois biblio faux : 4 demandes explicites et nommées, toutes non traitées).

Si les points 1 à 4 ci-dessus (titre, pagination x/N, acronymes séparés, renvois biblio) sont corrigés en moins de 45 minutes de travail cumulé, le mémoire passe mécaniquement d'un verdict "Corrections importantes" à "Corrections mineures" sur l'axe forme. Les points 5 à 8 demandent chacun 1 à 3 heures mais sont ceux qui débloquent la note sur le fond.
