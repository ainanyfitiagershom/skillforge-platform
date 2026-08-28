# Fiche diagrammes du mémoire M2 MBDS — SkillForge

Cette fiche rassemble les codes **Mermaid** et **PlantUML** de tous les diagrammes cités dans le mémoire (fichier [MEMOIRE_REDIGE.md](MEMOIRE_REDIGE.md)). Chaque bloc est prêt à copier-coller dans un outil de rendu :

- **Mermaid** → [mermaid.live](https://mermaid.live) → Export PNG ou SVG.
- **PlantUML** → [www.plantuml.com/plantuml](https://www.plantuml.com/plantuml) → Export PNG ou SVG.
- Extension VSCode "Markdown Preview Mermaid Support" pour prévisualiser dans l'IDE.
- Pour le Gantt : soit Mermaid (rapide), soit **GanttProject** (plus pro, format .gan exportable).

Une fois exporté, l'image est à insérer dans le document Word `MEMOIRE-itu-MBDS-v1.docx` à l'endroit indiqué par le titre de section.

---

## Diagramme 1 — Contexte / cas d'usage acteurs (chapitre 1 ou 5)

**Objectif :** montrer les trois acteurs principaux et les grands cas d'utilisation qu'ils déclenchent sur la plateforme.
**Outil recommandé :** PlantUML (rendu use-case plus lisible que Mermaid).

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Recruteur" as R
actor "Candidat" as C
actor "Administrateur" as A

rectangle "Plateforme SkillForge" {
  usecase "S'authentifier" as UC1
  usecase "Téléverser un CV" as UC2
  usecase "Générer un test technique" as UC3
  usecase "Valider les questions générées" as UC4
  usecase "Envoyer l'invitation candidat" as UC5
  usecase "Démarrer une passation\n(lien + code d'accès)" as UC6
  usecase "Répondre aux questions\n(QCM, code, cas pratique)" as UC7
  usecase "Consulter le compte rendu" as UC8
  usecase "Exporter le rapport PDF" as UC9
  usecase "Consulter le tableau de bord\nanalytique" as UC10
  usecase "Gérer les comptes utilisateurs" as UC11
}

R --> UC1
R --> UC2
R --> UC3
R --> UC4
R --> UC5
R --> UC8
R --> UC9
R --> UC10
C --> UC6
C --> UC7
A --> UC1
A --> UC11
@enduml
```

---

## Diagramme 2 — Architecture logicielle en composants (chapitre 6.1)

**Objectif :** montrer les trois blocs déployables (frontend, backend-app, backend-sandbox) et la base de données, avec la justification de l'isolation de la sandbox.
**Outil recommandé :** Mermaid.

```mermaid
flowchart LR
  subgraph Client["Poste utilisateur"]
    B["Navigateur\nrecruteur / candidat"]
  end

  subgraph Backend["Infrastructure Tsarajoro"]
    FE["frontend-web\n(React 19 + Vite)\nport 5173 dev / 80 prod"]
    APP["backend-app\n(Spring Boot 3.4)\nport 8090"]
    SBX["backend-sandbox\n(Spring Boot 3.4)\nport 8091\nISOLÉ - aucun accès DB"]
    DB[("PostgreSQL 16\nport 5434")]
    DOCKER["Démon Docker local\n(conteneurs éphémères\ndurcis seccomp)"]
    LLM{"Fournisseur LLM\nGroq / OpenAI / Claude\n/ Ollama local"}
    SMTP["SMTP\nMailpit dev / réel prod"]
  end

  B -->|HTTPS| FE
  FE -->|REST /api| APP
  APP -->|JPA| DB
  APP -->|REST + clé interne| SBX
  APP -->|HTTPS OpenAI-like| LLM
  APP -->|SMTP| SMTP
  SBX -->|Docker API| DOCKER

  style SBX fill:#fff4e6,stroke:#e67700,stroke-width:2px
  style DB fill:#e7f5ff,stroke:#1971c2
  style LLM fill:#f3f0ff,stroke:#7048e8
```

---

## Diagramme 3 — Architecture technique (chapitre 6.2)

**Objectif :** vue d'infrastructure serveur : reverse proxy, conteneurs, volumes, réseau externe.
**Outil recommandé :** Mermaid.

```mermaid
flowchart TB
  subgraph EXT["Réseau externe"]
    U["Utilisateurs\n(recruteurs + candidats)"]
    APIEXT["APIs LLM externes\nGroq / OpenAI / Claude"]
  end

  subgraph SERV["Serveur Linux Tsarajoro"]
    PROXY["Reverse proxy Traefik / Nginx\n(TLS 1.3 - Let's Encrypt)"]

    subgraph DK["Docker Engine"]
      CFE["container: frontend-web\n(nginx static)"]
      CAPP["container: backend-app\n(port 8090)"]
      CSBX["container: backend-sandbox\n(port 8091 + accès Docker socket)"]
      CDB["container: postgres:16"]
      COLL["container: ollama\n(port 11434)"]
      CMAIL["container: mailpit (dev only)\n(SMTP 1026 - UI 8026)"]
    end

    VDB[("Volume\nskillforge_pgdata")]
    VOLL[("Volume\nskillforge_ollama_models\n~5 Go")]
    VLOG[("Volume\nlogs applicatifs")]
  end

  U -->|HTTPS 443| PROXY
  PROXY --> CFE
  PROXY --> CAPP
  CAPP <--> CSBX
  CAPP --> CDB
  CAPP --> COLL
  CAPP -.->|si provider externe| APIEXT
  CDB --- VDB
  COLL --- VOLL
  CAPP --- VLOG
  CSBX -.->|lance des conteneurs\néphémères durcis| DK

  style CSBX fill:#fff4e6,stroke:#e67700,stroke-width:2px
  style COLL fill:#f3f0ff,stroke:#7048e8
```

---

## Diagramme 4 — Diagramme de séquence US-03 (chapitre 5.1.3 ou 7.2.4)

**Objectif :** décrire finement le flux de démarrage sécurisé d'une passation (verrouillage identité + code d'accès 6 chiffres + rate limiting + comparaison temps constant).
**Outil recommandé :** Mermaid.

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidat
    participant FE as Frontend<br/>(page /invite/:token)
    participant CTL as CandidateController<br/>backend-app
    participant SVC as CandidatePassationService
    participant TRK as AccessCodeAttemptTracker
    participant REPO as InvitationRepository
    participant DB as PostgreSQL
    participant GEH as GlobalExceptionHandler

    C->>FE: Saisit email + code 6 chiffres
    FE->>CTL: POST /candidate/passations/start<br/>{token, email, code}
    CTL->>SVC: startPassation(dto)

    SVC->>REPO: findByToken(token)
    REPO->>DB: SELECT
    DB-->>REPO: Invitation ou null
    alt Token inconnu / expiré / déjà utilisé
        SVC->>GEH: throw InvitationInvalidException
        GEH-->>FE: HTTP 410 (message uniforme)
        FE-->>C: "Lien invalide ou expiré"
    end

    SVC->>TRK: isLocked(invitationId)?
    alt Verrouillé (5 échecs / 15 min)
        SVC->>GEH: throw SecurityException
        GEH-->>FE: HTTP 403<br/>"Trop de tentatives"
    end

    Note over SVC: MessageDigest.isEqual(<br/>codeSaisi, codeStocké)<br/>= comparaison temps constant
    alt Code incorrect
        SVC->>TRK: recordFailure(invitationId)
        SVC->>GEH: throw SecurityException
        GEH-->>FE: HTTP 403<br/>"Code d'accès invalide"
    end

    SVC->>TRK: reset(invitationId)
    Note over SVC: Vérrouillage identité :<br/>email saisi == candidat pré-établi ?
    alt Identité non concordante
        SVC->>GEH: throw SecurityException
        GEH-->>FE: HTTP 403<br/>"Identité non reconnue"
    end

    SVC->>REPO: existsPassationFor(invitation)
    alt Déjà démarrée (F5)
        SVC-->>CTL: passation existante (idempotent)
    else Première fois
        SVC->>DB: INSERT Passation
        SVC->>DB: UPDATE Invitation SET usedAt = now()
    end

    CTL-->>FE: 200 OK + PassationDto
    FE-->>C: Redirection vers /passation/:id/question/1
```

---

## Diagramme 5 — Modèle Conceptuel de Données (chapitre 7.2.3)

**Objectif :** représenter les 11 entités principales et leurs relations.
**Outil recommandé :** Mermaid (Entity Relationship Diagram).

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string password_hash "Argon2id"
        string role "RECRUTEUR / ADMIN"
        timestamp created_at
    }
    CANDIDATE {
        uuid id PK
        string email UK
        string full_name
        timestamp created_at
    }
    CV {
        uuid id PK
        uuid candidate_id FK
        string filename
        bytes content
        string mime_type
        timestamp uploaded_at
        timestamp purge_after "RGPD +12 mois"
    }
    CV_ANALYSIS {
        uuid id PK
        uuid cv_id FK
        string llm_provider
        int tokens_used
        jsonb skills_detected
        timestamp analyzed_at
    }
    SKILL {
        uuid id PK
        string name UK
        string category
    }
    TEST {
        uuid id PK
        uuid candidate_id FK
        uuid created_by_user FK
        string profile_target
        string status
        timestamp created_at
    }
    QUESTION {
        uuid id PK
        uuid test_id FK
        string type "QCM / CODE / CAS_PRATIQUE"
        int difficulty "1..5"
        jsonb payload
        string status "PENDING_REVIEW / APPROVED / REJECTED"
    }
    QUESTION_SKILLS {
        uuid question_id FK
        uuid skill_id FK
    }
    INVITATION {
        uuid id PK
        uuid test_id FK
        string token UK
        string access_code "6 chiffres"
        timestamp expires_at
        timestamp used_at
    }
    PASSATION {
        uuid id PK
        uuid invitation_id FK
        uuid candidate_id FK
        timestamp started_at
        timestamp submitted_at
        boolean consent_given
    }
    ANSWER {
        uuid id PK
        uuid passation_id FK
        uuid question_id FK
        jsonb response
        int score
        string execution_details
    }
    FRAUD_EVENT {
        uuid id PK
        uuid passation_id FK
        string type "TAB_BLUR / PASTE / FULLSCREEN_EXIT"
        timestamp occurred_at
    }
    REPORT {
        uuid id PK
        uuid passation_id FK UK
        int global_score
        string recommendation "HIRE / INTERVIEW / REJECT"
        text explanation
        string llm_provider
        timestamp generated_at
    }

    USER ||--o{ TEST : "crée"
    CANDIDATE ||--o{ CV : "possède"
    CANDIDATE ||--o{ TEST : "cible"
    CV ||--o| CV_ANALYSIS : "analysé par IA"
    TEST ||--|{ QUESTION : "contient"
    QUESTION ||--o{ QUESTION_SKILLS : ""
    SKILL ||--o{ QUESTION_SKILLS : ""
    TEST ||--|| INVITATION : "envoyée via"
    INVITATION ||--o| PASSATION : "démarre"
    PASSATION ||--|{ ANSWER : "produit"
    QUESTION ||--o{ ANSWER : "répondue par"
    PASSATION ||--o{ FRAUD_EVENT : "détecte"
    PASSATION ||--|| REPORT : "génère"
```

---

## Diagramme 6 — Diagramme de classes UML (chapitre 7.2.2)

**Objectif :** vue statique des classes principales du domaine et de leurs responsabilités.
**Outil recommandé :** Mermaid (classDiagram) ou PlantUML pour plus de finesse.

```mermaid
classDiagram
    class LlmClient {
        <<interface>>
        +analyzeCv(text) CvAnalysisResult
        +generateQuestions(skills, count) List~Question~
        +gradeCasPratique(prompt, answer) GradingResult
        +providerName() String
    }

    class MockLlmClient
    class OpenAiLlmClient
    class ClaudeLlmClient
    class GroqLlmClient
    class OllamaLlmClient

    LlmClient <|.. MockLlmClient
    LlmClient <|.. OpenAiLlmClient
    LlmClient <|.. ClaudeLlmClient
    LlmClient <|.. GroqLlmClient
    LlmClient <|.. OllamaLlmClient

    class CandidatePassationService {
        -InvitationRepository invRepo
        -PassationRepository passRepo
        -AccessCodeAttemptTracker tracker
        -SandboxClient sandbox
        -LlmClient llm
        +startPassation(dto) Passation
        +saveAnswer(passationId, questionId, response) Answer
        +executeCode(passationId, questionId, code) ExecutionResult
        +submitPassation(passationId) Report
        -verifyAccessCode(inv, code) void
    }

    class SandboxRunner {
        -DockerClient docker
        +run(language, code, hiddenTests) SandboxResult
        -applyHardening(container) void
    }

    class AccessCodeAttemptTracker {
        -Map~UUID,AttemptState~ store
        +isLocked(invitationId) boolean
        +recordFailure(invitationId) void
        +reset(invitationId) void
    }

    class GlobalExceptionHandler {
        +handleNotFound(EntityNotFoundException) 404
        +handleBadRequest(IllegalArgumentException) 400
        +handleForbidden(SecurityException) 403
        +handleGone(InvitationInvalidException) 410
        +handleConflict(DataIntegrityViolationException) 409
        +handleUnsupportedMedia(HttpMediaTypeNotSupportedException) 415
    }

    CandidatePassationService --> LlmClient : "IoC"
    CandidatePassationService --> AccessCodeAttemptTracker
    CandidatePassationService --> SandboxRunner : "via SandboxClient HTTP"
```

---

## Diagramme 7 — Diagramme de packages (chapitre 7.2.2)

**Objectif :** vue macro de l'organisation "package by feature" du backend.
**Outil recommandé :** Mermaid.

```mermaid
flowchart TB
    subgraph COM["com.tsarajoro.skillforge"]
        AUTH["auth\n(JWT, login, refresh)"]
        CV["cv\n(parsing PDF/DOCX/OCR)"]
        GEN["generation\n(prompts, service génération)"]
        CAND["candidate\n(passations, invitations)"]
        REP["report\n(comptes rendus IA, export PDF)"]
        ANA["analytics\n(indices discriminants, dashboard)"]
        MAIL["mail\n(MailService, templates HTML)"]
        SBX["sandbox\n(client HTTP vers backend-sandbox)"]
        LLM["llm\n(LlmClient + 5 implémentations)"]
        SEC["security\n(SecurityConfig, filtres, CSP)"]
        EXC["exception\n(GlobalExceptionHandler)"]
    end

    AUTH --> SEC
    CAND --> LLM
    CAND --> SBX
    CAND --> MAIL
    GEN --> LLM
    CV --> LLM
    REP --> LLM
    CAND --> EXC
    GEN --> EXC
    AUTH --> EXC
```

---

## Diagramme 8 — Diagramme d'activité pour un cas d'utilisation clé

**Objectif :** illustrer le flux global "du CV au verdict" côté recruteur, pour montrer l'intégration end-to-end au jury.
**Outil recommandé :** Mermaid.

```mermaid
flowchart TD
    A([Recruteur se connecte]) --> B[Téléverse CV candidat<br/>PDF/DOCX]
    B --> C{Type de fichier}
    C -->|PDF natif| D[Extraction PDFBox]
    C -->|PDF scanné| E[OCR Tesseract]
    C -->|DOCX| F[Extraction Apache POI]
    D --> G[LLM : analyse compétences]
    E --> G
    F --> G
    G --> H[Affichage compétences détectées<br/>+ badge fournisseur LLM]
    H --> I[Recruteur sélectionne profil cible]
    I --> J[LLM : génération questions<br/>QCM + CODE + CAS_PRATIQUE]
    J --> K[Recruteur valide / modifie<br/>chaque question]
    K --> L{Toutes approuvées ?}
    L -->|Non| K
    L -->|Oui| M[Envoi invitation<br/>email + code 6 chiffres]
    M --> N[Attente passation candidat]
    N --> O[Candidat termine passation]
    O --> P[Notation automatique<br/>QCM binaire + code sandbox + LLM cas pratique]
    P --> Q[LLM : génération compte rendu]
    Q --> R([Recruteur consulte rapport<br/>+ recommandation HIRE/INTERVIEW/REJECT])
```

---

## Diagramme 9 — Diagramme d'états d'une passation (utile pour la fiche de tests)

**Objectif :** montrer le cycle de vie d'une Passation et les transitions autorisées.
**Outil recommandé :** Mermaid.

```mermaid
stateDiagram-v2
    [*] --> Invited: Invitation envoyée
    Invited --> Expired: TTL dépassé
    Invited --> LinkOpened: Candidat ouvre le lien
    LinkOpened --> Locked: 5 échecs code d'accès
    Locked --> LinkOpened: après 15 min
    LinkOpened --> InProgress: code correct + consentement
    InProgress --> InProgress: sauvegarde réponse (autosave)
    InProgress --> InProgress: exécution code sandbox
    InProgress --> Submitted: candidat soumet
    InProgress --> Abandoned: TTL passation dépassé
    Submitted --> Graded: notation automatique OK
    Graded --> [*]: rapport produit
    Expired --> [*]
    Abandoned --> [*]
```

---

## Diagramme 10 — Planning Gantt macro (chapitre 4.4)

**Objectif :** frise chronologique des 8 sprints du stage.
**Outil recommandé :** Mermaid (rapide) OU **GanttProject** desktop pour un rendu plus pro (export PNG/PDF/HTML).

**Version Mermaid :**

```mermaid
gantt
    title Planning SkillForge — 8 sprints × 2 semaines (avril 2026 → août 2026)
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section Cadrage
    S0 Cadrage, CDC, état de l'art       :done, s0, 2026-04-01, 14d

    section Conception & MVP
    S1 UML, MCD, MVP backend             :done, s1, after s0, 14d

    section POC 1 & 2
    S2 POC 1 Analyse CV + RGPD           :done, s2, after s1, 14d
    S3 POC 2 Génération adaptative       :done, s3, after s2, 14d

    section POC 3 & suite
    S4 POC 3 Sandbox + IHM candidat      :done, s4, after s3, 14d
    S5 Auto-grading + compte rendu IA    :done, s5, after s4, 14d

    section POC 4 & Sécurité
    S6 POC 4 Statistiques + dashboard    :done, s6, after s5, 14d
    S7 Tests sécurité + charge (ZAP, k6) :active, s7, after s6, 14d

    section Livraison
    S8 Recette + mise en production      :s8, after s7, 14d

    section Jalons
    Soutenance M2 MBDS                    :milestone, sout, 2026-10-15, 0d
```

**Version GanttProject (recommandée pour rendu final)** :
1. Créer un projet neuf, dates de début 2026-04-01, fin 2026-08-31.
2. Créer 8 tâches parents "S0 Cadrage" à "S8 Recette", 14 jours chacune, chaînées.
3. Ajouter le jalon "Soutenance" au 2026-10-15.
4. Décomposer S7 et S8 en sous-tâches si tu veux un niveau de détail plus fin.
5. Export → PNG ou PDF → insérer dans le Word.

---

## Diagramme 11 — Diagramme de déploiement (chapitre 7.2.5)

**Objectif :** vue infrastructure et artefacts déployés.
**Outil recommandé :** PlantUML (rendu deployment plus riche).

```plantuml
@startuml
node "Poste dev / prod Linux" {
  artifact "docker-compose.yml"

  node "Docker Engine" {
    node "container: postgres:16" as N1 {
      artifact "skillforge (schéma Flyway V1..V7)"
    }
    node "container: skillforge-mailpit" as N2 {
      artifact "SMTP 1026 / UI 8026"
    }
    node "container: skillforge-ollama" as N3 {
      artifact "qwen2.5:7b (~4,5 Go)"
    }
    node "container: backend-app" as N4 {
      artifact "backend-app.jar\n(Spring Boot 3.4)"
    }
    node "container: backend-sandbox" as N5 {
      artifact "backend-sandbox.jar"
      artifact "images sandbox\n(alpine PHP 8.3, node 20)"
    }
    node "container: frontend-web" as N6 {
      artifact "dist/ (React 19 build)"
      artifact "nginx.conf"
    }
  }

  node "Reverse proxy (host)" as RP {
    artifact "Traefik / Nginx\nTLS 1.3"
  }

  database "Volume\nskillforge_pgdata" as V1
  database "Volume\nskillforge_ollama_models" as V2

  N1 - V1
  N3 - V2
  RP --> N6 : HTTPS
  RP --> N4 : HTTPS /api
  N4 --> N1
  N4 --> N3
  N4 --> N5
  N4 --> N2
}
@enduml
```

---

## Résumé — quel diagramme dans quelle section du mémoire

| # | Diagramme | Section MEMOIRE_REDIGE | Outil |
|---|---|---|---|
| 1 | Use-case acteurs | Ch. 1 ou 5 (intro use stories) | PlantUML |
| 2 | Composants (archi logicielle) | Ch. 6.1 | Mermaid |
| 3 | Infrastructure (archi technique) | Ch. 6.2 | Mermaid |
| 4 | Séquence US-03 boîte blanche | Ch. 5.1.3 ou 7.2.4 | Mermaid |
| 5 | MCD / ER Diagram | Ch. 7.2.3 (+ Annexe 2) | Mermaid |
| 6 | Diagramme de classes | Ch. 7.2.2 | Mermaid |
| 7 | Diagramme de packages | Ch. 7.2.2 | Mermaid |
| 8 | Activité "du CV au verdict" | Ch. 5 intro ou soutenance | Mermaid |
| 9 | États d'une passation | Ch. 8.1 (fiche tests) | Mermaid |
| 10 | Gantt 8 sprints | Ch. 4.4 | Mermaid ou GanttProject |
| 11 | Déploiement | Ch. 7.2.5 | PlantUML |

---

## Astuces d'export

- **Mermaid Live** : après rendu, cliquer sur "Actions" → "PNG" (pour Word) ou "SVG" (meilleur pour zoom).
- **Densité** : régler la largeur d'export à 1600–2400 px pour un rendu net dans un Word A4.
- **Thème** : le thème par défaut Mermaid rend bien en noir/blanc pour impression ; passer sur "neutral" ou "forest" si tu veux plus de couleur.
- **PlantUML** : pour un rendu local sans dépendre du site public, `sudo pacman -S plantuml` sur Arch, puis `plantuml diagramme.puml` → génère un PNG à côté.
- **Cohérence visuelle** : garder les 11 diagrammes dans le même style (mêmes couleurs pour "sensible" = sandbox orange, "IA" = violet, "DB" = bleu, etc.) rend le mémoire beaucoup plus pro.

---

*Fiche créée le 2026-08-28 pour accompagner MEMOIRE_REDIGE.md. Les codes ont été alignés sur les vrais noms de classes, tables, ports et sprints du projet SkillForge à cette date.*
