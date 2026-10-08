# Compléments acronymes et glossaire — suite aux Annexes 6 et 7

Les Annexes 6 (dictionnaire des données) et 7 (plan de tests détaillé) ont introduit de nouveaux termes techniques dans le mémoire. Les tableaux ci-dessous indiquent lesquels doivent être ajoutés aux tables existantes et à quelle position alphabétique.

## 1. Acronymes à ajouter

Insère ces 6 lignes dans ta **table des acronymes** (page 9 du PDF), à la bonne place alphabétique.

| Position dans la table | Acronyme | Signification |
|---|---|---|
| entre `DOCX` et `HTTP` | **FK** | Foreign Key (clé étrangère) |
| entre `MBDS` et `MCD` | — | — |
| entre `OWASP` et `p95` | **OOM** | Out Of Memory (épuisement de la mémoire) |
| entre `p95` et `PDF` | — | — |
| entre `PDF` et `QCM` | **PID** | Process Identifier (identifiant de processus Linux) |
| entre `PDF` et `PID` | **PK** | Primary Key (clé primaire) |
| entre `UML` et `VU` | — | — |
| entre `UI` et `UML` | **UUID** | Universally Unique Identifier (identifiant unique universel sur 128 bits) |

### Les 6 lignes exactes à coller

```
FK         Foreign Key (clé étrangère)
OOM        Out Of Memory (épuisement de la mémoire)
PID        Process Identifier (identifiant de processus Linux)
PK         Primary Key (clé primaire)
UUID       Universally Unique Identifier (identifiant unique universel sur 128 bits)
```

Place-les à leur bonne position alphabétique :

- **FK** → entre `DOCX` et `HTTP`
- **OOM** → entre `MGA` et `OWASP` (si tu avais mis OWASP juste après ; sinon entre `MCD` et `OWASP`)
- **PID** → entre `PDF` et `QCM`
- **PK** → entre `PDF` et `PID` (ordre alphabétique strict : PDF, PID, PK, QCM)
- **UUID** → entre `UI` et `UML`

**⚠️ Correction d'ordre alphabétique strict** : PDF < PID < PK < QCM. Les deux lignes à ajouter dans cette zone sont donc dans l'ordre PID puis PK.

## 2. Glossaire — entrées à ajouter

Insère ces 4 lignes dans ton **glossaire** (page 10-11 du PDF), à la bonne place alphabétique.

### Les 4 entrées exactes à coller

```
JSONB            Type de colonne PostgreSQL stockant des données JSON sous forme
                 binaire indexée, utilisé pour les contenus flexibles comme les
                 options de QCM ou les métadonnées d'événements.

JUnit            Framework Java standard pour l'écriture et l'exécution de tests
                 unitaires et d'intégration, utilisé en version 5 avec AssertJ dans
                 SkillForge.

Seccomp          Mécanisme du noyau Linux permettant de restreindre les appels
                 système autorisés à un processus. Utilisé dans la sandbox pour
                 bloquer les opérations sensibles.

TIMESTAMPTZ      Type de colonne PostgreSQL représentant un horodatage avec fuseau
                 horaire, utilisé pour toutes les dates du modèle de données
                 (création, mise à jour, expiration, purge).
```

**Note** : « Seccomp » est peut-être déjà présent dans ton glossaire. Vérifie avec Ctrl+F avant d'ajouter — si oui, laisse celui qui existe.

### Position alphabétique

- **JSONB** → entre `IDE` et `JUnit` (ou avant « Mailpit » si pas d'autres entrées en J)
- **JUnit** → entre `JSONB` et `Mailpit`
- **Seccomp** → entre `Sandbox` et `Spring Boot` *(si pas déjà présent)*
- **TIMESTAMPTZ** → entre `Spring Boot` et `Vite`

## 3. Ce que l'on NE met PAS dans les acronymes/glossaire

Certains termes trouvés dans les annexes ne nécessitent **pas** d'ajout :

| Terme | Pourquoi ne pas l'ajouter |
|---|---|
| VARCHAR, INTEGER, BOOLEAN, TEXT, NUMERIC, BYTEA | Types SQL universels, connus de tout informaticien, surcharge inutile |
| NOT NULL, UNIQUE, DEFAULT, CHECK, CASCADE, RESTRICT | Contraintes SQL standard documentées dans toute la littérature |
| CAS_PRATIQUE | Valeur d'énumération métier (pas un acronyme) |
| QCM | Déjà dans la table des acronymes |
| JPA, SGBD, MGA, VU, p95 | Déjà dans la table des acronymes (fix M-A4 précédent) |

## 4. Récap des 10 lignes à coller au total

### Dans la table des acronymes (5 lignes)

```
FK         Foreign Key (clé étrangère)
OOM        Out Of Memory (épuisement de la mémoire)
PID        Process Identifier (identifiant de processus Linux)
PK         Primary Key (clé primaire)
UUID       Universally Unique Identifier (identifiant unique universel sur 128 bits)
```

### Dans le glossaire (4 lignes)

```
JSONB            Type de colonne PostgreSQL stockant des données JSON sous forme
                 binaire indexée.

JUnit            Framework Java de tests unitaires et d'intégration, utilisé en
                 version 5 avec AssertJ.

Seccomp          Mécanisme du noyau Linux restreignant les appels système autorisés
                 à un processus, utilisé par la sandbox.

TIMESTAMPTZ      Type de colonne PostgreSQL représentant un horodatage avec fuseau
                 horaire.
```

**Total : 9 nouvelles entrées (5 acronymes + 4 termes de glossaire).**

Après insertion, pense à **mettre à jour la TDM** avec Ctrl+A puis F9 si les tables sont des champs dynamiques, ou vérifie manuellement que l'ordre alphabétique reste correct.
