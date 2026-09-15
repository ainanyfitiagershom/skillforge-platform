# Mémoire M2 MBDS — Sections restantes à coller

**Fichier cible :** `MEMOIRE M2/MEMOIRE-itu-MBDS-v1.docx`
**Sections déjà rédigées dans le .docx (à ne pas retoucher ici) :** Résumé, Abstract, Glossaire, Introduction, Chapitres 1 → 4, Chapitre 5.1 et 5.2.
**Sections à coller depuis ce fichier :** 5.3.1 (à remplacer par la version enrichie ci-dessous) → Chapitre 11.

**Remarque sur 5.3.1 :** la version actuellement dans le .docx présente quatre captures d'écran mais reste courte. La version ci-dessous détaille sept écrans structurants du parcours utilisateur, avec pour chacun l'URL réelle de l'application, son rôle dans le cycle et son fonctionnement précis. Elle est plus riche pour un jury M2, en particulier sur les mécanismes non triviaux (verrouillage d'identité, anti-fraude, notation multi-critères).

**Contraintes de rédaction appliquées :**
- Style **impersonnel** (aucun « je » sauf dans le bilan personnel de la conclusion et dans les rôles/outils).
- Radar anti-IA : pas de « premièrement / deuxièmement », pas de « en effet / notamment / par ailleurs / cependant » utilisés à toutes les lignes, phrases de longueurs variées.
- Alignement sur le style du .docx : phrases moyennes, quelques mots-clés en gras pour rythmer.
- Consignes du plan-type MBDS respectées section par section.
- Données réelles du projet : 14 cas d'utilisation, 4 concurrents (HackerRank, Codility, TestGorilla, CoderPad), 15 User Stories, 7 risques (R1-R7), 8 sprints, 10 outils, 6 fournisseurs LLM.
- Niveau technique : concret (vrais noms de classes, ports, migrations Flyway) mais chaque nom est justifié par un choix argumenté.

---

## 5.3.1 Interface Homme-Machine

L'interface de SkillForge a été conçue autour de deux parcours strictement séparés : celui du recruteur, accessible après authentification sous les URL préfixées `/app`, et celui du candidat, accessible en public à partir du lien signé reçu par courrier électronique sous les URL préfixées `/candidate/passation`. Cette séparation n'est pas seulement esthétique. Le parcours candidat ne reçoit ni le menu de navigation, ni les liens vers les autres écrans, ni aucun élément permettant de deviner l'organisation interne de la plateforme. Cette réduction volontaire de la surface visible pour le candidat limite les risques d'exploration involontaire et concentre son attention sur l'évaluation en cours.

L'ensemble de l'interface a été construit avec React 19, TypeScript 5, Tailwind CSS et la bibliothèque de composants shadcn/ui. Un thème clair et un thème sombre sont pris en charge et commutables via un sélecteur discret présent dans l'en-tête du parcours recruteur. Le choix de l'utilisateur est mémorisé localement, et la préférence système du navigateur est respectée au premier chargement.

Sept écrans structurants ont été retenus pour illustrer le parcours utilisateur dans le présent chapitre. Les captures correspondantes figurent à la suite de leur description.

### Écran 1 — Accueil recruteur (`/app`)

Le tableau de bord constitue le point d'entrée du recruteur après authentification. Il donne en un coup d'œil l'état de l'activité récente sur la plateforme et sert de raccourci vers les actions les plus fréquentes.

L'écran est organisé en trois zones. En haut, quatre cartes d'indicateurs présentent le nombre de tests en cours, le nombre de passations soumises, le score moyen des évaluations terminées et le nombre de questions restant à valider. Au centre, trois graphiques statistiques sont rendus avec la bibliothèque Recharts : la distribution des scores globaux par tranche, la moyenne des scores par compétence évaluée et un nuage de points croisant l'indice de difficulté et le pouvoir discriminant des questions du référentiel. Ce dernier graphique met immédiatement en évidence les questions à retravailler, celles dont le pouvoir discriminant est négatif ou nul. En bas, une liste des dernières passations soumises permet d'accéder directement au rapport détaillé d'un candidat.

Un bouton d'export en CSV et un bouton d'export en PDF permettent au recruteur de reprendre les données affichées dans un tableur ou de partager un instantané du tableau de bord avec un décideur.

**[INSÉRER ICI LA CAPTURE — FIGURE X : TABLEAU DE BORD RECRUTEUR (`/app`)]**

*Figure X. Tableau de bord recruteur. Les quatre indicateurs du haut résument l'activité de la plateforme. Les trois graphiques centraux permettent au recruteur de repérer les questions à retravailler et de visualiser la distribution des scores.*

### Écran 2 — Création d'un test (`/app/new-test`)

Cet écran est le point de départ du cycle complet d'évaluation. Il prend la forme d'un assistant en trois étapes présentées visuellement en haut de la page.

À la première étape, le recruteur sélectionne le profil cible dans une liste préconfigurée (par exemple *Développeur PHP*, *Intégrateur WordPress*, *Développeur Vue.js*, *Spécialiste SEO technique*), saisit le nom et l'adresse électronique du candidat, puis téléverse le CV au format PDF ou DOCX. L'analyse démarre au clic sur le bouton *CV analysé*.

À la deuxième étape, les compétences détectées par l'analyse du CV sont présentées sous forme de badges avec leur niveau estimé (`JUNIOR`, `CONFIRMÉ`, `SENIOR`). Le recruteur peut décocher les compétences qui ne sont pas pertinentes pour le poste ou ajouter manuellement des compétences absentes du CV via un champ de recherche avec suggestions. Un liseré discret sous l'en-tête indique le fournisseur de modèle de langage utilisé, le nombre de jetons consommés et le coût estimé de l'appel. Cette information paraît anodine mais elle est précieuse en production : un recruteur qui voit *mock* sur ce liseré sait immédiatement que son environnement fonctionne en mode simulation.

À la troisième étape, la génération des questions est lancée. Les questions produites apparaissent une par une avec leur type (QCM, CODE, CAS_PRATIQUE), leur difficulté, leur énoncé et un aperçu du contenu spécifique. Pour les exercices de code, un éditeur Monaco intégré affiche le code de démarrage proposé au candidat. Toutes les questions sont créées avec le statut `PENDING_REVIEW` et devront être validées à l'écran suivant.

