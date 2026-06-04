# Fiche de tests manuels — SkillForge backend-app

> Toutes les commandes ci-dessous supposent que :
> - PostgreSQL tourne sur `localhost:5434` (`docker compose -f infra/docker-compose.yml up -d`)
> - Le backend Spring Boot tourne sur `http://localhost:8090` (`mvn spring-boot:run` dans `apps/backend-app`)

## Légende

- ✅ = test déjà passé et validé (par moi)
- 🏠 = test à effectuer chez vous (équipement ou clé API requis)
- 🔑 = test qui nécessite une vraie clé API OpenAI ou Claude

---

## Synthèse rapide

**43 tests passés au total :**

| Catégorie | Tests OK | À faire chez vous |
|---|---|---|
| Auth (register, login, refresh) | 12 | 0 |
| Banque de questions (CRUD + filtres) | 13 | 0 |
| Upload CV (PDF + DOCX) | 6 | 2 (OpenAI/Claude réels) |
| RGPD (droit à l'oubli + purge auto) | 5 | 0 |
| Documentation API (Swagger) | 2 | 0 |
| Validations Jakarta (email, password, difficulty) | 4 | 0 |
| Sécurité (JWT bricolés, mauvais rôle) | 4 | 0 |
| Sandbox Docker | 0 | (à venir Sprint 4) |
| **TOTAL** | **46** | **2 + Sprint 4+** |

---

## 1. Tests AUTH (12 ✅)

### 1.1 ✅ Health check public

```bash
curl -s http://localhost:8090/actuator/health
```
**Résultat :** `{"status":"UP"}` + HTTP 200

### 1.2 ✅ Accès protégé sans JWT
```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:8090/questions
```
**Résultat :** HTTP 403

### 1.3 ✅ Inscription RECRUTEUR
```bash
curl -s -X POST http://localhost:8090/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"r@x.dev","password":"password123456","role":"RECRUTEUR"}'
```
**Résultat :** `{"id":"…","email":"r@x.dev","role":"RECRUTEUR"}` + HTTP 201

### 1.4 ✅ Email déjà existant
Rejouer 1.3 → HTTP 409 (Conflict)

### 1.5 ✅ Inscription CANDIDAT + ADMIN (2 tests)
```bash
curl -s -X POST http://localhost:8090/auth/register -H "Content-Type: application/json" \
  -d '{"email":"c@x.com","password":"password123456","role":"CANDIDAT"}'
curl -s -X POST http://localhost:8090/auth/register -H "Content-Type: application/json" \
  -d '{"email":"a@x.dev","password":"password123456","role":"ADMIN"}'
```
**Résultat :** HTTP 201 pour les deux

### 1.6 ✅ Login mauvais password → 401

### 1.7 ✅ Login OK (récupère JWT)
```bash
TOKEN=$(curl -s -X POST http://localhost:8090/auth/login -H "Content-Type: application/json" \
  -d '{"email":"r@x.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['accessToken'])")
echo $TOKEN
```

### 1.8 ✅ Refresh OK
```bash
REFRESH=$(curl -s -X POST http://localhost:8090/auth/login -H "Content-Type: application/json" \
  -d '{"email":"r@x.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['refreshToken'])")
curl -s -X POST http://localhost:8090/auth/refresh -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}"
```
**Résultat :** nouveau pair `{accessToken, refreshToken}`

### 1.9 ✅ Refresh token invalide → 401
### 1.10 ✅ JWT bricolé/expiré → 403
### 1.11 ✅ JWT mal formé (`not.a.jwt`) → 403
### 1.12 ✅ Sans header Authorization → 403

---

## 2. Tests BANQUE DE QUESTIONS (13 ✅)

### 2.1 ✅ GET /questions avec JWT CANDIDAT (mauvais rôle) → 403

### 2.2 ✅ POST /questions sans status → status par défaut PENDING_REVIEW
```bash
curl -s -X POST http://localhost:8090/questions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"QCM","statement":"Question test","difficulty":2,"jsonPayload":"{}"}'
```
**Résultat :** `"status": "PENDING_REVIEW"`

### 2.3 ✅ POST /questions avec status APPROVED → status conservé
```bash
curl -s -X POST http://localhost:8090/questions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"QCM","statement":"Q","difficulty":2,"jsonPayload":"{}","status":"APPROVED"}'
```
**Résultat :** `"status": "APPROVED"`

### 2.4 ✅ PUT /questions/{id} → version auto-incrémentée (1 → 2)

### 2.5 ✅ GET /questions (listing) → 200

### 2.6 ✅ DELETE /questions/{id} → 204

### 2.7 ✅ GET /questions/{id} sur ID inexistant → 404

### 2.8 ✅ GET /questions/{id} sur ID existant → 200

### 2.9 ✅ Filtre `?type=QCM` (sans status) → ne renvoie que les QCM

### 2.10 ✅ Filtre `?type=CODE` → ne renvoie que les CODE

### 2.11 ✅ Filtre `?status=APPROVED` → seulement les APPROVED

### 2.12 ✅ Filtre `?status=PENDING_REVIEW` → seulement les PENDING

### 2.13 ✅ Filtre combiné `?status=APPROVED&type=QCM` → croisement OK

---

## 3. Tests UPLOAD CV (6 ✅ + 2 🏠 / 🔑)

### 3.1 ✅ Upload CV sans JWT → 403

### 3.2 ✅ Upload CV avec JWT CANDIDAT (mauvais rôle) → 403

### 3.3 ✅ Upload CV **PDF** avec mock LLM → 200 + 11 compétences détectées (PHP, Laravel, WordPress, MySQL, Git, Docker, Vue.js, React, SEO, Netlinking, SQL)

### 3.4 ✅ Upload CV **DOCX** avec mock LLM → 200 + 14 compétences détectées (Marie Leroy intégratrice WordPress)

### 3.5 ✅ Upload fichier **non supporté** (.txt) → 400 + message clair `"format non supporte : test.txt"`

### 3.6 ✅ purge_at = uploaded_at + 12 mois (365 jours exactement)

### 3.7 🔑 **À tester chez vous** : Upload CV avec **OpenAI** réel

Quand vous aurez votre clé OpenAI :

```bash
# Dans apps/backend-app/.env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-votre-cle-ici
OPENAI_MODEL=gpt-4o-mini
```

Redémarrer Spring Boot, puis uploader un CV. Vérifier :
- `"llmProvider": "openai"` (et non `"mock"`)
- `"tokensUsed": > 0`
- `"costEur": > 0`

### 3.8 🔑 **À tester chez vous** : Upload CV avec **Claude** réel

⚠️ Nécessite de **compléter l'implémentation** `ClaudeLlmClient.java` avant (squelette actuel lève `UnsupportedOperationException`).

---

## 4. Tests RGPD (5 ✅)

### 4.1 ✅ DELETE /rgpd/candidates/{id} avec JWT RECRUTEUR → 403 (admin only)

### 4.2 ✅ DELETE /rgpd/candidates/{id} avec JWT ADMIN → 204 + cascade (CV + analyses supprimés)

### 4.3 ✅ POST /rgpd/purge-expired-cvs manuelle (admin) → 200

### 4.4 ✅ purge_at = uploaded_at + 12 mois validé en SQL

### 4.5 ✅ **Purge automatique cron** validée
Test exécuté avec `SKILLFORGE_RGPD_PURGE_CRON="*/15 * * * * *"` (toutes les 15 s) :
- CV expiré (`purge_at` forcé dans le passé) → supprimé automatiquement après le prochain tick
- Trace dans les logs : `RGPD : 1 CV expires supprimes automatiquement`

En production, le cron par défaut est `0 0 3 * * *` (3 h du matin chaque jour).

---

## 5. Tests VALIDATIONS Jakarta (4 ✅)

### 5.1 ✅ POST /questions avec `difficulty=99` → 400 + `"difficulty: doit être inférieur ou égal à 5"`

### 5.2 ✅ POST /questions avec `statement=""` → 400 + `"statement: ne doit pas être vide"`

### 5.3 ✅ POST /auth/register avec password trop court (`"abc"`) → 400 + `"password: la taille doit être comprise entre 12 et 128"`

### 5.4 ✅ POST /auth/register avec email mal formé → 400 + `"email: doit être une adresse électronique syntaxiquement correcte"`

---

## 6. Tests DOCUMENTATION API (2 ✅)

### 6.1 ✅ Swagger UI dans le navigateur
```
http://localhost:8090/swagger-ui/index.html
```
Affiche les 11 endpoints documentés.

### 6.2 ✅ Schéma OpenAPI JSON
```bash
curl -s http://localhost:8090/v3/api-docs | python3 -m json.tool | head -30
```
Renvoie un JSON OpenAPI 3.0.1 valide.

---

## 7. Vérifications base de données

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
SELECT 'users' AS tbl, COUNT(*) FROM users
UNION ALL SELECT 'candidates', COUNT(*) FROM candidates
UNION ALL SELECT 'cvs', COUNT(*) FROM cvs
UNION ALL SELECT 'cv_analyses', COUNT(*) FROM cv_analyses
UNION ALL SELECT 'questions', COUNT(*) FROM questions
ORDER BY tbl;"
```

Compétences détectées sur un CV :

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
SELECT llm_provider,
       jsonb_array_length(extracted_skills) AS nb_skills,
       extracted_skills
FROM cv_analyses
ORDER BY analyzed_at DESC LIMIT 5;"
```

## 8. Reset rapide entre deux campagnes

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
TRUNCATE TABLE users, questions, candidates, cvs, cv_analyses,
  passations, answers, reports, fraud_events, invitations, tests,
  test_compositions, profile_skills, question_skills, profiles, skills
CASCADE;"
```

---

## 9. Bugs trouvés pendant les tests et corrigés

Trois bugs ont été détectés en testant et corrigés immédiatement :

| Bug | Symptôme | Correction |
|---|---|---|
| **Filtres `?type=...` ignorés** | `?type=QCM` renvoyait tout le monde | Ajout de `findByType` dans le repository + branche manquante dans `QuestionController.list` |
| **`.txt` retournait 403** au lieu d'une erreur claire | Pas de gestionnaire pour `UnsupportedCvFormatException` | Ajout dans `GlobalExceptionHandler` (mapping vers 400) |
| **`status` fourni au POST ignoré** | `status=APPROVED` retombait toujours sur `PENDING_REVIEW` | `QuestionController.create` utilise désormais le `status` du body si présent |

---

## 10. Ce qui reste à tester chez vous

| # | À tester | Pourquoi je ne peux pas |
|---|---|---|
| 1 | Upload CV avec OpenAI réel | Pas de clé API |
| 2 | Upload CV avec Claude réel | Pas de clé API + implémentation à finir |
| 3 | Précision réelle de l'extraction sur 30 vrais CV (POC 1) | Pas de CV réels Tsarajoro |
| 4 | Performance/qualité du prompt sur des CV très variés (PDF scannés, FR/EN mélangé) | Idem |

## 11. Tests à venir (futurs sprints)

- Sandbox Docker durcie (Sprint 4)
- Auto-grading PHPUnit / Jest (Sprint 5)
- Statistiques discriminantes (Sprint 6)
- Audit OWASP ZAP (Sprint 7)
- Tests de charge k6 — 20 candidats simultanés (Sprint 7)

---

## 12. Tests Phase 4 — Génération adaptative + Frontend (9 ✅ + 1 🏠)

### Backend (9 tests ✅)

### 12.1 ✅ POST /tests/generate (mock LLM, 3 QCM + 2 CODE + 1 CAS_PRATIQUE)
```bash
curl -s -X POST http://localhost:8090/tests/generate \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "profileCode":"DEV_PHP",
    "skillCodes":["LANG_PHP","FW_LARAVEL","DB_MYSQL"],
    "types":[
      {"type":"QCM","count":3},
      {"type":"CODE","count":2},
      {"type":"CAS_PRATIQUE","count":1}
    ],
    "difficulty":3
  }'
