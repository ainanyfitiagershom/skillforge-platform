# Recette guidée — UX-01 (code d'accès) + BUG-01 (mock CAS)

Fiche pas-à-pas pour vérifier les 3 correctifs livrés le 2026-08-11.

**Ce qu'on teste :**
1. **BUG-01** — le mock LLM ne compte plus les cas pratiques comme réussis avec une réponse bidon.
2. **UX-01 v1** — l'identité du candidat est verrouillée depuis l'invitation.
3. **UX-01 v2** — code d'accès à 6 chiffres reçu par email + vérifié au démarrage.

---

## Prérequis avant de démarrer

### 1. Services à lancer

```bash
cd /home/tsarajoro/Documents/st/skillforge-platform

# Postgres + Mailpit
docker compose -f infra/docker-compose.yml up -d

# Backend (auth active, PAS audit-mode)
cd apps/backend-app
mvn -o -q -DskipTests spring-boot:run &

# Frontend
cd ../frontend-web
pnpm dev &
```

### 2. Vérifier que tout est UP

| Service | URL | Ce qui doit s'afficher |
|---|---|---|
| Frontend | http://localhost:5173 | Landing SkillForge |
| Backend health | http://localhost:8090/actuator/health | `{"status":"UP"}` |
| Mailpit (inbox) | http://localhost:8026 | Interface web Mailpit (0 mail au départ) |

### 3. Provider LLM actif

Dans `apps/backend-app/.env`, vérifier :
```
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
```
Sinon les CV vont retourner `UNKNOWN` partout et les questions générées seront moisies.

### 4. Compte recruteur

Créer un compte recruteur (une fois pour toutes) via l'UI ou :
```bash
curl -X POST http://localhost:8090/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"recruteur@test.local","password":"RecruteurTest2026!","role":"RECRUTEUR"}'
```

---

## Scénario A — Flow nominal (le "happy path")

### A.1 — Recruteur uploade un CV et génère un test

1. Se connecter : http://localhost:5173/login → `recruteur@test.local` / `RecruteurTest2026!`
2. Aller sur **Nouveau test** (menu latéral)
3. Uploader un CV **avec un email candidat réel** (ex : `fitia-test@example.com`) et un nom (ex : `Fitia Gershom`)
4. Choisir un profil (ex : Développeur PHP)
5. Attendre l'analyse Groq (~5-10s)
6. ✅ Vérifier que les **compétences détectées ont des niveaux JUNIOR/CONFIRME/SENIOR** (pas tout `UNKNOWN` — sinon LLM_PROVIDER=mock encore actif, redémarrer backend)
7. Cliquer **Générer le test** (10-15 questions)

### A.2 — Recruteur valide et envoie l'invitation

1. Aller sur **Review** (`/app/review`)
2. Trouver la carte du candidat → cliquer **"Valider et envoyer"**
3. **Vérifications dans la modale d'invitation** :
   - 🟢 Bandeau vert **"Email envoyé à fitia-test@example.com"** avec icône enveloppe
   - 🔵 Bloc **"Code d'accès candidat"** — grand rectangle bleu avec **6 chiffres en gros** (ex : `487302`), bouton **"Copier"**
   - Lien du candidat en dessous
4. **Noter le code affiché** pour comparer avec l'email

### A.3 — Vérifier l'email dans Mailpit

1. Ouvrir http://localhost:8026 dans un onglet
2. ✅ Un nouvel email doit apparaître automatiquement (`inbox` en temps réel)
3. Cliquer dessus, dans l'onglet **HTML** vérifier :
   - Objet : **"Votre test technique SkillForge — Développeur PHP"** (ou ton profil)
   - Salutation personnalisée (`Bonjour Fitia Gershom,`)
   - **Grand bloc bleu** avec le **même code à 6 chiffres** qu'à l'étape A.2 (avec espaces entre les chiffres pour lisibilité)
   - Bouton bleu **"Démarrer mon test"**
   - Lien de secours en bas
   - Mention "Ne partagez jamais votre code d'accès"

### A.4 — Candidat démarre la passation

