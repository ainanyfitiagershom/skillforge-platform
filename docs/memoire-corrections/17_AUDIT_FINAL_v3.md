# Audit final mémoire v3 — livrable ou brouillon ?

Auditeur : relecture critique page par page du PDF v3.
Fichier audité : `/home/tsarajoro/Documents/st/V3/MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v3.pdf` (64 pages PDF, 53 pages de corps numéroté 1 → 53).
Croisé avec : `Fiche retour M2 MBDS 2025-2026 – ETU001776 GERSHOM.pdf` (V2).

---

## 0. Verdict global

- **Note globale : À CORRIGER AVANT ENVOI** (livrable à ~90 %, mais 3 problèmes bloquants mineurs à régler en 15–30 min).
- Nombre de pages corps : **53** (cible prof : 40). ÉCART : **+13 pages**, soit 32 % au-dessus de la cible. C'est **le point noir principal** du livrable. En v2 il y avait 50 pages de corps : la v3 a donc **gagné 3 pages au lieu d'en perdre 10**, à cause de l'ajout du cadre réglementaire (2.3), des diagrammes UML (Fig 4, 5), de l'enrichissement des ENF (Tableau 11) et de l'extrait 2 (config sandbox).
- Nombre de problèmes **bloquants** : **4**
- Nombre de problèmes **mineurs** : **6**

Verdict courant : techniquement propre, bien structuré, les corrections prof ont bien été intégrées, mais le dépassement de volume est **le reproche que le prof va formuler le premier**.

---

## 1. Front matter (pages PDF 1–10, non numérotées)

### Page de garde (PDF p.1)
- Titre : `Conception et développement d'une plateforme web d'évaluation technique des candidats assistée par LLM, avec exécution isolée du code` → **OK, titre factuel conforme M-A1**. Correspond très exactement au titre suggéré par le prof.
- Auteur : `GERSHOM Ny Aina Fitia` — OK.
- Formation : `MASTER … MOBIQUITE, BASES DE DONNEES ET INTEGRATION DE SYSTÈMES (MBDS)` — OK, accents présents.
- Date : `Octobre, 2026` — OK.
- Jury : trois lignes mais **président et examinateur sont vides** (lignes `M.` sans nom). L'encadreur professionnel RAVELOMANANTIANA est bien renseigné. **Problème mineur** : il faudra avoir au moins l'intitulé des rôles (« M. [NOM], président », « M. [NOM], examinateur ») ou laisser des champs à compléter clairement identifiés avant impression.
- Logos (UCA, MBDS, Tsarajoro, ITU) : non vérifiable depuis le texte extrait ; le prof signalait en v2 que les logos étaient présents, donc présumé OK.

### Résumé (PDF p.2) + Abstract (PDF p.3)
- Résumé FR : 24 lignes, cadré sur contexte / solution / tests / perspectives — **OK**.
- Mots-clés FR présents : `recrutement technique, évaluation de compétences, LLM, sandbox Docker, sécurité applicative, Spring Boot, React, Scrum` — **OK, M-A2 traité**.
- Abstract EN : rédigé, longueur comparable, cohérent avec FR — **OK**.
- Keywords EN : `technical recruitment, skills assessment, LLM, Docker sandbox, application security, Spring Boot, React, Scrum` — **OK**.

### Table des matières (PDF p.4–6)
- Chapitres 1 à 11 bien numérotés — **OK**.
- Chapitre 9 titré `Conclusion` (sans « générale ») — **OK, M-I1 traité**.
- Sous-sections 4.3 : les cinq items (Backlog, Estimation, Découpage, Suivi, Planification) sont présentés comme des **puces** avec le symbole « ● » et non en numérotation 4.3.1 à 4.3.5. **M-A5 partiellement traité** : le prof demandait des sous-sections numérotées (4.3.1 à 4.3.4 dans la fiche). Elles existent visuellement comme sections mais sans numéro. **Problème mineur**.
- Pages ToC vs corps : chaque entrée pointe sur le bon numéro (ex. Introduction = 1, 1 Présentation du stage = 2, 10 Références = 41, 11 Annexes = 43, 11.5 Annexe 5 = 53). **Cohérent**.

