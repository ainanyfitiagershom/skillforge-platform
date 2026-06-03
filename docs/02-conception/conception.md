# Dossier de conception

Ce document regroupe l'ensemble des éléments de conception du projet SkillForge : architecture technique, diagrammes UML (cas d'usage, classes, séquences), modèle de données (MCD Merise, MLD, MPD), et choix structurants.

> Tous les diagrammes sont en **Mermaid** pour pouvoir être versionnés en texte aux côtés du code. Ils sont rendus directement par GitHub, GitLab et la plupart des éditeurs Markdown.

## 1. Architecture technique

### 1.1 Vue d'ensemble

L'architecture repose sur **deux services Spring Boot séparés** pour des raisons de sécurité : la sandbox exécute du code venant de l'extérieur (potentiellement malveillant), il est donc essentiel de l'isoler du service applicatif principal qui gère la base de données et les utilisateurs.

```mermaid
flowchart TB
  Recruteur[Recruteur navigateur]:::user
  Candidat[Candidat navigateur]:::user

  subgraph Frontend [Frontend React]
    UI[Application web React 19 + TypeScript + ShadcnUI]
  end

  subgraph BackendApp [Service applicatif backend-app]
    Auth[Authentification JWT]
    Banque[Banque de questions]
    Llm[Module IA - analyse CV / generation / compte rendu]
    Stats[Module statistiques]
    Api[API REST OpenAPI 3]
  end

  subgraph BackendSandbox [Service Sandbox backend-sandbox isole]
    Runner[SandboxRunner Docker Java API]
    DockerPHP[Conteneur PHP 8.3 ephemere]
    DockerJS[Conteneur Node 20 ephemere]
  end

  subgraph Infra [Infrastructure]
    Postgres[(PostgreSQL 16)]
    LlmExt[API IA externe OpenAI ou Claude]
  end

  Recruteur -->|HTTPS| UI
  Candidat -->|HTTPS lien unique| UI
  UI -->|REST + JWT| Api
  Api --> Auth
  Api --> Banque
  Api --> Llm
  Api --> Stats
  Llm -->|HTTPS| LlmExt
  Api -->|JDBC| Postgres
  Stats -->|JDBC| Postgres
  Api -->|REST interne| Runner
  Runner -->|Docker API| DockerPHP
  Runner -->|Docker API| DockerJS

  classDef user fill:#fde9b8,stroke:#aa6500,color:#000
```

### 1.2 Pourquoi deux services et pas un seul ?

La sandbox exécute du code arbitraire fourni par le candidat. Même avec un durcissement Docker complet (seccomp, capabilities, etc.), il subsiste un **risque résiduel d'évasion** (faille du noyau Linux, faille de Docker). En isolant la sandbox dans un service séparé :

- si l'attaquant s'échappe d'un conteneur, il atterrit dans un service vide, sans base de données ni informations utilisateur ;
- le service applicatif principal reste protégé même en cas de compromission de la sandbox ;
- les deux services peuvent être déployés sur des machines différentes en production si nécessaire.

## 2. Diagrammes UML

### 2.1 Diagramme de cas d'usage

```mermaid
flowchart LR
  Admin((Administrateur)):::actor
  Recruteur((Recruteur)):::actor
  Candidat((Candidat)):::actor
  IA((Service IA externe)):::system

  Admin --> UC_Users[Gerer les utilisateurs]
  Admin --> UC_Purge[Purger les donnees candidat - RGPD]

  Recruteur --> UC_UploadCV[Televerser un CV]
  Recruteur --> UC_Generer[Generer un test sur mesure]
  Recruteur --> UC_Valider[Valider les questions generees]
  Recruteur --> UC_Inviter[Inviter le candidat]
  Recruteur --> UC_Consulter[Consulter le compte rendu]
  Recruteur --> UC_Dashboard[Consulter le tableau de bord]
  Recruteur --> UC_Banque[Gerer la banque de questions]

  Candidat --> UC_Passer[Passer le test]
  Candidat --> UC_Coder[Ecrire et executer du code]

  UC_UploadCV --> IA
  UC_Generer --> IA
  UC_Consulter --> IA

  classDef actor fill:#cce5ff,stroke:#0066cc,color:#000
  classDef system fill:#e8e8e8,stroke:#666,color:#000
```

### 2.2 Diagramme de classes (domaine métier)

