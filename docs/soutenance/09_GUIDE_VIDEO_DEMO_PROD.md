# Guide clic par clic - video demo production SkillForge

Objectif : enregistrer rapidement la demo production pour les slides 14, 15 et
16. Ce guide est fait pour etre suivi a l'ecran, sans reflechir.

---

## 0. URLs utiles

| Element | URL |
|---|---|
| Frontend | `https://skillforge-platform-pi.vercel.app` |
| Login | `https://skillforge-platform-pi.vercel.app/login` |
| Backend health | `https://skillforge-api-xde0.onrender.com/actuator/health` |
| Swagger | `https://skillforge-api-xde0.onrender.com/swagger-ui/index.html` |
| ngrok actuel | `https://revenue-deskbound-drastic.ngrok-free.dev` |

Compte demo recruteur :

| Champ | Valeur |
|---|---|
| Email | `recruteur@skillforge.app` |
| Mot de passe | `SkillForgeFitia2026!` |

Ne jamais montrer a l'ecran : `.env`, cles API, Render Environment, tokens.

---

## 1. Avant d'enregistrer

### 1.1 Demarrer Docker

Dans le terminal :

```bash
open -a Docker
```

Attendre que Docker Desktop soit lance, puis :

```bash
docker info
```

Si pas d'erreur, continuer.

### 1.2 Construire les images sandbox

Depuis la racine du projet :

```bash
docker build -t skillforge-runtime-php:8.3 infra/sandbox/php8.3/
docker build -t skillforge-runtime-node:20 infra/sandbox/node20/
```

### 1.3 Lancer la sandbox locale

Terminal 1 :

```bash
cd apps/backend-sandbox
SANDBOX_INTERNAL_KEY=dev-internal-key-please-change mvn spring-boot:run
```

Attendu : le service reste lance sur `8091`.

Dans un autre terminal, verifier :

```bash
curl -s http://localhost:8091/actuator/health
```

Attendu :

```json
{"status":"UP"}
```

### 1.4 Lancer ngrok

Terminal 2 :

```bash
ngrok http 8091
```

Copier la ligne `Forwarding`, exemple :

```text
https://revenue-deskbound-drastic.ngrok-free.dev -> http://localhost:8091
```

### 1.5 Mettre ngrok dans Render

1. Ouvrir Render.
2. Aller dans le service backend `skillforge-api`.
3. Cliquer **Environment**.
4. Chercher `SANDBOX_URL`.
5. Mettre l'URL ngrok :

```text
https://revenue-deskbound-drastic.ngrok-free.dev
```

6. Cliquer **Save changes**.
7. Cliquer **Manual Deploy** ou **Restart service**.
8. Attendre la fin du redeploiement.

Verifier ensuite :

```bash
curl -s https://skillforge-api-xde0.onrender.com/actuator/health
```

Attendu :

```json
{"status":"UP"}
```

### 1.6 Preparer les fenetres

1. Ouvrir Chrome normal.
2. Ouvrir `https://skillforge-platform-pi.vercel.app/login`.
3. Ouvrir une fenetre navigation privee.
4. Ouvrir Gmail dans un onglet.
5. Fermer les onglets inutiles.
6. Mettre le zoom navigateur a `110 %` ou `125 %`.
7. Couper les notifications.
8. Preparer un CV demo sur le bureau.
9. Preparer ce code PHP dans un fichier texte :

```php
<?php
function solve(int $n): int {
    return $n * 2;
}
```

10. Preparer ce code attaque dans un fichier texte :

```php
<?php
echo file_get_contents('/etc/passwd');
```

---

## 2. Recording OBS

1. Ouvrir OBS.
2. Choisir capture ecran ou capture fenetre navigateur.
3. Regler :
   - resolution : `1920 x 1080` ;
   - fps : `30` ;
   - format : `MP4`.
4. Lancer l'enregistrement.
5. Ne pas parler dans la video si tu commentes en direct pendant la soutenance.

