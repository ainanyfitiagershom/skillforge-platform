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

Duree cible : environ 3 min 30. Tout dans un seul lien candidat, dans l'ordre.

Les codes faux et corrects pour chaque exercice CODE ne sont PAS dans ce guide : les enonces varient selon la generation IA. Pendant le test, demander a Claude la bonne reponse en lui donnant l'enonce exact.

Seuls les 3 codes d'attaque (PHP, JS, cas pratique) sont fournis en bas de chaque etape concernee.

---

### Etape 1 : Ouvrir le mail (10 s)

1. Dans la fenetre privee du navigateur, ouvrir Gmail du candidat (`gershomfitia@gmail.com`).
2. Ouvrir le dernier mail SkillForge intitule `Votre test technique SkillForge`.
3. Montrer le mail a l'ecran 2 secondes.
4. Cliquer sur le lien d'invitation dans le mail.

Phrase orale : « Le candidat ouvre son mail et clique sur le lien unique qu'il a recu. »

### Etape 2 : Saisir le code d'acces (10 s)

5. Sur la page de login candidat, revenir sur le mail, copier le code a 6 chiffres.
6. Coller le code dans le champ `Code d'acces`.
7. Verifier que le nom et l'email du candidat s'affichent.
8. Cocher la case de consentement.
9. Cliquer **Commencer**.

Phrase orale : « Il saisit le code a six chiffres recu, coche son consentement, et demarre la passation. »

### Etape 3 : Repondre aux QCM (20 s)

10. Lire rapidement la premiere QCM.
11. Cocher option C.
12. Cliquer **Suivant**.
13. Pour chaque QCM restante : cocher option C, cliquer **Suivant**.

Phrase orale : « Il traverse les QCM a grande vitesse — ce comportement sera remonte par l'anti-fraude. »

### Etape 4 : Code PHP 1 - premiere question CODE PHP (1 min)

Arriver sur la premiere question CODE PHP.

**4a. Attaque sandbox**

14. Ctrl+A dans l'editeur, Suppr pour tout effacer.
15. Copier le code d'attaque ci-dessous :

```
<?php
$cibles = ['/etc/passwd', '/etc/shadow', '/proc/self/environ', '/etc/hosts'];
foreach ($cibles as $cible) {
    $contenu = @file_get_contents($cible);
    if ($contenu === false) {
        echo "BLOQUE $cible : refuse par le systeme de fichiers\n";
    } else {
        echo "LU $cible : " . substr($contenu, 0, 60) . "\n";
    }
}
function solve($x): array { return []; }
```

16. Coller dans l'editeur (Ctrl+V).
17. Cliquer **Executer**.
18. Attendre 1 seconde.
19. Pointer les 4 lignes `BLOQUE` dans la sortie.

Phrase orale : « Avant la vraie solution, je teste la robustesse de la sandbox : lecture de fichiers systeme. Les quatre tentatives sont refusees par les barrieres sandbox PHP. »

**4b. Code faux**

20. Ctrl+A dans l'editeur, Suppr.
21. Attendre au moins 1 seconde (sinon le signal paste est deduplique).
22. Demander a Claude un code faux pour l'enonce visible a l'ecran.
23. Coller dans l'editeur.
24. Cliquer **Executer**.
25. Montrer `ERROR, exit 1, tests 0/1`.

Phrase orale : « Premiere tentative erronee. Les tests caches echouent. »

**4c. Code correct**

26. Ctrl+A, Suppr.
27. Attendre 1 seconde.
28. Demander a Claude le code correct pour cet enonce.
29. Coller.
30. Cliquer **Executer**.
31. Montrer `OK, exit 0, tests 1/1, score 100 %`.

Phrase orale : « Avec la bonne solution, les tests caches passent. »

32. Cliquer **Suivant**.

### Etape 5 : Code PHP 2 - deuxieme question CODE PHP (45 s)

Arriver sur la deuxieme question CODE PHP.

**5a. Code faux**

33. Ctrl+A, Suppr.
34. Attendre 1 seconde.
35. Demander a Claude un code faux.
36. Coller.
37. Cliquer **Executer**.
38. Montrer `ERROR, tests 0/1`.

