# Guide de démarrage — SkillForge

Ce guide explique comment installer SkillForge sur un nouveau poste (le PC de la maison par exemple) et le faire tourner en local.

---

## 1. Pré-requis à installer sur la machine

| Outil | Version cible | Pourquoi |
|---|---|---|
| Git | 2.40+ | Récupérer le code |
| Java | 21 (Temurin recommandé) | Backend Spring Boot |
| Maven | 3.9+ | Build du backend |
| Node | 20 LTS | Frontend (à venir) |
| pnpm | dernière | Gestionnaire de paquets JS plus rapide que npm |
| Docker Engine | dernière | Lancer PostgreSQL en local et la sandbox |
| Docker Compose | inclus avec Docker récent | Orchestration locale |
| Client `psql` | 16+ | Inspecter la base PostgreSQL |
| IntelliJ IDEA | Community ou Ultimate étudiant | IDE recommandé pour Java |
| VS Code | dernière | Pour le frontend + édition Markdown |

### 1.1 Installation sur Linux (Arch / Manjaro / Ubuntu)

```bash
# Arch / Manjaro
sudo pacman -S git jdk21-temurin maven nodejs pnpm docker docker-compose postgresql-libs code

# Ubuntu / Debian
sudo apt update
sudo apt install -y git openjdk-21-jdk maven nodejs npm docker.io docker-compose-plugin postgresql-client
sudo npm install -g pnpm
```

IntelliJ IDEA : télécharger sur https://www.jetbrains.com/idea/download/ (édition Community gratuite, ou Ultimate gratuite avec licence étudiant).

### 1.2 Installation sur Windows

- Java 21 : https://adoptium.net/temurin/releases/
- Maven : https://maven.apache.org/download.cgi
- Node 20 : https://nodejs.org/ (LTS)
- pnpm : après Node, dans PowerShell `npm install -g pnpm`
- Docker Desktop : https://www.docker.com/products/docker-desktop/
- PostgreSQL client : https://www.postgresql.org/download/windows/ (cocher uniquement "Command Line Tools")
- IntelliJ IDEA : https://www.jetbrains.com/idea/download/
- VS Code : https://code.visualstudio.com/

### 1.3 Vérifier que tout est bien installé

```bash
java -version            # cible : 21
mvn -version             # cible : 3.9+
node -v                  # cible : v20.x
pnpm -v
docker --version
docker compose version
psql --version
```

Vérifier que Docker tourne :
```bash
docker info | head -5
```

---

## 2. Récupérer le code

### 2.1 Cloner le dépôt

```bash
git clone https://github.com/ainanyfitiagershom/skillforge-platform.git
cd skillforge-platform
```

### 2.2 Configurer l'identité Git **localement** (très important si vous avez 2 comptes GitHub)

⚠️ Sans cette étape, vos commits risquent d'être attribués au mauvais compte.

```bash
git config user.name "ainanyfitiagershom"
git config user.email "fitiagershom@yahoo.com"

# Vérifier
git config user.name    # doit afficher ainanyfitiagershom
git config user.email   # doit afficher fitiagershom@yahoo.com
```

⚠️ **Ne pas ajouter `--global`** : ça écraserait la config du compte pro.

---

## 3. Récupérer les documents officiels (cahier des charges, estimation)

Le dossier `docs/01-cahier-des-charges/` est **volontairement exclu** de Git (cf. `.gitignore`). Pour récupérer ces documents sur le nouveau poste, deux options :

- Les copier manuellement depuis votre clé USB / Drive / Dropbox.
- Les régénérer depuis votre dossier `Documents/st/` qui contient déjà les scripts Python générateurs et les sources Markdown.

À placer ensuite dans `skillforge-platform/docs/01-cahier-des-charges/`.

---

## 4. Démarrer la base de données PostgreSQL

```bash
docker compose -f infra/docker-compose.yml up -d
```

Vérifier que le conteneur tourne et est `healthy` :

```bash
docker ps | grep skillforge-postgres
```

⚠️ La base écoute sur le port **5434** (et non 5432) car d'autres projets Docker peuvent occuper 5432 et 5433 sur votre poste. Si ces ports sont libres sur le nouveau PC, vous pouvez ramener le mapping à `5432:5432` dans `infra/docker-compose.yml`, mais pensez aussi à mettre à jour `DB_URL` dans `apps/backend-app/.env`.

Tester la connexion :

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "SELECT version();"
```

---

## 5. Configurer le backend (`apps/backend-app`)

### 5.1 Créer le fichier `.env`

```bash
cd apps/backend-app
cp .env.example .env
```

### 5.2 Renseigner les variables d'environnement

Ouvrir `.env` et remplir au minimum :

```env
DB_URL=jdbc:postgresql://localhost:5434/skillforge
DB_USER=skillforge
DB_PASSWORD=skillforge_dev
SERVER_PORT=8090

# Secret JWT (peut rester sur la valeur de demo en local)
JWT_SECRET=change-me-in-production-this-secret-must-be-at-least-32-characters-long

# Provider IA : "mock" (defaut, gratuit) | "openai" | "claude"
LLM_PROVIDER=mock

