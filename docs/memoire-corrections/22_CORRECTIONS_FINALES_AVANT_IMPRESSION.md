# Corrections finales mémoire v3 — avant impression

Audit croisé de deux agents indépendants (technique + relecture jury) sur `V3/MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v3.pdf` du 14 octobre 2026.

**Verdict global** : LIVRABLE après 2 corrections bloquantes (2 min). Peut viser 17-18/20 avec 3 corrections majeures supplémentaires (10 min).

---

## 🔴 Bloquants avant impression

### Fix 1 — Supprimer la page parasite `13 / 12`

**Problème** : entre la fin du Glossaire (page 12/12 du front matter) et le début de l'Introduction (page 1/71 du corps), une page physique vide ou résiduelle porte le pied de page `13 / 12`.

**Preuve** : extraction du PDF ligne 522 → `© GERSHOM Ny Aina Fitia, 2026 13 / 12` juste avant la ligne `Introduction`.

**Correction Word** :

1. Va à la fin du Glossaire (après l'entrée Vite).
2. Repère le saut de page qui précède l'Introduction.
3. Il y a probablement un saut de page double ou une page vide. Supprime-la (Suppr).
4. Vérifie qu'il reste bien un seul saut de section entre « 12 / 12 » et « 1 / 71 ».
5. Mets à jour la TDM (clic droit → Mettre à jour les champs).

**Attendu après fix** : plus aucune occurrence de `13 / 12` dans le PDF régénéré.

---

### Fix 2 — Corriger les noms de tables au § 7.2.4

**Problème** : en section 7.2.4 (page 33), les tables sont nommées au singulier (`passation`, `réponse`, `anti_fraud_event`) alors que partout ailleurs (Annexe 6, Figure 12, code SQL, migrations Flyway) elles sont au pluriel (`passations`, `answers`, `fraud_events`).

**Correction Word (Ctrl+H trois fois)** :

| Chercher | Remplacer par |
|---|---|
| `passation (session` | `passations (sessions` |
| `réponse (réponses` | `answers (réponses` |
| `anti_fraud_event (événements` | `fraud_events (événements` |

**Attendu après fix** : les 3 noms de tables du § 7.2.4 correspondent exactement à ceux de l'Annexe 6.

---

## ⚠️ Majeurs — pour viser 17-18/20 (recommandés, pas obligatoires)

### Fix 3 — Mentionner OpenAI comme fournisseur principal dans le résumé et l'abstract

**Problème** : le résumé (page 1/12) et l'abstract (page 2/12) parlent de « multi-fournisseurs » sans jamais nommer celui qui est principal. Le jury qui ne lit que le résumé pour cadrer la soutenance ne sait pas quel LLM a réellement tourné en préproduction.

**Correction** : ajouter une phrase à la fin du 2e paragraphe du résumé et de l'abstract.

**Résumé (FR)** :

Ancienne fin du 2e paragraphe (après `multi-fournisseurs permet de configurer différents modèles de langage.`) :
```
… multi-fournisseurs permet de configurer différents modèles de langage.
```

Remplacer par :
```
… multi-fournisseurs permet de configurer différents modèles de langage. OpenAI gpt-4o-mini a été retenu comme fournisseur principal en préproduction, les cinq autres fournisseurs servant de secours ou d'alternative locale.
```

**Abstract (EN)** :

Ancienne fin du 2e paragraphe (après `allows different language models to be configured.`) :
```
… allows different language models to be configured.
```

Remplacer par :
```
… allows different language models to be configured. OpenAI gpt-4o-mini was selected as the main provider in pre-production, with five other providers available as fallback or local alternative.
```

---

### Fix 4 — Tableau 15 (bilan livrables) trop lisse

**Problème** : tous les livrables sont à « 100 % Testé » dans le Tableau 15 (§ 9.1, page 38). Même les points où tu reconnais honnêtement des limites ailleurs dans le mémoire (ex : « précision/rappel non chiffrés faute de jeu de référence » en § 8.5) sont à 100 %. Le jury trouve ça suspect.

**Correction** : modifier deux lignes et ajouter une ligne.

Trouve la ligne « Analyse de CV par IA » et modifie :

| Avant | Après |
|---|---|
| 100 % Testé | 90 % Testé — extraction fonctionnelle, mesure de précision non chiffrée faute de jeu de référence annoté |

Ajoute une nouvelle ligne à la fin du Tableau 15 :

| Livrable / objectif | Cible initiale | Réalisation | Taux | Statut |
|---|---|---|---|---|
| Déploiement interne Tsarajoro | Hébergement sur l'infrastructure interne | Préproduction publique sur Vercel + Render | 0 % | Prévu post-stage |

---

### Fix 5 — Dater les chiffres de validation IA

**Problème** : en § 2.3 (page 6) et § 8.5 (page 37), les chiffres « 22 CV analysés, 189 questions générées, 56 approuvées, 0 rejetée » apparaissent sans date de relevé. Le jury peut demander : « quand a été fait ce comptage ? ».

**Correction Word (Ctrl+H)** :

| Chercher | Remplacer par |
|---|---|
| `22 CV ont été analysés et 189 questions` | `au 6 octobre 2026, 22 CV ont été analysés et 189 questions` |

---

## 🟡 Mineurs — optionnels si tu as 15 min de plus

### Fix 6 — Annoncer le chapitre 9 dans l'Introduction

L'Introduction s'arrête à l'annonce du chapitre 8 et oublie le chapitre 9 (Conclusion).

**Correction** : trouver la phrase « Enfin, le chapitre 8 présente les tests et les résultats obtenus. » et remplacer par « Le chapitre 8 présente les tests et les résultats obtenus, et le chapitre 9 dresse le bilan du projet et ses perspectives. »

### Fix 7 — « caractère innovant » en § 1.2

Reformuler pour éviter le ton marketing.

Avant :
```
Le caractère innovant repose sur la personnalisation des évaluations à partir du CV et du profil recherché grâce à l'intelligence artificielle.
```

Après :
```
L'originalité fonctionnelle de SkillForge repose sur l'enchaînement intégré analyse CV → compétences → questions personnalisées, avec validation humaine systématique avant envoi au candidat.
```

### Fix 8 — Lier le § 8.1 à l'Annexe 7

Ajouter à la phrase « 27 tests ont été détectés : 19 dans le backend principal et 8 dans la sandbox » une précision :

Après :
```
… 19 dans le backend principal et 8 dans la sandbox, soit 25 tests unitaires et 2 tests d'intégration (voir Annexe 7).
```

### Fix 9 — Retirer « et de test » pour Groq (Tableau 16)

Dans la colonne « Usage dans SkillForge » du Tableau 16 pour Groq, « Fournisseur de secours et de test » → remplacer par « Fournisseur de secours ».

### Fix 10 — Accents majuscules page de garde

À arbitrer selon le libellé officiel UCA :

Si l'UCA accentue, remplacer sur la page de garde :
- `SANTE` → `SANTÉ`
- `MOBIQUITE` → `MOBIQUITÉ`
- `DONNEES` → `DONNÉES`
- `INTEGRATION` → `INTÉGRATION`

Si l'UCA laisse les majuscules sans accent (libellé administratif figé), laisser tel quel.

---

## ✅ Points vérifiés et OK (ne rien changer)

- 71 pieds de page corps `/71` sans doublon ni saut
- 38 tableaux T1 à T38 cohérents (Liste des tableaux et corps)
- 22 figures F1 à F22 cohérentes (Liste des figures et corps)
- Table des matières alignée sur les pages réelles
- 11 titres d'annexe distincts (aucune duplication)
- 17 références bibliographiques toutes citées dans le corps
- Zéro vocabulaire interdit (`PocSandboxHarnessTest` = nom de classe acceptable)
- Zéro hallucination LLM, zéro crochet non rempli
- Jury page de garde complet (3 membres : Michel Syska, 2e nom à compléter si pas encore reçu, Ulrich Ravelomanantiana)
- Pagination `/12` front matter + `/71` corps
- Chapitre 9 = « Conclusion » (sans « générale »)
- Sous-sections 4.3.1 à 4.3.5 numérotées
- Figure 4 : légende complète
- 50 scénarios sandbox cohérents partout
- 27 tests JUnit cohérents partout
- p95 charge k6 = 4,37 s cohérent
- Cohérence Groq → OpenAI
- MBDS développé en « Mobiquité, Bases de Données et Intégration de Systèmes »
- Noms de modèles LLM du Tableau 16 cohérents avec `application.yml` (Qwen 3.8, Gemini 3.5 Flash-Lite, Claude Sonnet 4.5, etc.) — ne PAS changer

---

## Récap action — checklist à cocher

### Bloquants (2 min)
- [ ] Fix 1 — supprimer page parasite `13 / 12`
- [ ] Fix 2 — passation → passations, réponse → answers, anti_fraud_event → fraud_events (§ 7.2.4)

### Majeurs (10 min) — pour 17-18/20
- [ ] Fix 3 — OpenAI principal dans résumé + abstract
- [ ] Fix 4 — Tableau 15 : Analyse CV 90 % + ligne Déploiement interne 0 %
- [ ] Fix 5 — « au 6 octobre 2026 » devant les chiffres IA

### Mineurs (15 min) — pour 18+/20
- [ ] Fix 6 — annoncer chapitre 9 dans Introduction
- [ ] Fix 7 — reformuler « caractère innovant » (§ 1.2)
- [ ] Fix 8 — lier § 8.1 à l'Annexe 7
- [ ] Fix 9 — retirer « et de test » pour Groq (Tableau 16)
- [ ] Fix 10 — arbitrer accents majuscules page de garde

### Après impression
- [ ] Jury page de garde : compléter le 2ᵉ membre dès notification officielle

---

## Verdict final

Après les 2 bloquants : **mémoire 100 % livrable**.
Après les 5 bloquants + majeurs : **viser 17-18 / 20 sur la qualité rédactionnelle**.
Après les 10 fix complets : **viser 18+ / 20**.