```mermaid
classDiagram
  direction LR

  class User {
    UUID id
    String email
    String passwordHash
    Role role
    LocalDateTime createdAt
  }

  class Role {
    <<enumeration>>
    ADMIN
    RECRUTEUR
    CANDIDAT
  }

  class Profile {
    UUID id
    String code
    String displayName
  }

  class Skill {
    UUID id
    String code
    String displayName
    String category
  }

  class Question {
    UUID id
    QuestionType type
    String statement
    int difficulty
    QuestionStatus status
    int version
    LocalDateTime createdAt
  }

  class QuestionType {
    <<enumeration>>
    QCM
    CODE
    CAS_PRATIQUE
  }

  class QuestionStatus {
    <<enumeration>>
    PENDING_REVIEW
    APPROVED
    REJECTED
    ARCHIVED
  }

  class Candidate {
    UUID id
    String email
    String displayName
    LocalDateTime createdAt
  }

  class Cv {
    UUID id
    String fileName
    byte[] content
    LocalDateTime uploadedAt
    LocalDateTime purgeAt
  }

  class CvAnalysis {
    UUID id
    JsonNode extractedSkills
    String llmProvider
    String llmModel
    int tokensUsed
    double costEur
    LocalDateTime analyzedAt
  }

  class Test {
    UUID id
    String name
    int durationMinutes
    LocalDateTime createdAt
  }

  class Invitation {
    UUID id
    String token
    LocalDateTime expiresAt
    boolean used
  }

  class Passation {
    UUID id
    LocalDateTime startedAt
    LocalDateTime submittedAt
    double globalScore
    int fraudRiskScore
  }

  class Answer {
    UUID id
    String answerText
    String submittedCode
    double score
  }

  class Report {
    UUID id
    String summary
    String strengths
    String weaknesses
    String recommendation
    LocalDateTime generatedAt
  }

  class FraudEvent {
    UUID id
    String eventType
    LocalDateTime occurredAt
  }

  User "1" --> "1" Role
  Profile "*" --> "*" Skill : couvre
  Question "*" --> "*" Skill : evalue
  Candidate "1" --> "*" Cv
  Cv "1" --> "0..1" CvAnalysis
  Candidate "1" --> "*" Passation
  Test "*" --> "*" Question : compose
  Test "1" --> "*" Invitation
  Invitation "1" --> "0..1" Passation
  Passation "1" --> "*" Answer
  Passation "1" --> "0..1" Report
  Passation "1" --> "*" FraudEvent
  Answer "*" --> "1" Question
```

### 2.3 Diagramme de séquence — Analyse du CV par IA

```mermaid
sequenceDiagram
  actor R as Recruteur
  participant UI as Frontend React
  participant API as backend-app (API)
  participant Parser as CvParserService
  participant LLM as LlmClient
  participant Ext as API IA externe
  participant DB as PostgreSQL

  R->>UI: Selection profil + upload CV
  UI->>API: POST /cv/upload (fichier + profileCode)
  API->>Parser: extractText(fichier)
  Parser-->>API: texte brut + metadonnees
  API->>LLM: extractSkills(texte, profileCode)
  LLM->>Ext: POST chat/completions (prompt + schema JSON)
  Ext-->>LLM: reponse JSON structuree
  LLM-->>API: SkillsExtractionResult (skills + niveaux + couts)
  API->>DB: INSERT cv + cv_analysis
  API-->>UI: 200 OK (skills detectees, editables)
  UI-->>R: Affichage liste competences validables
```

### 2.4 Diagramme de séquence — Génération adaptative de tests

```mermaid
sequenceDiagram
  actor R as Recruteur
  participant UI as Frontend React
  participant API as backend-app
  participant Banque as QuestionBankService
  participant LLM as LlmClient
  participant Ext as API IA externe
  participant DB as PostgreSQL

  R->>UI: Validation competences + clic Generer test
  UI->>API: POST /tests/generate (skills, profile, count, difficulty)
  API->>Banque: pickReusableQuestions(skills) - questions deja approuvees et discriminantes
  Banque-->>API: questions reutilisables (peut etre 0..N)
  API->>LLM: generateMissingQuestions(skills, profile, count restant)
  LLM->>Ext: POST chat/completions (prompt structure)
  Ext-->>LLM: questions JSON
  LLM-->>API: liste de questions generees (pending_review)
  API->>DB: INSERT questions + INSERT test composition
  API-->>UI: 200 OK (test propose + questions a valider)
  UI-->>R: Affichage interface de revue (accept / reject / edit)
```

### 2.5 Diagramme de séquence — Exécution sécurisée de code

```mermaid
sequenceDiagram
  actor C as Candidat
  participant UI as Frontend React (Monaco)
  participant API as backend-app
  participant SB as backend-sandbox
  participant DK as Docker Daemon
  participant DB as PostgreSQL

  C->>UI: Saisie du code + clic Executer
  UI->>API: POST /passations/{id}/run (langage, code, questionId)
  API->>SB: POST /sandbox/execute (langage, code, tests caches)
  SB->>DK: docker run --network none --read-only --user nobody --memory 256m --cpus 1 --security-opt seccomp=skillforge.json
  DK-->>SB: stdout, stderr, exitCode, durationMs
  SB->>SB: run hidden unit tests + score gradue
  SB-->>API: ExecutionResult (passedTests, score, output)
  API->>DB: INSERT answer (code, score)
  API-->>UI: 200 OK (resultat + score)
  UI-->>C: Affichage du resultat
```

