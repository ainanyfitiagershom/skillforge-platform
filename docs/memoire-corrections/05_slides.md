# Vague 5 — Harmonisation des slides avec le mémoire corrigé

Cette vague traite les 6 critères du prof portant sur le support de
soutenance. L'enjeu : aligner les slides sur le mémoire corrigé (Vagues 1
à 4) pour que le jury retrouve une cohérence totale entre le document
écrit et la présentation orale.

## Critères couverts

| ID | Critère | Priorité prof |
|---|---|---|
| S-1 | Diapositive de titre | Partiel |
| S-3 | Numérotation x/N | À revoir |
| S-4 | Problématique en ouverture (réordonner slide 7) | Conforme + ajustement |
| **S-5** | Cohérence mémoire ↔ slides | ⭐ À revoir |
| S-6 | État de l'art et justification | Partiel |
| S-7 | Existant et solution | Partiel |
| S-8 | Démarche projet | Partiel |
| S-9 | Exigences / archi / conception | Partiel |
| S-11 | Bilan et perspectives | Partiel |

---

## S-1 — Diapositive de titre

**Nouveau titre à utiliser sur la slide 1** (identique à M-A1 validé) :

> **Conception et développement d'une plateforme web d'aide au recrutement
> technique, assistée par LLM, avec exécution isolée du code candidat**

**Blocs à ajouter / corriger sur la slide titre** :

- Prénom NOM : **Ny Aina Fitia GERSHOM**
- Numéro étudiant : **ETU001776**
- Formation : **Master 2 MBDS — Université Côte d'Azur / ITU**
- Entreprise d'accueil : **Tsarajoro**
- Encadreur entreprise : *[nom à confirmer]*
- Encadreur académique : *[nom à confirmer]*
- Date de soutenance : **7 octobre 2026**
- Logo UCA + logo ITU + logo Tsarajoro (côte à côte, bas de slide)

---

## S-3 — Numérotation x/N

**Consigne PowerPoint** : activer le pied de page `Diapositive n° {x}/{N}`
sur toutes les slides sauf la slide de titre.

Dans PowerPoint : *Insertion → En-tête et pied de page → cocher
« Diapositive numéro »*, puis adapter le masque avec le format
`{slide-number} / {slide-total}`.

---

## S-4 — Problématique en ouverture

**Consigne** : réordonner les slides pour que la **problématique** vienne
dès la slide 2 ou 3 (juste après le titre et une slide « Qui je suis »
courte si pertinent).

### Slide « Problématique » proposée

**Titre** : *Pourquoi SkillForge ?*

**Contenu** (3 blocs) :

- **Constat Tsarajoro** : préparation + correction d'une évaluation
  technique = demi-journée d'un développeur sénior par candidat.
- **Marché** : solutions existantes (HackerRank, Codility…) à ~15 USD /
  candidat, hébergées hors Madagascar.
- **Enjeu** : outil interne, souverain, assisté par IA, qui garde le
  recruteur maître de la décision finale.

---

## ⭐ S-5 — Cohérence mémoire ↔ slides

**Enjeu** : chaque slide doit renvoyer à une section du mémoire et
réutiliser les mêmes figures, tableaux et chiffres. Grille de
correspondance à vérifier avant impression.

### Table de correspondance proposée

| # Slide | Titre | Section mémoire | Source visuelle |
|---|---|---|---|
| 1 | Titre | Page de garde | Logos |
| 2 | Problématique | 1.2 | — |
| 3 | Tsarajoro en 3 chiffres | 1.1 | — |
| 4 | État de l'art — plateformes | 2.2 | Tableau M-C3 |
| 5 | État de l'art — IA & biais | 2.3 | Tableau M-C8 |
| 6 | État de l'art — sécurité & RGPD | 2.5 + 2.5.X | — |
| 7 | Synthèse des choix | 2.7 | Tableau M-C12 ⭐ |
| 8 | Démarche projet (Scrum adapté) | 4.1.1 | — |
| 9 | Planning & jalons | 4.2 | Gantt |
| 10 | Risques & budget | 4.3 + 4.4 | Tableaux M-E6 + M-E8 |
| 11 | Exigences fonctionnelles clés | 5.1 | Extrait FR-xx |
| 12 | Exigences non fonctionnelles clés | 5.1 | Tableau NFR-xx |
| 13 | Architecture | 6.2 | Diagramme composants M-F2 |
| 14 | Zoom sandbox Docker | 6.3 ou 7.3 | — |
| 15 | Zoom abstraction `LlmClient` | 6.3 ou 7.3 | Interface Java |
| 16 | Démo (vidéo de secours) | — | Vidéo |
| 17 | Tests OWASP + k6 | 7.4 | Tableaux M-H1 |
| 18 | Bilan — objectifs atteints | 8.1 | — |
| 19 | Problèmes rencontrés | 8.2 | — |
| 20 | Perspectives | 8.3 | — |
| 21 | Remerciements + questions | — | — |

**Règle à tenir** : toute figure, tout tableau et tout chiffre présent dans
les slides doit être identique à ceux du mémoire. Si une donnée change dans
le mémoire pendant la Vague 4, mettre à jour la slide correspondante.