Nom final conseille :

```text
demo-skillforge-prod-v1.mp4
```

---

## 3. Bloc 1 - Recruteur

Objectif : montrer qu'un recruteur cree un test a partir d'un candidat/CV.

### 3.1 Connexion

1. Aller sur `https://skillforge-platform-pi.vercel.app/login`.
2. Saisir `recruteur@skillforge.app`.
3. Saisir le mot de passe.
4. Cliquer **Se connecter**.
5. Attendre le tableau de bord.
6. Laisser le dashboard visible 2 secondes.

Phrase orale :

> Ici, je suis connecte comme recruteur sur l'environnement de production.

### 3.2 Creer un nouveau test

1. Cliquer **Nouveau test**.
2. Dans **Nom du candidat**, saisir `Marie Laurent`.
3. Dans **Email**, saisir `marie.laurent.demo@skillforge.app`.
4. Selectionner `Developpeur PHP`.
5. Importer le CV demo.
6. Cliquer **Analyser le CV**.
7. Attendre les competences.
8. Si l'attente depasse 5 secondes, couper cette partie au montage.
9. Montrer les competences detectees.

Phrase orale :

> Le recruteur part du CV. L'IA extrait les competences, mais le recruteur garde
> la main sur la suite.

### 3.3 Generer les questions

1. Verifier les competences proposees.
2. Choisir les types de questions :
   - QCM ;
   - CODE ;
   - CAS_PRATIQUE.
3. Choisir une difficulte moyenne ou elevee.
4. Cliquer **Generer le test** ou **Generer les questions**.
5. Attendre la generation.
6. Montrer au moins une question QCM, une question CODE et un cas pratique.

Phrase orale :

> Le test est personnalise selon le profil et les competences detectees.

### 3.4 Valider les questions

1. Aller dans **Revue questions**.
2. Ouvrir la premiere question.
3. Cliquer **Valider** si elle est correcte.
4. Faire pareil pour les questions necessaires.
5. Montrer le statut **APPROVED** ou **Validee**.

Phrase orale :

> Les questions generees ne partent pas directement au candidat. Elles passent
> par une validation recruteur.

### 3.5 Envoyer l'invitation

1. Revenir au test ou continuer apres validation.
2. Cliquer **Generer invitation** ou **Envoyer invitation**.
3. Montrer la modale avec le lien candidat et le code d'acces.
4. Ouvrir Gmail.
5. Ouvrir l'email recu.
6. Montrer que le candidat recoit le lien et le code.
7. Copier le lien candidat.

Phrase orale :

> L'invitation contient un lien unique et un code d'acces. Le candidat n'a pas
> besoin de compte.

---

## 4. Bloc 2 - Candidat

Objectif : tout montrer dans le meme lien candidat, sans refaire plusieurs
tests : acces securise, QCM, code correct, signaux anti-fraude, attaque sandbox,
remise du bon code, puis soumission.

### 4.1 Ouvrir l'invitation

1. Aller dans la fenetre navigation privee.
2. Coller le lien candidat.
3. Appuyer sur entree.
4. Saisir le code d'acces recu par email.
5. Verifier que le nom et l'email sont ceux du candidat invite.
6. Cocher le consentement.
7. Cliquer **Commencer**.

Phrase orale :

> Cote candidat, l'acces est controle par le lien et le code d'acces.

### 4.2 Repondre au QCM

1. Lire rapidement la premiere question QCM.
2. Cocher une reponse.
3. Cliquer **Suivant**.
4. Sur une autre QCM, repondre tres vite pour simuler un comportement suspect.
5. Si l'application affiche un signal, le laisser visible 1 ou 2 secondes.

Ne pas perdre trop de temps ici : 5 a 10 secondes suffisent.

Phrase orale :

> Pendant la passation, certains comportements peuvent etre remontes comme
> signaux de risque : reponses anormalement rapides, perte de focus ou actions
> inhabituelles.

