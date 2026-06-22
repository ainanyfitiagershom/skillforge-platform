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

---

## 14. Tests Phase 5 — Sandbox Docker durcie + Frontend candidat (à effectuer chez vous)

> Cette phase nécessite Docker fonctionnel. Avant de tester, construire les images :
> ```bash
> docker build -t skillforge-runtime-php:8.3 infra/sandbox/php8.3/
> docker build -t skillforge-runtime-node:20 infra/sandbox/node20/
> ```

### Backend Sandbox (port 8091)

#### 14.1 🏠 Healthcheck public
```bash
curl http://localhost:8091/actuator/health
```
**Attendu :** `{"status":"UP"}`

#### 14.2 🏠 Accès sans clé interne → 401
```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:8091/sandbox/execute
```
**Attendu :** HTTP 401 + `{"error":"missing or invalid X-Internal-Key"}`

#### 14.3 🏠 Exécution PHP simple (hello world)
```bash
curl -s -X POST http://localhost:8091/sandbox/execute \
  -H "Content-Type: application/json" \
  -H "X-Internal-Key: dev-internal-key-please-change" \
  -d '{"language":"PHP","userCode":"<?php echo 42;"}' | python3 -m json.tool
```
**Attendu :** `status: OK`, `exitCode: 0`, `stdout: "42"`, `durationMs < 2000`

#### 14.4 🏠 Exécution JS simple
```bash
curl -s -X POST http://localhost:8091/sandbox/execute \
  -H "Content-Type: application/json" \
  -H "X-Internal-Key: dev-internal-key-please-change" \
  -d '{"language":"JS","userCode":"console.log(2+2)"}' | python3 -m json.tool
```
**Attendu :** `stdout: "4"`

#### 14.5 🏠 PHP avec PHPUnit (auto-grading)
```bash
curl -s -X POST http://localhost:8091/sandbox/execute \
  -H "Content-Type: application/json" \
  -H "X-Internal-Key: dev-internal-key-please-change" \
  -d '{
    "language": "PHP",
    "userCode": "<?php function add($a,$b){return $a+$b;}",
    "hiddenTests": "<?php\nuse PHPUnit\\Framework\\TestCase;\nrequire \"solution.php\";\nclass HiddenTest extends TestCase { public function testAdd(){ $this->assertEquals(5, add(2,3)); } }"
  }' | python3 -m json.tool
```
**Attendu :** `testsPassed: 1`, `testsTotal: 1`, `score: 1.0`

#### 14.6 🏠 Tests de cas d'attaque (cf. POC 3, à faire un par un)
- Fork bomb PHP : `<?php while(true) pcntl_fork();` → `status: OOM` ou `ERROR` (PID limit)
- Accès réseau : `<?php file_get_contents("http://example.com");` → `status: ERROR`
- Lecture /etc/shadow : `<?php echo file_get_contents("/etc/shadow");` → contenu vide / erreur
- Écriture FS : `<?php file_put_contents("/x", "1");` → `status: ERROR`
- Boucle infinie : `<?php while(true);` → `status: TIMEOUT`
- Allocation 1 Go : `<?php $a=str_repeat("x", 1000000000);` → `status: OOM`

### Frontend candidat

#### 14.7 🏠 Cycle complet candidat
1. En tant que recruteur, créer un test + générer une invitation (UI Nouveau test)
2. Récupérer le token et ouvrir `http://localhost:5173/candidate/passation/{token}`
3. Vérifier le statut `token.valid` + nombre de questions
4. Saisir email + nom, cliquer "Commencer le test"
5. Naviguer Précédente / Suivante, répondre aux QCM (sauvegarde immédiate)
6. Sur une question CODE : taper du code dans Monaco, cliquer "Exécuter" → voir `OK` + `durationMs` + score
7. Cliquer "Soumettre le test" → page `done` avec score indicatif
8. Vérifier en BDD que `passations.submitted_at IS NOT NULL` et `invitations.used = true`

#### 14.8 🏠 Token invalide / expiré → page "Lien invalide"
Aller sur `http://localhost:5173/candidate/passation/inexistant`
**Attendu :** message "Lien invalide" + détail

#### 14.9 🏠 Reload pendant la passation
Recharger la page (F5) en cours de test → vérifier que les réponses sauvegardées sont conservées en BDD (mais la session sessionStorage est perdue, donc retourner à `/candidate/passation/:token` pour redémarrer)

### Tests Java unitaires Phase 5

#### 14.10 ✅ Parsing PHPUnit et Jest (tests unitaires `SandboxRunner`)
Lancer `mvn test` dans `apps/backend-sandbox/` :
**Attendu :** 6 tests verts dans `TestResultParsingTest` (3 cas PHPUnit, 3 cas Jest)

