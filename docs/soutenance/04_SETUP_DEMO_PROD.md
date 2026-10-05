# Setup de la demo production pour la video soutenance

Ce guide prepare l environnement a 100% pour enregistrer la video de demo
en utilisant la vraie prod (Vercel + Render + Supabase) avec en plus le
mail d invitation qui arrive dans ta boite et la sandbox d execution de
code qui fonctionne.

Deux parties independantes :

1. **SMTP Gmail** — pour que le mail d invitation candidat arrive vraiment
2. **Sandbox via ngrok** — pour que le candidat puisse executer du code

Tu peux faire les deux ou juste une, selon ce que tu veux montrer.

---

## 0. URLs et identifiants

### URLs de la plateforme en production

| Service | URL |
|---|---|
| Frontend (recruteur + candidat) | https://skillforge-platform-pi.vercel.app |
| Page de login recruteur | https://skillforge-platform-pi.vercel.app/login |
| API backend | https://skillforge-api-xde0.onrender.com |
| API health check | https://skillforge-api-xde0.onrender.com/actuator/health |
| Swagger UI (API interactive) | https://skillforge-api-xde0.onrender.com/swagger-ui/index.html |

### Compte recruteur de demo

| Champ | Valeur |
|---|---|
| Email | `recruteur@skillforge.app` |
| Mot de passe | `SkillForgeFitia2026!` |
| Role | RECRUTEUR |
| Cree le | 2026-10-05 |

Ce compte sert pour toute la demo du cote recruteur (upload CV, generation
de questions, invitation candidat, consultation des resultats). Il est deja
cree en production, pas besoin de refaire register.

### Candidat

Le candidat est cree a la volee pendant la demo via l invitation : son
email est saisi par le recruteur dans l interface d invitation, puis le
candidat recoit son lien unique par mail et saisit son nom + code d acces
au demarrage. Pas de compte prealable requis.

Pour la demo, utiliser une 2e adresse mail a toi (ex: compte Gmail perso
different de celui du SMTP) pour recevoir l invitation et jouer le candidat.

---

## 1. Brancher Gmail comme serveur SMTP

### 1.1. Prerequis cote Google

Il faut un **App Password** Google (pas ton mot de passe habituel). Pour
cela, l authentification a 2 facteurs doit etre activee sur ton compte.

Verifier et activer la 2FA si besoin :
https://myaccount.google.com/security

### 1.2. Creer un App Password