### 4.3 Executer le code

1. Aller a la question CODE.
2. Montrer que le squelette de depart est bien present.
3. Copier-coller le code valide.

Si la question attend un double :

```php
<?php
function solve(int $n): int {
    return $n * 2;
}
```

Si la question attend une somme de tableau :

```php
<?php
function solve(array $numbers): int {
    return array_sum($numbers);
}
```

Si la question attend un palindrome :

```php
<?php
function solve(string $text): bool {
    $clean = strtolower(preg_replace('/[^a-z0-9]/i', '', $text));
    return $clean === strrev($clean);
}
```

Si la question est en JavaScript sur les voyelles :

```js
function solve(sentence) {
  return (sentence.match(/[aeiouyàâäéèêëîïôöùûü]/gi) || []).length;
}

module.exports = { solve };
```

4. Cliquer **Executer**.
5. Attendre le resultat.
6. Montrer le statut OK, les tests passes, le score ou la sortie.

Phrase orale :

> Le code candidat est execute dans un service sandbox separe du backend
> principal.

### 4.4 Simuler la fraude dans la meme passation

Faire les actions suivantes avant de soumettre :

1. Changer d'onglet pendant 2 secondes.
2. Revenir sur la passation.
3. Copier-coller un gros bloc de code dans l'editeur.
4. Repondre tres rapidement a une question simple.
5. Si un indicateur anti-fraude apparait, le montrer rapidement.

Phrase orale :

> Ici, je simule quelques comportements a risque : sortie de l'onglet, collage
> de code et reponses tres rapides. Ces signaux ne condamnent pas le candidat,
> ils alimentent seulement un score de risque pour le recruteur.

### 4.5 Simuler une attaque sandbox

Toujours dans le meme lien candidat, sur une question CODE :

1. Remplacer temporairement le code correct par une tentative d'acces fichier.

Pour PHP :

```php
<?php
function solve($input) {
    return file_get_contents('/etc/passwd');
}
```

Ou :

```php
<?php
echo file_get_contents('/etc/passwd');
```

Pour JavaScript :

```js
const fs = require('fs');

function solve(input) {
  return fs.readFileSync('/etc/passwd', 'utf8');
}

module.exports = { solve };
```

2. Cliquer **Executer**.
3. Montrer le resultat : erreur, sortie controlee ou echec des tests.
4. Ne pas chercher a faire planter l'application.
5. Expliquer que l'important est l'isolation.

Phrase orale si l'attaque echoue :

> Le code malveillant echoue dans la sandbox. L'erreur reste confinee et le
> backend principal continue de fonctionner.

Phrase orale si `/etc/passwd` s'affiche :

> Meme si le code lit un fichier, il lit le fichier du conteneur sandbox
> jetable, pas celui du serveur principal. C'est le principe de l'isolation.

Phrase orale courte a retenir :

> Le code candidat n'est jamais execute dans le backend principal.

### 4.6 Remettre le bon code puis soumettre

1. Recoller le code correct dans l'editeur.
2. Cliquer **Executer** pour retrouver un resultat OK.
3. Repondre vite aux questions restantes.
4. Cliquer **Soumettre**.
5. Montrer la page finale.

Phrase orale :

> A la soumission, SkillForge calcule le score et prepare le rapport recruteur.

---

## 5. Bloc 3 - Sandbox + Resultats

Objectif : montrer le retour recruteur apres la passation. La simulation
sandbox/attaque a deja ete faite dans le lien candidat.

### 5.1 Ouvrir les resultats recruteur

1. Revenir dans Chrome normal.
2. Aller dans **Resultats**.
3. Ouvrir la derniere passation.
4. Montrer :
   - nom du candidat ;
   - score global ;
   - score fraude ;
   - detail des reponses ;
   - rapport IA ;
   - forces/faiblesses.

Phrase orale :

> Cote recruteur, la passation est transformee en resultat exploitable :
> score, details, signaux anti-fraude et synthese.

