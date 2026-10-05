# Demo video SkillForge — script final pret a filmer

Document de production pour la video de demo qui sera projetee pendant la
soutenance M2 MBDS. **Objectif : montrer en 5-6 minutes maximum tout le
parcours fonctionnel de SkillForge en production reelle, avec impact.**

## Pre-requis avant d'appuyer sur REC

### Setup technique (coche chaque case avant de filmer)

- [ ] Backend en prod sur Render : https://skillforge-api-xde0.onrender.com (verifier /actuator/health = UP)
- [ ] Frontend en prod sur Vercel : https://skillforge-platform-pi.vercel.app
- [ ] Compte recruteur de demo cree : `recruteur@skillforge.app` / `SkillForgeFitia2026!`
- [ ] Mail SMTP Resend configure et teste (RESEND_API_KEY dans Render, MAIL_PROVIDER=resend)
- [ ] Sandbox lancee en local (`mvn spring-boot:run` dans apps/backend-sandbox)
- [ ] Tunnel ngrok actif sur port 8091 : URL copiee dans Render (SANDBOX_URL=https://xxx.ngrok-free.app)
- [ ] Images Docker runners buildees (`docker images | grep skillforge-runner`)
- [ ] Yahoo Mail ouvert dans un onglet pour voir le mail d'invitation arriver

### Setup navigateur

- [ ] 2 fenetres navigateur ouvertes :
  - Fenetre A (plein ecran) = cote recruteur, deja logout (localStorage.clear() si besoin)
  - Fenetre B (plein ecran) = cote candidat, en navigation privee (ou autre profil)
- [ ] Taille de police navigateur a 110% pour que ca se voit bien a la video
- [ ] Barre de favoris masquee (ctrl+shift+B)
- [ ] Notifications desactivees (ne pas se faire interrompre par un message)

### Setup enregistrement

- [ ] Outil de capture ecran pret : OBS Studio (recommande) OU SimpleScreenRecorder
- [ ] Resolution 1920x1080, 30 fps
- [ ] Micro teste : parle a voix claire, pas trop proche du micro
- [ ] Son systeme desactive sauf si tu veux garder les sons du clic
- [ ] Dossier de sauvegarde : ~/Videos/skillforge-demo/
- [ ] Fichier CV PDF de demo pret sur le bureau : CV du candidat demo
      (voir docs/soutenance/00_CV_CANDIDAT_DEMO.md pour le profil)

---

## Structure de la video (5 min 30 cible)

| Section | Duree | Contenu |
|---|---|---|
| 1. Intro contextuelle | 20 s | Qui je suis, ce qu'on va voir |
| 2. Page d'accueil + login recruteur | 25 s | Landing page, se connecter |
| 3. Creation d'une evaluation (upload CV + IA) | 1 min 15 s | Upload CV, extraction competences, generation questions |
| 4. Validation des questions | 30 s | Revue des questions proposees par l'IA |
| 5. Composition du test et invitation candidat | 30 s | Nommer, parametrer, inviter |
| 6. Reception du mail et bascule candidat | 25 s | Mail Yahoo, clic lien, interface candidat |
| 7. Passation : QCM + code sandbox | 1 min 30 s | Repondre QCM, ecrire code, voir l'execution isolee |
| 8. Compte rendu IA + rapport recruteur | 25 s | Soumission, rapport genere, forces/faiblesses |
| 9. Conclusion + CTA | 10 s | Resume de ce qu'on vient de voir |

Total vise : **5 min 50 s**. Si tu depasses, coupe la section 4 (validation
questions) qui est moins impressionnante.

---

## Script detaille — voix off + action a l'ecran

Chaque bloc contient :
- **ACTION** : ce que tu fais a l'ecran
- **VOIX** : ce que tu dis (phrases exactes a reciter)
- **DUREE** : combien de temps dure ce bloc

### 1. Intro contextuelle (0:00 → 0:20)

**ACTION** : afficher plein ecran la page de garde du mémoire v3 (ou juste
un fond noir avec le logo SkillForge si tu preferes).

**VOIX** :
> « Bonjour, je m'appelle Ny Aina Fitia GERSHOM, etudiant en Master 2
> MBDS a l'Universite Cote d'Azur. Je vais vous presenter SkillForge, la
> plateforme d'evaluation technique des candidats assistee par LLM que
> j'ai developpee pendant mon stage chez Tsarajoro. Voici le parcours
> complet, de l'upload d'un CV jusqu'au rapport final transmis au
> recruteur. »

**DUREE** : 20 s

---

### 2. Page d'accueil + login recruteur (0:20 → 0:45)

**ACTION** :
- Ouvre https://skillforge-platform-pi.vercel.app (fenetre A, recruteur)
- Scrolle doucement sur la landing page pour montrer le pitch (3-4 s max)
- Clique sur le bouton "Se connecter" OU va directement sur /login
- Saisis l'email `recruteur@skillforge.app` et le mot de passe
- Clique "Se connecter"

**VOIX** :
> « SkillForge est accessible en production a cette adresse. La page
> d'accueil presente le pitch : une plateforme web qui aide les
> recruteurs techniques a evaluer un candidat en quelques minutes, avec
> une sandbox Docker durcie pour executer le code en toute securite. Je
> me connecte avec mon compte recruteur. »

**DUREE** : 25 s

---

### 3. Creation d'une evaluation : upload CV + IA (0:45 → 2:00)

**ACTION** :
- Tu arrives sur le dashboard recruteur, montre-le 2 s
- Clique sur "Nouveau test" dans le menu
- Clique sur "Analyser un CV"
- Depose le fichier PDF du CV demo (ou clique parcourir)
- **Attends 5 a 15 secondes** que l'IA (OpenAI gpt-4o-mini) analyse — zoome sur l'ecran de chargement si possible
- Les competences detectees s'affichent → fais une pause de 2 s pour laisser le temps de lire
- Choisis le profil "Developpeur PHP" (ou "Developpeur Web" selon ce qui matche le CV)
- Clique "Generer les questions"
- **Attends 10 a 20 secondes** que l'IA genere les questions

**VOIX** (pendant l'upload et l'extraction) :
> « Je cree un nouveau test en televersant le CV d'un candidat. Le backend
> envoie le texte extrait du PDF a un fournisseur LLM — OpenAI dans cet
> exemple — qui identifie les competences techniques declarees. L'important,
> c'est que ce resultat n'est pas une decision finale, c'est une
> proposition que je vais pouvoir ajuster. »

**VOIX** (quand les competences s'affichent) :
> « Voici les competences detectees : PHP, Laravel, MySQL, Git... Le
> recruteur garde la main pour corriger ou completer avant la generation
> des questions. »

**VOIX** (pendant la generation de questions) :
> « Maintenant je demande a l'IA de generer un test adapte au profil. Le
> backend construit un prompt structure, l'envoie au LLM, et recoit un
> ensemble de QCM, de cas pratiques et d'exercices de code. »

**DUREE** : 1 min 15 s

---

### 4. Validation des questions (2:00 → 2:30)

**ACTION** :
- Tu arrives sur la page des questions generees
- Scrolle pour montrer qu'il y a plusieurs questions (QCM + code)
- Clique sur une question CODE pour montrer qu'elle contient un starterCode
  (c'est important pour la demo : prouve que le fallback marche)
- Modifie legerement une question (change un mot de l'enonce) pour montrer
  qu'on peut ajuster
- Valide / approuve les questions

**VOIX** :
> « Chaque question est marquee "en attente de validation". Le recruteur
> peut la modifier, l'approuver ou la rejeter. C'est le principe
> fondamental de SkillForge : l'IA propose, l'humain decide. »

**DUREE** : 30 s

---

### 5. Composition du test et invitation candidat (2:30 → 3:00)

**ACTION** :
- Clique "Composer le test"
- Donne un nom au test (ex: "Test demo soutenance")
- Choisis une duree (ex: 30 minutes)
- Selectionne les questions a inclure
- Clique "Creer le test"
- Puis clique "Inviter un candidat"
- Saisis l'email du candidat : **fitiagershom@yahoo.com** (ou l'adresse
  que tu as prevue pour recevoir le mail)
- Clique "Envoyer l'invitation"

**VOIX** :
> « Je compose maintenant le test final en choisissant les questions a
> inclure et la duree. Puis j'invite le candidat par email. Le lien
> genere est unique et comporte un code d'acces personnel. »

**DUREE** : 30 s

---

### 6. Reception du mail et bascule candidat (3:00 → 3:25)

**ACTION** :
- **Bascule immediatement** sur l'onglet Yahoo Mail (ouvert avant la demo)
- Rafraichis la boite de reception
- Le mail d'invitation apparait (expediteur : SkillForge via Resend)
- Ouvre le mail → montre le visuel propre, le code d'acces en gros, le
  bouton "Demarrer le test"
- **Bascule sur la fenetre B** (navigateur candidat prive)
- Colle le lien du mail OU clique dessus directement

**VOIX** :
> « En quelques secondes, le candidat recoit son invitation. Le mail
> contient le code d'acces personnel et le lien vers la plateforme.
> Passons maintenant du cote candidat. »

**DUREE** : 25 s

---

### 7. Passation : QCM + code sandbox (3:25 → 4:55)

**ACTION** :
- Le candidat arrive sur la page de demarrage, saisit son nom et le code d'acces
- Clique "Demarrer la passation"
- Repond rapidement a 1 QCM (coche une option, suivant)
- Arrive sur une question CODE
- Montre le squelette propose (c'est le starterCode)
- **Tape du code dans l'editeur** (quelque chose de simple, correct ou volontairement bugue)
- Clique "Executer"
- **Attends 2-5 secondes** que la sandbox Docker execute le code dans un conteneur isole
- Le resultat s'affiche : tests passes, stdout, duree d'execution
- Si echec, montre le message d'erreur, puis corrige et re-execute pour montrer un succes
- Clique "Question suivante" OU "Soumettre"

**VOIX** (sur l'ecran de demarrage) :
> « Le candidat arrive sur la page de demarrage. Il saisit son nom et le
> code d'acces recu par email. »

**VOIX** (pendant les QCM) :
> « Les QCM sont corriges automatiquement. »

**VOIX** (sur la question code) :
> « Voici une question code. Le candidat ecrit sa solution dans l'editeur
> integre, puis l'execute. »

**VOIX** (apres l'execution) :
> « Point critique : le code vient d'etre execute dans un conteneur
> Docker isole, avec seccomp, cap-drop ALL et aucun acces reseau. Le
> candidat ne peut rien faire d'autre que resoudre son exercice. Les
> tests caches s'executent, le resultat remonte en 2 a 5 secondes. »

**DUREE** : 1 min 30 s

---

### 8. Compte rendu IA + rapport recruteur (4:55 → 5:20)

**ACTION** :
- Clique "Soumettre la passation" (cote candidat)
- **Attends 10-20 s** que l'IA genere le compte rendu
- Message de confirmation : "Passation soumise, merci"
- **Rebascule sur la fenetre A** (recruteur)
- Clique "Resultats" dans le menu
- La passation du candidat apparait avec son score
- Clique dessus pour ouvrir le detail
- Montre le rapport IA : synthese, forces, faiblesses, recommandation
  (Hire / Interview / Reject)

**VOIX** (sur la soumission) :
> « Le candidat soumet sa passation. L'IA genere un compte rendu
> structure. »

**VOIX** (cote recruteur, sur le rapport) :
> « Cote recruteur, je retrouve immediatement la passation dans mes
> resultats. L'IA a prepare une synthese : les forces, les faiblesses,
> une recommandation Hire / Interview / Reject. Je garde le dernier mot :
> je peux valider ou ajuster avant de transmettre a l'equipe RH. »

**DUREE** : 25 s

---

### 9. Conclusion + CTA (5:20 → 5:30)

**ACTION** :
- Reviens sur le dashboard recruteur, montre les KPIs qui ont bouge
  (passations totales +1, candidats +1)
- Facultatif : montre https://skillforge-api-xde0.onrender.com/swagger-ui/index.html
  en passant (3 s) pour prouver que l'API est documentee et accessible publiquement

**VOIX** :
> « Du CV au verdict, en moins de 10 minutes. L'IA accelere, l'humain
> decide. SkillForge est deploye en production sur Vercel, Render et
> Supabase, avec un pipeline CI/CD GitHub Actions. Merci pour votre
> attention. »

**DUREE** : 10 s

---

## Checklist montage video

Si tu enregistres en plusieurs prises :

- [ ] Garde l'audio **continu** si possible (sinon raccorde proprement)
- [ ] Coupe les temps morts (attentes IA, pages de chargement) a 2-3 s max
  par morceau, pas plus
- [ ] Ajoute un **zoom** sur les moments cles :
  - Les competences extraites apparaissent (zoom 1.2x pendant 2 s)
  - Le mail arrive dans Yahoo (zoom sur l'objet et le code d'acces)
  - La sandbox termine l'execution (zoom sur le temps d'execution et les tests passes)
  - Le rapport IA affiche la recommandation Hire/Interview/Reject
- [ ] Ajoute une **musique de fond** douce, instrumentale, legere
  (volume -20 dB, pas plus) — Pixabay / Freesound ont des pistes libres de droits
- [ ] Ajoute un **sous-titre discret** en bas pour chaque section :
  "1. Analyse du CV", "2. Generation des questions", etc.
- [ ] **Logo UCA + ITU + Tsarajoro** en coin, discret, pendant toute la video
- [ ] Export final : MP4 H.264, 1920x1080, 30 fps, bitrate 8-10 Mbps,
  audio 192 kbps

---

## Plan B si quelque chose casse pendant la demo live

- **Mail n'arrive pas en 30 s** : copie le code d'acces depuis l'ecran recruteur
  (option fallback deja prevue dans le code) et saisis-le manuellement cote candidat
- **Sandbox retourne une erreur de timeout** : relance une seule fois, si
  encore KO montre juste le QCM
- **Render Free spin down** (service dormant) : attends 50 s qu'il se reveille,
  masque l'attente par la voix off qui parle de l'architecture pendant ce temps
- **ngrok tunnel coupe** : relance `ngrok http 8091`, update SANDBOX_URL dans Render,
  retente — mais prends ca comme SIGNAL : enregistre une version offline en secours

---

## Variante avec logiciel montage

Si tu utilises **DaVinci Resolve** ou **Kdenlive** (gratuits sous Linux) :

1. Importe le MP4 brut dans la timeline
2. Decoupe les sections avec blade tool (B)
3. Ajoute des titres pour chaque section avec Fusion (Resolve) ou Title (Kdenlive)
4. Reduis les silences avec speed ramping (×1.5 sur les attentes)
5. Normalise l'audio (-16 LUFS pour une diffusion propre)
6. Export en MP4 H.264, 1920x1080, 30 fps

Duree de montage estimee : 2-3 h si premier essai, 1 h en etant deja a l'aise.

---

## Timing total de la production

| Etape | Duree |
|---|---|
| Preparation setup (ngrok, Render, Yahoo, navigateurs) | 20 min |
| Premier essai d'enregistrement (sans micro, juste pour verifier le script) | 10 min |
| Enregistrement final (avec voix off) | 30-45 min (plusieurs prises) |
| Montage video | 1-3 h |
| Export + verification finale | 15 min |
| **Total** | **2 h 30 - 4 h 30** |

Prevois 1 soiree complete, pas moins.