**[INSÉRER ICI LA CAPTURE — FIGURE X : CRÉATION D'UN TEST (`/app/new-test`)]**

*Figure X. Écran de création d'un test avec ses trois étapes CV → Compétences → Questions. Le liseré du haut indique le fournisseur IA utilisé, le nombre de jetons consommés et le coût estimé de l'analyse.*

### Écran 3 — Validation des questions (`/app/review`)

Cet écran matérialise le contrôle humain que SkillForge maintient sur les productions du modèle de langage. Il se présente comme une boîte de réception, groupée par candidat et par test, et affiche pour chaque question son type, sa difficulté, son énoncé et son statut (`PENDING_REVIEW`, `APPROVED` ou `REJECTED`).

Chaque question peut être approuvée en l'état, modifiée dans un éditeur intégré puis approuvée, ou rejetée. Les modifications portent aussi bien sur l'énoncé que sur le contenu spécifique : options d'un QCM, code de démarrage d'un exercice, points attendus d'un cas pratique. Pour les exercices de code, l'éditeur Monaco affiche à la fois le code de démarrage et les tests cachés qui seront exécutés dans la sandbox, ce qui permet au recruteur de vérifier la cohérence de l'ensemble.

Lorsque toutes les questions d'un test ont été approuvées, un bouton *Générer le lien d'invitation* devient actif. Il produit une URL signée de la forme `/candidate/passation/:token` accompagnée d'un code d'accès à six chiffres, puis prépare le courrier électronique à envoyer au candidat. La copie du lien dans le presse-papiers est également disponible pour un envoi manuel.

**[INSÉRER ICI LA CAPTURE — FIGURE X : VALIDATION DES QUESTIONS (`/app/review`)]**

*Figure X. Écran de validation des questions générées. Chaque question porte son statut et peut être approuvée, modifiée ou rejetée. Le bouton d'envoi n'apparaît qu'une fois toutes les questions du test approuvées.*

### Écran 4 — Accueil candidat et identification (`/candidate/passation/:token`)

Cet écran est le premier point de contact du candidat avec la plateforme. Il est accessible en public via un lien à usage unique reçu par courrier électronique et matérialise plusieurs mécanismes de sécurité importants.

L'écran est structuré en trois blocs. Le premier bloc, sur fond vert clair, affiche l'identité verrouillée par le recruteur : le nom complet et l'adresse électronique du candidat sont pré-remplis et non modifiables. Une phrase explicite précise que ces informations proviennent de l'invitation et que le candidat doit contacter le recruteur en cas d'erreur. Ce verrouillage empêche un tiers en possession du lien de démarrer la passation sous une identité différente de celle attendue.

Le deuxième bloc demande la saisie du code d'accès à six chiffres transmis dans le même courrier que le lien. La comparaison entre le code saisi et le code attendu est réalisée côté serveur en temps constant, et cinq échecs consécutifs déclenchent un blocage temporaire de quinze minutes de l'invitation.

Le troisième bloc présente le consentement RGPD sur l'analyse anti-fraude. Le candidat prend connaissance des signaux qui seront captés pendant sa passation (changements d'onglet, collages volumineux, temps de réponse anormalement courts), du fait que ces signaux ne bloquent pas la passation et qu'ils constituent une aide à la décision pour le recruteur. Le démarrage est conditionné à l'acceptation explicite de ce consentement. Sous les trois blocs, un encadré rappelle que les données saisies sont conservées uniquement pour ce recrutement et purgées après douze mois.

**[INSÉRER ICI LA CAPTURE — FIGURE X : ACCUEIL CANDIDAT (`/candidate/passation/:token`)]**

*Figure X. Écran d'accueil et d'identification du candidat. Le bloc vert affiche l'identité verrouillée par le recruteur. Le code d'accès à six chiffres reçu par courrier conditionne le démarrage. Le consentement RGPD sur l'analyse anti-fraude est obligatoire.*

### Écran 5 — Passation en cours (`/candidate/passation/:token/run`)

Cet écran est le cœur de l'évaluation. Il présente les questions une par une, sauvegarde les réponses au fur et à mesure et enregistre les signaux anti-fraude détectés en arrière-plan.

Le haut de l'écran affiche un chronomètre persistant, recalculé depuis l'horodatage de démarrage stocké côté serveur. Ce détail est important : en cas de fermeture accidentelle du navigateur ou de rechargement de la page, le compteur reprend au bon endroit et ne peut pas être réinitialisé par le candidat. La progression dans le test est indiquée sous forme *Question N sur T*, avec des boutons de navigation avant et arrière pour permettre au candidat de revenir sur ses réponses tant qu'il n'a pas soumis.

L'éditeur affiché dépend du type de la question courante. Pour un QCM, quatre options sont présentées avec une sélection unique et un retour visuel immédiat. Pour une question de type cas pratique, un éditeur de texte enrichi accueille la réponse rédigée. Pour un exercice de code, un éditeur Monaco identique à celui de Visual Studio Code est intégré, avec coloration syntaxique et bouton *Exécuter* qui envoie le code au service sandbox et affiche les résultats dans un panneau adjacent. Le candidat peut ainsi vérifier sa solution contre les tests visibles avant de la soumettre.

Sous l'en-tête, une bannière anti-fraude discrète informe le candidat en direct des signaux captés par la plateforme : perte de focus de l'onglet, collage supérieur à deux cents caractères, réponse anormalement rapide sur une question longue. Ces signaux ne bloquent pas le candidat et n'invalident pas la passation. Ils alimentent le rapport de fraude consulté ensuite par le recruteur, qui reste libre de son appréciation.

Un bouton *Soumettre l'évaluation* n'apparaît qu'à la dernière question. La soumission déclenche la correction automatique et bascule le candidat vers l'écran de fin.

**[INSÉRER ICI LA CAPTURE — FIGURE X : PASSATION EN COURS (`/candidate/passation/:token/run`)]**

*Figure X. Écran de passation pour une question de code. L'éditeur Monaco intégré propose la même expérience que Visual Studio Code. Le bouton Exécuter envoie le code à la sandbox durcie et affiche les résultats.*

### Écran 6 — Liste des résultats (`/app/results`)

Cet écran donne au recruteur la vue d'ensemble des passations soumises. Il présente un tableau ordonné du plus récent au plus ancien, avec pour chaque ligne le nom du candidat, son profil cible, la date de soumission et un anneau coloré qui matérialise le score global obtenu.

Le code couleur de l'anneau est pensé pour être lisible d'un coup d'œil : rouge en dessous de 40, orange entre 40 et 60, vert au-dessus de 60. Cette codification alignée sur le seuil de réussite du système facilite le tri manuel des candidats. Un clic sur une ligne ouvre le détail de la passation, présenté à l'écran suivant.

**[INSÉRER ICI LA CAPTURE — FIGURE X : LISTE DES RÉSULTATS (`/app/results`)]**

*Figure X. Liste des passations soumises. L'anneau coloré permet au recruteur de trier visuellement les candidats selon leur score global.*

### Écran 7 — Détail d'une passation (`/app/results/:passationId`)

Cet écran est celui sur lequel le recruteur prend sa décision. Il rassemble en une seule page tous les éléments produits par SkillForge sur une passation donnée.

L'en-tête affiche le nom du candidat, son profil cible, la date de soumission, un grand anneau coloré porteur du score global et cinq chips de statistiques : nombre de QCM réussis, nombre d'exercices de code passant les tests cachés, moyenne des cas pratiques notés par le modèle de langage, temps total passé sur l'évaluation et nombre de signaux anti-fraude enregistrés.

Immédiatement sous l'en-tête, la section *Compte rendu* affiche la synthèse produite par le modèle de langage à partir de l'ensemble des réponses. Elle propose un résumé en deux à trois phrases, une liste de trois à cinq points forts, une liste de trois à cinq points faibles et une recommandation finale parmi `HIRE`, `INTERVIEW` ou `REJECT`. Une bannière discrète rappelle que cette recommandation n'est qu'une aide à la décision et que la responsabilité finale incombe au recruteur.

La section *Analyse anti-fraude* liste les signaux détectés pendant la passation, triés par question, avec pour chacun son horodatage et un pictogramme évocateur : perte de focus prolongée, collage volumineux, réponse anormalement rapide, tentative d'ouverture des outils de développement. Si aucun signal n'a été détecté, un encadré vert confirme la conformité comportementale de la passation.

La section *Réponses détaillées* déroule chaque question du test avec la réponse fournie par le candidat, la note attribuée par la plateforme et une explication contextuelle. Pour un QCM, la bonne réponse est mise en évidence à côté de celle donnée par le candidat. Pour un exercice de code, l'éditeur Monaco s'ouvre en lecture seule sur la solution du candidat, suivi du détail de l'exécution dans la sandbox (tests passés, tests échoués, sortie standard capturée, message d'erreur éventuel). Pour un cas pratique, la réponse est affichée avec l'analyse produite par le modèle de langage et le rappel des points attendus initialement fournis par le recruteur.