### Liste des tableaux (PDF p.7–8)
- 16 entrées : Tableau 1 à 16 — **OK**.
- Pages annoncées vs réelles : T1=5, T2=8, T3=10, T4=15, T5=16, T6=17, T7=18, T8=19, T9=22, T10=23, T11=26, T12=35, T13=36, T14=37, T15=38, T16=53. Chaque tableau est effectivement présent à la page annoncée — **cohérence OK**.

### Liste des figures (PDF p.8–9)
- 20 entrées : Figure 1 à 20 — **OK, correspond au corps**.
- Pages annoncées vs réelles : Fig1=20, Fig2=21, Fig3=23, Fig4=25, Fig5=25, Fig6=27, Fig7=28, Fig8=30, Fig9=30, Fig10=32, Fig11=34, Fig12=44, Fig13=45, Fig14=46, Fig15=47, Fig16=48, Fig17=49, Fig18=50, Fig19=51, Fig20=52 — **toutes exactes**.
- **Attention — divergence par rapport au plan de correction annoncé** : la **Figure 4 est titrée « Diagramme de séquence système du parcours d'évaluation »**, pas un diagramme d'activités. La note de mission (correction M-F2) indiquait « diagramme d'activités Figure 4 + diagramme d'états Figure 5 ». Le diagramme d'états est bien là (Fig 5), mais le diagramme d'activités a été remplacé par un diagramme de séquence système. Les deux sont UML comportementaux donc l'exigence M-F2 reste globalement satisfaite, mais **la description interne de la correction v2→v3 n'est pas fidèle à la réalité du PDF**.

