# SkillForge

Plateforme nouvelle génération de recrutement technique entièrement assistée par IA : analyse du CV, génération adaptative de tests, sandbox sécurisée et compte rendu argumenté. Projet de stage M2 MBDS pour Tsarajoro.

---

## Présentation

SkillForge est une plateforme web sécurisée d'évaluation technique des candidats, conçue pour les besoins spécifiques de Tsarajoro. À partir du CV d'un candidat, l'IA extrait automatiquement ses compétences et génère un test sur mesure (QCM, exercices de code, cas pratiques). Le code est exécuté dans une sandbox Docker durcie et corrigé automatiquement. L'IA produit enfin un compte rendu détaillé avec une recommandation d'embauche argumentée.

## Stack technique

- **Backend** : Java 21 + Spring Boot 3
- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS + Shadcn/UI
- **Base de données** : PostgreSQL 16
- **Sandbox** : Docker + Docker Java API + seccomp
- **IA** : Claude API (Anthropic)
- **Parsing CV** : Apache PDFBox, Apache POI, Tesseract (OCR)
- **CI/CD** : GitHub Actions

## Architecture

Deux services Spring Boot séparés pour des raisons de sécurité :

- `backend-app` : service applicatif principal (utilisateurs, banque de questions, IA, statistiques, API REST)
- `backend-sandbox` : service isolé d'exécution sécurisée du code candidat

Un frontend React unique sert les recruteurs et les candidats selon leurs rôles.

## Structure du dépôt

```
skillforge-platform/
├── apps/
│   ├── backend-app/         # Spring Boot principal
│   ├── backend-sandbox/     # Spring Boot sandbox isolée
│   └── frontend-web/        # React + Vite + TypeScript
├── docs/
│   ├── 01-cahier-des-charges/
│   ├── 02-conception/
│   └── 03-poc/
└── infra/                   # docker-compose, configuration
```

## Environnement de développement local

### Prérequis
- Java 21 (Temurin)
- Node 20 + pnpm
- Maven 3.9+
- Docker Engine + Docker Compose
- Client `psql` (PostgreSQL 16+)

### Démarrer la base de données locale

```bash
docker compose -f infra/docker-compose.yml up -d
```

La base PostgreSQL 16 démarre dans un conteneur Docker :

| Paramètre | Valeur |
|---|---|
| Hôte | `localhost` |
| Port | `5434` (mappé sur 5432 du conteneur, car 5432 et 5433 sont déjà occupés sur le poste de dev) |
| Base | `skillforge` |
| Utilisateur | `skillforge` |
| Mot de passe | `skillforge_dev` |

Tester la connexion :
```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "SELECT version();"
```

Arrêter la base :
```bash
docker compose -f infra/docker-compose.yml down
```

Les données sont persistées dans le volume Docker `skillforge_pgdata`.

## Méthodologie

Scrum, sprints de 2 semaines, 8 sprints sur 4 mois (mai à septembre 2026).

## Documentation

| Document | Pour quoi faire |
|---|---|
| [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) | Installer et démarrer SkillForge sur un nouveau poste |
| [`docs/GUIDE_API_KEYS.md`](docs/GUIDE_API_KEYS.md) | Obtenir et configurer une clé API OpenAI ou Claude |
| [`docs/04-tests/fiche-tests-manuels.md`](docs/04-tests/fiche-tests-manuels.md) | Liste exhaustive des tests à passer (29 déjà validés + à venir) |
| [`docs/02-conception/`](docs/02-conception/) | État de l'art, étude existant, cadrage V1, UML, MCD, architecture |
| [`docs/03-poc/`](docs/03-poc/) | Rapports des Proofs of Concept |
| [`plan.md`](plan.md) | Plan d'exécution 90 jours (document vivant) |

## Auteur

GERSHOM Ny Aina Fitia — Master 2 MBDS — Université Côte d'Azur / IT University
