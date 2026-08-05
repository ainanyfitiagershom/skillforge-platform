# Guide de recette manuelle SkillForge

Ce document explique comment dérouler la recette fonctionnelle de la plateforme et remonter les bugs proprement.

📋 **Fiche de tests à dérouler :** [fiche-tests-manuels.md](./fiche-tests-manuels.md)

---

## 1. Préparer l'environnement

### 1.1 Postgres

```bash
docker start skillforge-postgres
docker ps | grep skillforge-postgres    # doit être "Up (healthy)"
```

Si le conteneur n'existe pas (première installation) :

```bash
cd /home/tsarajoro/Documents/st/skillforge-platform
docker compose -f infra/docker-compose.yml up -d postgres
```

### 1.2 Backend Spring Boot (port 8090)

**Mode normal (auth active — c'est celui à utiliser pour la recette)** :

```bash
cd apps/backend-app
mvn -o -q -DskipTests spring-boot:run
```

⚠️ **Ne surtout PAS lancer avec `SKILLFORGE_SECURITY_AUDITMODE=true`** — ce mode est réservé à l'audit OWASP ZAP et **bypasse toute l'authentification**. Si tu testes en audit mode, tes tests ne reflèteront pas le comportement réel.

Vérifier que le backend répond :

```bash
curl http://localhost:8090/actuator/health
# doit renvoyer {"status":"UP"}
```

### 1.3 Frontend Vite (port 5173)

```bash
cd apps/frontend-web
pnpm dev
```

Puis ouvrir http://localhost:5173 dans un navigateur (Chrome ou Firefox de préférence, DevTools ouvert F12).

---

## 2. Comment tester

### 2.1 Compte de test à créer

Créer 2 comptes une fois pour toutes :

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@test.local` | `AdminTest2026!` |
| Recruteur | `recruteur@test.local` | `RecruteurTest2026!` |

Le rôle candidat n'a pas de compte : il accède via un lien d'invitation à usage unique généré par le recruteur.

### 2.2 Suivre la fiche de tests

Ouvrir [fiche-tests-manuels.md](./fiche-tests-manuels.md) et dérouler les scénarios dans l'ordre. Pour chaque scénario :

1. Suivre les étapes indiquées
2. Vérifier chaque résultat attendu
3. Cocher ✅ si OK
4. Ajouter un bug (voir §3) si KO

### 2.3 Zones à tester en priorité (récemment modifiées)

Ces zones ont eu des changements récents, à surveiller particulièrement :

- **Persistance passation candidat après F5** — sur `/candidate/passation/{token}/run`, faire F5 : la question courante et les réponses déjà données doivent être conservées.
- **Page `/app/review`** — refonte inbox intelligent :
  - Grille responsive : 1 colonne sur mobile, 2 en tablet, 3 sur grand écran
  - Bouton **« Valider et envoyer »** approuve toutes les questions PENDING d'un coup puis ouvre la modale d'invitation
  - Bouton **« Réviser le détail »** déplie la card
  - Menu **⋯** contextuel avec « Supprimer ce test »
- **Accents FR** — vérifier qu'il n'y a plus de mots sans accents visibles (`genere`, `difficulte`, `reviser`, `editer`…). Voir la règle dans `.claude/projects/-home-tsarajoro-Documents-st/memory/feedback_accents_ui.md`.
- **Headers de sécurité HTTP** — ouvrir DevTools → Network → cliquer une requête → onglet Headers → Response. Doivent apparaître :
  - `Content-Security-Policy: default-src 'self'; ...`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), ...`
- **Sandbox** — passer un test candidat avec du code PHP et du code JS : les tests doivent s'exécuter, le score doit s'afficher (le durcissement récent ne doit pas casser les cas légitimes).

---

## 3. Format de remontée des bugs

**Ajouter chaque bug dans `fiche-tests-manuels.md` sous une nouvelle section `## Bugs remontés le YYYY-MM-DD`** avec ce format :

```markdown
### [BUG-XX] Titre court et explicite

- **Où** : URL exacte, page, bouton concerné
- **Étapes** :
  1. …
  2. …
  3. …
- **Attendu** : ce qui devrait se passer
- **Observé** : ce qui se passe réellement
- **Gravité** : Bloquant / Majeur / Mineur / Cosmétique
- **Console navigateur** (si erreur JS, F12 → Console) : coller l'erreur
- **Logs backend** (si erreur 500, coller la ligne du terminal)
- **Capture écran** (optionnel mais aide énormément)
```

### Grille de gravité

| Gravité | Définition |
|---|---|
| **Bloquant** | Empêche complètement d'utiliser la fonctionnalité, aucun contournement possible |
| **Majeur** | Fonctionnalité utilisable mais résultat incorrect ou expérience très dégradée |
| **Mineur** | Défaut visible mais fonctionnalité utilisable (UX moyenne, erreur silencieuse) |
| **Cosmétique** | Défaut d'affichage sans impact fonctionnel (accent oublié, alignement, couleur…) |

### Exemple concret

```markdown
### [BUG-01] Le chronomètre ne persiste pas après reload sur /candidate/passation

- **Où** : http://localhost:5173/candidate/passation/f2d9626e57254c78ac8a5e070f3f5b33/run
- **Étapes** :
  1. Ouvrir un lien candidat, démarrer le test
  2. Répondre à 2 questions (avancer jusqu'à Q3)
  3. Le chrono affiche 02:15
  4. Appuyer sur F5
- **Attendu** : chrono continue à 02:15, on est toujours sur Q3
- **Observé** : chrono repart à 00:00 et retour à Q1
- **Gravité** : Majeur (le candidat perd son temps réel + progression)
- **Console** : rien
- **Backend** : `GET /candidate/passations/{id}/state → 404`
```

---

## 4. Après les tests

Quand la fiche est déroulée :

1. **Commit** ta version enrichie de `fiche-tests-manuels.md` (respecter les règles Git du projet : compte perso `ainanyfitiagershom`, zéro mention IA dans les commits).

   ```bash
   git add docs/04-tests/fiche-tests-manuels.md
   git commit -m "docs(tests): retours de recette manuelle du YYYY-MM-DD"
   git push https://ainanyfitiagershom:VOTRE_PAT@github.com/ainanyfitiagershom/skillforge-platform.git main
   ```

2. **Reprendre la session Claude** avec un message du genre :
   > « J'ai déroulé la recette manuelle et ajouté N bugs dans `docs/04-tests/fiche-tests-manuels.md`. On corrige par ordre de gravité (Bloquant d'abord). »

3. Les bugs seront traités par priorité, un à un, avec commit dédié par bug corrigé (traçabilité).

---

## 5. Astuces pratiques

- **Nettoyer entre 2 tests** : parfois utile de purger la base pour repartir clean.
  ```bash
  docker exec skillforge-postgres psql -U skillforge -d skillforge -c "TRUNCATE TABLE passations, invitations, tests, questions, candidates, cv_analyses CASCADE;"
  ```
  (⚠️ efface tout sauf les users → tes 2 comptes de test restent)

- **Voir les mails envoyés** : SkillForge n'envoie pas de vrais mails en dev — les liens d'invitation sont affichés dans l'UI recruteur après génération.

- **Erreur 401 / 403 inattendue** : ton JWT a peut-être expiré (durée 30 min). Se déconnecter et se reconnecter.

- **Devtools navigateur** : garde toujours l'onglet **Network** ouvert pour capturer les requêtes en échec, et **Console** pour les erreurs JS. Une capture d'écran de ces deux onglets vaut mille mots.

- **Redémarrer proprement** :
  ```bash
  # Tuer backend
  pkill -f "spring-boot:run"
  # Redémarrer
  cd apps/backend-app && mvn -o -q -DskipTests spring-boot:run
  ```