1. Ouvrir un **navigateur privé** (Chrome/Firefox → Ctrl+Shift+N/P) — indispensable, sinon session recruteur va interférer
2. Cliquer le **bouton "Démarrer mon test"** dans l'email Mailpit (s'ouvre dans la nouvelle fenêtre privée)
3. **Vérifications de la page d'accueil candidat** :
   - 🟢 Bloc vert **"Identité vérifiée par le recruteur"** avec icône cadenas
   - Nom : Fitia Gershom (ou ce que t'as saisi)
   - Email : fitia-test@example.com (en fonte monospace)
   - Petit texte : "Ces informations proviennent de votre invitation…"
   - 🔵 **Nouveau champ "Code d'accès (reçu par email)"** — input grand format, monospace, chiffres espacés
   - Bloc bleu ciel "Analyse anti-fraude" avec checkbox
4. Saisir le code d'accès **à 6 chiffres** de l'email
5. Cocher le consentement anti-fraude
6. Cliquer **Démarrer**
7. ✅ Attendu : redirection sur `/run` avec la première question

---

## Scénario B — Cas d'erreur (le "sad path")

### B.1 — Code d'accès faux

1. Depuis l'étape A.4, refaire l'invitation (nouveau lien) pour avoir un code frais
2. Sur la page d'accueil candidat, saisir un **code faux** : `000000`
3. Cocher consentement + Démarrer
4. ✅ Attendu : message d'erreur **"Code d acces invalide"** (403)
5. Vérifier qu'aucune passation n'a été créée (rester sur la page welcome)

### B.1-bis — Rate limiting brute force (fix C4)

Objectif : vérifier qu'après 5 tentatives ratées, l'invitation se **verrouille 15 min** pour bloquer un brute force sur les 1M codes possibles.

1. Créer une invitation fraîche (via `/app/review` → "Valider et envoyer")
2. Sur la page candidat, essayer **5 codes faux d'affilée** (`000001`, `000002`, `000003`, `000004`, `000005`)
   - Chaque fois : erreur `"Code d acces invalide."` (403)
3. Tenter une **6e fois** avec un code faux :
   - ✅ Attendu : erreur **"Trop de tentatives. Reessayez dans 15 minutes."** (403)
4. Tenter avec le **BON code** (celui du mail) :
   - ✅ Attendu : **encore rejeté** avec le même message de lock
5. Documente que l'invitation est bloquée pour 15 min (test à faire une seule fois, pas la peine d'attendre 15 min pour re-tester)

### B.2 — Code vide

1. Sur la même page, laisser le champ code **vide**
2. Cocher consentement + Démarrer
3. ✅ Attendu : le navigateur bloque (validation HTML `required + pattern=[0-9]{6}`)

### B.3 — Code < 6 chiffres

1. Saisir `123` (3 chiffres)
2. ✅ Attendu : le navigateur bloque (message natif "Correspondez au format demandé")

### B.4 — Caractères non-numériques

1. Essayer de taper des lettres dans le champ code
2. ✅ Attendu : les lettres sont **automatiquement filtrées**, seuls les chiffres apparaissent

### B.5 — Bon code, bon flow → passation démarre

1. Revenir sur la page welcome (créer nouvelle invitation si celle du B.1-bis a été verrouillée)
2. Saisir le **bon code** (celui du mail)
3. Consentement + Démarrer
4. ✅ Attendu : redirection sur `/run`

### B.6 — Lien inconnu ou expiré (fix C1)

Objectif : vérifier qu'un token inconnu ou expiré renvoie **410 Gone uniforme** (pas 400/404/500) pour éviter qu'un attaquant puisse énumérer les tokens valides par différence de code HTTP.

Ouvrir dans navigation privée :
1. **Token inconnu** : http://localhost:5173/candidate/passation/fakeToken1234567890
   - ✅ Attendu : page d'erreur "Lien expiré, déjà utilisé ou inconnu."
2. **Token expiré** : impossible à créer manuellement rapidement, mais un lien vieux de plus de 24h donnera la même erreur

---