# Cles API (seulement si vous changez de provider)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-5
```

➡️ Voir `docs/GUIDE_API_KEYS.md` pour savoir comment obtenir une clé OpenAI ou Claude.

⚠️ Le `.env` est ignoré par Git. **Ne le committez jamais.**

### 5.3 Démarrer le backend

```bash
mvn spring-boot:run
```

Au premier lancement, Maven télécharge les dépendances (peut prendre 1 à 2 minutes).

Vous devriez voir dans les logs :

```
Tomcat started on port 8090
Successfully applied 1 migration to schema "public", now at version v1
Started SkillforgeApplication in X.XXX seconds
```

### 5.4 Vérifier que tout fonctionne

```bash
curl http://localhost:8090/actuator/health
# Attendu : {"status":"UP"}
```

Ouvrir Swagger UI dans le navigateur :
```
http://localhost:8090/swagger-ui/index.html
```

---

## 6. Tester les API

Voir le document complet : `docs/04-tests/fiche-tests-manuels.md`

Test rapide en 3 commandes :

```bash
# 1. Inscription d'un recruteur
curl -X POST http://localhost:8090/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"r@x.dev","password":"password123456","role":"RECRUTEUR"}'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"r@x.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['accessToken'])")

# 3. Lister les questions (vide au depart)
curl -s http://localhost:8090/questions -H "Authorization: Bearer $TOKEN"
```

---

## 7. Architecture du dépôt

```
skillforge-platform/
├── apps/
│   ├── backend-app/         # Spring Boot principal (auth, IA, banque, RGPD)
│   ├── backend-sandbox/     # Spring Boot sandbox Docker (à venir Sprint 4)
│   └── frontend-web/        # React + Vite + TypeScript (à venir Sprint 2)
├── docs/
│   ├── 01-cahier-des-charges/   # NON versionnée (privée)
│   ├── 02-conception/           # État de l'art, étude existant, UML, MCD, conception
│   ├── 03-poc/                  # Rapports POC
│   ├── 04-tests/                # Fiche de tests manuels
│   ├── GETTING_STARTED.md       # Ce document
│   └── GUIDE_API_KEYS.md        # Comment obtenir une clé OpenAI ou Claude
├── infra/
│   └── docker-compose.yml       # PostgreSQL local
├── plan.md                      # Plan d'exécution 90 jours (vivant, à mettre à jour)
├── README.md
└── .gitignore
```

---

## 8. Workflow Git au quotidien

### Avant chaque commit

```bash
# Verifier l'identite
git config user.name   # doit etre ainanyfitiagershom
git config user.email  # doit etre fitiagershom@yahoo.com

# Voir les fichiers modifies
git status --short

# Ajouter precisement (jamais "git add -A")
git add chemin/vers/fichier1 chemin/vers/fichier2

# Commiter (anglais court, impératif, sans mention IA)
git commit -m "feat: add CV upload endpoint"

# Pousser
git push
```

### Conventions de commit (à respecter)

| Préfixe | Quand l'utiliser |
|---|---|
| `feat:` | nouvelle fonctionnalité |
| `fix:` | correction de bug |
| `refactor:` | réécriture sans changement de comportement |
| `docs:` | documentation |
| `test:` | ajout/modification de tests |
| `chore:` | config, deps, scripts |
| `style:` | formatage uniquement |

⚠️ **Jamais** de mention de Claude, ChatGPT, IA, "généré par", "Co-Authored-By: Claude" dans les commits, le code ou les PR. Vous devez pouvoir défendre votre code en soutenance.

---

## 9. Que faire en cas de problème ?

### "Address already in use" sur le port 5432 / 5433 / 8090

C'est qu'un autre service occupe le port. Solutions :

- Vérifier qui occupe : `ss -tln | grep -E ":(5432|5433|8090)\s"`
- Soit arrêter l'autre service, soit changer le port :
  - PostgreSQL : éditer `infra/docker-compose.yml` ligne `ports`
  - Backend : éditer `.env` ligne `SERVER_PORT=`

### Migration Flyway en erreur

```bash
# Reset complet de la base (perte de données)
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO skillforge;"
```

Puis redémarrer Spring Boot : Flyway re-applique toutes les migrations.

### `mvn spring-boot:run` ne démarre pas

Vérifier les logs au moment du démarrage :
```bash
mvn spring-boot:run 2>&1 | tee /tmp/spring-boot.log
grep -E "(ERROR|Exception|Failed)" /tmp/spring-boot.log
```

### Token JWT invalide après redémarrage

Normal : le secret JWT par défaut est régénéré au démarrage. Refaites un login pour obtenir un nouveau token.

---

## 10. Checklist installation poste maison

Cochez au fur et à mesure :

- [ ] Java 21 installé (`java -version` → 21)
- [ ] Maven 3.9+ installé
- [ ] Node 20 + pnpm installés
- [ ] Docker Engine + Compose installés et tournent
- [ ] Client `psql` installé
- [ ] IntelliJ IDEA installé
- [ ] VS Code installé (avec les extensions Java + Spring Boot + ESLint + Prettier + Tailwind)
- [ ] Repo cloné : `git clone https://github.com/ainanyfitiagershom/skillforge-platform.git`
- [ ] Identité Git locale configurée (`ainanyfitiagershom` / `fitiagershom@yahoo.com`)
- [ ] PostgreSQL démarré : `docker compose -f infra/docker-compose.yml up -d`
- [ ] Fichier `.env` créé dans `apps/backend-app/` à partir de `.env.example`
- [ ] Backend démarré : `mvn spring-boot:run` dans `apps/backend-app/`
- [ ] Swagger UI accessible : http://localhost:8090/swagger-ui/index.html
- [ ] Test de bout en bout réussi (cf. `docs/04-tests/fiche-tests-manuels.md`)
