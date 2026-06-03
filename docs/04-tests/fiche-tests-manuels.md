# Fiche de tests manuels — SkillForge backend-app

> Toutes les commandes ci-dessous supposent que :
> - PostgreSQL tourne sur `localhost:5434` (`docker compose -f infra/docker-compose.yml up -d`)
> - Le backend Spring Boot tourne sur `http://localhost:8090` (`mvn spring-boot:run` dans `apps/backend-app`)
> - Le fichier `cv-test.pdf` existe dans `/tmp/` (sinon prendre n'importe quel CV PDF ou DOCX)

## Légende

- ✅ = test déjà passé et validé
- ⏳ = test à effectuer manuellement
- 🔑 = test qui nécessite une vraie clé API OpenAI ou Claude

---

## 1. Tests AUTH (12 tests — ✅ tous validés)

### 1.1 ✅ Health check public (sans JWT)

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:8090/actuator/health
```
**Attendu :** `{"status":"UP"}` + HTTP 200

### 1.2 ✅ Accès protégé sans JWT

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:8090/questions
```
**Attendu :** HTTP 403

### 1.3 ✅ Inscription d'un recruteur

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"recruteur@tsarajoro.dev","password":"password123456","role":"RECRUTEUR"}'
```
**Attendu :** `{"id":"…","email":"recruteur@tsarajoro.dev","role":"RECRUTEUR"}` + HTTP 201

### 1.4 ✅ Tentative d'inscription avec un email déjà existant

Rejouer la commande 1.3 → **Attendu :** HTTP 409 (Conflict)

### 1.5 ✅ Inscription candidat et admin

```bash
curl -s -X POST http://localhost:8090/auth/register -H "Content-Type: application/json" \
  -d '{"email":"candidat@example.com","password":"password123456","role":"CANDIDAT"}'

curl -s -X POST http://localhost:8090/auth/register -H "Content-Type: application/json" \
  -d '{"email":"admin@tsarajoro.dev","password":"password123456","role":"ADMIN"}'
```
**Attendu :** HTTP 201 pour les deux

### 1.6 ✅ Login avec mauvais mot de passe

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruteur@tsarajoro.dev","password":"wrong_password!"}'
```
**Attendu :** HTTP 401 + `{"error":"Unauthorized","message":"invalid credentials"}`

### 1.7 ✅ Login OK (récupère un access token + refresh token)

```bash
TOKEN_RECRUTEUR=$(curl -s -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruteur@tsarajoro.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['accessToken'])")

echo "Token recruteur : $TOKEN_RECRUTEUR"
```
**Attendu :** une longue chaîne `eyJ…` (un JWT)

### 1.8 ✅ Refresh d'un access token

```bash
REFRESH=$(curl -s -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruteur@tsarajoro.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['refreshToken'])")

curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}"
```
**Attendu :** un nouveau pair `{accessToken, refreshToken}` + HTTP 200

### 1.9 ✅ Refresh avec un token invalide

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"invalid.token.here"}'
```
**Attendu :** HTTP 401

---

## 2. Tests BANQUE DE QUESTIONS (6 tests — ✅ tous validés)

### 2.1 ✅ GET /questions avec JWT CANDIDAT (mauvais rôle)

```bash
TOKEN_CANDIDAT=$(curl -s -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidat@example.com","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['accessToken'])")

curl -s -w "\nHTTP %{http_code}\n" http://localhost:8090/questions \
  -H "Authorization: Bearer $TOKEN_CANDIDAT"