1. Va sur https://myaccount.google.com/apppasswords
   (si la page dit "Les mots de passe d application ne sont pas
   disponibles", c est que la 2FA n est pas activee -> l activer d abord)
2. Dans **Nom de l application** : tape `SkillForge SMTP`
3. Clique **Creer**
4. Google affiche un mot de passe de 16 caracteres sans espaces, du type
   `abcd efgh ijkl mnop` -> **copie-le immediatement** (ne sera plus
   affiche apres)
5. Garde-le de cote, on va le mettre dans Render dans un instant

### 1.3. Mettre a jour les variables d env dans Render

Sur https://dashboard.render.com -> service `skillforge-api` ->
**Environment** :

**Modifier** la variable existante :

| Variable | Nouvelle valeur |
|---|---|
| `MAIL_ENABLED` | `true` |

**Ajouter** 7 nouvelles variables :

| Variable | Valeur |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | *(ton adresse Gmail, ex : fitia.gershom@gmail.com)* |
| `SMTP_PASSWORD` | *(le App Password Google de 16 caracteres sans espaces)* |
| `SMTP_AUTH` | `true` |
| `SMTP_STARTTLS` | `true` |
| `MAIL_FROM` | *(ton adresse Gmail, meme que SMTP_USERNAME)* |
| `MAIL_FROM_NAME` | `SkillForge - Tsarajoro` |

Clique **Save, rebuild and deploy** -> Render redemarre tout seul
(~1-2 min, pas de rebuild Docker car ce ne sont que des variables).

### 1.4. Verification

Apres redemarrage, teste l envoi en invitant un candidat depuis le
frontend. Le mail doit arriver dans ta boite Gmail (regarde aussi dans
Spam la premiere fois, Gmail peut flagger).

Si tu vois une erreur `Authentication failed`, verifie :
- Que le App Password est bien le 16 caracteres **sans espaces**
- Que la 2FA est bien activee
- Que SMTP_USERNAME est bien ton adresse Gmail complete (pas juste le
  nom avant le @)

---

## 2. Exposer la sandbox via ngrok (pour l execution de code candidat)

La sandbox tourne en local sur ta machine (Docker-in-Docker interdit
sur Render Free). ngrok cree un tunnel public qui redirige vers ton
port local 8091. Render peut alors appeler la sandbox a travers ce
tunnel.

### 2.1. Prerequis

- **Docker** installe et demarre : `docker --version`
- **Java 21** installe : `java --version`
- **Maven** installe : `mvn --version`
- **ngrok** installe (voir 2.2)

### 2.2. Installer ngrok

Via snap sur Arch/Ubuntu :

```bash
sudo snap install ngrok
```

Ou via le binaire officiel :

1. Va sur https://ngrok.com et cree un compte gratuit
2. Dans le dashboard ngrok, copie ton **authtoken**
3. Dans ton terminal :

```bash
ngrok config add-authtoken TON_TOKEN_NGROK
```

### 2.3. Pre-pull des images Docker runners

La sandbox utilise des images Docker pour executer le code candidat
dans un conteneur isole. Il faut les pre-puller une seule fois :

```bash
cd /home/tsarajoro/Documents/st/skillforge-platform
docker build -t skillforge-runner-node:latest -f infra/sandbox/node20/Dockerfile infra/sandbox/node20/
docker build -t skillforge-runner-php:latest -f infra/sandbox/php8.3/Dockerfile infra/sandbox/php8.3/
```

Verifie :

```bash
docker images | grep skillforge-runner
```

Tu dois voir les 2 images.

### 2.4. Demarrer la sandbox Spring Boot

**Terminal 1** — lance la sandbox :

```bash
cd /home/tsarajoro/Documents/st/skillforge-platform/apps/backend-sandbox
mvn spring-boot:run
```

Attends le message `Started SandboxApplication in X seconds`. La sandbox
ecoute maintenant sur `http://localhost:8091`.

Test rapide dans un autre terminal :

```bash
curl http://localhost:8091/actuator/health
```

Doit renvoyer `{"status":"UP"}`.

### 2.5. Demarrer ngrok

**Terminal 2** — lance ngrok sur le port 8091 :

```bash
ngrok http 8091
```

ngrok affiche une interface avec une URL publique :

```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:8091
```

**Copie cette URL HTTPS** (ex: `https://abc123.ngrok-free.app`).

### 2.6. Mettre a jour SANDBOX_URL dans Render

Sur Render -> `skillforge-api` -> **Environment** :

**Modifier** la variable existante :

| Variable | Nouvelle valeur |
|---|---|
| `SANDBOX_URL` | *(l URL HTTPS ngrok, ex: `https://abc123.ngrok-free.app`)* |

Clique **Save** -> Render redemarre (~1-2 min).

### 2.7. Test de bout en bout

1. Garde les 2 terminaux ouverts (sandbox + ngrok)
2. Dans le frontend Vercel, deroule le parcours candidat jusqu a un
   exercice de code
3. Soumets du code, clique "Executer"
4. La requete passe par : Vercel -> Render -> ngrok -> ta sandbox locale
   -> Docker runner -> resultat renvoye en sens inverse

Dans le terminal ngrok, tu verras les requetes passer en direct (interface
tres pratique pour montrer au jury que les requetes arrivent vraiment).

### 2.8. Important pour la video

- L URL ngrok **change a chaque redemarrage** de ngrok (sauf si tu as un
  compte Pro). Donc : lance ngrok juste avant d enregistrer la video, et
  mets a jour SANDBOX_URL dans Render **juste a ce moment-la**.
- Le free tier ngrok a une limite de 40 requetes/minute, largement
  suffisante pour une demo.
- Ne pas eteindre les terminaux pendant l enregistrement : si tu Ctrl+C
  sur ngrok ou sur la sandbox, le flux candidat casse.

---

## 3. Scenario de demo pour la video

### 3.1. Preparation avant d appuyer sur REC

- Les 2 terminaux (sandbox + ngrok) sont lances
- SANDBOX_URL dans Render pointe sur l URL ngrok actuelle
- MAIL_ENABLED=true dans Render
- Tu as un vrai CV PDF sous la main (du candidat demo de
  `00_CV_CANDIDAT_DEMO.md`)
- Tu es logout du frontend (clique Deconnexion ou efface localStorage
  dans la console navigateur)
- Tu as 2 fenetres navigateur ouvertes : une pour le recruteur, une
  autre (navigation privee idealement) pour le candidat

### 3.2. Scenario (5-6 min au total)

#### Partie recruteur (3 min)

1. Ouvre https://skillforge-platform-pi.vercel.app
   dans la fenetre recruteur
2. Login : `recruteur@skillforge.app` / `SkillForgeFitia2026!`
3. Dashboard : montre les KPIs (meme si vides, ca prouve que ca marche)
4. Clique "Nouveau test"
5. Upload du CV PDF du candidat demo
6. Attends l extraction IA (OpenAI gpt-4o-mini, 5-15 s)
7. Montre les competences extraites
8. Choisis un profil (Developpeur Web par exemple)
9. Genere les questions (IA, 10-20 s)
10. Valide ou ajuste 1-2 questions dans la banque de questions
11. Compose le test (nom, duree, selection des questions)
12. Invite le candidat (son email)
13. Verifie que le mail arrive dans Gmail (ouvre un onglet gmail, montre
    le mail recu avec le lien et le code d acces)

#### Partie candidat (2 min)

14. Bascule sur la fenetre privee candidat
15. Clique sur le lien dans le mail -> arrive sur la page d invitation
16. Saisit nom + email + code d acces
17. Demarre la passation
18. Repond a 1-2 QCM
19. Ecris du code pour un exercice -> clique Executer
20. Montre le resultat de la sandbox (temps d execution, tests passes,
    stdout)
21. Soumets la passation

#### Retour recruteur (1 min)

22. Rebascule sur la fenetre recruteur
23. Va dans Resultats
24. Clique sur la passation du candidat
25. Montre le rapport IA genere (synthese, forces, faiblesses,
    recommandation Hire/Interview/Reject)
26. Montre l analytics (dashboard rempli maintenant)

### 3.3. Montage video

Si tu enregistres plusieurs prises :
- Garde l audio continu pour que la narration soit fluide
- Coupe les temps morts (attente IA, attente mail Gmail)
- Garde les 2-3 secondes d UI quand la reponse arrive, c est satisfaisant
  a regarder pour le jury

---

## 4. Checklist express avant REC

- [ ] 2FA active sur Gmail
- [ ] App Password cree et sauvegarde
- [ ] 8 variables SMTP ajoutees dans Render + MAIL_ENABLED=true
- [ ] Images Docker runners buildees (`docker images | grep skillforge-runner`)
- [ ] Sandbox lancee (`mvn spring-boot:run`) sur :8091
- [ ] ngrok lance sur :8091 et URL copiee
- [ ] SANDBOX_URL mise a jour dans Render avec l URL ngrok
- [ ] Logout du frontend (localStorage.clear() dans la console)
- [ ] CV PDF du candidat demo sous la main
- [ ] Gmail ouvert dans un onglet pour verifier le mail entrant
- [ ] 2 fenetres navigateur (recruteur + candidat prive)
- [ ] Logiciel de capture video pret (OBS, SimpleScreenRecorder, Kazam...)

Bonne chance pour la demo.