## 3. Modèle de données

### 3.1 MCD Merise

```mermaid
erDiagram
  USER ||--o{ PASSATION : "valide les questions"
  USER }o--|| ROLE : "a un role"

  PROFILE ||--o{ PROFILE_SKILL : ""
  SKILL ||--o{ PROFILE_SKILL : ""
  SKILL ||--o{ QUESTION_SKILL : ""
  QUESTION ||--o{ QUESTION_SKILL : ""

  CANDIDATE ||--o{ CV : "possede"
  CV ||--o| CV_ANALYSIS : "analysee"
  CANDIDATE ||--o{ PASSATION : "passe"

  TEST ||--o{ TEST_COMPOSITION : ""
  QUESTION ||--o{ TEST_COMPOSITION : ""
  TEST ||--o{ INVITATION : "envoyee"
  INVITATION ||--o| PASSATION : "donne lieu"

  PASSATION ||--o{ ANSWER : "contient"
  QUESTION ||--o{ ANSWER : "evaluee par"
  PASSATION ||--o| REPORT : "produit"
  PASSATION ||--o{ FRAUD_EVENT : "declenche"
```

### 3.2 MLD (tables + colonnes essentielles)

| Table | Colonnes principales | Clés |
|---|---|---|
| `users` | id (UUID PK), email, password_hash, role, created_at | PK id, UQ email |
| `profiles` | id, code (UQ), display_name | PK id |
| `skills` | id, code (UQ), display_name, category | PK id |
| `profile_skills` | profile_id, skill_id | PK composite, FK profiles, skills |
| `questions` | id, type, statement (TEXT), difficulty (1-5), status, version, json_payload (JSONB), created_at | PK id |
| `question_skills` | question_id, skill_id | PK composite, FK |
| `candidates` | id, email, display_name, created_at | PK id, UQ email |
| `cvs` | id, candidate_id (FK), file_name, content (BYTEA), uploaded_at, purge_at | PK id |
| `cv_analyses` | id, cv_id (FK UQ), extracted_skills (JSONB), llm_provider, llm_model, tokens_used, cost_eur, analyzed_at | PK id |
| `tests` | id, name, duration_minutes, created_at | PK id |
| `test_compositions` | test_id, question_id, position | PK composite |
| `invitations` | id, test_id (FK), token (UQ), expires_at, used | PK id |
| `passations` | id, invitation_id (FK UQ), candidate_id (FK), started_at, submitted_at, global_score, fraud_risk_score | PK id |
| `answers` | id, passation_id (FK), question_id (FK), answer_text, submitted_code, score | PK id |
| `reports` | id, passation_id (FK UQ), summary, strengths, weaknesses, recommendation, generated_at | PK id |
| `fraud_events` | id, passation_id (FK), event_type, occurred_at | PK id |

### 3.3 MPD (script SQL initial)

Le script complet est généré et versionné par **Flyway** sous `apps/backend-app/src/main/resources/db/migration/V1__init.sql`. Il sera produit au Sprint 1.

## 4. Sécurité — synthèse des choix structurants

| Couche | Mécanisme |
|---|---|
| Transport | TLS 1.3 obligatoire |
| Authentification | JWT signés (HS256 ou RS256) + refresh token |
| Mots de passe | Argon2id (Spring Security) |
| Liens candidats | UUID v4 + expiration (24 h par défaut) + usage unique |
| API publique | Rate limiting (Bucket4j) sur les endpoints sensibles |
| Sandbox | `--network none`, `--read-only`, `--user nobody`, `--memory=256m`, `--cpus=1`, `--security-opt seccomp=skillforge.json`, `--cap-drop=ALL`, timeout 5 s |
| RGPD | Consentement explicite avant analyse CV, droit à l'oubli (purge complète d'un candidat), purge automatique des CV après 12 mois, registre des traitements |
| Audit | Journal d'audit pour toutes les actions sensibles (création test, validation questions, consultation résultats, exports) |

## 5. Choix d'organisation du code (à venir Sprint 1)

Le backend Spring Boot adoptera une organisation **en couches classique** mais propre :

```
src/main/java/com/tsarajoro/skillforge/
├── config/         # configuration Spring, sécurité, beans
├── domain/         # entités JPA, value objects, enums métier
├── repository/     # interfaces Spring Data JPA
├── service/        # logique métier
├── llm/            # abstraction LLM (interface + impls OpenAI / Claude / mock)
├── controller/     # contrôleurs REST + DTO
└── exception/      # gestion centralisée des erreurs
```

Le frontend React adoptera une organisation par **feature** :

```
src/
├── features/
│   ├── auth/
│   ├── cv-upload/
│   ├── test-generation/
│   ├── passation/
│   ├── reports/
│   └── dashboard/
├── components/ui/   # composants ShadcnUI
├── lib/             # client API, hooks utilitaires
└── routes/
```