```
**Attendu :** HTTP 403 (le candidat n'a pas le droit de voir la banque)

### 2.2 ✅ POST /questions avec JWT RECRUTEUR (création)

```bash
QID=$(curl -s -X POST http://localhost:8090/questions \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" \
  -H "Content-Type: application/json" \
  -d '{"type":"QCM","statement":"Difference entre == et === en PHP ?","difficulty":3,"jsonPayload":"{\"options\":[\"strict\",\"loose\"],\"correctIndex\":0}","status":"APPROVED"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")

echo "Question créée : $QID"
```
**Attendu :** un UUID

### 2.3 ✅ PUT /questions/{id} (modification + version auto-incrémentée)

```bash
curl -s -w "\nHTTP %{http_code}\n" -X PUT http://localhost:8090/questions/$QID \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" \
  -H "Content-Type: application/json" \
  -d '{"type":"QCM","statement":"Différence == et === en PHP ? (V2)","difficulty":4,"jsonPayload":"{\"options\":[\"strict\",\"loose\",\"both\"],\"correctIndex\":0}","status":"APPROVED"}'
```
**Attendu :** HTTP 200 + `version` passe à 2

### 2.4 ✅ GET /questions (listing)

```bash
curl -s http://localhost:8090/questions -H "Authorization: Bearer $TOKEN_RECRUTEUR" | python3 -m json.tool
```
**Attendu :** une liste contenant la question modifiée avec `"version": 2`

### 2.5 ✅ DELETE /questions/{id}

```bash
curl -s -w "\nHTTP %{http_code}\n" -X DELETE http://localhost:8090/questions/$QID \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR"
```
**Attendu :** HTTP 204

### 2.6 ✅ Filtre par status

```bash
curl -s "http://localhost:8090/questions?status=APPROVED" \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" | python3 -m json.tool
```
**Attendu :** seulement les questions au statut APPROVED

---

## 3. Tests UPLOAD CV (analyse IA — ✅ avec mock, 🔑 reste à tester avec vraie clé)

### 3.1 ✅ Upload CV sans JWT

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/cv/upload \
  -F "file=@/tmp/cv-test.pdf" \
  -F "candidateEmail=test@x.com" \
  -F "candidateDisplayName=Test" \
  -F "profileCode=DEV_PHP"
```
**Attendu :** HTTP 403

### 3.2 ✅ Upload CV PDF avec mock LLM

```bash
curl -s -X POST http://localhost:8090/cv/upload \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" \
  -F "file=@/tmp/cv-test.pdf" \
  -F "candidateEmail=jean.dupont@example.com" \
  -F "candidateDisplayName=Jean Dupont" \
  -F "profileCode=DEV_PHP" \
  | python3 -m json.tool
```
**Attendu :** une réponse JSON avec `candidateId`, `cvId`, `analysisId`, et une liste `skills` (le mock détecte au moins PHP, Laravel, WordPress…)

### 3.3 ⏳ Upload CV DOCX (à tester chez vous)

Prendre n'importe quel CV au format .docx (par exemple votre propre CV) et le mettre dans `/tmp/cv-test.docx`, puis :

```bash
curl -s -X POST http://localhost:8090/cv/upload \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" \
  -F "file=@/tmp/cv-test.docx" \
  -F "candidateEmail=test.docx@example.com" \
  -F "candidateDisplayName=Test DOCX" \
  -F "profileCode=DEV_PHP" \
  | python3 -m json.tool
```
**Attendu :** même type de réponse qu'avec un PDF. Apache POI doit lire le DOCX sans erreur.

### 3.4 ⏳ Upload fichier de format non supporté (.txt par exemple)

```bash
echo "Just a text file" > /tmp/test.txt
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/cv/upload \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR" \
  -F "file=@/tmp/test.txt" \
  -F "candidateEmail=test.txt@example.com" \
  -F "candidateDisplayName=Test" \
  -F "profileCode=DEV_PHP"
```
**Attendu :** HTTP 500 ou 400 avec message d'erreur indiquant que le format n'est pas supporté.

### 3.5 🔑 Upload CV avec OPENAI (vraie clé API)

D'abord activer OpenAI dans `apps/backend-app/.env` :

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-votre-cle-ici
```

Puis redémarrer Spring Boot et refaire le test 3.2.

**Attendu :** même format de réponse, mais :
- `llmProvider` = `"openai"`
- `tokensUsed` > 0
- `costEur` > 0
- `level` plus précis (junior / confirmé / senior)
- `yearsOfExperience` rempli quand l'IA le déduit

### 3.6 🔑 Upload CV avec CLAUDE (vraie clé Anthropic)

Quand vous avez la clé Claude :

```env
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
```

⚠️ L'implémentation `ClaudeLlmClient` est actuellement un **squelette**. Pour la rendre fonctionnelle, il faut implémenter l'appel HTTP vers `https://api.anthropic.com/v1/messages` (voir commentaires dans `ClaudeLlmClient.java`). Tant que ce n'est pas fait, l'appel renverra `UnsupportedOperationException`.

---

## 4. Tests RGPD (4 tests — ✅ tous validés)

### 4.1 ✅ DELETE candidat avec JWT RECRUTEUR (mauvais rôle)

```bash
CANDIDATE_ID="9fe050e5-3b9b-4a10-85b0-57e171b07925"  # remplacer par un vrai id

curl -s -w "\nHTTP %{http_code}\n" -X DELETE http://localhost:8090/rgpd/candidates/$CANDIDATE_ID \
  -H "Authorization: Bearer $TOKEN_RECRUTEUR"
```
**Attendu :** HTTP 403 (réservé aux admins)

### 4.2 ✅ DELETE candidat avec JWT ADMIN (droit à l'oubli)

```bash
TOKEN_ADMIN=$(curl -s -X POST http://localhost:8090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tsarajoro.dev","password":"password123456"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['accessToken'])")

curl -s -w "\nHTTP %{http_code}\n" -X DELETE http://localhost:8090/rgpd/candidates/$CANDIDATE_ID \
  -H "Authorization: Bearer $TOKEN_ADMIN"
```
**Attendu :** HTTP 204. En BDD : le candidat et tous ses CV/analyses sont supprimés (cascade).

### 4.3 ✅ Purge manuelle des CV expirés

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8090/rgpd/purge-expired-cvs \
  -H "Authorization: Bearer $TOKEN_ADMIN"
```
**Attendu :** HTTP 200

### 4.4 ⏳ Purge automatique quotidienne à 03:00

Ce test ne peut pas être validé par curl : c'est un job programmé `@Scheduled(cron = "0 0 3 * * *")` dans `RgpdService.purgeExpiredCvs`. Pour vérifier, soit :

- Attendre 3 h du matin et vérifier les logs.
- Changer temporairement le cron dans `application.yml` :
  ```yaml
  skillforge:
    rgpd:
      purge-cron: "*/30 * * * * *"   # toutes les 30 secondes pour test
  ```
- Insérer un CV avec `purge_at` dans le passé et observer sa suppression.

---

## 5. Tests DOCUMENTATION API (2 tests — ✅ validés)

### 5.1 ✅ Swagger UI dans le navigateur

Ouvrir dans Firefox / Chrome :

```
http://localhost:8090/swagger-ui/index.html
```

**Attendu :** l'interface Swagger affiche tous les endpoints (auth, questions, cv, rgpd) et permet de les tester depuis le navigateur (bouton "Try it out").

### 5.2 ✅ Schéma OpenAPI brut

```bash
curl -s http://localhost:8090/v3/api-docs | python3 -m json.tool | head -30
```
**Attendu :** un JSON OpenAPI 3.0.1 valide.

---

## 6. Vérifications en base de données

À tout moment, pour voir l'état de la BDD :

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
SELECT 'users' AS tbl, COUNT(*) FROM users
UNION ALL SELECT 'candidates', COUNT(*) FROM candidates
UNION ALL SELECT 'cvs', COUNT(*) FROM cvs
UNION ALL SELECT 'cv_analyses', COUNT(*) FROM cv_analyses
UNION ALL SELECT 'questions', COUNT(*) FROM questions
ORDER BY tbl;"
```

Pour voir les compétences détectées sur un CV :

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
SELECT llm_provider,
       jsonb_array_length(extracted_skills) AS nb_skills,
       extracted_skills
FROM cv_analyses
ORDER BY analyzed_at DESC
LIMIT 5;"
```

---

## 7. Reset rapide entre deux campagnes de tests

Pour repartir d'une base propre :

```bash
PGPASSWORD=skillforge_dev psql -h localhost -p 5434 -U skillforge -d skillforge -c "
TRUNCATE TABLE users, questions, candidates, cvs, cv_analyses,
  passations, answers, reports, fraud_events, invitations, tests,
  test_compositions, profile_skills, question_skills, profiles, skills
CASCADE;"
```

---

## 8. Tests à venir (pas encore implémentés)

À mesure que le projet avance, cette fiche s'enrichira de tests pour :

- Génération de tests adaptatifs par IA (Sprint 3)
- Sandbox d'exécution de code (Sprint 4)
- Auto-grading + compte rendu IA (Sprint 5)
- Statistiques discriminantes et boucle d'amélioration (Sprint 6)
- Tests de charge avec k6 (Sprint 7)
- Audit OWASP avec ZAP (Sprint 7)