## Scénario C — Test BUG-01 (mock CAS)

⚠️ **Ce test suppose que tu es en `LLM_PROVIDER=mock`**. Avec Groq (LLM réel), le comportement sera différent (les CAS seront vraiment évalués sémantiquement). Si tu veux tester **spécifiquement le mock**, mettre temporairement `LLM_PROVIDER=mock` dans `.env` et redémarrer backend.

### C.1 — Passer un test avec réponses "n'importe quoi" sur les CAS

Depuis la page `/run` (issue du scénario A.4 ou B.5) :

1. **QCM** : cliquer n'importe quelle option (peu importe)
2. **CODE** : soit ne rien faire, soit coller un code qui plante
3. **CAS_PRATIQUE** : écrire une phrase incohérente (ex : *"blabla azertyuiop, je ne sais pas répondre, texte long pour tester le mock qui note à la longueur, lorem ipsum dolor sit amet consectetur adipiscing elit."*)
4. Soumettre le test

### C.2 — Vérifier la page finale `/done`

Sur la page "Merci d'avoir passé le test" :

**En mode mock :**
- ✅ Label **"Cas (simulé)"** au lieu de "Cas"
- ✅ Score **0/2** ou **0/N** (au lieu de 2/2 avant le fix) parce que le mock plafonne à 40/100 < seuil 60
- ✅ **Bannière ambre** ⚠ sous la grille de scores : *"L'évaluation des cas pratiques a été faite en mode démo (aucune analyse sémantique). Le score indicatif ci-dessus n'est pas fiable ; le recruteur ajustera manuellement."*

**En mode Groq (LLM réel) :**
- Le label est juste "Cas" (pas de mention "simulé")
- Le score reflète la vraie qualité de la réponse (une réponse bidon devrait donner 0-30/100)
- Pas de bannière ambre

---

## Scénario D — Vérifications techniques (bonus)

### D.1 — Endpoint public ne fuite pas le code

```bash
# Récupérer un token d'invitation depuis la base
TOKEN=$(docker exec skillforge-postgres psql -U skillforge -d skillforge -tA \
  -c "SELECT token FROM invitations WHERE access_code IS NOT NULL ORDER BY expires_at DESC LIMIT 1;")

curl -s http://localhost:8090/invitations/$TOKEN | python3 -m json.tool
```

- ✅ Attendu : `requiresAccessCode: true`
- ✅ Attendu : **PAS** de champ `accessCode` dans la réponse

### D.2 — Endpoint privé (recruteur) expose bien le code

Le recruteur voit le code dans la modale (déjà vérifié en A.2). Ça correspond au JSON renvoyé par `POST /tests/{id}/invite` qui contient `accessCode`.

### D.3 — F5 pendant la passation

1. Depuis `/run`, répondre à 2 questions puis F5 (recharger)
2. ✅ Attendu : rester sur la question courante, réponses déjà données conservées, chrono à sa valeur (pas 00:00)

### D.4 — Rétro-compat invitations pré-V6 (fix C5)

La migration V7 backfill toutes les invitations legacy avec un code aléatoire, puis force `access_code NOT NULL`. Vérification :

```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge \
  -c "SELECT COUNT(*) AS legacy_sans_code FROM invitations WHERE access_code IS NULL;"
```
- ✅ Attendu : `0` (toutes ont un code après V7)