### Acronymes (PDF p.9–10)
- Table dédiée, séparée du glossaire, ordre alphabétique — **OK, M-A4 traité**.
- 22 entrées : API, ASVS, CSS, CV, DOCX, HTTP, IA, IHM, LLM, MBDS, MCD, OWASP, PDF, QCM, REST, RGPD, SMTP, SPA, SQL, UI, UML, ZAP.
- Vérification usage réel dans le corps : tous les acronymes de la liste apparaissent au moins 1 fois dans le corps (API=16, LLM=13, OWASP=18, ZAP=9, IA=40, CV=55, etc.). **Aucun acronyme orphelin.**
- Manquants potentiels : **MCD** (listé mais 1 seule occurrence, dans la section 7.2 pour « Modèle Conceptuel de Données ») ; **CU** (cas d'utilisation) et **US** (user story) ne sont pas listés mais apparaissent dans le corps — ce sont des termes très courants, acceptable.

### Glossaire (PDF p.10–11)
- Table dédiée, séparée des acronymes — **OK**.
- 14 entrées : Anti-fraude, Backend, Backlog, Cas d'utilisation, Docker, Flyway, Frontend, Mailpit, Ollama, Passation, React, Sandbox, Scrum, Seccomp, Spring Boot, Sprint, Vite. Toutes utilisées dans le corps — **cohérent**.

---

## 2. Pagination

- Format : `x / 53`, par exemple `1 / 53`, `25 / 53`, `53 / 53` — **OK, M-A6 traité**.
- Commence sur la page PDF 11 (Introduction, numérotée 1).
- Finit sur la page PDF 63 (Annexe 5, numérotée 53).
- Front matter (PDF 1–10) non numéroté — conforme aux usages.
- **Important** : le dénominateur est 53, pas 55 comme annoncé dans la note de mission. Le corps fait **53 pages, pas 55**. Cela ne change rien au problème de volume mais la cible prof est **toujours 40 pages** → écart = +13.

---

## 3. Corps chapitre par chapitre

### Introduction (page 1)
- Problématique explicite, bien formulée (« dans quelle mesure une plateforme web intégrant l'intelligence artificielle peut-elle automatiser et personnaliser l'évaluation technique… »). **OK**.
- Plan du mémoire annoncé — **OK**.

### Chapitre 1 — Présentation du stage (p. 2–3)
- Entreprise décrite : création 2019, activités numériques, équipes dév + WordPress + rédaction + SEO/netlinking — **chiffré** (date).
- Mission chiffrée : « 3 heures par candidat : 1 h 30 préparation, 1 h correction, 30 min analyse » — **excellent, chiffres précis**.
- Pas de titre marketing ni de phrases vides.
- Verdict : **OK**.

### Chapitre 2 — État de l'art (p. 3–10)
- Section 2.1 démarche et périmètre — OK.
- Section 2.2 benchmark : 4 plateformes (HackerRank, Codility, TestGorilla, CoderPad) avec références [6][7][8][9] correctement rattachées à chacune — **M-J2 traité, OK**.
- Tableau 1 : coûts chiffrés 948 $, 1 200 $, 924 $, 960 $ (annuels) — **OK, conforme à ce qui était annoncé**.
- Section 2.3 IA / biais / cadre réglementaire : RGPD [13], loi 2014-038 [14], AI Act [15], HELM [16] — **M-C9 et M-J1 bien traités**.
- Section 2.4 technologies : Tableau 2 (Backend/Frontend/Base/Isolation × maturité/compétences/coût). **Note** : ce n'est pas un comparatif explicite des LLM (OpenAI vs Groq vs Claude vs Gemini vs Ollama), c'est un comparatif des choix techniques généraux. Le mandat M-C8 (« Comparatif LLM enrichi ») est **satisfait en prose** (dans 2.3 et 5.3.2 : liste des 6 fournisseurs, mention OpenAI et Ollama avec coûts observés) mais **sans tableau synthétique dédié aux LLM**. Partiel.
- Section 2.5 sécurité du code, 2.6 qualité/exploitation, 2.7 synthèse : Tableau 3 synthèse des choix / options écartées / raison / risque / repli — **M-C12 traité, OK**.
- Verdict : **OK à Partiel** — l'absence d'un vrai comparatif LLM chiffré (coût / qualité / localisation données) reste signalable, mais le prof peut considérer le point couvert.

### Chapitre 3 — Existant et solution envisagée (p. 11–13)
- 3.1.1 vision utilisateur, 3.1.2 vision développeur, 3.2 critique, 3.3 contraintes, 3.4 solutions envisagées, 3.5 objectifs/livrables — **structure complète**.
- Objectifs chiffrés : « temps d'analyse < 15 s par CV » et « 0 évasion sandbox sur 50 attaques » — **OK**.
- Verdict : **OK**.

### Chapitre 4 — Démarche projet (p. 13–22)
- 4.1.1 activités, 4.1.2 Scrum (Conventional Commits, GitHub Actions, Flyway V1–V7), 4.1.3 rôles (Tableau 4), 4.1.4 outils (compact, bien condensé — M-A7 traité pour cette partie).
- 4.2 contraintes/risques : Tableau 5 avec 6 risques, probabilité, gravité, action, statut — **OK**.
- 4.3 démarche mise en œuvre : backlog (Tableau 6 avec 15 US), estimation (Tableau 7, 90 j, 8 sprints), découpage sprint 0 à 8 (Tableau 8), suivi, planification — **OK vérifiable**.
- Figure 1 : Planning prévisionnel — **présente, p. 20**.
- Figure 2 : Planning réalisé — **présente, p. 21**.
- 4 écarts documentés : anti-fraude anticipée, durcissement sandbox (50 au lieu de 30), bascule GitHub Models → Groq, intégration Ollama — **M-E7 bien traité**.
- **PROBLÈME MINEUR** : page 20, phrase « L'abstraction LlmClient, conçue dès le **POC 1**, a permis cette transition sans modification de la logique métier. » → **vestige du vocabulaire « POC » qui n'existe plus** dans le reste du mémoire (où on parle de Sprint 0–8). La note de mission signalait ce point à corriger. Il faut remplacer `POC 1` par `Sprint 1 – Conception` (ou simplement `dès les premiers sprints`).
- 4.4 Budget : prime 1 000 000 MGA, API 50 000 MGA, total ≈ 1 050 000 MGA (≈ 211 EUR), Tableau 9 — **OK, chiffré**.
- Verdict : **OK sauf POC 1 à corriger**.

### Chapitre 5 — Exigences (p. 22–28)
- 5.1 CU : tableau de 14 cas avec traçabilité US → CU → acteur — OK.
- Figure 3 Diagramme global CU — **présente, p. 23**.
- 4 CU détaillés : Cas-01 Analyser le CV, Cas-02 Génération/validation, Cas-06 Passation sécurisée, Cas-12 Consultation résultats — **OK**.
- Figure 4 : **Diagramme de séquence système** (pas « d'activités » comme annoncé en M-F2) — présente, p. 25.
- Figure 5 : Diagramme d'états de la passation — **présente, p. 25**.
- Tableau 11 ENF : 11 lignes avec Utilisabilité, Performance (×3), Sécurité (×2), Protection données, Évolutivité, Capacité, **Robustesse (×3 : indispo IA, perte connexion, timeout)** — **M-F3 traité, robustesse ajoutée OK**.
- **Nuance** : la mission parle de « protocoles de mesure » explicitement. Dans le tableau 11, la colonne « État / résultat » donne la mesure obtenue (p95 4,37 s, timeout 5 s, etc.) mais pas vraiment un « protocole » (comment mesuré, outil). Les protocoles détaillés sont renvoyés au chap. 8 (noté dans la phrase introductive). Acceptable.
- 5.3.1 IHM : Fig 6, Fig 7 présentes.
- 5.3.2 Interfaces avec autres systèmes : LlmClient (6 fournisseurs), SMTP (Mailpit + envoi réel), Sandbox (POST /sandbox/execute, timeout 5 s) — **M-F5 traité, OK**.
- Verdict : **OK**.

### Chapitre 6 — Architectures (p. 29–30)
- 6.1 logicielle : trois composants, communication REST, séparation sandbox. Figure 8.
- 6.2 technique : réseaux dédiés, socket Docker, point sensible identifié. Figure 9.
- Verdict : **OK — court et dense, bon équilibre**.

### Chapitre 7 — Conception (p. 31–34)
- 7.1 plateforme technique : Java 21, Spring Boot, Spring Security, JPA, React 19, TypeScript, Vite 6, PostgreSQL 16, Flyway, Docker — **chiffré**.
- 7.2.1 code source : conventions PascalCase/camelCase/snake_case — OK.
- 7.2.2 vue statique : Figure 10 (packages backend) — présente.
- 7.2.3 extraits : **Extrait 1 interface LlmClient** présent p. 32, **Extrait 2 limites conteneur** présent p. 33 — **M-G3 traité, OK**.
- 7.2.4 modélisation données : prose + renvoi Annexe 1.
- 7.2.5 réalisation CU passation sécurisée : Figure 11 séquence interne — **présente p. 34, M-G5 traité**.
- 7.2.6 composants et déploiement : Vercel + Render + Docker — OK.
- Verdict : **OK**.

### Chapitre 8 — Tests (p. 34–37)
- 8.1 unitaires : « 27 tests ont été détectés : 19 backend principal + 8 sandbox », Tableau 12 montre 27/27 réussis, 0 ignoré, 0 échec. **Formulation finale : « 27 tests validés avec succès lorsqu'ils sont exécutés avec leur configuration appropriée »** — **la reformulation « 27 réussis » attendue est effective. OK, l'ambiguïté 25+2 ignorés a disparu**.
- 8.2 fonctionnels : parcours testés manuellement, anomalies corrigées, code à 6 chiffres.
- 8.3 sécurité : « 0 évasion sur 50 scénarios », latence médiane 330 ms, p95 422 ms, ZAP « Aucune alerte de niveau élevé, moyen ou faible » — **formulation OK, Tableau 13 cohérent**.
- 8.4 performance : k6, 20 VU, 60 s, 707 requêtes, 823/823 checks, 0 % erreur, p95 **4,37 s** — **OK**.
- 8.5 qualité IA : 22 CV, 189 questions générées, 56 approuvées, 133 en attente — chiffré. Reconnaît explicitement « ne peut pas être exprimée en précision/rappel sans jeu de référence annoté » — **honnête**.
- Verdict : **OK**.

### Chapitre 9 — Conclusion (p. 38–40)
- 9.1 bilan livrables : Tableau 15 avec 9 livrables, cible, réalisation, taux, statut (100 % × 8, Finalisé × 1) — **OK, chiffré**.
- 9.2 problèmes rencontrés (3) : indispo GitHub Models → OpenAI (via LlmClient), tests JS dans sandbox, qualité générations IA — **OK**.
- 9.3 perspectives : court/moyen terme — OK.
- 9.4 bilan personnel : 3 domaines marquants, remerciements à l'encadreur — OK.
- Titre « Conclusion » (sans « générale ») — **OK, M-I1 confirmé**.
- Verdict : **OK**.

---

## 4. Annexes (p. 43–53)

- **Annexe 1 Modèle de données** (p. 43–44) : Figure 12 (modèle physique complet) — présente, 7 migrations V1–V7 citées.
- **Annexe 2 Interfaces complémentaires** (p. 45–50) : Fig 13 liste évaluations, Fig 14 compte rendu, Fig 15 validation questions, Fig 16 éditeur code, Fig 17 résultats, Fig 18 tableau de bord — **toutes présentes aux pages annoncées**.
- **Annexe 3 Sandbox** (p. 51) : Figure 19 architecture sandbox — présente. Décrit seccomp, cap-drop, no-network, FS read-only, user non privilégié, 50 scénarios.
- **Annexe 4 Multi-fournisseurs** (p. 52) : Figure 20 architecture LlmClient — présente. Mentionne bascule < 1 h.
- **Annexe 5 Outils** (p. 53) : Tableau 16 outils + usages, 11 outils groupés par catégorie — **OK, M-E5 traité**.
- **Point positif** : les annexes sont bien référencées depuis le corps (ex. 7.2.4 renvoie à Annexe 1, 4.1.4 renvoie à Annexe 5, 2.3 implicitement à Annexe 4). Le reproche de la v2 (« aucune annexe référencée depuis le corps ») est corrigé.

---

## 5. Bibliographie (p. 41–43)

- **17 références au total** — **OK, M-J1 traité**.
- Groupement en 4 sections : Articles scientifiques et ouvrages de référence (1–5), Plateformes d'évaluation (6–9), Documentation technique et sécurité (10–12), Textes réglementaires (13–15), Articles scientifiques complémentaires (16–17) — **OK**.
- [1] Raghavan — cité en 2.3 ✓
- [2] Bogen & Rieke — cité en 2.3 ✓
- [3] Russell & Norvig — cité en 2.3 ✓
- [4] Merkel — cité en 2.5 ✓
- [5] OWASP ASVS — cité en 2.5 ✓
- [6] HackerRank — cité en 2.2.2 ✓
- [7] Codility — cité en 2.2.2 ✓
- [8] TestGorilla — cité en 2.2.2 ✓
- [9] CoderPad — cité en 2.2.2 ✓
- **[10] OWASP Top 10 → ORPHELINE** (n'apparaît que dans la bibliographie elle-même, aucun renvoi `[10]` dans le corps).
- **[11] Docker Engine Security → ORPHELINE** (aucun renvoi `[11]` dans le corps).
- **[12] Docker Seccomp Profiles → ORPHELINE** (aucun renvoi `[12]` dans le corps).
- [13] RGPD — cité en 2.3 ✓
- [14] Loi 2014-038 — cité en 2.3 ✓
- [15] AI Act — cité en 2.3 ✓
- [16] HELM — cité en 2.3 ✓
- [17] Combe — cité en 2.5 ✓
- **Problème bloquant** : **3 références orphelines ([10], [11], [12])**. Le prof en v2 l'avait déjà signalé indirectement via M-J3 (« renvois biblio »). À corriger : soit insérer un renvoi `[10]` quand on parle d'OWASP Top 10 (par exemple en 2.5 ou 8.3), `[11]` quand on cite la documentation Docker (2.5 ou Annexe 3), `[12]` quand on parle de seccomp (2.5, 7.2.3 ou Annexe 3). Ces insertions sont triviales (5 min).

---

## 6. Points de forme critiques

- Pas de `nouvelle génération` : **confirmé absent** — OK.
- Pas de `entièrement assistée par IA` : **confirmé absent** — OK.
- Pas de `0 vulnérabilité` : **confirmé absent** ; formulation en vigueur = « Aucune alerte de niveau élevé, moyen ou faible » — OK.
- `POC 1` : **une occurrence restante page 20** → à corriger en « dès le Sprint 1 » ou « dès les premiers sprints ».
- Nombre d'objectifs : cohérent partout (temps analyse < 15 s, 0 évasion / 50 attaques).
- Accents français (État, École, À) : rapide inspection — OK, aucun « etat » / « a propos » / « ecole » détecté.
- Coquilles manifestes : rapide lecture n'a rien révélé de choquant. Deux micro-coquilles tolérables :
  - p. 2 (Résumé) : « d'aide à l'évaluation » OK.
  - p. 25 : « Diagrammes UML associés » suivi d'un retour à la ligne — mise en page cosmétique, pas une coquille.

---

## 7. Checklist des 42 critères prof mémoire (M-A à M-J)

| ID | Critère | Statut v3 | Preuve / commentaire |
|---|---|---|---|
| M-A1 | Titre factuel | **OK** | PDF p.1 : « Conception et développement d'une plateforme web d'évaluation technique… assistée par LLM, avec exécution isolée du code » |
| M-A2 | Résumé + Abstract + mots-clés | **OK** | PDF p.2–3, FR + EN avec mots-clés |
| M-A3 | Listes figures/tableaux | **OK** | 20 figures, 16 tableaux, pages exactes |
| M-A4 | Acronymes séparés du glossaire | **OK** | 2 tables distinctes, PDF p.9–11 |
| M-A5 | Numérotation 4.3.x | **Partiel** | 4.3 contient 5 sous-sections en puces, non numérotées 4.3.1–4.3.5 |
| M-A6 | Pagination x/N | **OK** | Format `x / 53` partout dans le corps |
| M-A7 | Volume ≤ 40 pages | **NON** | **53 pages de corps**, soit +13 pages. **BLOQUANT**. |
| M-A8 | Rédaction et ton | **OK** | Pas de marketing, phrases prudentes |
| M-B1 | Introduction (contexte + problématique) | **OK** | p.1, problématique explicite |
| M-B2 | Présentation entreprise/stage | **OK** | Chap 1, chiffres (2019, 3 h/candidat) |
| M-C1 | État de l'art — démarche | **OK** | Section 2.1 |
| M-C2 | Benchmark 4 solutions avec critères et coûts | **OK** | Tableau 1, coûts 948/1200/924/960 $ |
| M-C8 | Comparatif LLM | **Partiel** | Prose en 2.3, pas de tableau explicite coût×qualité×localisation |
| M-C9 | Cadre réglementaire | **OK** | RGPD [13], loi 2014-038 [14], AI Act [15] |
| M-C12 | Synthèse choix retenus | **OK** | Tableau 3 (choix / options écartées / risque / repli) |
| M-D1 | Existant | **OK** | Chap 3, vision user + dev |
| M-D2 | Critique existant | **OK** | 3.2 |
| M-E1 | Scrum vérifiable | **OK** | Sprint 0–8, Tableau 8 |
| M-E2 | Backlog | **OK** | Tableau 6, 15 US |
| M-E3 | Estimation / vélocité | **Partiel** | Tableau 7 estimation initiale, pas de burndown ni vélocité réelle |
| M-E5 | Outils (condensé) | **OK** | 4.1.4 + Annexe 5 |
| M-E7 | Planning prévu + réalisé + écarts | **OK** | Fig 1 + Fig 2 + 4 écarts documentés |
| M-E8 | Budget chiffré | **OK** | Tableau 9, 1 050 000 MGA |
| M-F1 | Cas d'utilisation | **OK** | 14 CU, 4 détaillés, Fig 3 |
| M-F2 | Diagrammes UML comportementaux | **OK, divergence** | Fig 4 = séquence (pas activités comme annoncé), Fig 5 = états |
| M-F3 | ENF avec robustesse et mesures | **OK** | Tableau 11 avec 3 lignes robustesse |
| M-F5 | Interfaces (LlmClient, sandbox, SMTP) | **OK** | 5.3.2 |
| M-G1 | Architecture logicielle + technique | **OK** | 6.1 + 6.2, Fig 8 + Fig 9 |
| M-G3 | Extraits de code | **OK** | Extrait 1 LlmClient + Extrait 2 config sandbox |
| M-G4 | Modèle de données | **OK** | Annexe 1, Fig 12, 7 migrations |
| M-G5 | Diagramme séquence interne | **OK** | Fig 11, chap 7.2.5 |
| M-H1 | Tests unitaires chiffrés | **OK** | 27 tests JUnit, Tableau 12 |
| M-H2 | Tests fonctionnels | **OK** | 8.2 |
| M-H3 | Tests sécurité | **OK** | 0/50 évasions, ZAP « aucune alerte » |
| M-H4 | Tests performance k6 | **OK** | 20 VU, p95 4,37 s, Tableau 14 |
| M-H5 | Qualité sorties IA | **OK** | 8.5, honnête sur limites |
| M-I1 | Conclusion (titre correct) | **OK** | « Conclusion » sans « générale » |
| M-I2 | Bilan livrables chiffré | **OK** | Tableau 15 |
| M-I3 | Perspectives | **OK** | 9.3 |
| M-I4 | Bilan personnel | **OK** | 9.4 |
| M-J1 | Bibliographie enrichie (17 refs) | **OK** | 17 références groupées |
| M-J2 | Renvois biblio 2.2.2 | **OK** | HackerRank [6], Codility [7], TestGorilla [8], CoderPad [9] |
| M-J3 | Annexes référencées + pas d'orphelins | **Partiel** | Annexes bien renvoyées, mais **[10][11][12] orphelines** |

Score estimé : **38 OK / 42**, 3 partiels, 1 non conforme (volume).

---

## 8. Problèmes bloquants (à corriger impérativement avant envoi)

1. **Volume 53 pages vs 40 cibles (M-A7)** — c'est le premier reproche attendu du prof. Options pour gagner 10–13 pages rapidement :
   - Déplacer les captures IHM des sections 5.3.1 (Fig 6, Fig 7) vers l'Annexe 2 → ~1,5 page.
   - Compacter Tableau 10 (14 CU) sur une seule ligne par CU → ~0,5 page.
   - Fusionner 7.2.1 + 7.2.2 (répétitifs) → ~0,5 page.
   - Compacter la liste US (Tableau 6) en 2 colonnes → ~1 page.
   - Réduire les espaces blancs entre sections (sauts de page explicites inutiles) → 2–4 pages.
   - Compacter 9.1 Tableau 15 → ~0,3 page.
   - Compacter Tableau 11 (fusion lignes Performance ou Sécurité) → ~0,5 page.
   - **Alternative pragmatique** : si le temps manque, annoncer dans l'intro « corps + 2 pages liste US + 2 pages annexe tableaux » et poser le compteur à 48–50 pages, puis **assumer le dépassement avec une justification** (richesse technique du sujet). Cela reste un reproche mais plus mineur.

2. **3 références bibliographiques orphelines : [10] OWASP Top 10, [11] Docker Engine Security, [12] Docker Seccomp Profiles**. À insérer dans le corps (correction de 5 minutes) :
   - `[10]` → fin de la section 2.6 ou 8.3 (OWASP Top 10 comme référentiel implicite ZAP).
   - `[11]` → section 2.5 phrase « conteneurisation avec Docker [4][11] » ou en Annexe 3.
   - `[12]` → section 7.2.3 à propos du seccomp dans l'Extrait 2, ou en Annexe 3.

3. **« POC 1 » page 20** — vestige du vocabulaire v1. À remplacer par « dès le Sprint 1 – Conception » ou « dès les premiers sprints ». Correction de 10 secondes.

4. **Jury incomplet page de garde** — « M. » × 2 sans nom pour président et examinateur. Si ces noms ne sont pas encore connus, mettre « [À compléter avant soutenance] » et le signaler oralement au prof lors de la remise. Sinon renseigner les noms.

---

## 9. Problèmes mineurs (correction souhaitable mais pas bloquante)

1. **Sous-sections 4.3.1 à 4.3.5 non numérotées (M-A5)** — actuellement en puces `●`. Le prof demandait une numérotation. Correction : ajouter `4.3.1 Backlog du projet`, `4.3.2 Estimation de la charge`, `4.3.3 Découpage du projet en itérations`, `4.3.4 Suivi et pilotage`, `4.3.5 Planification`. Correction de 2 minutes.

2. **Figure 4 est un diagramme de séquence, pas d'activités** — pas conforme au plan de correction v2→v3 annoncé, mais UML comportemental donc M-F2 reste satisfait. Si le prof demande strictement un diagramme d'activités, remplacer Fig 4 en ajoutant un vrai diagramme UML activités (via Mermaid flowchart ou PlantUML). Sinon, acceptable.

3. **Comparatif LLM pas sous forme de tableau (M-C8)** — les 6 fournisseurs sont listés en prose, avec coûts GPT-4o-mini mentionnés brièvement. Un petit tableau en 2.3 (Fournisseur / Type / Coût / Localisation données) de 5 lignes ferait l'affaire et renforcerait l'état de l'art IA.

4. **Pas de burndown chart ni vélocité chiffrée (M-E3)** — Scrum documenté mais la métrique « points par sprint » n'est pas montrée. Le prof peut l'accepter puisque la planification réalisée est bien là. Si envie de renforcer, ajouter une phrase « vélocité moyenne observée : X story points par sprint ».

5. **Tableau 11 ENF — colonne « protocole de mesure » implicite** — la colonne État/résultat donne la mesure mais pas le mode opératoire (outil, scénario). Peu bloquant car le détail est dans le chap 8.

6. **Annexe 5 Outils (Tableau 16, p. 53) duplique partiellement la section 4.1.4** — compressible, mais utile pour un lecteur rapide.

---

## 10. Verdict final et recommandation

**À corriger avant envoi (30 minutes maximum)**, puis livrable.

Checklist pré-envoi, par ordre de priorité :
1. [ ] Remplacer « POC 1 » par « Sprint 1 – Conception » (p. 20, 1 occurrence).
2. [ ] Insérer les renvois `[10]`, `[11]`, `[12]` dans le corps (3 insertions, 5 min).
3. [ ] Numéroter 4.3.1 à 4.3.5 dans la ToC et dans le corps (2 min).
4. [ ] Décider du traitement du jury page de garde (compléter ou mettre `[À compléter]`).
5. [ ] **Décision volume** : soit tenter de ramener à 45–48 pages par compactage (30 min, voir § 8.1), soit assumer le dépassement en l'expliquant en avant-propos.

Le mémoire est **techniquement propre, les 17 corrections prof annoncées de v2→v3 sont effectivement présentes** (sauf nuance sur Fig 4 séquence vs activités). La seule véritable fragilité est le **volume** : passer de 50 à 53 pages au lieu de descendre à 40 est un signal faible qui montre que les ajouts (RGPD, UML, ENF enrichie, extrait 2) n'ont pas été compensés par des coupes ailleurs.

**Si le temps est serré, livrer en l'état en acceptant 53 pages — c'est jouable pour un prof pragmatique vu la richesse du contenu technique.** Si 1 h est disponible, viser 45 pages par compactage des IHM et des tableaux larges.