---

## 15. Tests Sprint 6 — Invitation + Auto-grading + Vue résultats + Compte rendu IA (à tester chez vous)

Ces tests valident les **3 tâches déjà terminées du Sprint 6** :
- Tâche 1 : bouton « Envoyer l'invitation » sur la page Review
- Tâche 2 : auto-grading par type + page Résultats (liste + détail)
- Tâche 3 : compte rendu IA généré automatiquement + export PDF

### Pré-requis

```bash
# Démarrer la stack
docker start skillforge-postgres
cd apps/backend-app && set -a && source .env && set +a && nohup mvn -o -q -DskipTests spring-boot:run > /tmp/sf-back.log 2>&1 &
cd apps/frontend-web && nohup npm run dev > /tmp/sf-front.log 2>&1 &
```

Vérifier que les migrations Flyway V2, V3 et V4 se sont appliquées :
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge \
  -c "SELECT version, description FROM flyway_schema_history ORDER BY installed_rank;"
```
**Attendu :** 4 lignes : V1 init, V2 test link candidate, V3 answer details, V4 report llm meta.

### Bouton « Envoyer l'invitation » (Tâche 1)

#### 15.1 🏠 Le bouton apparaît dans le bon contexte
1. Se connecter en tant que recruteur sur `/login`
2. Aller sur `/app/new-test`, uploader un CV, valider les compétences, générer un test (qui doit produire ≥1 question)
3. Aller sur `/app/review`, sélectionner le candidat dans la sidebar
4. Dans le header du panneau droit, le bouton **« Envoyer l'invitation »** (icône Send, bleu) doit être visible à côté de « Tout approuver »

**Attendu :** le bouton n'apparaît que si `group.questions.length > 0`.

#### 15.2 🏠 Modal d'invitation — état initial
Cliquer sur **« Envoyer l'invitation »**.
**Attendu :**
- Modal qui s'ouvre avec un backdrop flouté
- Titre « Envoyer l'invitation »
- Bloc destinataire affichant le nom + email du candidat sélectionné
- Texte explicatif : « Un lien unique sera créé pour ce test, valable 24 heures »
- Boutons **Annuler** + **Générer le lien** (CTA noir)

#### 15.3 🏠 Génération du lien et affichage
Cliquer sur **Générer le lien**.
**Attendu :**
- Spinner « Génération… » brièvement, bouton désactivé
- Un input read-only apparaît avec un lien `http://localhost:5173/candidate/passation/{token}`
- Bouton **Copier** à droite de l'input
- Mention « Expire le {date} » avec une vraie date à J+1
- Lien cliquable « Tester le lien dans un nouvel onglet »

#### 15.4 🏠 Copie du lien
Cliquer **Copier** → bouton devient vert avec « Copié ». Coller dans un autre champ pour vérifier le contenu du presse-papier.

#### 15.5 🏠 Vérification en base
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge \
  -c "SELECT token, expires_at, used FROM invitations ORDER BY expires_at DESC LIMIT 1;"
```
**Attendu :** une ligne avec `used = false`, expiration ≈ now() + 24h.

### Auto-grading par type (Tâche 2)

#### 15.6 🏠 Pipeline complet bout-en-bout
1. Approuver toutes les questions du test depuis `/app/review`
2. Cliquer **Envoyer l'invitation** + copier le lien
3. Ouvrir le lien en **navigation privée**
4. Sur la page Welcome candidat : saisir email + nom, cliquer **Commencer le test**
5. Répondre à **tous types** de questions :
   - QCM : cocher au moins 1 option
   - CODE : modifier le starterCode et cliquer **Exécuter** au moins 1 fois
   - CAS_PRATIQUE : saisir un texte (≥30 caractères pour ne pas tomber sur score=30 mock)
6. Cliquer **Soumettre le test**

**Attendu :** page Done avec :
- Anneau de score (ScoreRing) animé avec un chiffre entre 0 et 100
- 3 mini-stats (QCM X/Y · Code X/Y · Cas X/Y), couleurs vert/orange/rouge selon le ratio
- Encart « Et après ? » mentionnant le compte rendu IA en cours
- Mention RGPD

#### 15.7 🏠 Vérification en base des scores
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge -c "
  SELECT q.type, a.score, a.qcm_selected_index, a.last_tests_passed, a.last_tests_total,
         LEFT(a.grading_explanation, 80) AS explanation
  FROM answers a
  JOIN questions q ON q.id = a.question_id
  JOIN passations p ON p.id = a.passation_id
  WHERE p.id = (SELECT id FROM passations ORDER BY submitted_at DESC LIMIT 1)
  ORDER BY q.type;"
```
**Attendu :**
- QCM : `score` = 100.00 si bonne réponse, 0.00 sinon ; `qcm_selected_index` rempli ; explanation type « Bonne réponse » ou « Mauvaise réponse… »
- CODE : `score` ≈ ratio testsPassed/testsTotal × 100 ; `last_tests_*` remplis ; explanation type « X / Y tests cachés réussis »
- CAS_PRATIQUE : `score` entre 0 et 100 ; explanation = verdict LLM (1-2 phrases) OU « Évaluation IA indisponible » si le LLM a échoué

