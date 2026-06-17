# POC 2 — Génération adaptative de tests par IA

## 1. Objectif

Démontrer que l'IA est capable de **générer des questions techniques de qualité industrielle** adaptées :
- aux **compétences déclarées** dans le CV du candidat,
- au **profil métier cible** chez Tsarajoro (dev PHP, intégrateur WordPress, etc.).

| Indicateur | Cible |
|---|---|
| Questions acceptées sans modification | ≥ 75 % |
| Questions acceptées avec modifications mineures | ≥ 90 % cumulé |
| Coût moyen par question générée | ≤ 0,02 € |
| Latence p50 d'une génération de 10 questions | < 30 secondes |
| Diversité de difficulté demandée vs produite | écart ≤ 1 sur 5 |

## 2. Mise en place technique (déjà réalisée)

| Brique | Implémentation |
|---|---|
| Interface `LlmClient` | Méthode `generateQuestions(GenerationRequest)` |
| Implémentations | **4 clients** : `MockLlmClient` (factice, gratuite), `OpenAiLlmClient` (gpt-4o-mini), `GitHubModelsLlmClient` (gpt-4o-mini via GitHub Models, gratuit), `ClaudeLlmClient` (Anthropic) |
| Endpoint REST | `POST /tests/generate` — accepte un `candidateId` optionnel ; si fourni, la génération crée automatiquement un `Test` lié au candidat (`tests.candidate_id`) et peuple `test_compositions` |
| Persistance | Questions stockées en `PENDING_REVIEW` dans la banque |
| Composition | Soit automatique (via `POST /tests/generate` avec `candidateId`), soit manuelle (`POST /tests` + `POST /tests/{id}/invite`) |
| Accès candidat public | `GET /invitations/{token}` (payload nettoyé : pas de `correctIndex`, pas de `hiddenTests`) |
| Revue groupée | `GET /review/by-candidate` — renvoie les questions groupées par Test + Candidate pour la page de validation |

### Format JSON de requête

```json
{
  "profileCode": "DEV_PHP",
  "skillCodes": ["LANG_PHP", "FW_LARAVEL", "DB_MYSQL"],
  "types": [
    {"type": "QCM", "count": 5},
    {"type": "CODE", "count": 3},
    {"type": "CAS_PRATIQUE", "count": 2}
  ],
  "difficulty": 3
}
```

### Format JSON de réponse

```json
{
  "questions": [
    {
      "id": "uuid",
      "type": "QCM",
      "statement": "...",
      "difficulty": 3,
      "status": "PENDING_REVIEW",
      "jsonPayload": "{\"options\":[\"...\"],\"correctIndex\":1,\"explanation\":\"...\"}"
    }
  ],
  "llmProvider": "openai",
  "llmModel": "gpt-4o-mini",
  "tokensUsed": 1234,
  "costEur": "0.0006"
}
```

## 3. Protocole de mesure

### 3.1 Constitution du jeu de test

100 questions générées au total, réparties sur 5 compétences cibles Tsarajoro :

| Compétence | Nb de questions générées | Mix |
|---|---|---|
| PHP avancé (`LANG_PHP`) | 20 | 10 QCM + 7 CODE + 3 CAS |
| WordPress hooks (`CMS_WP_HOOKS`) | 20 | 12 QCM + 4 CODE + 4 CAS |
| Vue.js (`FW_VUE`) | 20 | 10 QCM + 7 CODE + 3 CAS |
| MySQL (`DB_MYSQL`) | 20 | 12 QCM + 6 CODE + 2 CAS |
| SEO technique (`SEO_TECHNIQUE`) | 20 | 14 QCM + 0 CODE + 6 CAS |

### 3.2 Validation par 2 ou 3 développeurs seniors

Chaque question est notée selon **3 critères** sur une grille simple :

- **Pertinence** : la question évalue bien la compétence ciblée ? (oui / partiellement / non)
- **Qualité de rédaction** : énoncé clair, sans ambiguïté ? (oui / partiellement / non)
- **Qualité des distracteurs (QCM)** : plausibles, pas évidents ? (oui / partiellement / non)

Une question est :
- **Acceptée sans modification** si les 3 critères sont à "oui"
- **Acceptée avec modifications mineures** si au moins 2 critères à "oui"
- **Rejetée** sinon

### 3.3 Critère de validation

Le POC est validé si simultanément :
- Taux d'acceptation sans modification ≥ 75 %
- Taux d'acceptation cumulé (avec modifications mineures) ≥ 90 %
- Coût moyen par question ≤ 0,02 €
- Latence p50 < 30 s

## 4. État actuel

| Étape | Statut |
|---|---|
| Endpoint fonctionnel avec mock LLM | ✅ Testé 6 questions générées (3 QCM + 2 CODE + 1 CAS) |
| Validations Jakarta (skillCodes, difficulty, types) | ✅ Testées |
| Persistance en PENDING_REVIEW | ✅ Vérifié en BDD |
| Composition + invitation + accès candidat | ✅ Testé bout-en-bout |
| Génération **réelle** avec GitHub Models (gpt-4o-mini) | ✅ Testé bout-en-bout (provider `github`, gratuit pour le POC) |
| Génération **réelle** avec OpenAI (gpt-4o-mini) | ⏳ Switch trivial via `LLM_PROVIDER=openai` + `OPENAI_API_KEY` |
| Génération réelle avec Claude | ⏳ `ClaudeLlmClient.generateQuestions` implémenté, à valider avec une clé `ANTHROPIC_API_KEY` |
| Validation par 2-3 dev seniors | ⏳ À planifier avec le tuteur entreprise |
| Rapport final chiffré | ⏳ À rédiger après exécution |

## 5. Risques traités par ce POC

- **R2 — IA génère des questions de qualité insuffisante** : le POC mesure le taux d'acceptation réel par des humains experts.
- **R5 — Coûts API** : on mesure le coût exact par question. Si > 0,02 €, on peut activer le prompt caching (Claude) ou passer sur `gpt-4o-mini` (moins cher).

## 6. Plan post-POC

Si le POC est validé :
- Activation de la **boucle d'amélioration continue** au Sprint 6 : les questions discriminantes sont priorisées et regénérées moins souvent (réduction des coûts).

Si le POC est partiellement validé (60-75 %) :
- Enrichir le prompt système avec des **exemples few-shot** issus de la banque Tsarajoro.
- Affiner la sélection automatique des compétences cibles (éviter les compétences trop génériques).
- Mettre en place un **double passage IA** : la 1ʳᵉ génère, la 2ᵉ critique et propose des améliorations.

Si le POC échoue (< 60 %) :
- Passer sur un modèle plus puissant (`gpt-4o` ou `claude-opus-4-5`).
- Envisager du fine-tuning sur les questions Tsarajoro déjà validées.
