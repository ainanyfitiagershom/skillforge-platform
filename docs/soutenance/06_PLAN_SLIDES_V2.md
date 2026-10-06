# Plan de refonte des slides SkillForge - v2 pour soutenance

> Document de travail. Source : slides v1 (`Slide-ETU1776-GERSHOM-Fitia.docx.pdf`, 20 slides), fiche retour prof (`Fiche retour M2 MBDS 2025-2026 – ETU001776 GERSHOM.pdf`, critères S-1 à S-12 et M-A à M-J), mémoire v3 (`MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v3.pdf`, Tableaux 1 à 9).
>
> Objectif : livrer 20 slides en 20 minutes, format x/20, cohérentes mot pour mot avec le mémoire v3, satisfaisant les 12 critères S-1 à S-12.

---

## 0. Diagnostic de la v1 actuelle

| Slide | Titre actuel | Contenu principal | Verdict | Action |
|---|---|---|---|---|
| 1 | Présentation du projet | Titre slogan « nouvelle génération … entièrement assistée par IA, du CV au verdict », étudiant, formation | À modifier | Nouveau titre factuel, ajouter jury, encadreurs, logos |
| 2 | Plan | 8 sections (contexte, existant, objectifs, gestion, réalisation, démo, résultats, bilan) | À modifier | Reformuler en 6 blocs cohérents avec la nouvelle structure et numéroter x/20 |
| 3 | Le recrutement technique aujourd'hui | 4 difficultés : temps, homogénéité, fiabilité, suivi | À modifier | Garder, ajouter chiffrage (nombre de recrutements/an, temps actuel), passer avant Tsarajoro |
| 4 | Solutions existantes (1) | HackerRank, Codility | À remplacer | Fusionner dans un tableau comparatif unique (slide 5/20) |
| 5 | Solutions existantes (2) | CoderPad, TestGorilla | À supprimer | Fusionner dans le tableau comparatif |
| 6 | Positionnement SkillForge | 5 critères textuels | À remplacer | Remplacer par slide « pourquoi ce choix » (acquisition vs interne, Docker vs gVisor, 6 LLM) |
| 7 | Tsarajoro et mission | Entreprise, mission, 4 fonctionnalités | À déplacer | Remonter en 4/20 (avant état de l'art) |
| 8 | Quatre objectifs mesurables | 4 objectifs avec cibles « < 15 s / CV », « 0 évasion / 50 » | À modifier | Passer à 5 objectifs cohérents avec slide 16 et Tableau 7 (p95 < 6 s, 100 % des livrables testés, etc.) |
| 9 | Gestion de projet | Sem. 1-2 à 12-13, POC 1-4 | À modifier | Remplacer par Sprint 0 à Sprint 8 (Tableau 5 du mémoire : 71 j dev + 12 j cadrage + 4 j tests + 3 j livraison) |
| 10 | Architecture logicielle | 5 blocs (front, back, DB, sandbox, IA) | OK | Garder, insérer la Figure 8 du mémoire |
| 11 | Pipeline IA : du CV au verdict | 5 étapes Analyser → Générer → Valider → Passer → Restituer | OK | Garder, lier à Figure 5 du mémoire |
| 12 | Sandbox durcie | 7 verrous (seccomp, cap-drop, network=none…) | À modifier | Garder les 7 verrous + chiffres mémoire (0 évasion sur 50, 100 exécutions, médiane 330 ms, p95 422 ms, OWASP ZAP « aucune alerte élevée/moyenne/faible ») |
| 13 | IA multi-fournisseurs | 6 LLM via LlmClient | OK | Garder, ajouter extrait de code LlmClient (interface Java, 10 lignes) |
| 14-15 | Démonstration | Scénario 9 étapes | OK | Conserver, prévoir vidéo de secours (critère S-10) |
| 16 | 5 objectifs, 5 résultats | 5 objectifs atteints | À modifier | Aligner mot pour mot avec slide 8 (5 objectifs) et Tableau 7 |
| 17 | Résultats mesurés | Isolation, vulnérabilités, charge, bascule IA | À modifier | Reformuler « 0 vulnérabilité » en « aucune alerte de niveau élevé, moyen ou faible », ajouter p95 4,37 s, 27 tests JUnit, 823/823 checks |
| 18 | Difficultés rencontrées | 3 difficultés + solutions | OK | Garder, ajouter l'impact planning |
| 19 | Bilan et perspectives | Apports, perspectives | À modifier | Scinder : garder bilan livrables (nouveau 18/20) et perspectives (19/20) |
| 20 | Conclusion / Merci | « Merci pour votre attention » | À modifier | Transformer en slide « Message clé + QR code dépôt + merci » |

Bilan v1 : 20 slides, structure plausible mais **5 incohérences avec le mémoire** (objectifs 4 vs 5, planning 13 sem vs 9 sprints, cibles inventées « < 15 s / CV », formulation « 0 vulnérabilité », slide « existant Tsarajoro » absente), **4 slides à refondre entièrement** (1, 4+5, 6, 9), **1 slide à supprimer** (fusion 4+5), **1 slide à ajouter** (existant Tsarajoro).

---

## 1. Les 12 critères prof - statut initial vs cible

| ID | Critère | Statut v1 | Statut v2 cible | Levier principal |
|---|---|---|---|---|
| S-1 | Diapositive de titre | Partiel | Conforme | Nouveau titre factuel, jury + encadreurs + 4 logos (UCA, MBDS, ITU, Tsarajoro) |
| S-2 | Nombre de diapositives | Conforme | Conforme | Rester à 20 |
| S-3 | Numérotation x/N | À revoir | Conforme | Format `n/20` en pied de page à droite sur toutes les slides sauf 1/20 |
| S-4 | Problématique en ouverture | Conforme | Conforme | Problématique chiffrée dès 3/20, mission Tsarajoro en 4/20 |
| S-5 | Cohérence avec le mémoire | À revoir | Conforme | 5 objectifs cohérents 8↔16, planning Sprints 0-8, cibles du Tableau 7, OWASP mot pour mot |
| S-6 | État de l'art | Partiel | Conforme | Fusion 4+5 en un seul tableau comparatif (5/20) + slide « pourquoi ce choix » (6/20) |
| S-7 | Existant et solution | Partiel | Conforme | Nouvelle slide 7/20 « Existant Tsarajoro : limites et solution retenue » |
| S-8 | Démarche projet | Partiel | Conforme | 8/20 : prévu vs réalisé, vélocité, risques statut (Tableau 3) |
| S-9 | Exigences, architecture, conception | Partiel | Conforme | Slide 10/20 avec 2 CU clés + 3 ENF chiffrées + extrait schéma de données |
| S-10 | Réalisation, démo, tests | Conforme | Conforme | 12-14/20, vidéo de secours MP4 préparée |
| S-11 | Bilan et perspectives | Partiel | Conforme | 17/20 tableau livrables + statut, 18/20 bilan personnel |
| S-12 | Place de la contribution personnelle | Conforme | Conforme | État de l'art réduit à 2 slides, 12 slides sur conception + réalisation |

---

## 2. Plan slides v2 (le vrai livrable)

**Structure cible : 20 slides, format x/20, durée totale 20 min.**

Découpage en 6 blocs :
- **Bloc A — Ouverture (1 à 4)** : titre, plan, problématique, mission Tsarajoro.
- **Bloc B — État de l'art et choix (5 à 7)** : benchmark, décisions structurantes, existant / solution.
- **Bloc C — Objectifs et démarche (8 à 9)** : objectifs mesurables, gestion de projet.
- **Bloc D — Conception et architecture (10 à 13)** : architecture, pipeline IA, sandbox, multi-fournisseurs.
- **Bloc E — Démonstration (14 à 16)** : parcours recruteur, parcours candidat, blocage attaque.
- **Bloc F — Résultats, bilan, perspectives (17 à 20)** : résultats mesurés, bilan livrables, difficultés et perspectives, conclusion.

---

### Slide 1/20 — Titre
- **Objectif** : identifier le projet, l'étudiant, l'encadrement et le jury.
- **Contenu** :
  - Titre : « Conception et développement d'une plateforme web d'évaluation technique des candidats assistée par LLM, avec exécution isolée du code (Spring Boot, React, Docker) »
  - Sous-titre : SkillForge — Mémoire de fin d'études Master 2 MBDS
  - Étudiant : Ny Aina Fitia GERSHOM (ETU001776)
  - Formation : Master 2 MBDS — Université Côte d'Azur / ITU
  - Entreprise d'accueil : Tsarajoro (Antananarivo)
  - Encadreur professionnel : M. Tahirintsoa Ulrich RAVELOMANANTIANA
  - Jury : Dr Olivier Robinson (président), M. Tahina Razafinjoelina (examinateur)
  - Date : soutenance octobre 2026
  - Logos (bandeau bas) : UCA, MBDS, ITU, Tsarajoro
- **Visuels** : 4 logos en bas, pas de texte superflu.
- **Durée orale** : 30 s.
- **Satisfait** : S-1.

### Slide 2/20 — Plan de la présentation
- **Objectif** : annoncer la structure.
- **Contenu** :
  1. Contexte et problématique (3-4)
  2. État de l'art et choix (5-7)
  3. Objectifs et démarche (8-9)
  4. Conception et architecture (10-13)
  5. Démonstration (14-16)
  6. Résultats, bilan et perspectives (17-20)
- **Visuels** : fil conducteur horizontal 6 blocs numérotés (SVG simple).
- **Durée orale** : 20 s.
- **Satisfait** : S-2, S-3.

### Slide 3/20 — Le recrutement technique aujourd'hui
- **Objectif** : poser une problématique chiffrée.
- **Contenu** :
  - Difficultés : **temps** (préparation et correction manuelles), **homogénéité** (tests variables selon la personne), **fiabilité** (vérification des compétences), **suivi** (données éparses)
  - Chiffrage (depuis mémoire 3.2) : X recrutements techniques par an chez Tsarajoro, Y h / campagne [à compléter avec les chiffres finaux du mémoire si disponibles, sinon : « plusieurs heures de préparation et correction par campagne »]
  - Besoin : évaluation plus rapide, personnalisée et traçable, **sans retirer le contrôle humain**
- **Visuels** : icône horloge + icône balance + icône dossier (3 pictogrammes).
- **Durée orale** : 45 s.
- **Satisfait** : S-4.

### Slide 4/20 — Tsarajoro et mission du stage
- **Objectif** : relier le projet au besoin réel de l'entreprise AVANT l'état de l'art.
- **Contenu** :
  - Tsarajoro : entreprise du numérique à Antananarivo (dév. web, WordPress, netlinking, contenus numériques)
  - Mission : concevoir et développer une plateforme interne d'aide à l'évaluation technique, de l'analyse du CV à la synthèse des résultats
  - Fonctionnalités cibles : analyse CV, génération adaptative de tests, passation sécurisée, rapport assisté
  - Durée : 4 mois (mai-août 2026), 1 stagiaire + 1 encadreur professionnel
- **Visuels** : logo Tsarajoro + mini-schéma « CV → Test → Rapport ».
- **Durée orale** : 45 s.
- **Satisfait** : S-4, S-7.

### Slide 5/20 — Benchmark des solutions existantes
- **Objectif** : état de l'art condensé en un seul tableau (ex-slides 4 + 5 + 6 fusionnées).
- **Contenu** : Tableau comparatif (reprise du Tableau 1 du mémoire)

| Critère | HackerRank | Codility | CoderPad | TestGorilla | **SkillForge** |
|---|---|---|---|---|---|
| Analyse CV par IA | Non | Non | Non | Partielle | **Oui** |
| Génération adaptative | Non | Non | Non | Non | **Oui** |
| Sandbox durcie dédiée | Oui | Oui | Oui | Oui | **Oui (Docker + seccomp)** |
| Rapport assisté IA | Partiel | Partiel | Non | Partiel | **Oui** |
| Hébergement interne possible | Non | Non | Non | Non | **Oui** |
| Coût par an | ≈ 2 000 USD+ | ≈ 1 200 USD+ | ≈ 1 500 USD+ | ≈ 1 000 USD+ | **Dev interne (1 050 000 MGA)** |

- **Visuels** : tableau pleine slide, dernière colonne SkillForge surlignée.
- **Durée orale** : 1 min.
- **Satisfait** : S-6, S-12.

### Slide 6/20 — Pourquoi développer en interne : trois choix structurants
- **Objectif** : expliciter les décisions avec options écartées (demande M-C12 et S-6).
- **Contenu** : Tableau choix / option écartée / raison / risque résiduel / plan de repli

| Décision | Choix retenu | Option écartée | Raison | Repli |
|---|---|---|---|---|
| Fournisseur LLM | **6 LLM via abstraction LlmClient** | 1 seul fournisseur | Pas de verrou, bascule par configuration | Ollama local |
| Isolation du code | **Docker + seccomp + cap-drop** | gVisor, Firecracker, service tiers | Maturité, compétences locales, coût 0 | Timeout 5 s + user non-root |
| Modèle de livraison | **Dev interne** | Acquisition HackerRank / Codility | Coût d'abonnement, données locales, personnalisation | Open source Judge0 / Piston |

- **Visuels** : tableau décisions ou matrice de choix.
- **Durée orale** : 1 min.
- **Satisfait** : S-6.

### Slide 7/20 — Existant Tsarajoro et solution retenue
- **Objectif** : décrire concrètement le processus manuel actuel et expliciter la rupture (critère S-7).
- **Contenu** :
  - **Avant SkillForge** : courriel + document partagé + correction manuelle par un développeur senior → variable, lent, non centralisé
  - **Limites** : pas d'exécution automatique de code, pas de traçabilité, aucun indicateur global
  - **Solution retenue** : plateforme web interne SkillForge → analyse CV + génération + passation sandboxée + rapport, le recruteur valide à chaque étape
- **Visuels** : schéma « Avant / Après » en 2 colonnes.
- **Durée orale** : 45 s.
- **Satisfait** : S-7.

### Slide 8/20 — Cinq objectifs mesurables (alignés mémoire Tableau 7)
- **Objectif** : poser les 5 objectifs qui seront repris en 17/20.
- **Contenu** : (noter : **5** et non 4, cohérent avec slide 17/20 et Tableau 7)

| # | Objectif | Cible (Tableau 7) |
|---|---|---|
| 1 | Analyser le CV par IA | Extraction des compétences validée par le recruteur |
| 2 | Générer des tests adaptés | QCM, exercices code, cas pratique (3 types) |
| 3 | Sécuriser l'exécution du code | 0 évasion sur 50 scénarios, timeout 5 s |
| 4 | Soutenir 20 candidats simultanés | p95 < 6 s |
| 5 | Restituer un rapport complet | Score, forces, faiblesses, anti-fraude |

- **Visuels** : 5 cartes alignées.
- **Durée orale** : 1 min.
- **Satisfait** : S-5, S-9.

### Slide 9/20 — Démarche projet : Scrum, planning réalisé, risques
- **Objectif** : rendre la démarche vérifiable (critère S-8).
- **Contenu** :
  - Méthode : **Scrum**, sprints de 2 semaines, 1 PO (encadreur) + 1 dev (étudiant)
  - Découpage réel (Tableau 5 mémoire) : **Sprint 0 Cadrage (12 j) + 8 Sprints dev (71 j) + Tests (4 j) + Livraison (3 j) = 90 j**
  - Sprint 0 Cadrage · S1 Fondations · S2 Analyse CV · S3 Génération · S4 Passation + anti-fraude · S5 Correction · S6 Tableau de bord · S7 Tests · S8 Recette
  - Prévu vs Réalisé : anti-fraude anticipée du S5 au S4 (gain 2 sem)
  - Risques principaux (Tableau 3) : qualité IA → prompts renforcés (éteint) ; indispo GitHub Models → bascule OpenAI (éteint) ; validations encadreur → ajustées (en cours)
  - Outils : GitHub, Docker, GanttProject, Mermaid, DBSchema, JUnit 5, OWASP ZAP, k6
- **Visuels** : mini-Gantt horizontal (S0 à S8) ou extrait du planning réalisé.
- **Durée orale** : 1 min 15.
- **Satisfait** : S-5, S-8.

### Slide 10/20 — Architecture logicielle + données
- **Objectif** : montrer l'architecture et la conception (critère S-9).
- **Contenu** :
  - **Frontend** : React 19, TypeScript, Vite 6
  - **Backend** : Spring Boot 3, Java 21 (modules Security, Data JPA, Web)
  - **Base de données** : PostgreSQL 16, 7 migrations Flyway (V1-V7)
  - **Sandbox** : Docker, seccomp, isolation réseau (daemon isolé)
  - **IA** : abstraction LlmClient → 6 fournisseurs
  - **Principe directeur** : *le frontend ne parle jamais à la sandbox*
  - 2 CU clés : **CU-05 Passer un test sécurisé**, **CU-02 Analyser un CV**
  - 3 ENF chiffrées : p95 < 6 s, 0 évasion / 50, timeout 5 s / exécution
- **Visuels** : Figure 8 du mémoire (architecture logicielle) OU Figure 9 (architecture technique) + mini-extrait du MCD (3 tables clés : passation, reponse, evenement_antifraude).
- **Durée orale** : 1 min 15.
- **Satisfait** : S-9.

### Slide 11/20 — Pipeline IA : du CV au verdict
- **Objectif** : expliquer le parcours complet et le rôle de l'IA à chaque étape.
- **Contenu** :
  1. **Analyser** → extraction compétences (JSON structuré)
  2. **Générer** → questions ciblées (QCM, code, cas)
  3. **Valider** → recruteur relit et ajuste (contrôle humain)
  4. **Passer** → candidat compose dans la sandbox
  5. **Restituer** → score, forces, faiblesses, synthèse assistée
  - Message clé : **« L'IA propose à chaque étape, le recruteur décide »**
- **Visuels** : flèche horizontale 5 cases avec icône IA + icône humain.
- **Durée orale** : 1 min.
- **Satisfait** : S-9.

### Slide 12/20 — Sandbox durcie : 7 verrous
- **Objectif** : démontrer le travail de sécurité (point fort reconnu par le prof).
- **Contenu** :
  - 1. `seccomp` (appels système filtrés) · 2. `cap-drop=ALL` (aucune capability) · 3. `network=none` (aucun réseau) · 4. `read-only` (FS verrouillé) · 5. `pids-limit=64` (fork bombs) · 6. `memory=256M` (ressources) · 7. `user=1001` (non-root)
  - Résultats mesurés : **0 évasion sur 50 scénarios d'attaque · 100 exécutions valides · médiane 330 ms, p95 422 ms · OWASP ZAP : aucune alerte de niveau élevé, moyen ou faible**
- **Visuels** : schéma en couches (candidat → container → hôte) + les 7 verrous en labels.
- **Durée orale** : 1 min 15.
- **Satisfait** : S-5 (formulation OWASP exacte), S-10.

### Slide 13/20 — IA multi-fournisseurs via LlmClient
- **Objectif** : montrer l'absence de dépendance à un seul fournisseur.
- **Contenu** :
  - 6 modèles intégrés : **OpenAI GPT-4o mini** · **Groq Qwen 3-32B** · **Gemini Flash 2.5** · **Claude Sonnet 4.5** · **GitHub Models GPT-4o mini** · **Ollama Qwen 2.5-7B** (local)
  - Abstraction : interface Java `LlmClient` avec 1 implémentation par fournisseur
  - Bascule : simple changement de variable d'environnement
  - Extrait de code (6 lignes) : signature de l'interface + méthode `generate(prompt, schema)`
- **Visuels** : hub central LlmClient avec 6 fournisseurs en satellite + extrait de code.
- **Durée orale** : 45 s.
- **Satisfait** : S-9.

### Slide 14/20 — Démonstration : parcours recruteur (1/3)
- **Objectif** : montrer la création d'une évaluation côté recruteur.
- **Contenu** :
  1. Connexion recruteur au tableau de bord
  2. Création d'évaluation + import du CV candidat
  3. Analyse IA du CV (compétences détectées, validation)
  4. Génération adaptative des questions (QCM + exercice code + cas pratique) et validation
  5. Invitation du candidat par e-mail (Mailpit)
- **Visuels** : captures d'écran de la démo + bandeau « Démo live » en haut.
- **Durée orale** : 2 min.
- **Satisfait** : S-10.

### Slide 15/20 — Démonstration : parcours candidat (2/3)
- **Objectif** : montrer la passation du test côté candidat.
- **Contenu** :
  6. Candidat ouvre son lien unique, coche le consentement
  7. QCM puis exercice code exécuté par la sandbox
  8. Signaux anti-fraude déclenchés volontairement (copier-coller, changement d'onglet)
- **Visuels** : captures mobile + desktop candidat.
- **Durée orale** : 1 min 30.
- **Satisfait** : S-10.

### Slide 16/20 — Démonstration : blocage d'attaque et rapport (3/3)
- **Objectif** : prouver la sécurité en direct + le rapport final.
- **Contenu** :
  9. Attaque simulée : lecture `/etc/passwd` + appel réseau sortant → **blocage par seccomp + network=none**
  10. Consultation du rapport : score global, forces/faiblesses, section anti-fraude
  11. Tableau de bord analytique et historique
  - **Vidéo de secours MP4 prête** (3 min) si problème réseau / fournisseur IA
- **Visuels** : capture du bloc d'erreur sandbox + capture du rapport final.
- **Durée orale** : 1 min 30.
- **Satisfait** : S-10.

### Slide 17/20 — Résultats mesurés (5 objectifs atteints)
- **Objectif** : prouver chaque objectif de la slide 8/20 avec un chiffre du mémoire.
- **Contenu** : Tableau résultats (reprise Tableaux 7, 8, 9)

| Objectif | Cible | Résultat mesuré |
|---|---|---|
| Analyser le CV | Extraction validée | Module fonctionnel validé humainement |
| Générer les tests | 3 types | QCM + code + cas pratique, 100 % |
| Sécuriser l'exécution | 0 évasion / 50 | **0 évasion sur 50, 100 exécutions valides, médiane 330 ms, p95 422 ms** |
| Charge 20 candidats | p95 < 6 s | **p95 : 4,37 s, 823/823 checks, 0 % d'erreur (k6)** |
| Restituer le rapport | Score + anti-fraude | Rapport complet livré |
| **Sécurité web** | Aucune alerte haute/moyenne/faible | **OWASP ZAP : aucune alerte de niveau élevé, moyen ou faible** |
| **Qualité code** | Tests JUnit | **27 tests JUnit** |

- **Visuels** : 4 KPIs mis en avant en haut (p95, OWASP, évasion, JUnit).
- **Durée orale** : 1 min 15.
- **Satisfait** : S-5, S-10, S-11.

### Slide 18/20 — Bilan des livrables (9/9 à 100 %)
- **Objectif** : donner le statut de chaque livrable (critère S-11 + M-I1).
- **Contenu** : Tableau livrables (depuis mémoire 9.1)

| Livrable | Statut | Taux |
|---|---|---|
| Application web recruteur | Testé | 100 % |
| Interface candidat | Testé | 100 % |
| Analyse de CV par IA | Testé | 100 % |
| Génération de tests personnalisés | Testé | 100 % |
| Banque de questions | Testé | 100 % |
| Sandbox d'exécution | Testé | 100 % |
| Correction et calcul des résultats | Testé | 100 % |
| Résultats et tableau de bord | Testé | 100 % |
| Documentation technique | Finalisé | 100 % |

- Budget : **1 050 000 MGA ≈ 211,09 EUR** (prime projet 1 000 000 + API IA ≈ 50 000)
- **Visuels** : tableau + barre de progression 100 %.
- **Durée orale** : 45 s.
- **Satisfait** : S-11.

### Slide 19/20 — Difficultés, apports et perspectives
- **Objectif** : montrer analyse, apports et vision (S-11).
- **Contenu** :
  - **Difficultés et solutions** (3) :
    1. Indispo GitHub Models → bascule OpenAI via LlmClient (confirme l'abstraction)
    2. Tests JavaScript dans la sandbox → ajustement du harnais d'exécution
    3. Qualité IA variable → prompts renforcés + validation humaine systématique
  - **Apports** : plateforme fonctionnelle testée, sandbox validée 50 attaques, architecture multi-LLM, base réutilisable Tsarajoro
  - **Perspectives** : déploiement production (en cours), montée en charge, extension Go/Rust/C#, intégration ATS, mode 100 % local via Ollama
  - **Bilan personnel** : sécurité applicative, conception de prompts, architecture orientée domaines — relié aux enseignements MBDS (bases, sécurité, génie logiciel)
- **Visuels** : 3 colonnes (difficultés / apports / perspectives).
- **Durée orale** : 1 min 15.
- **Satisfait** : S-11.

### Slide 20/20 — Conclusion
- **Objectif** : clôturer avec un message clé et ouvrir les questions.
- **Contenu** :
  - **Message clé** : « SkillForge industrialise l'évaluation technique chez Tsarajoro : l'IA propose, le recruteur décide, la sandbox protège. »
  - Résultat global : 9/9 livrables à 100 %, 0 évasion sur 50 attaques, p95 4,37 s, OWASP sans alerte
  - QR code : dépôt GitHub + mémoire v3
  - **Merci de votre attention**
- **Visuels** : 1 phrase centrale + 4 chiffres clés + QR code + logos UCA/MBDS/ITU/Tsarajoro.
- **Durée orale** : 30 s.
- **Satisfait** : S-1, S-11.

**Total durée** : 30 + 20 + 45 + 45 + 60 + 60 + 45 + 60 + 75 + 75 + 60 + 75 + 45 + 120 + 90 + 90 + 75 + 45 + 75 + 30 = **1 220 s ≈ 20 min 20**. Marge pour transitions.

---

## 3. Mapping slides v1 → v2

| Slide v1 | Slide v2 | Statut |
|---|---|---|
| 1 Présentation du projet | 1/20 Titre | Modifiée (nouveau titre factuel + logos + jury + encadreurs) |
| 2 Plan | 2/20 Plan | Modifiée (6 blocs au lieu de 8, numérotation x/20) |
| 3 Recrutement technique aujourd'hui | 3/20 Recrutement aujourd'hui | Modifiée (chiffrage ajouté) |
| 7 Tsarajoro et mission | 4/20 Tsarajoro et mission | **Déplacée** (de slide 7 à 4) pour que la mission soit connue avant l'état de l'art |
| 4 Solutions existantes (1) + 5 (2) + 6 Positionnement | 5/20 Benchmark unique | **Fusion de 3 slides en 1 tableau comparatif** |
| — | 6/20 Pourquoi en interne (choix / écartées / repli) | **Nouvelle slide** (critère M-C12) |
| — | 7/20 Existant Tsarajoro + solution | **Nouvelle slide** (critère S-7) |
| 8 Quatre objectifs mesurables | 8/20 Cinq objectifs (Tableau 7) | Modifiée (passage à 5 objectifs, cibles alignées mémoire) |
| 9 Gestion de projet | 9/20 Démarche + planning réalisé + risques | Modifiée (Sprint 0-8 au lieu de POC 1-4 ; ajout prévu/réalisé et risques) |
| 10 Architecture logicielle | 10/20 Architecture + CU + ENF + données | Enrichie (CU clés, ENF chiffrées, MCD) |
| 11 Pipeline IA | 11/20 Pipeline IA | Conservée |
| 12 Sandbox durcie | 12/20 Sandbox durcie | Modifiée (chiffres alignés mémoire, OWASP mot pour mot) |
| 13 IA multi-fournisseurs | 13/20 IA multi-fournisseurs | Enrichie (extrait de code LlmClient) |
| 14-15 Démonstration | 14/20 Démo recruteur + 15/20 Démo candidat + 16/20 Démo attaque | **Scindée en 3 slides** pour la démo (vidéo de secours en 16) |
| 16 Cinq objectifs cinq résultats | — | **Fusionnée** dans 17/20 Résultats mesurés |
| 17 Résultats mesurés | 17/20 Résultats mesurés | Modifiée (ajout 27 JUnit, p95 4,37 s, formulation OWASP exacte) |
| — | 18/20 Bilan des livrables | **Nouvelle slide** (critère S-11 et M-I1) |
| 18 Difficultés + 19 Bilan et perspectives | 19/20 Difficultés + apports + perspectives + bilan personnel | **Fusion de 2 slides en 1** |
| 20 Conclusion | 20/20 Conclusion + message clé + QR | Modifiée |

Compte : 20 → 20 slides. 5 slides nouvelles ou profondément refondues (1, 4, 5, 6, 7). 3 fusions (4+5+6 → 5 ; 16+17 → 17 ; 18+19 → 19). 1 scission (14-15 → 14+15+16).

---

## 4. Checklist des 12 critères prof — comment la v2 les satisfait

| Critère | Comment v2 répond |
|---|---|
| **S-1 Titre** | Slide 1/20 reprend le titre factuel M-A1 (« Conception et développement d'une plateforme web d'évaluation technique des candidats assistée par LLM, avec exécution isolée du code »), ajoute jury complet (Dr Robinson, M. Razafinjoelina, M. RAVELOMANANTIANA), 4 logos (UCA, MBDS, ITU, Tsarajoro). |
| **S-2 Nombre** | 20 slides. |
| **S-3 Numérotation x/N** | Pied de page `n/20` sur toutes les slides (sauf 1/20). |
| **S-4 Problématique en ouverture** | Problématique dès 3/20 et mission connue dès 4/20 (avant l'état de l'art). |
| **S-5 Cohérence mémoire** | 5 objectifs communs à 8/20 et 17/20 ; cibles tirées du Tableau 7 ; planning Sprints 0-8 (Tableau 5) ; formulation « aucune alerte de niveau élevé, moyen ou faible » reprise mot pour mot du Tableau 8. |
| **S-6 État de l'art** | 5/20 : un seul tableau comparatif (ex-slides 4+5+6). 6/20 : décisions structurantes (choix / écartées / raison / repli). |
| **S-7 Existant et solution** | Nouvelle slide 7/20 décrivant l'existant Tsarajoro (processus manuel) et la solution retenue (SkillForge). |
| **S-8 Démarche projet** | 9/20 : planning Sprint 0-8 (prévu vs réalisé), anti-fraude anticipée S5→S4, 3 risques avec statut (éteint/en cours), outils listés. |
| **S-9 Exigences, architecture, conception** | 10/20 : architecture + 2 CU clés (CU-02 et CU-05) + 3 ENF chiffrées + mini-MCD. 11/20 : pipeline. 12/20 : sandbox. 13/20 : LlmClient avec extrait de code. |
| **S-10 Réalisation, démo, tests** | 14, 15, 16/20 scénarisent la démo en 11 étapes et incluent le blocage d'attaque en direct. Vidéo de secours MP4 préparée. |
| **S-11 Bilan et perspectives** | 17/20 résultats chiffrés, 18/20 tableau livrables (9/9 à 100 %), 19/20 difficultés + apports + perspectives + bilan personnel. |
| **S-12 Place de la contribution personnelle** | État de l'art réduit à 2 slides (5+6), les 12 slides 7-19 portent sur contribution directe (conception, dev, tests). |

**12/12 critères couverts.**

---

## 5. Visuels à préparer

| Visuel | Slide | Origine | Format |
|---|---|---|---|
| Logos UCA / MBDS / ITU / Tsarajoro | 1, 20 | Fichiers institutionnels à récupérer | PNG transparent |
| Fil conducteur 6 blocs | 2 | À créer | SVG inline |
| 3 pictogrammes (horloge, balance, dossier) | 3 | Lucide / Heroicons libre | SVG |
| Mini-schéma « CV → Test → Rapport » | 4 | À créer | SVG |
| Tableau comparatif HackerRank/Codility/CoderPad/TestGorilla/SkillForge | 5 | **Tableau 1 mémoire** (p. 15) | Tableau PowerPoint |
| Tableau décisions choix/écartées/repli | 6 | Dérivé du Tableau 2 des choix (p. 23 mémoire) | Tableau PowerPoint |
| Schéma Avant/Après | 7 | À créer (2 colonnes) | SVG |
| 5 cartes objectifs | 8 | Tableau 7 mémoire | Cartes PowerPoint |
| Mini-Gantt Sprint 0-8 | 9 | **Tableau 5 mémoire + Figure 1 planning** | Capture GanttProject ou SVG |
| Architecture logicielle | 10 | **Figure 8 mémoire** | PNG haute résolution |
| Mini-MCD (3 tables) | 10 | **Figure 11 mémoire (zoom)** | PNG |
| Pipeline IA 5 étapes | 11 | **Figure 5 mémoire** ou SVG custom | SVG |
| Schéma sandbox en couches + 7 verrous | 12 | **Figure 10 mémoire** | PNG + labels |
| Hub LlmClient + 6 fournisseurs | 13 | **Figure 7 mémoire (multi-fournisseurs)** | SVG |
| Extrait Java LlmClient (6 lignes) | 13 | Code du dépôt (`LlmClient.java`) | Bloc code |
| Captures écran recruteur | 14 | App en live ou **Figures 13-16 mémoire** | PNG |
| Captures écran candidat | 15 | App en live ou **Figures 12, 14 mémoire** | PNG |
| Capture blocage sandbox + rapport | 16 | App en live, bloc d'erreur `seccomp` + Figure 15 | PNG |
| 4 KPIs résultats (p95, OWASP, évasion, JUnit) | 17 | Tableau 7, 8, 9 mémoire | Cartes KPI |
| Tableau livrables 9/9 | 18 | Section 9.1 mémoire | Tableau |
| 3 colonnes difficultés / apports / perspectives | 19 | Chapitres 9.2 et 9.3 mémoire | PowerPoint |
| QR code dépôt + logos | 20 | QR généré depuis URL GitHub | PNG |

**Vidéo de secours** : enregistrement MP4 de 3 min couvrant les étapes 6-9 de la démo (passation + attaque bloquée + rapport), prête sur clé USB.

---

## 6. Conseils de forme

- Charte : conserver la palette bleu / mint pastel de la v1 (déjà cohérente avec le mémoire). Titres en bleu nuit (#1F3A68), accents en mint (#8FD6B5).
- **Format x/20 obligatoire** en pied de page à droite sur toutes les slides sauf 1/20.
- 1 titre + 3-5 bullets max par slide (ou un tableau pleine slide).
- Figures en 300 dpi minimum, aucune pixellisation.
- Logos UCA / MBDS / ITU / Tsarajoro en pied de page sur 1/20, 20/20, et sous forme discrète (coin inférieur gauche) sur les autres si la place le permet.
- Noter la durée orale cible dans les **notes du présentateur** de chaque slide (champ Notes PowerPoint).
- Police : conserver Calibri ou passer à Inter pour plus de modernité (16-18 pt corps, 28 pt titres).
- Figures du mémoire v3 : vérifier que les légendes ne débordent pas quand recopiées dans les slides.

---

## 7. Points de vigilance pour la soutenance

1. **Cohérence mot pour mot avec le mémoire** : le prof vérifie slide par slide contre le Tableau 7 (ENF), le Tableau 8 (sécurité), le Tableau 5 (sprints) et le Tableau 1 (benchmark). La moindre cible inventée (comme « < 15 s / CV ») sera relevée. **Toujours citer le tableau d'origine**.
2. **Formulation OWASP** : ne JAMAIS dire ni écrire « 0 vulnérabilité ». La phrase exacte du mémoire (Tableau 8) est « **aucune alerte de niveau élevé, moyen ou faible** ». Le jury M2 est intraitable sur ce point : « 0 vulnérabilité » est une sur-affirmation que la section 8.3 du mémoire reconnaît explicitement comme indéfendable.
3. **Nombre d'objectifs** : 5 et seulement 5, cohérents entre 8/20 et 17/20. Si on cite 4 objectifs à un endroit et 5 à un autre, le jury le voit en 10 secondes.
4. **Planning** : parler de **Sprint 0 à Sprint 8** et JAMAIS de « POC 1 à POC 4 ». Le mémoire v3 utilise la terminologie Scrum, les slides doivent suivre.
5. **Démo** : prévoir impérativement la vidéo de secours MP4. Un fournisseur IA en panne pendant la soutenance ruine 2 minutes de démo. Dire explicitement au jury « voici la démo live, j'ai aussi une vidéo de secours si besoin » rassure.
6. **Ne pas sur-vendre l'IA** : garder le message clé « **l'IA propose, le recruteur décide** » du début à la fin. Le prof a noté comme point fort que le mémoire tient ce discours de bout en bout ; les slides doivent le refléter.
7. **Loi 2014-038 / RGPD** : si le jury pose la question « où sont stockées les données candidats et que fait OpenAI avec le CV ? », avoir une réponse courte prête (anonymisation possible avant envoi, option Ollama 100 % local, consentement coché avant passation).
8. **Budget** : citer **1 050 000 MGA ≈ 211,09 EUR** si on nous le demande (prime 1 000 000 + API ≈ 50 000). Pas « coût mensuel × 4 mois » qui a été reproché au mémoire.
9. **Timing 20 min** : s'entraîner avec chronomètre. La démo (14-16) consomme 5 min, c'est le plus gros bloc ; il ne faut pas s'étaler sur l'état de l'art (max 2 min total pour slides 5+6).
10. **Questions probables du jury** (prépar oral séparée) : (a) pourquoi Docker et pas gVisor/Firecracker ? (b) comment êtes-vous sûr de la qualité des générations IA ? (c) la plateforme passera-t-elle à l'échelle à 100 candidats simultanés ? (d) qui maintient après votre départ ?

---

*Document rédigé le 2026-10-06 sur la base des 3 PDFs source. À confronter avec la version finale du mémoire avant mise en production des slides.*