---

## S-6 — État de l'art et justification sur slides

**Enjeu** : le prof reproche que les slides actuelles survolent l'état de
l'art. Trois slides dédiées (4, 5, 6) sont désormais prévues.

### Slide 4 — Plateformes existantes

Tableau simplifié repris du mémoire (M-C3), colonnes : plateforme, coût
indicatif / candidat, localisation des données, point faible pour Tsarajoro.

### Slide 5 — IA, biais et AI Act

Deux colonnes :

- **Comparatif rapide des LLM** : 5 fournisseurs, 3 critères (coût, latence,
  souveraineté), tableau raccourci de M-C8.
- **Biais et cadre réglementaire** : trois bullets (Raghavan 2020, Bogen
  2018, AI Act usage à haut risque) + conséquence SkillForge (validation
  humaine systématique).

### Slide 6 — Sécurité et RGPD

Trois blocs : loi 2014-038 (Madagascar), RGPD (candidats UE), transferts
hors UE/Madagascar (consentement + minimisation + option Ollama locale).

### Slide 7 — Synthèse des choix (M-C12)

**Slide la plus importante.** Reprise directe du tableau de synthèse de
2.7 (M-C12), condensé à 5 lignes et 3 colonnes : décision / options
écartées / raison du choix. Les colonnes « risque résiduel » et « plan de
repli » restent dans le mémoire.

---

## S-7, S-8, S-9 — Alignement sur les autres sections du mémoire

### S-7 (Existant et solution)

- Slide 3 complétée par une mention « Processus actuel : *X h / candidat*,
  issu de M-D1 chiffré » si Fitia obtient le chiffre auprès de l'encadreur.

### S-8 (Démarche projet)

- Slide 8 : rôles cumulés (PO + SM + Dev) + 8 sprints + rituels écrits.
- Slide 9 : Gantt (export GanttProject) + 3 jalons visibles.
- Slide 10 : extrait du registre des risques (top 3 par niveau) + tableau
  budget simplifié.

### S-9 (Exigences, architecture, conception)

- Slide 11 : 5 exigences fonctionnelles clés (FR-02, FR-03, FR-07, FR-09,
  FR-13).
- Slide 12 : 5 exigences non fonctionnelles clés (NFR-01, NFR-03, NFR-04,
  NFR-06, NFR-07).
- Slide 13 : diagramme de composants (export Mermaid PNG, voir M-F2).
- Slide 14 : zoom sandbox — illustration + 4 options d'isolation (icônes
  seccomp, no-net, read-only, cap-drop).
- Slide 15 : zoom `LlmClient` — code Java + 6 implémentations alignées.

---

## S-11 — Bilan et perspectives

### Slide 18 — Bilan (objectifs atteints)

Reprise synthétique de M-I1 :

- **Fonctionnel** : plateforme opérationnelle, 6 fournisseurs IA testés,
  anti-fraude active.
- **Technique** : OWASP ZAP 0 finding critique, k6 20 VU tenue, bascule IA
  prouvée en < 1 h.
- **Organisationnel** : livraison à date, documentation transférée.

### Slide 19 — Problèmes rencontrés

Reprise synthétique de M-I2 : 3 problèmes (GitHub Models dépublié, évasion
sandbox en test interne, retard anti-fraude), 3 solutions.

### Slide 20 — Perspectives

- Dashboard analytics avancé (métier RH).
- Connecteur ATS (interopérabilité).
- Automatisation du suivi de couverture (JaCoCo + badge CI).
- Montée en charge au-delà de 50 VU (tests supplémentaires).
- Évaluation formalisée de la qualité des sorties IA (jeu de test
  reproductible).

---

## Récapitulatif Vague 5

| Critère | Statut après V5 |
|---|---|
| S-1 Titre | Nouveau titre + bloc identification prêts |
| S-3 Numérotation | Consigne PowerPoint |
| S-4 Problématique en ouverture | Slide prête |
| S-5 Cohérence mémoire ↔ slides ⭐ | Table de correspondance (21 slides) prête |
| S-6 État de l'art | 4 slides prêtes (4, 5, 6, 7) |
| S-7 Existant et solution | Ajustements slides 3 et 7 |
| S-8 Démarche projet | 3 slides prêtes (8, 9, 10) |
| S-9 Exigences / archi / conception | 5 slides prêtes (11-15) |
| S-11 Bilan et perspectives | 3 slides prêtes (18, 19, 20) |

**9 critères sur 9 traités en proposition.**

### Travaux complémentaires requis côté Fitia

- Reconstruire le PPTX à partir de la table de correspondance (21 slides).
- Insérer les figures finalisées (Gantt, diagrammes Mermaid exportés en
  PNG, tableaux repris du mémoire).
- Enregistrer la vidéo de secours de la démo.
- Préparer les 10 à 15 questions probables du jury + réponses d'une
  minute (fichier à part : `docs/soutenance/04_QUESTIONS_JURY.md` à
  créer si inexistant).