#### 15.8 🏠 Vérification du score global pondéré
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge -c "
  SELECT global_score, submitted_at FROM passations ORDER BY submitted_at DESC LIMIT 1;"
```
**Attendu :** `global_score` non-null, entre 0 et 100, cohérent avec la moyenne pondérée 30% QCM + 50% CODE + 20% CAS.

### Vue résultats recruteur (Tâche 2)

#### 15.9 🏠 Onglet « Résultats » dans la nav top
Revenir sur l'app recruteur et regarder la pill nav top.
**Attendu :** 4e onglet **« Résultats »** présent et cliquable.

#### 15.10 🏠 Page liste des passations
Cliquer **Résultats**.
**Attendu :**
- Titre « Performances des candidats »
- Compteur « N terminée(s) · M en cours »
- La passation que vous venez de soumettre apparaît en tête de liste avec :
  - Avatar coloré avec initiales du candidat
  - Nom + email
  - Badge **Soumis** (vert)
  - Profil + date + email visibles
  - **ScoreRing** à droite (anneau coloré selon le score)
  - Chevron à droite
- Au survol : translation légère + ombre renforcée

#### 15.11 🏠 État vide
Pour tester l'empty state, supprimer toutes les passations en base (ou faire un compte recruteur frais).
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge -c "DELETE FROM passations;"
```
**Attendu :** page liste affiche une grosse icône Inbox + texte « Aucune passation enregistrée » + lien vers `/app/review`.
(Pensez à re-créer une passation pour les tests suivants !)

#### 15.12 🏠 Page détail d'une passation
Cliquer sur la carte du candidat dans la liste.
**Attendu :**
- URL `/app/results/{passationId}`
- Lien « ← Retour aux résultats » en haut
- **Card hero** avec :
  - Avatar coloré + nom + email + profil + date soumission
  - Badges (Soumis, et si applicable Risque fraude)
  - **3 StatChips** : QCM N/M, Code N/M, Cas N/M (couleurs selon ratio)
  - **ScoreRing géant** à droite (150 px)
- Section **Compte rendu IA** (voir tests 15.14+)
- Liste des questions cliquables

#### 15.13 🏠 Dépliage des questions
Cliquer sur le numéro / l'énoncé d'une question pour la déplier.
**Attendu selon le type :**
- **QCM** : liste des options avec :
  - Bonne réponse encadrée en **vert** + badge « Bonne réponse »
  - Réponse du candidat marquée (badge « Réponse candidat » + couleur vert si correcte / rouge si incorrecte)
  - Explication tirée du payload
- **CODE** : badge langage + badge « X/Y tests » + **Monaco read-only** avec le code soumis par le candidat + `<details>` repliable « Sortie sandbox » (stdout/stderr de la dernière exécution) + `<details>` « Tests cachés utilisés »
- **CAS_PRATIQUE** : bloc scenario + bloc « Réponse du candidat » (texte) + **encart accent « Verdict IA »** avec l'évaluation + liste des points attendus

### Compte rendu IA + Export PDF (Tâche 3)

#### 15.14 🏠 Génération automatique à la soumission
Après une nouvelle passation soumise (test 15.6), vérifier dans les logs backend :
```bash
grep "Report: genere" /tmp/sf-back.log | tail -3
```
**Attendu :** ligne du type :
```
Report: genere pour passation {uuid} en {ms} ms (provider=github, tokens=...)
```

Vérifier en base :
```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge -c "
  SELECT recommendation, LENGTH(summary), llm_provider, tokens_used, cost_eur
  FROM reports ORDER BY generated_at DESC LIMIT 1;"
```
**Attendu :** une ligne avec `recommendation` parmi HIRE/INTERVIEW/REJECT, `summary` ≥ 50 caractères, `llm_provider` = `github` ou `mock`, `tokens_used` > 0 (si vrai LLM).

