# Guide — Obtenir et configurer une clé API IA

SkillForge utilise un modèle de langage (LLM) pour analyser les CV, générer des questions et rédiger des comptes rendus. Trois options sont supportées :

| Provider | Quand l'utiliser | Coût | Statut |
|---|---|---|---|
| **mock** | Développement et tests, sans appel réseau | Gratuit | ✅ Activé par défaut |
| **openai** | Production / POC réels avec ChatGPT | Payant à l'usage | ✅ Implémenté |
| **claude** | Production / POC réels avec Claude | Payant à l'usage | ⚠️ Squelette (à finaliser) |

Le choix se fait via la variable d'environnement `LLM_PROVIDER` dans `apps/backend-app/.env`.

---

## 1. OpenAI / ChatGPT

### 1.1 Créer un compte

1. Aller sur **https://platform.openai.com/signup**
2. S'inscrire avec votre e-mail (peut être le même qu'un compte ChatGPT existant)
3. Confirmer l'e-mail

⚠️ **Attention** : un compte payant **OpenAI API** n'est pas la même chose qu'un abonnement ChatGPT Plus à 20 $/mois. Il faut un compte sur `platform.openai.com` séparément.

### 1.2 Recharger le compte (pré-paiement)

OpenAI fonctionne en pré-paiement (crédits) depuis 2024.

1. Aller sur **https://platform.openai.com/settings/organization/billing/overview**
2. Cliquer sur "Add to credit balance"
3. Recharger d'au moins **5 $** (suffit largement pour le POC 1 avec 30 CV)
4. Configurer un seuil d'alerte (par exemple à 1 $ restant) pour ne pas être surpris

### 1.3 Créer une clé API

1. Aller sur **https://platform.openai.com/api-keys**
2. Cliquer sur **"+ Create new secret key"**
3. Donner un nom à la clé, par exemple : `skillforge-dev`
4. Choisir les permissions : **"Restricted"** → cocher uniquement `Models: read` et `Model capabilities: write` (chat completions)
5. Cliquer **"Create secret key"**
6. ⚠️ **Copier immédiatement** la clé (format `sk-proj-...`). Elle ne sera **plus jamais affichée** ensuite.

### 1.4 Configurer le backend SkillForge

Éditer `apps/backend-app/.env` :

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-votre-cle-collee-ici
OPENAI_MODEL=gpt-4o-mini
```

Redémarrer le backend :

```bash
cd apps/backend-app
mvn spring-boot:run
```

### 1.5 Choix du modèle (`OPENAI_MODEL`)

| Modèle | Cas d'usage | Coût (1 M tokens entrée / sortie) |
|---|---|---|
| `gpt-4o-mini` | Recommandé pour POC : bon rapport qualité/prix | 0,15 $ / 0,60 $ |
| `gpt-4o` | Meilleure qualité, plus cher | 2,50 $ / 10,00 $ |
| `gpt-4-turbo` | Compromis ancien | 10,00 $ / 30,00 $ |

➡️ Pour le POC 1 d'analyse de CV sur 30 CV : `gpt-4o-mini` suffit (coût estimé < 0,50 $).

### 1.6 Vérifier que ça marche

```bash
curl -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruteur@tsarajoro.dev","password":"password123456"}'
# (récupérer le token)

curl -X POST http://localhost:8090/cv/upload \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -F "file=@/tmp/cv-test.pdf" \
  -F "candidateEmail=test@x.com" \
  -F "candidateDisplayName=Test" \
  -F "profileCode=DEV_PHP" \
  | python3 -m json.tool
```

Dans la réponse, vous devez voir :

- `"llmProvider": "openai"` (au lieu de `"mock"`)
- `"tokensUsed": 1234` (un nombre > 0)
- `"costEur": "0.0001..."` (un coût > 0)

---

## 2. Claude / Anthropic

⚠️ L'implémentation Java est actuellement un **squelette** (`apps/backend-app/.../ClaudeLlmClient.java`). Pour la rendre opérationnelle, il faudra implémenter l'appel HTTP vers `https://api.anthropic.com/v1/messages`. Tout le reste (configuration, sélection automatique du provider via `LLM_PROVIDER=claude`) est déjà en place.

### 2.1 Créer un compte

1. Aller sur **https://console.anthropic.com**
2. S'inscrire
3. Confirmer l'e-mail

### 2.2 Recharger le compte (pré-paiement)

1. Aller dans **Settings → Plans & Billing**
2. Recharger d'au moins **5 $**

### 2.3 Créer une clé API