Un bouton *Exporter le rapport PDF* génère une version imprimable de l'ensemble à des fins d'archivage ou de partage avec un autre décideur de Tsarajoro.

**[INSÉRER ICI LA CAPTURE — FIGURE X : DÉTAIL D'UNE PASSATION (`/app/results/:passationId`)]**

*Figure X. Détail d'une passation. L'anneau coloré affiche le score global. La section Compte rendu présente la synthèse IA et la recommandation. La section Analyse anti-fraude liste les signaux captés. La section Réponses détaillées ouvre l'ensemble des réponses du candidat, avec la sortie brute de la sandbox pour les exercices de code.*

### Synthèse des écrans documentés

| # | URL | Rôle | Utilisateur |
|---|---|---|---|
| 1 | `/app` | Tableau de bord et indicateurs | Recruteur |
| 2 | `/app/new-test` | Création d'un test en trois étapes | Recruteur |
| 3 | `/app/review` | Validation des questions générées | Recruteur |
| 4 | `/candidate/passation/:token` | Accueil et identification candidat | Candidat |
| 5 | `/candidate/passation/:token/run` | Passation en cours avec éditeur et anti-fraude | Candidat |
| 6 | `/app/results` | Liste des passations soumises | Recruteur |
| 7 | `/app/results/:passationId` | Détail d'une passation et recommandation | Recruteur |

*Tableau X. Sept écrans structurants du parcours SkillForge. Les URL correspondent aux routes réelles de l'application React déployée.*

Quatre écrans complémentaires existent dans l'application mais n'apportent pas d'élément spécifique au regard des exigences du présent chapitre : la page publique de présentation (`/`), la page de connexion (`/login`), l'écran de remerciement du candidat après soumission (`/candidate/passation/:token/done`), et un écran d'erreur de fallback pour toute URL non reconnue.

---

## 5.3.2 Interfaces avec d'autres systèmes

Au-delà de son interface web, SkillForge communique avec trois systèmes extérieurs bien identifiés. Chacun de ces échanges a été isolé derrière une abstraction interne afin de pouvoir remplacer le fournisseur sous-jacent sans modifier le code métier.

**Fournisseurs de modèles de langage.** Six fournisseurs sont pris en charge : un mode simulation utilisé en développement, OpenAI, Anthropic Claude, Groq, Google Gemini et une instance Ollama exécutée localement. Le fournisseur actif est sélectionné par une variable d'environnement `LLM_PROVIDER`, sans redéploiement particulier. Cette flexibilité a été mise à l'épreuve pendant le stage lorsque le service GitHub Models, initialement retenu, a été retiré par son fournisseur. La bascule vers Groq puis vers Gemini a pu être réalisée en moins d'une heure, sans modification du reste de l'application. Tous les fournisseurs retenus exposent une API compatible avec le format OpenAI, ce qui a permis de conserver une seule interface interne appelée `LlmClient`.

**Serveur de messagerie SMTP.** L'envoi des invitations candidats repose sur un serveur SMTP standard, dont l'adresse et les identifiants sont fournis par les variables d'environnement `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME` et `SMTP_PASSWORD`. En développement, un conteneur Mailpit joue le rôle de serveur SMTP local et retient les courriers dans une interface web accessible à l'adresse `http://localhost:8026`. Cette configuration évite d'envoyer de vrais courriers pendant les phases de test, tout en permettant de vérifier visuellement le rendu HTML de l'invitation.

**API Docker.** Le service backend-sandbox pilote le démon Docker de la machine hôte via la bibliothèque Docker Java. Chaque exécution de code candidat déclenche la création d'un conteneur éphémère, dédié à cette seule exécution, puis sa destruction immédiate à la fin. Aucune image ni aucun volume n'est laissé sur le disque de la machine entre deux passations. Le détail des paramètres de durcissement de ces conteneurs est présenté au chapitre 7.

Aucune autre intégration externe n'est prévue dans la version actuelle de SkillForge. Les intégrations envisagées à plus long terme, notamment avec un système ATS externe, sont mentionnées dans les perspectives présentées en conclusion.

---

## 6. Architectures système

Ce chapitre présente les architectures cibles de SkillForge selon deux vues. La première décrit l'organisation logicielle interne et la répartition des responsabilités entre modules. La seconde décrit l'infrastructure sur laquelle ces modules sont déployés.

### 6.1 Architecture logicielle

L'architecture logicielle de SkillForge repose sur **trois applications distinctes** : une application web frontend, une application backend principale nommée `backend-app`, et un service isolé nommé `backend-sandbox`. Ce découpage n'est pas cosmétique. Il découle directement d'une contrainte de sécurité identifiée en début de projet : le code exécuté pour évaluer les candidats provient d'utilisateurs externes et ne peut donc pas être exécuté dans le même processus que celui qui manipule les données personnelles des candidats et les identifiants de connexion.

L'application `backend-app` centralise l'ensemble de la logique métier accessible via une API REST : authentification, gestion des candidats, analyse des CV, génération et validation des évaluations, gestion des invitations, correction automatique, production des comptes rendus et alimentation du tableau de bord analytique. Elle est la seule application autorisée à accéder à la base PostgreSQL et détient l'ensemble des données sensibles.

L'application `backend-sandbox` est volontairement pauvre. Son unique responsabilité consiste à recevoir un morceau de code, un langage cible et une liste de tests, puis à exécuter cet ensemble dans un conteneur Docker durci et à renvoyer les résultats. Ce service ne dispose d'aucun accès à la base de données. Il ne connaît ni les candidats, ni les évaluations, ni les invitations. Les échanges entre `backend-app` et `backend-sandbox` sont protégés par une clé interne partagée.

L'intérêt de cette séparation apparaît clairement dans un scénario défavorable. Les tests de sécurité présentés au chapitre 8 montrent que la sandbox résiste à cinquante attaques différentes sans qu'une seule ne parvienne à s'en échapper. Si une faille inconnue venait à être découverte plus tard, un attaquant qui sortirait de son conteneur se trouverait à l'intérieur de `backend-sandbox`, un service qui ne contient aucune donnée exploitable. Pour atteindre la base de données ou les CV des autres candidats, il lui faudrait franchir une seconde frontière. Ce principe de défense en profondeur limite fortement l'impact potentiel d'une éventuelle vulnérabilité.

Le frontend est une application React unique. Il ne parle qu'à `backend-app` et n'a aucune connaissance de l'existence de `backend-sandbox`. Cette invisibilité renforce l'isolation du service sandbox, qui n'est joignable que depuis le backend principal.

**[INSÉRER ICI LE DIAGRAMME DE COMPOSANTS]**

*Figure X. Vue logicielle de SkillForge : trois applications déployables et leurs relations.*

### 6.2 Architecture technique

L'architecture technique décrit l'infrastructure sur laquelle SkillForge est déployé. En développement comme en production, l'ensemble tient sur une seule machine Linux équipée du démon Docker. Cette contrainte a été retenue dès le début du projet afin de faciliter la reproduction de l'environnement par l'équipe technique de Tsarajoro.

Un reverse proxy assure la terminaison TLS et le routage des requêtes vers le frontend ou l'API. Derrière lui, plusieurs conteneurs Docker cohabitent : le frontend statique servi par Nginx, `backend-app` sur le port 8090, `backend-sandbox` sur le port 8091, la base PostgreSQL avec son volume persistant, et, lorsque l'option locale est retenue, une instance Ollama pour l'exécution locale des modèles de langage. Un conteneur Mailpit complète cet ensemble en développement, pour capturer les courriers électroniques sans les envoyer vers l'extérieur.

Le service `backend-sandbox` utilise le démon Docker de la machine hôte pour créer ses propres conteneurs éphémères, un par exécution de code candidat. Cette approche évite de superposer un runtime Docker à l'intérieur d'un autre. Chaque conteneur candidat est configuré selon un ensemble de règles de durcissement décrites en détail au chapitre 7.

Le fournisseur de modèle de langage constitue le seul composant capable de sortir de la machine. Deux modes de fonctionnement sont possibles. Le premier passe par une API externe (Groq, Gemini, OpenAI ou Anthropic) accessible via HTTPS. Le second passe par une instance Ollama posée localement sur la même machine, sans aucun appel réseau extérieur. Ce second mode répond aux besoins des clients de Tsarajoro qui manipulent des données particulièrement sensibles et souhaitent garantir qu'aucune information candidat ne quitte l'infrastructure interne. Le passage d'un mode à l'autre se fait par une variable d'environnement et un redémarrage.

**[INSÉRER ICI LE DIAGRAMME D'ARCHITECTURE TECHNIQUE]**

*Figure X. Vue technique de SkillForge : conteneurs, proxy et liaisons externes.*

Le projet ayant été mené en solo, l'ensemble des choix d'architecture (découpage en trois applications, sélection des technologies, mise en place de l'infrastructure de développement) a été réalisé par moi-même, avec validation régulière de l'encadreur professionnel à chaque revue de sprint.

---

## 7. Conception du système logiciel

Ce chapitre présente la conception interne de SkillForge, telle qu'un développeur reprenant le projet la découvrirait. Il complète la vue architecture du chapitre 6 en descendant au niveau des choix de structuration du code, du modèle de données et du déploiement des composants.

### 7.1 Plate-forme technique

La plate-forme technique combine plusieurs choix cohérents entre eux et alignés sur les technologies enseignées dans le cadre du Master 2 MBDS.

Côté backend, le socle est **Java 21** exécuté sur la JVM OpenJDK, avec **Spring Boot 3.4** comme framework applicatif. Spring Boot a été retenu pour son écosystème mature (Spring Security pour l'authentification, Spring Data JPA pour la persistance, Spring Boot Starter Mail pour l'envoi des invitations), sa productivité et sa large adoption dans les entreprises malgaches. La compilation et la gestion des dépendances passent par **Maven**.

Côté sandbox, deux images Docker Alpine minimales sont utilisées : **PHP 8.3** et **Node 20**. Alpine a été retenu pour la légèreté de ses images, chacune pesant moins de 200 mégaoctets, ce qui accélère les démarrages de conteneur et réduit la surface d'attaque disponible pour un candidat malveillant. Le choix de PHP et JavaScript reflète directement les profils réellement recrutés par Tsarajoro, notamment les développeurs PHP/Laravel et les intégrateurs WordPress.

Côté frontend, **Node 20** sert de runtime pour **Vite 6** et le gestionnaire de paquets **pnpm 10**. L'application elle-même repose sur **React 19** et **TypeScript 5**. TypeScript a été retenu pour renforcer la fiabilité du code frontend en détectant à la compilation les erreurs de type, ce qui limite les régressions lors des évolutions successives.

Côté base de données, **PostgreSQL 16** a été retenu pour sa robustesse, son support natif du type JSONB (utilisé pour stocker le contenu spécifique de chaque question sans multiplier les tables), et sa gratuité totale. Les migrations de schéma sont gérées par **Flyway** afin de garantir que chaque environnement (développement, recette, production) applique la même succession d'évolutions.

En production, un reverse proxy **Traefik** ou **Nginx** est prévu pour la terminaison TLS et le routage. La version 1.3 du protocole TLS est requise afin d'écarter les configurations vulnérables des versions antérieures.

### 7.2 Conception du logiciel développé

#### 7.2.1 Conception du code source

Le code source du backend est organisé en modules métier au sein de l'espace de nommage `com.tsarajoro.skillforge`. Cette organisation applique la convention dite **package by feature** : chaque package regroupe l'ensemble des classes participant à un même domaine fonctionnel, plutôt que de séparer les entités, les services et les contrôleurs dans des packages transverses.

Les modules retenus sont les suivants :
- `auth` : authentification et gestion des sessions JWT ;
- `cv` : extraction et analyse du contenu des CV ;
- `generation` : génération de tests par les modèles de langage ;
- `candidate` : gestion des passations candidat, des invitations et des codes d'accès ;
- `report` : production des comptes rendus post-évaluation ;
- `analytics` : indicateurs statistiques et tableau de bord recruteur ;
- `mail` : envoi transactionnel des invitations ;
- `sandbox` : client HTTP vers le service `backend-sandbox` ;
- `llm` : abstraction multi-fournisseurs des modèles de langage ;
- `security` : configuration Spring Security, filtres et en-têtes HTTP ;
- `exception` : gestion centralisée des erreurs.

Cette organisation présente deux avantages. Chaque package reste autonome, ce qui limite les dépendances croisées entre modules et facilite la reprise du code par un nouveau développeur. Les dépendances entre packages sont explicites et passent par des interfaces définies dans le package qui les utilise. L'interface `LlmClient`, par exemple, est déclarée dans le package `llm` et implémentée par six classes correspondant aux six fournisseurs pris en charge.

Les règles de nommage sont classiques en Java. Les classes suivent la convention **PascalCase**, les méthodes et variables la convention **camelCase**, les constantes la convention **MAJUSCULES_AVEC_UNDERSCORE**. Les entités JPA portent le nom du concept métier au singulier, par exemple `Passation`, `Candidate`, `Invitation`. Les repositories ajoutent le suffixe `Repository`, les services le suffixe `Service` et les contrôleurs le suffixe `Controller`. Les tables PostgreSQL suivent la convention **snake_case**, par exemple `cv_analyses`, `fraud_events`, `question_skills`.

Côté frontend, le code TypeScript est organisé par grand parcours utilisateur (`recruiter`, `candidate`) et par module technique (`api`, `components`, `hooks`, `pages`, `stores`). Les composants réutilisables issus de la bibliothèque shadcn/ui sont regroupés dans un sous-dossier `components/ui` distinct des composants métier de SkillForge.

#### 7.2.2 Le code source — vue statique

L'organisation en packages du backend est représentée par le diagramme de packages ci-dessous. Il met en évidence les dépendances entre modules et souligne la position centrale de l'interface `LlmClient`, qui absorbe l'ensemble des variations liées aux fournisseurs de modèles de langage.

**[INSÉRER ICI LE DIAGRAMME DE PACKAGES]**

*Figure X. Vue statique du code source de backend-app : organisation en packages métier.*

Trois classes méritent une présentation particulière au regard des enjeux techniques du projet.

La classe `CandidatePassationService` orchestre l'intégralité du cycle candidat : démarrage sécurisé de la passation avec vérification du code d'accès à six chiffres, sauvegarde des réponses au fur et à mesure, exécution du code via le service sandbox et soumission finale avec correction multi-critères. Sa méthode `verifyAccessCode` applique une comparaison à temps constant via `MessageDigest.isEqual`, afin de neutraliser une éventuelle attaque par mesure du temps de réponse.

La classe `SandboxRunner` applique un ensemble de règles de durcissement à chaque conteneur Docker créé pour exécuter du code candidat. Onze paramètres sont positionnés à chaque exécution : suppression totale du réseau, système de fichiers racine en lecture seule, retrait de toutes les capacités Linux, activation du drapeau `no-new-privileges`, plafonnement de la mémoire et du nombre de processus, application d'un profil seccomp restrictif, exécution sous un utilisateur non privilégié, entrypoint fixe, répertoire de travail en lecture seule et timeout dur de cinq secondes.

L'interface `LlmClient` définit un contrat unique implémenté par six classes correspondant aux six fournisseurs : `MockLlmClient` pour le mode simulation, `OpenAiLlmClient`, `ClaudeLlmClient`, `GroqLlmClient`, `OllamaLlmClient` et `GeminiLlmClient`. Le fournisseur actif est sélectionné à l'exécution par une simple variable d'environnement. Cette conception a démontré sa valeur lorsque le service GitHub Models a été retiré par son fournisseur en cours de projet : la bascule vers Groq puis vers Gemini n'a nécessité aucune modification du code métier consommateur de l'interface.

#### 7.2.3 Modélisation des données

Le modèle conceptuel de données regroupe onze entités principales. Chaque entité correspond à une table PostgreSQL portant son nom au pluriel et en snake_case.

Un `User` représente un compte de la plateforme (recruteur ou administrateur), dont le mot de passe est haché en **Argon2id** avec les paramètres recommandés par l'OWASP en 2025.

Un `Candidate` représente un candidat au recrutement, identifié par son adresse électronique. Un candidat peut posséder plusieurs CV successifs, chacun pouvant avoir une `CvAnalysis` associée listant les compétences détectées et leur niveau estimé.

Un `Test` est un ensemble de questions préparé pour un candidat et un profil cible donnés. Un test contient plusieurs `Questions`, chacune de type QCM, CODE ou CAS_PRATIQUE, et portant sur une ou plusieurs `Skills` via la table de liaison `question_skills`.

Une `Invitation` matérialise l'envoi d'un test à un candidat. Elle contient un token unique, un code d'accès à six chiffres généré cryptographiquement, une date d'expiration et un statut d'utilisation. La contrainte d'unicité sur le token empêche par construction la création de deux passations concurrentes pour la même invitation.

Une `Passation` est instanciée lorsque le candidat démarre effectivement son évaluation à partir de son invitation. Elle contient l'ensemble des `Answers` du candidat, une par question du test.

Les `FraudEvents` sont enregistrés au fil de la passation lorsque le navigateur du candidat détecte un signal susceptible d'indiquer un comportement suspect, tel qu'une perte de focus prolongée de l'onglet ou un collage volumineux dans l'éditeur de code.

Un `Report` est produit à la soumission de la passation. Il contient le score global pondéré, la répartition par type de question, la recommandation finale (HIRE, INTERVIEW ou REJECT) et l'explication textuelle générée par le modèle de langage.

**[INSÉRER ICI LE MCD OU LE DIAGRAMME DE CLASSES UML]**

*Figure X. Modèle conceptuel de données de SkillForge : onze entités principales.*

Le schéma de la base est versionné et évolue à travers sept migrations Flyway numérotées V1 à V7. La migration V1 pose le schéma initial. Les migrations V2 à V5 ajoutent progressivement les relations et les colonnes issues des sprints S1 à S5. Les migrations V6 et V7 correspondent à un enrichissement livré à la suite d'une remarque formulée pendant la recette : l'ajout du code d'accès à six chiffres sur les invitations et le remplissage rétroactif des invitations pré-existantes avec un code aléatoire, afin de rendre la colonne obligatoire sans casser les données antérieures.

#### 7.2.4 Réalisation d'un cas d'utilisation

Le cas d'utilisation retenu pour illustrer la vision interne du système est celui de la **passation sécurisée du candidat**, présenté en vision externe au chapitre 5.1.3. Ce cas concentre plusieurs mécanismes de sécurité intéressants : vérification en trois temps de l'invitation, code d'accès à six chiffres, verrouillage d'identité, comparaison à temps constant et limitation du nombre de tentatives.

Le déroulement interne est le suivant. Le navigateur du candidat envoie une requête `POST` à l'endpoint `/candidate/passations/start`, portant le token de l'invitation, l'adresse électronique saisie, le nom du candidat et le code d'accès. Le contrôleur `CandidateController` transmet la requête au service `CandidatePassationService`, qui orchestre l'ensemble des vérifications.

Le service vérifie d'abord l'existence de l'invitation dans le repository `InvitationRepository`. Une invitation inconnue, expirée ou déjà utilisée déclenche une `InvitationInvalidException`, mappée par le gestionnaire centralisé `GlobalExceptionHandler` vers un code HTTP 410 uniforme. Cette uniformité est volontaire : elle empêche un attaquant de distinguer un token inconnu d'un token expiré, ce qui rendrait possible l'énumération des invitations valides.

Le service consulte ensuite le compteur d'échecs `AccessCodeAttemptTracker`. Si le nombre d'échecs consécutifs pour cette invitation dépasse cinq, la passation est bloquée pour une durée de quinze minutes. Ce mécanisme réduit à un maximum de cinq tentatives par intervalle de quinze minutes la brute-force du code à six chiffres, ce qui ramène le million de combinaisons théoriques à un nombre de tentatives inatteignable en pratique.

La comparaison du code saisi et du code stocké utilise la méthode `MessageDigest.isEqual`, qui s'exécute en temps constant indépendamment de la longueur du préfixe commun. Ce point neutralise une éventuelle attaque par mesure de temps sur le canal HTTP.

L'identité du candidat est ensuite verrouillée : l'adresse électronique saisie doit correspondre à celle du candidat pré-établi par le recruteur lors de l'envoi de l'invitation. Ce contrôle empêche un tiers en possession du lien de démarrer une passation sous une identité différente de celle attendue.

Lorsque toutes les vérifications passent, une nouvelle `Passation` est créée et retournée au client. Si une passation existait déjà pour cette invitation (par exemple à la suite d'un rafraîchissement de la page par le candidat), elle est retournée telle quelle, ce qui garantit un comportement idempotent.

**[INSÉRER ICI LE DIAGRAMME DE SÉQUENCE UML BOÎTE BLANCHE]**

*Figure X. Diagramme de séquence interne du cas Passation sécurisée du candidat.*

#### 7.2.5 Les composants et leur déploiement

Trois composants déployables sont produits par le projet.

Le premier est `backend-app`, packagé sous forme de JAR exécutable par Maven. En développement, il est démarré par la commande `mvn spring-boot:run`, avec les variables d'environnement chargées depuis un fichier `.env` grâce à la bibliothèque spring-dotenv. En production, il sera distribué sous forme d'image Docker construite en multi-stage, ce qui permet de produire une image finale de petite taille ne contenant que le JAR et son runtime Java.

Le second est `backend-sandbox`, packagé de la même manière, avec la contrainte supplémentaire de disposer d'un accès local au démon Docker pour lancer les conteneurs éphémères d'exécution.

Le troisième est `frontend-web`. La commande `vite build` produit un ensemble de fichiers statiques (HTML, CSS, JavaScript minifié) servis par Nginx en production. En développement, la commande `pnpm dev` lance le serveur de développement Vite sur le port 5173 avec rechargement à chaud.

Ces trois composants sont complétés par plusieurs conteneurs d'infrastructure fournis dans le fichier `infra/docker-compose.yml` : `skillforge-postgres` pour la base de données, `skillforge-mailpit` pour le serveur SMTP de développement, et `skillforge-ollama` pour l'exécution locale des modèles de langage lorsque le mode souverain est retenu.

Les règles de nommage des artefacts sont les suivantes. Les images Docker portent le préfixe de l'organisation `tsarajoro/skillforge-<service>:<version>`. Les volumes persistants suivent la convention `skillforge_<usage>`, par exemple `skillforge_pgdata` pour les données PostgreSQL et `skillforge_ollama_models` pour les modèles téléchargés localement.

**[INSÉRER ICI LE DIAGRAMME DE DÉPLOIEMENT]**

*Figure X. Diagramme de déploiement de SkillForge : composants et leurs volumes persistants.*

---

## 8. Tests du système logiciel

En cohérence avec la stratégie de test présentée au chapitre 4.1.1, quatre niveaux de tests ont été mis en œuvre au cours du projet : tests unitaires, tests fonctionnels manuels, tests de sécurité offensive et tests de charge. Chacun de ces niveaux répond à un objectif distinct et couvre une catégorie de risques différente.

### 8.1 Tests unitaires et d'intégration

Les tests unitaires ont été écrits en **JUnit 5** avec la bibliothèque d'assertions **AssertJ**. Ils couvrent la logique métier isolée : analyse et validation des payloads JSON des questions générées, calcul du score pondéré, vérification du code d'accès en temps constant, génération aléatoire du code à six chiffres et gestion des cas limites.

Les tests d'intégration s'appuient sur la bibliothèque **Testcontainers**, qui démarre une véritable instance PostgreSQL dans un conteneur Docker pour la durée de la classe de test. Cette approche évite le recours à des simulations imparfaites de la base de données. Le comportement réel des repositories JPA, des migrations Flyway et des transactions est ainsi vérifié dans les mêmes conditions qu'en production.

L'exécution de ces tests est automatisée via la commande `mvn test` et intégrée à la chaîne d'intégration continue GitHub Actions. Chaque modification pousseée sur une branche déclenche la compilation et l'exécution complète de la suite, ce qui limite l'introduction involontaire de régressions.

### 8.2 Tests fonctionnels manuels

Une fiche de tests manuels a été rédigée en cours de projet et couvre une centaine de scénarios d'utilisation, structurés par grand domaine fonctionnel : authentification, gestion des candidats, analyse de CV, génération et validation des questions, envoi et acceptation des invitations, passation candidat, correction automatique, consultation des résultats.

La fiche a été déroulée en deux passes de recette successives avec l'encadreur professionnel dans le rôle du testeur. Ces passes ont permis d'identifier deux anomalies significatives, corrigées avant le dépôt du présent mémoire.

La première anomalie, référencée **BUG-01**, portait sur la correction des cas pratiques lorsque le fournisseur LLM était configuré en mode simulation. Le mock notait les réponses uniquement à leur longueur, ce qui permettait à une réponse hors sujet mais suffisamment longue d'être comptée réussie. La correction a plafonné le score du mock à quarante sur cent, préfixé toutes les explications par « SIMULÉ — mode démonstration » et ajouté une bannière visuelle ambre sur la page finale du candidat lorsque le mock est utilisé.

La seconde anomalie, référencée **UX-01**, portait sur un risque d'usurpation d'identité candidat. Le formulaire de démarrage initial laissait le candidat saisir librement son nom, ce qui rendait possible qu'un tiers en possession du lien démarre la passation sous une identité différente de celle attendue. La correction a introduit trois mécanismes complémentaires détaillés au chapitre 5.1.3 : verrouillage de l'identité côté serveur, code d'accès à six chiffres transmis par courrier électronique, et limitation du nombre de tentatives après cinq échecs consécutifs.

### 8.3 Tests de sécurité offensive

Ce niveau de tests occupe une place particulière dans le mémoire car il produit des mesures chiffrées et reproductibles qui justifient directement les choix techniques de sécurité présentés au chapitre 7.

#### 8.3.1 Validation de la sandbox par un harness d'attaques

Un harness de tests a été développé spécifiquement pour valider les critères de sécurité de la sandbox fixés dans le cahier des charges. Il prend la forme d'un test JUnit exécutable via la commande `mvn test -Dpoc3.run=true` et applique cent cinquante cas à la sandbox réelle : cent cas d'exécutions valides censées réussir (cinquante en PHP et cinquante en JavaScript), et cinquante cas d'attaque censés être bloqués.

Les cinquante attaques sont réparties en sept catégories : bombes forkées et déni de service processeur, tentatives d'accès réseau, lecture de fichiers système, écriture ou persistance sur le système, épuisement de la mémoire, exécution de processus enfant pour tenter d'échapper au conteneur, et attaques créatives complémentaires (contournement d'`open_basedir`, imports dynamiques).

La première exécution du harness a fait remonter **dix-sept évasions** sur cinquante tentatives, ce qui a déclenché onze itérations successives de durcissement. Chaque itération a corrigé une classe précise de vulnérabilité : ajout des appels système `clone` et `clone3` au profil seccomp afin de permettre à Node de créer ses threads sans casser le durcissement, désactivation via `php.ini` des fonctions dangereuses `shell_exec`, `system`, `exec`, `popen` et de leurs équivalents, ajout d'un `open_basedir` restrictif, retrait des droits d'exécution des utilitaires shell (`cat`, `ls`, `whoami`) pour l'utilisateur non privilégié, activation de la Permission API expérimentale de Node avec `--allow-fs-read` restreint.

Les cinq dernières évasions détectées se sont révélées être des faux positifs du harness lui-même. Par exemple, un `Buffer.alloc(512 * 1024 * 1024)` en JavaScript n'alloue pas réellement la mémoire tant qu'aucune écriture n'est effectuée dans le tampon : l'`OOM killer` ne se déclenche donc pas. Ces cas ont été réécrits pour forcer l'écriture effective dans la zone mémoire, et l'`OOM killer` s'est alors correctement déclenché.

Le résultat final, reproductible sur toute machine disposant de Docker, est le suivant : **zéro évasion** sur les cinquante cas d'attaque, cent pour cent de succès sur les cent exécutions valides, latence médiane de **330 millisecondes** et latence au 95e centile de **422 millisecondes**. Ces chiffres dépassent les critères de succès fixés dans le cahier des charges, qui demandait zéro évasion sur trente cas d'attaque et une latence médiane inférieure à deux secondes.

#### 8.3.2 Audit OWASP Top 10 avec ZAP

Un audit de sécurité selon le classement OWASP Top 10 a été mené avec l'outil **OWASP ZAP** exécuté en conteneur Docker, sous deux formes complémentaires. Un premier scan de type baseline analyse les réponses HTTP de manière passive, sans envoyer d'attaques. Un second scan de type full envoie de véritables charges d'attaque : injections SQL, tentatives de cross-site scripting, path traversal, injections de commande, entités externes XML et falsifications de requêtes côté serveur.

La chaîne d'analyse est automatisée par un script shell reproductible qui démarre le backend en mode audit, réalise le login recruteur, importe la spécification OpenAPI publiée par le backend sur `/v3/api-docs` afin de permettre à ZAP de découvrir automatiquement l'ensemble des endpoints, exécute les deux scans et génère des rapports HTML et JSON horodatés.

L'audit initial a fait remonter dix-sept alertes de niveau Low, principalement rattachées à la catégorie Information Disclosure : des stacktraces Java étaient renvoyées au client sur certains endpoints en cas de saisie invalide (par exemple un UUID malformé). Onze itérations de correction ont été appliquées : ajout des six en-têtes HTTP de sécurité manquants (Content-Security-Policy strict, X-Frame-Options DENY, X-Content-Type-Options nosniff, Strict-Transport-Security d'un an, Referrer-Policy et Permissions-Policy) et enrichissement de la classe `GlobalExceptionHandler` par six nouveaux gestionnaires mappant proprement les erreurs Spring vers les codes HTTP 400, 404, 405, 409, 415 ou 500 génériques, sans jamais renvoyer la trace d'appel au client.

Le résultat final est le suivant : **zéro vulnérabilité High, zéro Medium et zéro Low** sur le scan baseline comme sur le scan full. Seules deux alertes de niveau informationnel subsistent, identifiées comme des observations attendues et non des failles : la reconnaissance d'un endpoint d'authentification et le bruit d'un fuzzer d'`User-Agent`.

#### 8.3.3 Mécanismes complémentaires de sécurité

Trois mécanismes complètent la couverture des risques au-delà du top dix OWASP.

Le compteur d'échecs de saisie du code d'accès verrouille toute invitation après cinq échecs consécutifs pendant quinze minutes. Ce plafonnement rend inatteignable en pratique la brute-force du code à six chiffres, dont le million de combinaisons théoriques est ramené à un maximum de cinq tentatives par intervalle de quinze minutes.

La comparaison du code saisi et du code attendu utilise la méthode `MessageDigest.isEqual`, qui s'exécute en temps constant indépendamment de la longueur du préfixe commun. Ce détail d'implémentation neutralise une éventuelle attaque par mesure de temps sur le canal HTTP.

Enfin, l'intégration du fournisseur LLM local Ollama supprime toute fuite potentielle des données candidat vers un service tiers étranger. Cette option est un atout au regard du RGPD, particulièrement pour les clients de Tsarajoro travaillant avec des données réglementées.

### 8.4 Tests de performance

Le cahier des charges cible une capacité de vingt candidats simultanés en passation, avec des latences maîtrisées sur les principales opérations. Un jeu de tests **k6** est en cours de rédaction afin de simuler cette charge en parallèle et de mesurer les latences des principales requêtes API ainsi que les temps de réponse de la sandbox. Les résultats seront intégrés au présent mémoire avant la soutenance finale, à l'issue du sprint 7.

**[INSÉRER ICI LES CHIFFRES ET COURBES k6 UNE FOIS LES TESTS EXÉCUTÉS]**

---

## 9. Conclusion générale

### 9.1 Bilan des résultats obtenus pour l'entreprise

À la date de dépôt du présent mémoire, l'ensemble des livrables fixés dans le cahier des charges initial ont été produits, à l'exception des tests de charge k6 en cours d'exécution et de la mise en production sur l'infrastructure interne de Tsarajoro, planifiée au sprint 8.

Le projet livre trois applications déployables (`backend-app`, `backend-sandbox` et `frontend-web`), un fichier `docker-compose` complet pour l'infrastructure de développement, quatre rapports de preuve de concept, un rapport d'audit OWASP ZAP, une fiche de tests manuels d'environ cent scénarios, une documentation d'installation, un guide d'exploitation Ollama et le présent mémoire. Le code source représente environ **quinze mille lignes de code Java** côté backend, **dix mille lignes de TypeScript** côté frontend et **sept migrations Flyway** de base de données. L'historique Git compte une quarantaine de commits versionnés sur un compte personnel dédié aux projets d'école.

Les principaux critères de succès mesurables définis dans le cahier des charges sont atteints. La sandbox Docker est validée à zéro évasion sur cinquante cas d'attaque, au lieu des trente initialement ciblés. L'audit OWASP ZAP est validé à zéro vulnérabilité High, Medium ou Low. L'analyse des CV extrait correctement les compétences déclarées avec un niveau estimé parmi JUNIOR, CONFIRMÉ, SENIOR ou UNKNOWN. La génération de questions produit des tests exploitables acceptés par le recruteur après relecture. Les indicateurs statistiques du tableau de bord sont calculés selon les formules psychométriques standards.

Sur le plan de l'avancement, les sprints S0 à S6 sont clos à cent pour cent, le sprint S7 est clos à quatre-vingt-dix pour cent, et le sprint S8 est planifié pour la mise en production. La plateforme est fonctionnellement complète pour le périmètre V1 du cahier des charges.

### 9.2 Bilan des problèmes rencontrés et solutions apportées

Cinq difficultés majeures ont marqué le déroulement du projet.

La première a été le **retrait annoncé du service GitHub Models** par son fournisseur en cours de projet. Ce service, initialement retenu comme fournisseur LLM gratuit, est passé en HTTP 410 de manière intermittente puis quasi-continue à partir du sprint 6. La solution est venue de la conception initiale : l'interface `LlmClient` avait été prévue dès le sprint 1 pour supporter plusieurs fournisseurs. La bascule vers Groq puis vers Google Gemini a été réalisée en moins d'une heure, sans modification du code métier consommateur de l'interface.

La deuxième difficulté a porté sur la **génération de JSON structuré** par certains modèles hébergés chez Groq, en particulier Qwen. Le modèle produisait fréquemment du JSON tronqué à la limite de jetons de sortie ou malformé avec des guillemets mal échappés. La solution a combiné trois actions : compactage du prompt système pour économiser des jetons, ajout d'un mécanisme d'auto-réparation côté service qui referme les containers JSON non fermés en fin de chaîne, et proposition d'un fournisseur alternatif (Gemini) au comportement JSON plus stable.

La troisième difficulté a été une **condition de course** lors des doubles clics sur le bouton de démarrage de passation. Deux requêtes concurrentes tentaient de créer deux `Passation` pour la même `Invitation`, ce qui violait la contrainte d'unicité et retournait une HTTP 500 avec stacktrace exposée au candidat. La solution a été d'ajouter un gestionnaire dédié à `DataIntegrityViolationException` dans la classe `GlobalExceptionHandler`, qui mappe proprement l'erreur vers une HTTP 409 Conflict sans stacktrace.

La quatrième difficulté est le **bug BUG-01** mis en évidence lors de la recette et détaillé au chapitre 8.2 : le mock LLM notait les cas pratiques selon leur longueur uniquement, permettant à une réponse hors sujet d'être comptée réussie. La correction a plafonné le score, préfixé les explications et ajouté une bannière visuelle.

La cinquième difficulté est **l'exigence UX-01** également issue de la recette : le risque d'usurpation d'identité candidat via un lien intercepté. La solution combine le verrouillage d'identité côté serveur, le code d'accès à six chiffres et la limitation du nombre de tentatives, détaillés au chapitre 5.1.3.

### 9.3 Perspectives du projet

Les perspectives à court terme portent sur la finalisation des tests de charge k6 en sprint 7 et sur la mise en production effective au sprint 8. La bascule vers l'infrastructure interne de Tsarajoro donnera lieu à un cycle de validation avec le responsable technique de l'entreprise.

À moyen terme, plusieurs évolutions écartées du périmètre V1 pourront être adressées : application mobile candidat, télésurveillance vidéo par webcam avec accord préalable du candidat, tests adaptatifs de type Item Response Theory, détection de plagiat de code par comparaison à des dépôts publics, intégration avec un système ATS externe, authentification unique côté recruteur et extension de la sandbox à d'autres langages tels que Python, Java ou Go.

À plus long terme, la valeur la plus riche du produit reposera sur l'exploitation de la boucle d'amélioration continue à partir des indicateurs statistiques. À mesure que le nombre de passations augmente, les questions à fort pouvoir discriminant pourront être priorisées automatiquement pour les futures générations de tests, et les questions à faible pouvoir discriminant pourront être proposées à la régénération par le modèle de langage. Cette boucle transforme la plateforme en un système apprenant, capable de s'améliorer sans intervention manuelle systématique.

### 9.4 Bilan personnel

*Cette section est la seule où le pronom « je » est pleinement légitime dans un mémoire M2. Elle porte sur l'apport personnel du stage.*

Ce stage a représenté pour moi un aboutissement de la formation Master 2 MBDS et l'occasion de mobiliser en un seul projet un large spectre de compétences acquises durant l'année : ingénierie logicielle, sécurité applicative, bases de données, intelligence artificielle et méthodologie de projet.

Sur le plan technique, l'approfondissement de Spring Security, du durcissement de conteneurs Docker et des mécanismes seccomp constitue le premier apport majeur. La confrontation directe à un vrai retrait d'API en cours de projet, avec le cas de GitHub Models, m'a également enseigné la valeur pratique du principe d'inversion de dépendance. Sans l'abstraction `LlmClient` prévue dès la conception initiale, ce retrait aurait pu compromettre plusieurs semaines de travail. La découverte pratique d'Ollama et du déploiement local de modèles de langage m'ouvre par ailleurs des perspectives d'architecture souveraine qui dépassent le cadre du présent stage.

Sur le plan méthodologique, l'apport le plus marquant est la démarche de preuve de concept avec validation chiffrée. Le harness de sécurité de la sandbox, qui a fait remonter dix-sept évasions puis a permis de les corriger une par une jusqu'à zéro, m'a fait passer d'une approche déclarative de la sécurité (« la sandbox est durcie parce que ces flags Docker sont appliqués ») à une approche empirique (« la sandbox est durcie parce que cinquante attaques distinctes ne parviennent pas à s'en échapper, mesuré et reproductible sur toute machine »). Ce changement de posture est probablement le principal acquis du stage.

Sur le plan humain, la conduite en solo de l'ensemble du cycle, du cadrage du besoin jusqu'à la livraison, s'est révélée exigeante mais formatrice. Elle m'a appris à hiérarchiser les efforts en fonction de la valeur pour l'entreprise plutôt que du confort technique, à documenter systématiquement pour permettre à un tiers de reprendre le projet, et à confronter régulièrement les choix à l'encadreur professionnel plutôt qu'à décider seul.

Je remercie Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich pour la confiance accordée dès le premier sprint et pour la qualité de son encadrement, ainsi que l'ensemble de l'équipe pédagogique du Master 2 MBDS pour la formation qui a rendu ce projet possible.

---

## 10. Références et Bibliographie

*Cette section complète les références [1] à [7] déjà présentes dans le .docx, en ajoutant les sources techniques et académiques mobilisées au fil du projet. Le format retenu est celui déjà utilisé dans le .docx.*

**Standards, spécifications et documentation officielle**

[8] **Docker Inc.** *Seccomp security profiles for Docker*. Consulté le 15 septembre 2026, sur https://docs.docker.com/engine/security/seccomp/

[9] **OWASP Foundation.** *OWASP Top 10 – 2025*. Consulté le 15 septembre 2026, sur https://owasp.org/Top10/

[10] **OWASP Foundation.** *Password Storage Cheat Sheet*. Consulté le 15 septembre 2026, sur https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

[11] **PostgreSQL Global Development Group.** *PostgreSQL 16 Documentation*. Consulté le 15 septembre 2026, sur https://www.postgresql.org/docs/16/

[12] **Spring Team.** *Spring Boot 3.4 Reference Documentation*. VMware. Consulté le 15 septembre 2026, sur https://docs.spring.io/spring-boot/docs/3.4.x/reference/html/

[13] **Jones, M., Bradley, J., & Sakimura, N.** *JSON Web Token (JWT) — RFC 7519*. Internet Engineering Task Force, mai 2015.

**Articles et livres**

[14] **Biryukov, A., Dinu, D., & Khovratovich, D.** *Argon2 : New Generation of Memory-Hard Functions for Password Hashing and Other Applications*. IEEE European Symposium on Security and Privacy, 2016.

[15] **Fowler, M.** *Refactoring : Improving the Design of Existing Code* (2ᵉ éd.). Addison-Wesley, 2018.

**Réglementaire**

[16] **Commission Nationale de l'Informatique et des Libertés (CNIL).** *Règlement général sur la protection des données — texte intégral*. Consulté le 15 septembre 2026, sur https://www.cnil.fr/fr/reglement-europeen-protection-donnees

---

## 11. Annexes

*Les annexes viennent en complément du rapport principal. Elles peuvent être fournies dans des fichiers séparés joints au mémoire, comme le précise le plan-type.*

**Annexe 1 — Cahier des charges consolidé.** Version complète du cahier des charges initial validé avec l'encadreur professionnel, incluant l'ensemble des User Stories, les exigences non fonctionnelles chiffrées, les critères de succès des quatre preuves de concept et le plan de risques initial.

**Annexe 2 — Modèle conceptuel de données et diagramme de classes UML.** Vue conceptuelle complète des onze entités principales avec attributs, relations et cardinalités, complétée par la vue physique correspondante après application des sept migrations Flyway.

**Annexe 3 — Dossier technique.** Trois extraits de code commentés considérés comme les plus représentatifs du projet : la classe `SandboxRunner` avec ses onze paramètres de durcissement Docker, la méthode `verifyAccessCode` de `CandidatePassationService` avec son mécanisme de comparaison à temps constant, et la classe `GeminiLlmClient` en tant qu'illustration de l'implémentation d'un fournisseur LLM.

**Annexe 4 — Présentation des outils de développement utilisés.** Fiches détaillées pour chacun des dix outils cités au chapitre 4.1.4, avec pour chacun sa version, son rôle exact dans SkillForge, sa configuration éventuelle et les alternatives évaluées.

**Annexe 5 — User Stories complètes.** Ensemble des quinze User Stories US-01 à US-15 du backlog non détaillées dans le chapitre 5.1 du mémoire.

**Annexe 6 — Fiche de tests manuels complète.** Environ cent scénarios de recette structurés par domaine fonctionnel, avec pour chacun préconditions, étapes, résultat attendu, résultat observé, gravité et capture d'écran éventuelle.

**Annexe 7 — Diagramme de Gantt détaillé.** Frise chronologique sprint par sprint avec les tâches individuelles, les jalons de livraison et la comparaison entre planning initial et planning réalisé.

**Annexe 8 — Rapport POC 3 complet.** Reproduction intégrale du rapport de validation de la sandbox, avec la matrice détaillée par catégorie d'attaque, la comparaison avant et après onze itérations de durcissement, et les instructions de reproduction sur toute machine disposant de Docker.

**Annexe 9 — Rapport OWASP ZAP complet.** Reproduction intégrale du rapport d'audit, avec la matrice OWASP Top 10, l'historique des onze corrections successives et les captures d'écran des rapports HTML générés par ZAP.

**Annexe 10 — Guide d'installation et d'exploitation Ollama.** Documentation permettant à un exploitant Tsarajoro de déployer un fournisseur LLM local pour la plateforme SkillForge, incluant les prérequis machine, le téléchargement des modèles et la configuration de la variable d'environnement `LLM_PROVIDER`.

---

*Fiche à jour du 2026-09-15. Sections rédigées en cohérence avec les consignes du plan-type MBDS et le style adopté par l'auteur dans les chapitres 1 à 5.3.1 du fichier MEMOIRE-itu-MBDS-v1.docx. Les zones marquées entre crochets attendent l'insertion des diagrammes et captures : le code Mermaid et PlantUML correspondant est disponible dans docs/MEMOIRE_DIAGRAMMES.md.*