### 5.2 Finir sur le dashboard

1. Cliquer **Tableau de bord** ou **Analytics**.
2. Montrer les candidats evalues, le score moyen, les questions validees, le
   risque fraude et le graphique de distribution.
3. Attendre 2 secondes.
4. Arreter l'enregistrement.

Phrase orale :

> Le tableau de bord donne une vision globale du recrutement et permet
> d'ameliorer progressivement la qualite des questions.

---

## 6. Timeline rapide

| Temps | Partie | A montrer |
|---|---|---|
| 0:00 - 0:30 | Login + dashboard | Production accessible |
| 0:30 - 1:30 | Creation test | CV, competences, generation |
| 1:30 - 2:00 | Validation + invitation | Questions validees, lien, code |
| 2:00 - 3:20 | Candidat | Code acces, QCM, code correct |
| 3:20 - 4:10 | Meme lien candidat | Perte focus, collage, attaque sandbox |
| 4:10 - 5:00 | Resultats recruteur | Rapport, score fraude, analytics |

---

## 7. Donnees demo deja pretes

La preproduction contient des candidats de demonstration avec scores varies :

| Candidat | Score attendu | Fraude |
|---|---:|---:|
| Camille Bernard | 100 | 0 |
| Nicolas Moreau | 80 | 25 |
| Sarah Martin | 80 | 0 |
| Thomas Dubois | 60 | 55 |
| Julie Petit | 60 | 0 |
| Antoine Leroy | 40 | 65 |
| Manon Robert | 40 | 0 |
| Hugo Garnier | 20 | 75 |
| Claire Fournier | 20 | 0 |
| Alexandre Girard | 0 | 45 |

Si la creation d'un nouveau test bloque pendant la video, utiliser directement
la page **Resultats** avec ces candidats.

---

## 8. Plan B rapide

### Si l'IA est lente

1. Attendre quelques secondes.
2. Couper au montage.
3. Dire :

> Les temps d'attente ont ete raccourcis dans la video.

### Si Gmail ne recoit pas le mail

1. Revenir a la modale invitation.
2. Copier le lien et le code.
3. Continuer la demo avec ces informations.
4. Dire :

> L'envoi mail est asynchrone, mais le lien unique est deja genere.

### Si ngrok ne marche plus

1. Relancer :

```bash
ngrok http 8091
```

2. Copier la nouvelle URL.
3. Remettre `SANDBOX_URL` dans Render.
4. Redemarrer le backend Render.

### Si Docker ne marche pas

1. Ouvrir Docker Desktop.
2. Attendre.
3. Relancer :

```bash
docker info
```

4. Reprendre a l'etape sandbox.

### Si Render est lent

1. Ouvrir `https://skillforge-api-xde0.onrender.com/actuator/health`.
2. Attendre `UP`.
3. Relancer la page frontend.

---

## 9. Phrases a retenir

Phrase principale :

> L'IA propose, le recruteur valide, et la sandbox protege la plateforme contre
> le code non fiable.

Phrase recruteur :

> SkillForge ne remplace pas le recruteur : il automatise la preparation et
> donne une aide a la decision.

Phrase candidat :

> Le candidat passe le test sans compte, avec un lien unique et un code d'acces.

Phrase securite :

> Le code candidat n'est jamais execute dans le backend principal.

---

## 10. Checklist finale juste avant REC

- [ ] Docker Desktop lance.
- [ ] Sandbox lancee sur `localhost:8091`.
- [ ] ngrok lance.
- [ ] `SANDBOX_URL` Render mis a jour.
- [ ] Backend Render `UP`.
- [ ] Frontend Vercel accessible.
- [ ] Compte recruteur connectable.
- [ ] Gmail ouvert.
- [ ] CV demo pret.
- [ ] Code valide pret.
- [ ] Code attaque pret.
- [ ] Notifications coupees.
- [ ] Aucun secret visible.