Les invitations legacy sont désormais **inutilisables** (leur code n'a jamais été envoyé par email → personne ne le connaît). C'est voulu : force la création d'une nouvelle invitation pour recette. Pour utiliser une ancienne invitation, lire le code directement en base :

```bash
docker exec skillforge-postgres psql -U skillforge -d skillforge \
  -c "SELECT token, access_code FROM invitations ORDER BY expires_at DESC LIMIT 3;"
```

### D.5 — Double-clic sur "Démarrer" (fix C3)

Objectif : vérifier qu'un double-clic rapide ou une double soumission ne renvoie pas 500 stacktrace.

1. Sur page candidat, remplir le code, cocher consentement
2. Cliquer **très vite 2-3 fois** sur "Démarrer" (ou ouvrir DevTools → Network → laisser tomber la première requête et re-cliquer)
3. ✅ Attendu : au pire une erreur **409 Conflict** ("Ressource deja existante ou en conflit."), jamais 500 avec stacktrace
4. Vérifier en base qu'il n'y a **qu'une seule passation** créée pour cette invitation :
   ```bash
   docker exec skillforge-postgres psql -U skillforge -d skillforge \
     -c "SELECT invitation_id, COUNT(*) FROM passations GROUP BY invitation_id HAVING COUNT(*) > 1;"
   ```
   → doit renvoyer 0 ligne (aucune duplication)

---

## Format de remontée de bugs

Si tu trouves un problème pendant la recette, ajoute-le à la fin de `docs/04-tests/fiche-tests-manuels.md` sous une nouvelle section :

```markdown
## Bugs remontés le YYYY-MM-DD (recette UX-01 + BUG-01)

### [BUG-XX] Titre court
- **Scénario** : A.3 / B.1 / etc.
- **Où** : URL exacte + composant
- **Étapes reproductibles** :
  1. …
  2. …
- **Attendu** : …
- **Observé** : …
- **Console navigateur (F12)** :
  ```
  (coller erreur JS si présente)
  ```
- **Logs backend** (`/tmp/claude-*/scratchpad/backend.log`) :
  ```
  (coller stack si erreur 500)
  ```
- **Gravité** : Bloquant / Majeur / Mineur / Cosmétique
```

---

## Checklist finale (à cocher en fin de recette)

**Flow nominal :**
- [ ] A.1 — CV uploadé, compétences détectées avec niveaux JUNIOR/CONFIRME/SENIOR
- [ ] A.2 — Modale invitation montre code d'accès (bloc bleu) + bandeau email envoyé
- [ ] A.3 — Mail dans Mailpit contient le bon code à 6 chiffres (même que la modale)
- [ ] A.4 — Page candidat : identité verrouillée + champ code d'accès + démarrage OK

**Cas d'erreur & sécurité :**
- [ ] B.1 — Mauvais code → 403 "Code d acces invalide"
- [ ] B.1-bis — **Rate limiting** : 5 échecs → 403 "Trop de tentatives" + lock 15 min
- [ ] B.2/B.3/B.4 — Validations HTML (vide, <6 chiffres, non-numérique) fonctionnent
- [ ] B.6 — Token inconnu → 410 uniforme (pas 400/404)

**BUG-01 mock CAS :**
- [ ] C — CAS mock plafonne à 0/N + bannière ambre "Évaluation simulée"

**Vérifications techniques :**
- [ ] D.1 — Endpoint public `/invitations/{token}` ne renvoie **pas** `accessCode`
- [ ] D.3 — F5 pendant la passation conserve la question + les réponses
- [ ] D.4 — Migration V7 appliquée : `access_code NOT NULL`, 0 invitation sans code
- [ ] D.5 — Double-clic Démarrer → au pire 409, jamais 500 stacktrace + 0 duplication en base

Si toutes les cases sont cochées ✅ → on peut commit + push tout le lot en toute confiance.

---

## Note sur les fixes du code review (2026-08-11)

Le code d'accès a été livré en 2 vagues :
1. **Version 1** (matin) : token unique + verrouillage identité + code d'accès + email HTML
2. **Version 2** (après code review) : 6 fixes de robustesse
   - **C1** : 410 uniforme sur invitation inconnue/expirée/utilisée (anti-énumération)
   - **C2** : logs ne contiennent plus le token complet (juste 8 chars)
   - **C3** : double-clic → 409 Conflict au lieu de 500 stacktrace
   - **C4** : rate limiting 5 échecs → lock 15 min (anti-brute force)
   - **C5** : migration V7 backfill + `access_code NOT NULL` (plus de bypass silencieux)
   - **C6** : `MessageDigest.isEqual` constant-time (anti-timing attack théorique)

Les scénarios B.1-bis, B.6, D.4, D.5 testent spécifiquement ces fixes.