Phrase orale : « Deuxieme exercice. Encore une tentative fausse. »

**5b. Code correct**

39. Ctrl+A, Suppr.
40. Attendre 1 seconde.
41. Demander a Claude le code correct.
42. Coller.
43. Cliquer **Executer**.
44. Montrer `OK, tests 1/1`.

Phrase orale : « Solution validee. »

45. Cliquer **Suivant**.

### Etape 6 : Code JavaScript - premiere question CODE JS (1 min)

Arriver sur la question CODE JS.

**6a. Attaque sandbox JS**

46. Ctrl+A, Suppr.
47. Attendre 1 seconde.
48. Copier le code d'attaque ci-dessous :

```
const fs = require('fs');
const cibles = ['/etc/passwd', '/etc/shadow', '/proc/self/environ'];
for (const cible of cibles) {
    try {
        const contenu = fs.readFileSync(cible, 'utf8');
        console.log('FUITE sur ' + cible + ' : ' + contenu.substring(0, 60));
    } catch (e) {
        console.log('BLOQUE ' + cible + ' : ' + e.code);
    }
}
function solve(sentence) { return 0; }
module.exports = { solve };
```

49. Coller dans l'editeur.
50. Cliquer **Executer**.
51. Pointer les 3 lignes `BLOQUE ... ERR_ACCESS_DENIED`.

Phrase orale : « Meme principe en JavaScript. Node 20 refuse les lectures hors des dossiers autorises par son Permission Model. »

**6b. Code faux**

52. Ctrl+A, Suppr.
53. Attendre 1 seconde.
54. Demander a Claude un code faux pour cet enonce JS.
55. Coller.
56. Cliquer **Executer**.
57. Montrer `ERROR, tests 0/1`.

**6c. Code correct**

58. Ctrl+A, Suppr.
59. Attendre 1 seconde.
60. Demander a Claude le code correct.
61. Coller.
62. Cliquer **Executer**.
63. Montrer `OK, tests 1/1`.

Phrase orale : « Solution JS validee. »

64. Cliquer **Suivant**.

### Etape 7 : Simuler sorties d'onglet (10 s)

65. Appuyer Alt+Tab pour sortir de l'onglet, attendre 2 secondes.
66. Revenir sur l'onglet.
67. Refaire Alt+Tab et retour.
68. Refaire Alt+Tab et retour (3 sorties au total).

Phrase orale : « Pendant la passation, je simule aussi des sorties d'onglet. Ces evenements sont captures en silence. »

### Etape 8 : Cas pratique PHP (30 s)

Arriver sur la question CAS PRATIQUE.

69. Lire rapidement l'enonce.
70. Copier la reponse ci-dessous :

```
Trois pistes a verifier :
1. Verifier les identifiants fournis contre la table utilisateurs (hash correct, casse de l email, caracteres invisibles).
2. Verifier l etat du compte : actif, non suspendu, email verifie.
3. Verifier les middlewares et la session : CSRF, cookie, redirection, logs du serveur.
En parallele, consulter les logs d authentification pour identifier le motif exact du refus.
```

71. Coller dans le champ de reponse.
72. Cliquer **Suivant**.

Phrase orale : « Pour les cas pratiques, le candidat redige en texte libre. La correction est faite par le LLM, en comparant la reponse aux points attendus definis par le recruteur. »

### Etape 9 : Soumettre (10 s)

73. Si d'autres questions restent, cocher option C et passer.
74. Arriver sur l'ecran de soumission.
75. Cliquer **Soumettre l'evaluation**.
76. Attendre le message `Evaluation soumise`.
77. Montrer la page finale.

Phrase orale : « A la soumission, la passation est verrouillee. La correction automatique demarre. »

---

### Bilan attendu dans le rapport recruteur apres cette passation

- 2 attaques sandbox bloquees (1 PHP + 1 JS)
- 3 exercices CODE reussis apres correction du code faux
- Score global : moyen (QCM 0 % + 3 CODE a 100 % + 1 CAS variable)
- Score anti-fraude : eleve
- Plusieurs evenements PASTE_SUSPICIOUS (chaque bloc fait plus de 50 caracteres)
- 3 evenements FOCUS_LOSS (sorties d'onglet)

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
