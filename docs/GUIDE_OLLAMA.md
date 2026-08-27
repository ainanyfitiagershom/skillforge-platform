# Guide d'installation Ollama pour SkillForge

Ce guide couvre l'installation et l'utilisation d'Ollama comme LLM local
pour SkillForge (100% souverain, aucune donnée envoyée à un service externe).

---

## Pourquoi Ollama ?

- **GitHub Models** : retiré par GitHub fin 2026 (HTTP 410 en cours).
- **Groq (Qwen)** : rate limit 8000 tokens/min sur le free tier + génération JSON parfois invalide.
- **OpenAI / Claude** : payants (5 USD min de recharge).
- **Ollama** : gratuit, aucun quota, aucune fuite de données candidat vers un service externe. Argument fort pour le jury M2 : *"déploiement souverain sans dépendance externe"*.

---

## Prérequis machine

| Ressource | Minimum | Recommandé |
|---|---|---|
| **Disque** | 5 Go libres | 10 Go libres |
| **RAM libre** | 6 Go (modèle 7b) ou 4 Go (modèle 3b) | 8 Go |
| **Docker** | Docker Desktop / Engine installé | idem |
| **Réseau** | ~5 Go de download **une seule fois** par machine | idem |

Vérifie avant d'installer :

```bash
free -h              # RAM libre (colonne "disponible")
df -h /              # Disque libre
docker info          # Docker up ?
```

---

## Installation chez toi (première fois, ~15 min)

### Étape 1 — Récupérer le code à jour

```bash
cd ~/Documents/st/skillforge-platform  # ou ton chemin
git pull origin main
```

### Étape 2 — Lancer le conteneur Ollama

```bash
docker compose -f infra/docker-compose.yml up -d ollama
```

Ce que ça fait :
- Télécharge l'image `ollama/ollama:latest` (~500 Mo, une seule fois)
- Démarre le conteneur `skillforge-ollama` sur le port 11434
- Crée un volume persistant `skillforge_ollama_models` pour stocker les modèles

Attendre que le healthcheck passe :

```bash
docker ps --filter name=skillforge-ollama --format "{{.Names}} {{.Status}}"
# skillforge-ollama Up 20 seconds (healthy)
```

### Étape 3 — Télécharger le modèle (~4.5 Go, une seule fois)

**Option A — Qwen 2.5 7B (recommandé, meilleure qualité)** :
```bash
docker exec skillforge-ollama ollama pull qwen2.5:7b
```

**Option B — Qwen 2.5 3B (plus léger, ~2 Go, RAM plus faible)** :
```bash
docker exec skillforge-ollama ollama pull qwen2.5:3b
```

Le download peut prendre 5-15 minutes selon ta bande passante. Progrès affiché en direct.

### Étape 4 — Vérifier que le modèle marche

```bash
docker exec skillforge-ollama ollama run qwen2.5:7b "Réponds juste OK en JSON: {\"ok\":true}"
```

Doit répondre `{"ok":true}` en quelques secondes.

### Étape 5 — Configurer SkillForge pour utiliser Ollama

Éditer `apps/backend-app/.env` :

```
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen2.5:7b
```

(Si tu as pris le 3B, mettre `OLLAMA_MODEL=qwen2.5:3b`)

### Étape 6 — Redémarrer backend + tester

```bash
# Arrêter le backend s'il tourne
pkill -f "spring-boot:run"

# Le relancer
cd apps/backend-app
mvn -o -q -DskipTests spring-boot:run
```

Ouvrir http://localhost:5173 → uploader un CV → vérifier que les compétences sont détectées avec niveaux (pas UNKNOWN).

---

## Utilisation quotidienne (chez toi ou au bureau)

Une fois installé sur une machine, plus rien à télécharger :

```bash
# Démarrer tous les services (postgres + mailpit + ollama)
cd ~/Documents/st/skillforge-platform
docker compose -f infra/docker-compose.yml up -d

# Backend
cd apps/backend-app && mvn -o -q -DskipTests spring-boot:run

# Frontend
cd ../frontend-web && pnpm dev
```

Ollama utilise le modèle du volume persistant, **aucun trafic réseau**.

---

## Reprendre au bureau demain (SANS re-télécharger)

⚠️ **Cas important à comprendre :** le modèle Ollama est stocké dans un volume Docker **local à la machine**, pas dans Git.

### Scénario A — Tu VEUX Ollama au bureau aussi

Tu es obligé de re-télécharger 5 Go la première fois **sur cette machine bureau**. Une seule fois, ensuite c'est réutilisable.

```bash
cd skillforge-platform
git pull origin main
docker compose -f infra/docker-compose.yml up -d
docker exec skillforge-ollama ollama pull qwen2.5:7b  # <-- 5 Go download
```

### Scénario B — Tu veux ÉVITER le re-download au bureau

**Solution 1 — Utiliser Groq/mock au bureau** (bureau = tests légers, chez toi = tests LLM sérieux)

Dans `apps/backend-app/.env` au bureau :
```
LLM_PROVIDER=groq   # ou mock si Groq down
```
Ollama installé chez toi, Groq utilisé au bureau. Zero download.

**Solution 2 — Transférer le modèle par clé USB** (avancé, ~5 Go à copier)

Chez toi après l'install :
```bash
docker run --rm \
  -v skillforge_ollama_models:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/ollama-qwen2.5-7b.tar.gz -C /data .
```

Copier `ollama-qwen2.5-7b.tar.gz` sur clé USB (~4.5 Go).

Au bureau :
```bash
docker compose -f infra/docker-compose.yml up -d ollama
docker exec skillforge-ollama sh -c "cd /root/.ollama && rm -rf ./*"

# Copier le fichier depuis la clé USB dans le dossier, puis :
docker run --rm \
  -v skillforge_ollama_models:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/ollama-qwen2.5-7b.tar.gz -C /data
```

Pas de re-download.

---

## Nettoyage / désinstallation

Si tu veux libérer les 5 Go du disque plus tard :

```bash
# 1. Arrêter le conteneur
docker compose -f infra/docker-compose.yml stop ollama

# 2. Supprimer le conteneur
docker compose -f infra/docker-compose.yml rm -f ollama

# 3. Supprimer le volume (efface le modèle, ~4.5 Go libérés)
docker volume rm skillforge_ollama_models

# 4. Supprimer l'image (~500 Mo libérés)
docker rmi ollama/ollama:latest
```

⚠️ Note : ceci n'efface pas les logs réseau de ton FAI qui montrent que tu as téléchargé 5 Go depuis registry-1.docker.io / ollama.com. Le disque local est nettoyé, mais l'historique de trafic non.

---

## Dépannage

### "connection refused" côté backend
- Vérifier que le conteneur est up : `docker ps | grep ollama`
- Vérifier que le port 11434 est exposé : `ss -tlnp | grep 11434`

### Le modèle rame / OOM
- Modèle 7B trop lourd → passer sur `qwen2.5:3b` (édit `.env` + restart backend)
- Fermer Chrome / VSCode pour libérer de la RAM

### La génération est lente (>1 min pour 3 questions)
- Normal en CPU. Un GPU rendrait ça instantané mais pas obligatoire pour la démo.
- Réduire le nombre de questions par génération (3-5 max au lieu de 10)

### "model not found"
- Vérifier que le pull a réussi : `docker exec skillforge-ollama ollama list`
- Le modèle dans `.env` doit correspondre exactement (`qwen2.5:7b`, pas `qwen2.5-7b` ni `qwen2.5:latest`)
