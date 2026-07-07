# POC 1 — Analyse intelligente du CV par IA

## 1. Objectif

Vérifier que la chaîne complète **CV → parser → LLM → compétences structurées** fonctionne correctement et atteint les seuils suivants :

| Indicateur | Cible |
|---|---|
| Précision sur la détection des compétences principales | ≥ 85 % |
| Précision sur l'estimation du niveau (junior / confirmé / senior) | ≥ 80 % |
| Latence médiane par CV | < 15 secondes |
| Couverture des formats | PDF natif, PDF scanné (OCR), DOCX |

## 2. Mise en place technique (déjà réalisée)

Les briques suivantes sont déjà en place dans le backend :

| Brique | Implémentation |
|---|---|
| Parseur PDF | `CvParserService` (Apache PDFBox) |
| Parseur DOCX | `CvParserService` (Apache POI) |
| OCR fallback | Détection automatique des PDF scannés (< 100 caractères extraits). Retourne un indicateur `ocrFallbackRecommended` dans la réponse API. L'intégration effective avec Tesseract / tess4j est prévue en V2 (hors périmètre du POC initial : les 30 CV du benchmark sont majoritairement des PDF natifs). |
| Abstraction LLM | Interface `LlmClient` avec **quatre** implémentations : `MockLlmClient`, `OpenAiLlmClient`, `GitHubModelsLlmClient`, `ClaudeLlmClient` |
| Endpoint d'upload | `POST /cv/upload` (multipart) qui orchestre tout |
| Persistance | Entités `Candidate`, `Cv`, `CvAnalysis` + tables PostgreSQL |

Le choix du fournisseur LLM se fait par la variable d'environnement `LLM_PROVIDER` :

```env
LLM_PROVIDER=mock    # par défaut local, déterministe, sans réseau
LLM_PROVIDER=github  # GITHUB_TOKEN requis (PAT scope models:read) — GRATUIT, recommandé pour le POC
LLM_PROVIDER=openai  # OPENAI_API_KEY requis (gpt-4o-mini)
LLM_PROVIDER=claude  # ANTHROPIC_API_KEY requis
```

GitHub Models (Azure AI Inference) expose plusieurs LLM dont `gpt-4o-mini`,
`gpt-4o`, `Phi-3.5`, `Llama-3.3` avec une API OpenAI-compatible. C'est le
provider utilisé par défaut en démo : aucune carte bancaire, juste un PAT
GitHub.

## 3. Protocole de mesure

### 3.1 Constitution du jeu de test

30 CV réels Tsarajoro (anonymisés) doivent être collectés, répartis comme suit :

| Profil | Nombre de CV | Format |
|---|---|---|
| Développeur PHP | 8 | 5 PDF natif, 2 PDF scanné, 1 DOCX |
| Intégrateur WordPress | 8 | 5 PDF natif, 2 PDF scanné, 1 DOCX |
| Développeur Vue.js | 7 | 5 PDF natif, 1 PDF scanné, 1 DOCX |
| Spécialiste SEO | 7 | 5 PDF natif, 1 PDF scanné, 1 DOCX |

Pour chaque CV, un fichier **vérité terrain** (JSON) est créé manuellement :

```json
{
  "cvId": "cv-001",
  "profile": "DEV_PHP",
  "expectedSkills": [
    { "code": "LANG_PHP", "level": "SENIOR", "years": 6 },
    { "code": "FW_LARAVEL", "level": "CONFIRME", "years": 3 },
    { "code": "DB_MYSQL", "level": "CONFIRME" }
  ]
}
```

### 3.2 Exécution du POC

Un script Java (ou shell) exécute le pipeline sur chaque CV et compare les compétences détectées à la vérité terrain.

**Métriques calculées :**

- **Précision** = (compétences correctement détectées) / (compétences détectées au total)
- **Rappel** = (compétences correctement détectées) / (compétences attendues)
- **F1-score** = moyenne harmonique des deux
- **Latence p50 / p95** = médiane et 95ᵉ percentile de la durée d'analyse

### 3.3 Critère de validation

Le POC est validé si simultanément :

- Précision ≥ 85 % sur les compétences principales (langages, frameworks majeurs).
- Estimation du niveau correcte ≥ 80 % du temps.
- Latence p50 < 15 secondes.

## 4. État actuel

| Étape | Statut |
|---|---|
| Pipeline technique fonctionnel | ✅ Implémenté (peut être testé avec `MockLlmClient`) |
| Collecte des 30 CV réels anonymisés | ⏳ À faire — dépend du tuteur entreprise Tsarajoro |
| Fichiers de vérité terrain | ⏳ À faire |
| Exécution du benchmark sur GitHub Models (gpt-4o-mini) | ✅ Testé bout-en-bout avec le provider `github` (gratuit, PAT `models:read`) |
| Exécution du benchmark sur OpenAI | ⏳ Switch trivial via `LLM_PROVIDER=openai` + `OPENAI_API_KEY` |
| Exécution du benchmark sur Claude | ⏳ `ClaudeLlmClient.extractSkillsFromCv` en squelette, à finaliser si comparaison souhaitée |
| Rapport final chiffré | ⏳ À rédiger après exécution |

## 5. Risques traités par ce POC

- **R3 — Analyse CV imprécise** : ce POC mesure objectivement la précision et permet de basculer en saisie manuelle si on n'atteint pas 85 %.
- **R7 — Hétérogénéité des CV** : la couverture PDF natif + scanné + DOCX dans le jeu de test garantit la robustesse.
- **R5 — Coûts API** : on mesure les tokens consommés et le coût par CV pour vérifier la viabilité économique.

## 6. Plan post-POC

Si le POC est validé : on passe à l'intégration UI (Sprint 3, écran de revue des compétences détectées).

Si le POC est partiellement validé (par exemple 75 %) :
- itérer sur le prompt (few-shot avec exemples Tsarajoro) ;
- enrichir le mapping vers le référentiel interne ;
- prévoir une étape de validation manuelle plus visible côté UI.

Si le POC échoue (< 60 %) :
- réexaminer le choix du modèle (passage à un modèle plus puissant) ;
- envisager un modèle spécialisé pour l'extraction de CV (ex. solutions HR Tech open source).