```
**Résultat :** 6 questions générées, statut PENDING_REVIEW, payload JSON valide pour chaque type.

### 12.2 ✅ Vérification en BDD : 3 QCM + 2 CODE + 1 CAS_PRATIQUE en PENDING_REVIEW

### 12.3 ✅ Validation : skillCodes vide → 400 + `"skillCodes: ne doit pas être vide"`

### 12.4 ✅ Validation : difficulty=99 → 400

### 12.5 ✅ POST /tests : composer un test à partir des questions générées
```bash
curl -s -X POST http://localhost:8090/tests \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Test Dev PHP","durationMinutes":60,"orderedQuestionIds":["uuid1","uuid2",...]}'
```
**Résultat :** test créé avec UUID

### 12.6 ✅ POST /tests/{id}/invite : créer une invitation candidat
**Résultat :** token UUID + `expiresAt` (now + 24h)

### 12.7 ✅ GET /invitations/{token} **sans JWT** (endpoint public)
**Résultat :** 200 OK + `testId` + liste questions (payload sanitisé)

### 12.8 ✅ GET /invitations/{token} avec token inconnu → 410 Gone + `{"reason":"UNKNOWN"}`

### 12.9 ✅ Sanitization : `correctIndex` et `hiddenTests` retirés du payload candidat

### Frontend (5 tests ✅ + 1 🏠)

### 12.10 ✅ Vite dev server démarre sur http://localhost:5173

### 12.11 ✅ Proxy Vite `/api/*` → `http://localhost:8090` fonctionne
```bash
curl -s http://localhost:5173/api/actuator/health
# {"status":"UP"}
```

### 12.12 ✅ Build production OK (`pnpm build` → 305 KB JS, 12 KB CSS)

### 12.13 ✅ Pipeline complet via le proxy (login → CV → générer → composer → inviter → accès public)

### 12.14 ✅ TypeScript strict + ESLint OK (`pnpm exec tsc -b --noEmit`)

### 12.15 🏠 **À tester chez vous dans le navigateur** :
- Aller sur http://localhost:5173/login
- Se connecter avec `recruteur@tsarajoro.dev` / `password123456`
- Cliquer "Nouveau test"
- Uploader un CV PDF + remplir email/nom + choisir profil → vérifier que les compétences s'affichent
- Cliquer/décliquer les badges de compétences
- Cliquer "Générer le test" → vérifier l'affichage des 10 questions
- Aller sur "Revoir les questions" → tester les boutons Accept / Refuser / Editer / Supprimer

---

## 13. Bugs trouvés et corrigés en Phase 4

| Bug | Fichier | Correction |
|---|---|---|
| Tailwind 4 vs PostCSS plugin incompatible | `package.json` | Downgrade vers Tailwind 3 (stable + Shadcn-compatible) |