1. Aller sur **https://console.anthropic.com/settings/keys**
2. Cliquer sur **"Create Key"**
3. Donner un nom : `skillforge-dev`
4. Copier la clé immédiatement (format `sk-ant-...`)

### 2.4 Configurer le backend

Éditer `apps/backend-app/.env` :

```env
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-votre-cle-collee-ici
CLAUDE_MODEL=claude-sonnet-4-5
```

### 2.5 Choix du modèle (`CLAUDE_MODEL`)

| Modèle | Cas d'usage | Coût (1 M tokens entrée / sortie) |
|---|---|---|
| `claude-haiku-4-5` | Le plus économique, rapide | ~ 1 $ / 5 $ |
| `claude-sonnet-4-5` | Recommandé : qualité élevée, prix raisonnable | ~ 3 $ / 15 $ |
| `claude-opus-4-5` | Plus puissant, plus cher | ~ 15 $ / 75 $ |

➡️ Pour le POC 1 : `claude-sonnet-4-5` est un excellent compromis. `claude-haiku-4-5` si on veut minimiser au maximum.

### 2.6 Avantage du **prompt caching** chez Anthropic

Claude propose nativement du **prompt caching** : si le même prompt système est envoyé plusieurs fois (ce qui est notre cas avec l'extraction de compétences), Anthropic facture **90 % moins cher** les tokens en cache.

Pour l'activer dans l'implémentation Java, ajouter le header HTTP :
```
anthropic-beta: prompt-caching-2024-07-31
```

C'est un argument fort pour défendre le choix de Claude vs OpenAI dans votre rapport M2.

---

## 3. Bascule rapide entre providers

Le grand avantage de l'**abstraction LLM** mise en place : pour basculer entre mock, OpenAI et Claude, **aucune modification de code** n'est nécessaire. Il suffit de modifier la variable `LLM_PROVIDER` dans `.env` et de redémarrer Spring Boot.

| Pour utiliser | `LLM_PROVIDER=` | Clé requise |
|---|---|---|
| Mock (gratuit, déterministe) | `mock` | aucune |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Claude | `claude` | `ANTHROPIC_API_KEY` |

---

## 4. Sécurité — Ne JAMAIS commiter une clé

Le fichier `apps/backend-app/.env` est **déjà ignoré** par Git (voir `.gitignore`). Mais par sécurité :

### Avant chaque commit

```bash
git status --short  # ne doit JAMAIS faire apparaitre .env
```

### Si une clé est exposée par erreur sur GitHub

⚠️ Considérer la clé comme **compromise immédiatement** :

1. **Révoquer** la clé sur la console du fournisseur (OpenAI ou Anthropic) → la supprimer
2. **Générer une nouvelle clé** et la mettre dans `.env`
3. Si la clé a été poussée sur le repo public, OpenAI et Anthropic **scannent GitHub** et désactivent automatiquement la clé, mais il ne faut pas s'y fier.
4. Optionnel : nettoyer l'historique Git avec `git filter-repo` pour supprimer la clé des anciens commits.

---

## 5. Comparatif des coûts estimés pour SkillForge

Hypothèses :
- 30 CV analysés en POC 1
- ~2 000 tokens entrée + ~500 tokens sortie par CV
- 100 questions générées en POC 2
- ~1 500 tokens entrée + ~800 tokens sortie par question

| Provider | Modèle | POC 1 (30 CV) | POC 2 (100 questions) | Total POC |
|---|---|---|---|---|
| OpenAI | gpt-4o-mini | ~ 0,04 € | ~ 0,07 € | **~ 0,11 €** |
| OpenAI | gpt-4o | ~ 0,60 € | ~ 1,30 € | ~ 1,90 € |
| Claude | claude-haiku-4-5 | ~ 0,17 € | ~ 0,55 € | ~ 0,72 € |
| Claude | claude-sonnet-4-5 (avec caching) | ~ 0,15 € | ~ 0,50 € | ~ 0,65 € |
| Claude | claude-sonnet-4-5 (sans caching) | ~ 0,50 € | ~ 1,80 € | ~ 2,30 € |

➡️ **Conclusion** : pour la phase de POC, n'importe quel modèle reste **bien en dessous des 5 €** annoncés dans le cahier des charges.

---

## 6. Vérification finale

Après avoir configuré votre clé, vérifier dans les logs Spring Boot que le bon provider est chargé :

```
LOG : ConditionalOnProperty matched : skillforge.llm.provider=openai
```

Si vous voyez ça pour `mock`, c'est qu'aucune des autres impls n'a été activée — vérifier l'orthographe de `LLM_PROVIDER` dans `.env`.