#### 15.15 🏠 Affichage du compte rendu sur la page détail
Sur `/app/results/{id}`, sous la card hero.
**Attendu :**
- Card **Compte rendu IA** avec :
  - **Bandeau verdict coloré** en haut (vert HIRE / orange INTERVIEW / rouge REJECT) avec icône (Check/HelpCircle/X)
  - Label de la recommandation lisible « À embaucher / À approfondir en entretien / À écarter »
  - Boutons **Régénérer** (ghost) + **Exporter PDF** (CTA noir) à droite
  - **Résumé exécutif** (2-3 phrases)
  - 2 colonnes côte à côte :
    - « Points forts » avec icône TrendingUp verte + liste de bullets dans des mini-cards vertes
    - « Points faibles » avec icône TrendingDown rouge + liste dans des mini-cards rouges
  - Footer meta : « Généré le {date} · par {provider}/{model} · {N} tokens »

#### 15.16 🏠 Régénération du rapport
Cliquer **Régénérer**.
**Attendu :** spinner sur le bouton ; après ~3-5 s le contenu se rafraîchit avec un nouveau résumé / nouvelles bullets (le LLM est non-déterministe donc le verdict peut changer). Date « Généré le » mise à jour.

#### 15.17 🏠 Export PDF
Cliquer **Exporter PDF**.
**Attendu :**
- Un fichier `skillforge-rapport-{slug-candidat}-{YYYY-MM-DD}.pdf` se télécharge
- Le PDF contient 1-2 pages A4 avec :
  - En-tête « SkillForge » à gauche + « Compte rendu d'évaluation technique » à droite
  - Identité candidat (nom, email, profil, date passation)
  - **Bloc gris** « SCORE GLOBAL » avec score en gros + 3 mini-stats à droite (QCM/Code/Cas)
  - **Bandeau coloré** (couleur du verdict) avec « VERDICT : À EMBAUCHER » (ou autre)
  - Section « Résumé exécutif »
  - Section « Points forts » (puces noires)
  - Section « Points faibles » (puces noires)
  - Footer en bas de chaque page : « Généré par {provider}/{model} le {date} · SkillForge POC M2 MBDS · {N/M} »

#### 15.18 🏠 Robustesse : LLM down
Pour simuler une panne LLM, modifier temporairement `.env` :
```bash
# Mettre un GITHUB_TOKEN invalide
sed -i 's/^GITHUB_TOKEN=.*/GITHUB_TOKEN=ghp_invalid/' apps/backend-app/.env
# Redémarrer le backend
```

Refaire une passation bout-en-bout (test 15.6).
**Attendu :**
- La passation se finalise quand même (page Done avec score affiché)
- Logs backend : `WARN Generation du compte rendu IA en echec pour passation ...`
- Sur `/app/results/{id}` : la section Compte rendu affiche un encart amber « Compte rendu IA indisponible » avec un bouton **Générer le compte rendu** manuel
- Restaurer le vrai token + cliquer Générer manuellement → le rapport se génère

#### 15.19 🏠 Page candidat — encart « Et après ? »
Après une soumission, sur `/candidate/passation/{token}/done`.
**Attendu :** sous la card score, un nouvel encart avec icône Sparkles, label « Et après ? » et texte mentionnant la synthèse IA en cours. Le candidat ne voit JAMAIS le contenu du rapport (anti-biais RH).

### Checklist récapitulative Sprint 6

| # | Test | Statut |
|---|------|--------|
| 15.1 | Bouton « Envoyer l'invitation » visible | 🏠 |
| 15.2 | Modal d'invitation — état initial | 🏠 |
| 15.3 | Génération du lien | 🏠 |
| 15.4 | Copie du lien | 🏠 |
| 15.5 | Vérification invitation en base | 🏠 |
| 15.6 | Pipeline complet bout-en-bout | 🏠 |
| 15.7 | Scores stockés par type en base | 🏠 |
| 15.8 | Score global pondéré | 🏠 |
| 15.9 | Onglet « Résultats » présent | 🏠 |
| 15.10 | Liste des passations | 🏠 |
| 15.11 | Empty state | 🏠 |
| 15.12 | Page détail (hero + ScoreRing) | 🏠 |
| 15.13 | Dépliage questions (QCM/CODE/CAS) | 🏠 |
| 15.14 | Génération auto du rapport | 🏠 |
| 15.15 | Affichage du rapport | 🏠 |
| 15.16 | Régénération du rapport | 🏠 |
| 15.17 | Export PDF | 🏠 |
| 15.18 | Robustesse LLM down | 🏠 |
| 15.19 | Encart « Et après ? » côté candidat | 🏠 |

**À cocher en ✅ au fur et à mesure que vous validez chaque test.**
