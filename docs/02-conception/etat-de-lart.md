# État de l'art — Plateformes d'évaluation technique pour le recrutement

## 1. Introduction

L'évaluation technique des candidats au recrutement repose aujourd'hui sur quelques plateformes SaaS majeures. Avant de développer SkillForge en interne pour Tsarajoro, nous étudions ici les cinq solutions les plus utilisées en Europe et aux États-Unis, afin d'identifier précisément ce qu'elles couvrent, ce qu'elles ne couvrent pas, et où SkillForge se positionne.

## 2. Critères de comparaison

Huit critères ont été retenus pour permettre une comparaison objective.

| # | Critère | Justification |
|---|---|---|
| C1 | **Banque de questions techniques** | Richesse et qualité des questions prêtes à l'emploi |
| C2 | **Sandbox d'exécution de code multi-langage** | Capacité à exécuter le code candidat de façon sécurisée |
| C3 | **Génération automatique par IA depuis une fiche de poste** | Création d'un test à partir d'une description |
| C4 | **Génération adaptative à partir du CV individuel** | Test sur mesure pour chaque candidat |
| C5 | **Adaptation aux profils métier (WordPress, SEO, etc.)** | Couverture des profils non purement « dev généraliste » |
| C6 | **Hébergement on-premise (chez le client)** | Souveraineté des données candidat |
| C7 | **Conformité RGPD (UE)** | Conformité légale pour une entreprise européenne |
| C8 | **Coût mensuel (~50 candidats / mois)** | Coût total d'utilisation |

## 3. Étude des plateformes

### 3.1 HackerRank

Solution historique et la plus connue du marché. Très utilisée pour les profils développeurs et data.

- **Banque** : très complète (algorithmes, base de données, langages courants).
- **Sandbox** : mature, supporte ~30 langages.
- **IA depuis JD** : oui, depuis 2024, permet de générer un test à partir d'une description de poste.
- **IA depuis CV individuel** : non.
- **Profils WordPress / SEO** : non couverts.
- **On-premise** : non, uniquement SaaS US.
- **RGPD** : partielle, hébergement aux États-Unis.
- **Coût** : ~600 € / mois pour ~50 candidats.

### 3.2 Codility

Orientée algorithmique, populaire dans la finance et les grandes entreprises.

- **Banque** : très complète sur l'algorithmique et la structure de données.
- **Sandbox** : mature.
- **IA depuis JD** : limitée.
- **IA depuis CV individuel** : non.
- **Profils WordPress / SEO** : non couverts.
- **On-premise** : non.
- **RGPD** : partielle.
- **Coût** : ~700 € / mois pour ~50 candidats.

### 3.3 TestGorilla

Diversifie au-delà du code : tests techniques mais aussi soft skills, langues, personnalité.

- **Banque** : large mais moins profonde techniquement.
- **Sandbox** : oui mais moins avancée.
- **IA depuis JD** : limitée.
- **IA depuis CV individuel** : non. Propose un *AI Resume Scoring* (note un CV contre une fiche de poste) mais pas de génération de test sur mesure.
- **Profils WordPress / SEO** : non spécifiquement couverts.
- **On-premise** : non.
- **RGPD** : conformité avancée, hébergement européen possible.
- **Coût** : ~400 € / mois pour ~50 candidats.

### 3.4 CodeSignal

Détection de fraude avancée et IA conversationnelle (Cosmo).

- **Banque** : complète.
- **Sandbox** : mature.
- **IA depuis JD** : oui (agent Cosmo génère un test depuis une description de rôle).
- **IA depuis CV individuel** : non.
- **Profils WordPress / SEO** : non.
- **On-premise** : non.
- **RGPD** : partielle.
- **Coût** : ~800 € / mois pour ~50 candidats.

### 3.5 Karat

Modèle différent : pas une plateforme automatisée, mais un service d'entretiens techniques humains assistés par IA.

- **Banque** : non applicable (humains).
- **Sandbox** : non (entretien live).
- **IA depuis JD** : non (humain en visio).
- **IA depuis CV individuel** : non.
- **Profils WordPress / SEO** : non.
- **On-premise** : non.
- **RGPD** : non explicitement conforme.
- **Coût** : ~3 000 € / mois (modèle premium).

## 4. Tableau comparatif

| Critère | HackerRank | Codility | TestGorilla | CodeSignal | Karat | **SkillForge** |
|---|---|---|---|---|---|---|
| C1 — Banque de questions | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | (humain) | ⭐⭐ (à construire) |
| C2 — Sandbox multi-langage | Oui (30+) | Oui | Oui | Oui | Non | Oui (PHP + JS en V1) |
| C3 — IA depuis JD | Oui | Limité | Limité | Oui | Non | Non (pas le besoin) |
| **C4 — IA depuis CV individuel** | **Non** | **Non** | **Non** | **Non** | **Non** | **Oui (innovation centrale)** |
| **C5 — Profils WordPress / SEO** | **Non** | **Non** | **Non** | **Non** | **Non** | **Oui (sur mesure Tsarajoro)** |
| **C6 — On-premise** | **Non** | **Non** | **Non** | **Non** | **Non** | **Oui** |
| C7 — RGPD UE | Partielle | Partielle | Avancée | Partielle | Non | Totale |
| C8 — Coût mensuel | ~600 € | ~700 € | ~400 € | ~800 € | ~3 000 € | ~50-100 € (API uniquement) |

## 5. Positionnement de SkillForge

L'étude révèle que les plateformes du marché couvrent bien la **génération de tests à partir d'une fiche de poste générique**, mais **aucune** ne propose les trois éléments qui font la singularité du besoin de Tsarajoro :

1. **Génération adaptée au CV individuel du candidat** (C4) — chaque candidat reçoit un test différent, calibré sur les compétences qu'il a réellement déclarées.
2. **Adaptation aux profils métier spécifiques de Tsarajoro** (C5) — intégrateur WordPress, spécialiste SEO, profils peu présents dans les catalogues génériques.
3. **Hébergement on-premise** (C6) — souveraineté complète sur les données candidat.

SkillForge se positionne donc sur un espace non occupé par le marché, en complément (et non en concurrence directe) avec ces solutions, avec un coût récurrent dix fois inférieur car développé en interne et ne payant que l'usage de l'API d'IA.

## 6. Sources

Pages produits officielles consultées en mai 2026 :
- HackerRank — https://www.hackerrank.com
- Codility — https://www.codility.com
- TestGorilla — https://www.testgorilla.com
- CodeSignal — https://codesignal.com
- Karat — https://karat.com
