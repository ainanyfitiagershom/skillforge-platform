# Script oral soutenance SkillForge — 20 slides / 20 minutes

> Script prêt à mémoriser pour la soutenance M2 MBDS.
> Aligné sur `06_PLAN_SLIDES_V2.md` (20 slides v2) et le mémoire v3.
> Rédigé le 2026-10-06.

---

## 0. Vue d'ensemble des durées

| Slide | Titre | Durée cible | Durée cumulée |
|---|---|---|---|
| 1/20 | Titre | 30 s | 0:30 |
| 2/20 | Plan de la présentation | 20 s | 0:50 |
| 3/20 | Le recrutement technique aujourd'hui | 45 s | 1:35 |
| 4/20 | Tsarajoro et mission du stage | 45 s | 2:20 |
| 5/20 | Benchmark des solutions existantes | 1 min 00 | 3:20 |
| 6/20 | Pourquoi développer en interne | 1 min 00 | 4:20 |
| 7/20 | Existant Tsarajoro et solution retenue | 45 s | 5:05 |
| 8/20 | Cinq objectifs mesurables | 1 min 00 | 6:05 |
| 9/20 | Démarche projet, planning, risques | 1 min 15 | 7:20 |
| 10/20 | Architecture logicielle et conception | 1 min 15 | 8:35 |
| 11/20 | Pipeline IA du CV au verdict | 1 min 00 | 9:35 |
| 12/20 | Sandbox durcie : 7 verrous | 1 min 15 | 10:50 |
| 13/20 | IA multi-fournisseurs | 45 s | 11:35 |
| 14/20 | Démo : parcours recruteur | 2 min 00 | 13:35 |
| 15/20 | Démo : parcours candidat | 1 min 30 | 15:05 |
| 16/20 | Démo : blocage d'attaque et rapport | 1 min 30 | 16:35 |
| 17/20 | Résultats mesurés | 1 min 15 | 17:50 |
| 18/20 | Bilan des livrables | 45 s | 18:35 |
| 19/20 | Difficultés, apports, perspectives | 1 min 15 | 19:50 |
| 20/20 | Conclusion et message clé | 30 s | 20:20 |

**Total cible : 20 min 20** (marge de 20 s absorbée par les transitions ; viser 19 min 45 à l'oral pour rester sous 20 min).

---

## 1. Conseils généraux avant la soutenance

- Respirer avant de commencer, poser la voix, débit modéré.
- Regarder le jury quand on parle d'objectifs et de résultats ; regarder la slide quand on introduit une figure ou un tableau.
- La démo est intégrée aux slides 14 à 16 sous forme d'une vidéo pré-enregistrée (5 minutes). Elle est jouée automatiquement à l'arrivée sur la slide 14, le commentaire se fait en voix off par-dessus. Prévoir le fichier `demo-video.mp4` sur le bureau et sur une clé USB au cas où le lecteur de slides refuse l'embed.
- Boire une gorgée d'eau en fin de slide 16, avant d'enchaîner sur les résultats (slide 17).
- Tenue sobre adaptée au contexte académique.
- Message clé à répéter trois fois dans la soutenance : slide 11, slide 16, slide 20 — **« l'IA propose, le recruteur décide »**.
- Formulation OWASP exacte : **« aucune alerte de niveau élevé, moyen ou faible »**. Ne jamais dire « zéro vulnérabilité ».
- Vocabulaire interdit : « nouvelle génération », « entièrement assistée par IA », « révolutionnaire », « innovant ». Dire plutôt : plateforme interne, assistance IA, exécution isolée, contrôle humain.
- Terminologie Scrum : parler de **Sprint 0 à Sprint 8**, jamais de « POC ».
- Si la vidéo démo plante (lecture bloquée, son coupé) : rester calme, reprendre le fil au point où la vidéo s'est arrêtée, et basculer sur la clé USB au besoin. Les scripts des slides 14-16 restent compréhensibles sans la vidéo.

---

## 2. Script détaillé slide par slide

---

### Slide 1/20 — Titre (durée cible : 30 s)

**Action à l'écran** : slide affichée avant le début, ouvrir la soutenance en se levant face au jury.

**Script** :

> « Bonjour. Je m'appelle Ny Aina Fitia GERSHOM, étudiant en Master 2 MBDS à l'Université Côte d'Azur et à l'ITU. Je vais vous présenter mon projet de fin d'études : SkillForge, une plateforme web d'évaluation technique des candidats, assistée par un modèle de langage et avec exécution isolée du code. Ce projet a été réalisé pendant un stage de quatre mois chez Tsarajoro, à Antananarivo, sous l'encadrement de M. RAVELOMANANTIANA. »

**Transition vers slide 2** : « Voici le plan de la présentation. »

**Note** : ne pas s'attarder. Prononcer clairement son propre nom. Ne pas lire le titre tel qu'il est sur la slide, le reformuler.

---

### Slide 2/20 — Plan de la présentation (durée cible : 20 s)

**Action à l'écran** : avancer d'une slide.

**Script** :

> « La présentation suit six blocs : d'abord le contexte et la problématique ; ensuite l'état de l'art et les choix de conception ; puis les objectifs et la démarche projet ; l'architecture et la sécurité ; une démonstration en trois temps ; et enfin les résultats, le bilan et les perspectives. »

**Transition vers slide 3** : « Je commence par le contexte. »

**Note** : ne pas détailler les sous-points, juste nommer les six blocs. Pointer le fil conducteur avec la main si disponible.

---

### Slide 3/20 — Le recrutement technique aujourd'hui (durée cible : 45 s)

**Action à l'écran** : avancer d'une slide, pointer les trois pictogrammes.

**Script** :

> « Le recrutement technique soulève quatre difficultés récurrentes. Le temps d'abord : la préparation des tests et leur correction manuelle mobilisent plusieurs heures par campagne. L'homogénéité ensuite : les tests varient selon la personne qui les fait passer. La fiabilité : vérifier qu'un candidat sait vraiment coder reste difficile avec un simple entretien. Et le suivi : les données restent éparpillées entre courriels, documents et notes personnelles. Le besoin est donc clair : évaluer plus vite, de manière cohérente, avec une trace, mais sans retirer le contrôle humain. »

**Transition vers slide 4** : « C'est ce besoin que Tsarajoro m'a confié. »

**Note** : poser la voix sur « sans retirer le contrôle humain » — c'est le fil rouge de toute la soutenance.

---

### Slide 4/20 — Tsarajoro et mission du stage (durée cible : 45 s)

**Action à l'écran** : avancer d'une slide, pointer le mini-schéma CV → Test → Rapport.

**Script** :

> « Tsarajoro est une entreprise du numérique basée à Antananarivo : développement web, WordPress, netlinking, contenus numériques. Elle recrute régulièrement des profils techniques et avait besoin d'un outil interne pour fiabiliser cette évaluation. La mission du stage : concevoir et développer une plateforme couvrant toute la chaîne, de l'analyse du CV à la synthèse des résultats, avec quatre fonctionnalités cibles : l'analyse du CV, la génération adaptative des tests, la passation sécurisée, et le rapport assisté. Stage de quatre mois, un stagiaire, un encadreur professionnel. »

**Transition vers slide 5** : « Avant d'expliquer les choix de conception, je situe SkillForge par rapport aux outils du marché. »

**Note** : ne pas lire la liste des fonctionnalités, elle est à l'écran. Montrer plutôt la logique CV → Test → Rapport avec la main.

---

### Slide 5/20 — Benchmark des solutions existantes (durée cible : 1 min 00)

**Action à l'écran** : avancer d'une slide, laisser le jury balayer le tableau pendant deux secondes.

**Script** :

> « J'ai comparé quatre outils du marché : HackerRank, Codility, CoderPad et TestGorilla. Tous disposent d'une sandbox et d'une banque de questions. Mais aucun ne propose à la fois l'analyse du CV par IA, la génération adaptative des questions, un rapport réellement assisté par IA, et un hébergement interne. Les coûts annuels se situent entre mille et deux mille dollars. SkillForge couvre l'ensemble de ces critères, pour un coût de développement interne de 1 050 000 ariary, soit environ 211 euros. »

**Transition vers slide 6** : « Trois décisions structurantes expliquent ce positionnement. »

**Note** : ne pas lire ligne par ligne. Dire la synthèse puis citer le chiffre budget. Si le jury regarde le tableau, laisser 2 s de silence.

---

### Slide 6/20 — Pourquoi développer en interne (durée cible : 1 min 00)

**Action à l'écran** : avancer, pointer la colonne « option écartée ».

**Script** :

> « Trois décisions, trois alternatives écartées. Premier choix : six modèles de langage derrière une abstraction unique, plutôt qu'un seul fournisseur. L'objectif est d'éviter la dépendance et de pouvoir basculer par simple variable d'environnement. Deuxième choix : isoler le code par Docker avec seccomp et cap-drop, plutôt que gVisor ou Firecracker. La raison est la maturité de l'outil, les compétences disponibles localement et le coût nul. Troisième choix : développer en interne plutôt que souscrire à HackerRank ou Codility. Les motifs sont le coût d'abonnement, le fait que les données restent locales, et la personnalisation. Pour chaque choix, un plan de repli existe : Ollama en local pour les modèles, timeout court pour la sandbox, Judge0 ou Piston comme alternatives open source. »

**Transition vers slide 7** : « Avant de parler des objectifs, un mot sur l'existant chez Tsarajoro. »

**Note** : ces trois choix seront probablement questionnés. Les énoncer avec assurance. Si le jury coupe, c'est bon signe.

---

### Slide 7/20 — Existant Tsarajoro et solution retenue (durée cible : 45 s)

**Action à l'écran** : avancer, pointer la colonne « Avant » puis « Après ».

**Script** :

> « Avant SkillForge, l'évaluation chez Tsarajoro reposait sur un courriel, un document partagé et une correction manuelle par un développeur senior. Résultat : des tests variables selon l'évaluateur, aucune exécution automatique du code, pas de traçabilité, aucun indicateur global. La solution retenue est une plateforme web interne qui enchaîne analyse du CV, génération, passation sandboxée et rapport. À chaque étape, le recruteur valide ce que l'IA propose. »

**Transition vers slide 8** : « Ce besoin se traduit par cinq objectifs mesurables. »

**Note** : phrase courte sur « avant / après », laisser le visuel parler. Terminer sur « le recruteur valide » — insister.

---

### Slide 8/20 — Cinq objectifs mesurables (durée cible : 1 min 00)

**Action à l'écran** : avancer, pointer les cinq cartes.

**Script** :

> « J'ai fixé cinq objectifs, tous repris du tableau 7 du mémoire. Premier : analyser le CV par IA, avec une extraction de compétences validée par le recruteur. Deuxième : générer trois types de tests — QCM, exercice de code, cas pratique. Troisième : sécuriser l'exécution avec zéro évasion sur cinquante scénarios d'attaque et un timeout de cinq secondes. Quatrième : soutenir vingt candidats simultanés avec un p95 inférieur à six secondes. Cinquième : restituer un rapport complet avec score, forces, faiblesses et section anti-fraude. Ces cinq objectifs seront repris chiffre par chiffre à la slide 17. »

**Transition vers slide 9** : « Pour les atteindre, j'ai suivi une démarche Scrum sur quatre mois. »

**Note** : annoncer explicitement « ces cinq objectifs seront repris » pour montrer la cohérence au jury. Ne JAMAIS dire quatre objectifs.

---

### Slide 9/20 — Démarche projet, planning, risques (durée cible : 1 min 15)

**Action à l'écran** : avancer, pointer le mini-Gantt horizontal.

**Script** :

> « J'ai travaillé en Scrum, par sprints de deux semaines, avec l'encadreur comme Product Owner et moi comme développeur. Le découpage réel est documenté dans le tableau 5 du mémoire : un Sprint 0 de cadrage sur douze jours, huit sprints de développement sur soixante-et-onze jours, quatre jours de tests, trois jours de livraison. Au total, 90 jours. Les sprints couvrent dans l'ordre les fondations, l'analyse de CV, la génération, la passation avec l'anti-fraude, la correction, le tableau de bord, les tests et la recette. Côté écart prévu-réalisé, l'anti-fraude a été anticipée du Sprint 5 vers le Sprint 4, ce qui a dégagé deux semaines. Trois risques ont été suivis : la qualité des générations IA — traité par un renforcement des prompts ; l'indisponibilité de GitHub Models — basculée vers OpenAI via l'abstraction ; les validations de l'encadreur — ajustées en continu. Les outils : GitHub, Docker, GanttProject, JUnit 5, OWASP ZAP, k6. »

**Transition vers slide 10** : « Je passe maintenant à l'architecture. »

**Note** : c'est une slide dense. Ralentir sur les chiffres (douze, soixante-et-onze, quatre, trois, quatre-vingt-dix). Respirer avant « Côté écart prévu-réalisé ».

---

### Slide 10/20 — Architecture logicielle et conception (durée cible : 1 min 15)

**Action à l'écran** : avancer, pointer la figure 8, puis le mini-MCD.

**Script** :

> « L'architecture comporte cinq blocs. Un frontend React 19 en TypeScript avec Vite. Un backend Spring Boot 3 sur Java 21, avec les modules Security, Data JPA et Web. Une base PostgreSQL 16 pilotée par sept migrations Flyway. Une sandbox Docker durcie, dont j'y reviens dans deux slides. Et une couche IA abstraite derrière une interface commune. Le principe directeur est simple : le frontend ne parle jamais à la sandbox. Toute exécution passe par le backend. Côté conception, deux cas d'usage structurent le projet : passer un test sécurisé, et analyser un CV. Et trois exigences non-fonctionnelles chiffrées : un p95 inférieur à six secondes, zéro évasion sur cinquante scénarios, un timeout de cinq secondes par exécution. Le modèle de données s'appuie sur trois tables clés : passation, réponse, et événement anti-fraude. »

**Transition vers slide 11** : « Au-dessus de cette architecture, le parcours fonctionnel passe par cinq étapes. »

**Note** : insister sur « le frontend ne parle jamais à la sandbox » — c'est une décision d'architecture qui rassure le jury.

---

### Slide 11/20 — Pipeline IA du CV au verdict (durée cible : 1 min 00)

**Action à l'écran** : avancer, pointer les cinq cases de gauche à droite.

**Script** :

> « Le pipeline comporte cinq étapes. Première : analyser le CV, l'IA en extrait les compétences au format structuré. Deuxième : générer les questions ciblées — QCM, exercices de code, cas pratique. Troisième, et c'est la plus importante : valider. Le recruteur relit et ajuste. Quatrième : passer, le candidat compose dans la sandbox. Cinquième : restituer, l'IA propose une synthèse du score, des forces et des faiblesses, que le recruteur valide à nouveau. Le fil rouge est le suivant : à chaque étape, l'IA propose, le recruteur décide. »

**Transition vers slide 12** : « Au cœur de cette chaîne, la sandbox d'exécution. »

**Note** : marquer un temps sur « valider ». C'est le moment où le message clé est prononcé pour la première fois.

---

### Slide 12/20 — Sandbox durcie : 7 verrous (durée cible : 1 min 15)

**Action à l'écran** : avancer, pointer les sept labels du schéma en couches.

**Script** :

> « La sandbox repose sur sept verrous. Un, seccomp filtre les appels système. Deux, cap-drop retire toutes les capabilities Linux. Trois, aucun réseau. Quatre, le système de fichiers est en lecture seule. Cinq, un nombre maximal de processus limité à soixante-quatre pour bloquer les fork bombs. Six, la mémoire plafonnée à 256 mégaoctets. Sept, l'exécution se fait en utilisateur non-root. Côté mesures : zéro évasion sur cinquante scénarios d'attaque, cent exécutions valides, une médiane de 330 millisecondes et un p95 de 422 millisecondes. Côté audit externe, le scan OWASP ZAP n'a remonté aucune alerte de niveau élevé, moyen ou faible. »

**Transition vers slide 13** : « Au-dessus de cette sandbox, la couche IA permet six fournisseurs interchangeables. »

**Note** : prononcer très précisément « aucune alerte de niveau élevé, moyen ou faible ». Ne JAMAIS dire « zéro vulnérabilité ». C'est le piège à éviter.

---

### Slide 13/20 — IA multi-fournisseurs (durée cible : 45 s)

**Action à l'écran** : avancer, pointer le hub central puis l'extrait de code.

**Script** :

> « J'ai intégré six modèles : OpenAI GPT-4o mini, Groq Qwen 3-32B, Gemini Flash 2.5, Claude Sonnet 4.5, GitHub Models GPT-4o mini, et Ollama Qwen 2.5-7B en local. Tous se branchent sur une interface Java commune, LlmClient, avec une implémentation par fournisseur. Basculer se fait par un simple changement de variable d'environnement. Pendant le stage, cette abstraction a servi concrètement : GitHub Models a été indisponible, j'ai basculé sur OpenAI sans toucher au code métier. »

**Transition vers slide 14** : « Je vais maintenant vous montrer la plateforme en direct. »

**Note** : ne pas s'étendre sur chaque modèle. Insister sur le fait que la bascule a été utilisée en situation réelle.

---

### Slide 14/20 — Démo recruteur (vidéo pré-enregistrée, durée cible : 2 min 00)

**Format** : la vidéo démo est lancée dès l'arrivée sur la slide. Pas de démo live. Tu commentes en voix off pendant que la vidéo défile. La vidéo doit être calée pour que ton commentaire tombe pile.

**Action à l'écran** :
- Dès l'affichage de la slide 14, lancer la vidéo `demo-video.mp4` en plein écran (ou intégrée dans la slide avec autoplay).
- La vidéo montre le parcours recruteur de bout en bout, enregistré depuis la production.

**Repères de timing dans la vidéo** (à mémoriser pour synchroniser le commentaire) :

| Timecode | Ce que montre la vidéo | Phrase à dire |
|---|---|---|
| 0:00 — 0:10 | Connexion recruteur sur la plateforme | Voici la plateforme SkillForge en production. Je me connecte comme recruteur. |
| 0:10 — 0:30 | Création d'une nouvelle évaluation, saisie du candidat et import du CV | Je crée une nouvelle évaluation pour un candidat ciblé sur un profil développeur PHP. J'importe son CV, au format PDF. |
| 0:30 — 0:55 | Analyse IA du CV, apparition des compétences détectées | L'analyse IA tourne. En moins de dix secondes, les compétences détectées s'affichent : PHP, Laravel, MySQL, Git, Docker. Le recruteur peut les corriger avant génération. |
| 0:55 — 1:25 | Génération automatique des questions, QCM + code + cas pratique | Je lance la génération. L'IA produit trois types de contenu adaptés au profil : des QCM, deux exercices de code et deux cas pratiques. Chaque question est révisable avant envoi. |
| 1:25 — 1:50 | Validation des questions, envoi de l'invitation, email reçu | Je valide le lot et génère l'invitation. Le candidat reçoit un lien unique et un code à six chiffres par email. Rien ne part sans la validation humaine. |
| 1:50 — 2:00 | Transition visuelle (fade ou coupe) | Côté candidat maintenant. |

**Script complet (à lire en parallèle de la vidéo)** :

> « Voici la plateforme SkillForge, en production, sur Vercel pour le frontend et Render pour le backend. Je me connecte comme recruteur. Je crée une nouvelle évaluation pour un profil développeur PHP et j'importe le CV du candidat.
>
> L'analyse IA tourne. En moins de dix secondes, les compétences détectées s'affichent. Le recruteur garde le contrôle : il peut corriger, ajouter ou retirer avant la génération.
>
> Je lance la génération du test. L'IA produit trois types de contenu adaptés au profil : des QCM, des exercices de code, et des cas pratiques. Chaque question est révisable, modifiable, ou supprimable par le recruteur avant l'envoi.
>
> Je valide le lot et génère l'invitation. Le candidat reçoit un lien unique et un code à six chiffres par email. Rien ne part sans la validation humaine. »

**Transition vers slide 15** : « Côté candidat, voici ce qu'il voit en ouvrant son lien. »

**Note** :
- Démarrer la vidéo au moment où tu termines la phrase de transition de la slide 13.
- Si la vidéo désynchronise avec ta voix, c'est la voix qui s'adapte, pas la vidéo.
- Mettre la vidéo en lecture automatique ou appuyer sur Espace dès l'affichage de la slide.

---

### Slide 15/20 — Démo candidat (vidéo pré-enregistrée, durée cible : 1 min 30)

**Format** : vidéo pré-enregistrée, commentaire en voix off synchronisé.

**Action à l'écran** :
- Enchainement direct depuis la slide 14 (même fichier vidéo, nouvelle section).
- Montre le parcours candidat : accès, QCM, exécution de code correct et faux.

**Repères de timing dans la vidéo** :

| Timecode | Ce que montre la vidéo | Phrase à dire |
|---|---|---|
| 2:00 — 2:15 | Candidat ouvre le lien, saisit son code à six chiffres, consentement coché, démarrage | Le candidat ouvre son lien unique et saisit le code à six chiffres reçu par email. Il coche son consentement avant toute collecte de données. |
| 2:15 — 2:35 | QCM rapides sans réflexion | Il traverse les QCM à grande vitesse, sans vraiment lire — ce comportement sera remonté par les signaux anti-fraude. |
| 2:35 — 3:05 | Code PHP palindrome : première tentative fausse → ERROR → correction → OK | Il arrive sur l'exercice de code PHP. Première tentative : une solution naïve qui échoue aux tests cachés. Il corrige en normalisant la chaîne — cette fois les tests passent. Le code est exécuté dans une sandbox Docker durcie, j'y reviens sur la slide suivante. |
| 3:05 — 3:30 | Code JS factorielle : code faux → ERROR → correct → OK | Même parcours en JavaScript sur une factorielle. Une erreur détectée, puis la solution correcte. L'éditeur affiche le résultat des tests et le score. |

**Script complet** :

> « Le candidat ouvre son lien unique et saisit le code à six chiffres reçu par email. Il coche son consentement avant toute collecte de données.
>
> Il traverse les QCM rapidement. Trop rapidement — ce comportement sera remonté dans les signaux anti-fraude.
>
> Il arrive sur l'exercice de code PHP sur les palindromes. Première tentative : une solution naïve. Les tests cachés échouent, et le candidat voit immédiatement son erreur. Il corrige en normalisant la chaîne avant comparaison. Cette fois les tests passent.
>
> Même parcours en JavaScript sur une factorielle. Une tentative fausse, puis la solution correcte. Chaque exécution tourne dans la sandbox Docker durcie. J'y arrive dans un instant. »

**Transition vers slide 16** : « Maintenant le point sensible : que se passe-t-il si le candidat tente une attaque ? »

**Note** :
- La vidéo doit montrer clairement les transitions ERROR → OK pour marquer la pédagogie du système.
- Les écarts de rythme candidat sont volontaires pour générer les signaux anti-fraude visibles slide 16.

---

### Slide 16/20 — Démo attaque et rapport recruteur (vidéo pré-enregistrée, durée cible : 1 min 30)

**Format** : vidéo pré-enregistrée. Partie la plus dense de la démo : attaques sandbox + bascule côté recruteur pour le rapport.

**Action à l'écran** :
- La vidéo enchaîne les 3 attaques puis bascule sur l'interface recruteur.

**Repères de timing dans la vidéo** :

| Timecode | Ce que montre la vidéo | Phrase à dire |
|---|---|---|
| 3:30 — 3:50 | Attaque PHP : lecture de /etc/passwd, /etc/shadow, /proc/self/environ, /etc/hosts → 4 lignes `BLOQUE` | Le candidat tente de lire des fichiers système sensibles depuis le conteneur. Les quatre tentatives sont refusées : open_basedir côté PHP et readonly-rootfs côté Docker. |
| 3:50 — 4:10 | Attaque JS : lecture `/etc/passwd` et `/proc/self/environ` depuis Node.js → 3 lignes `BLOQUE ERR_ACCESS_DENIED` | Même principe en JavaScript. Node 20 est lancé avec son Permission Model, qui restreint les lectures aux dossiers autorisés. Trois refus clairs. |
| 4:10 — 4:30 | Attaque réseau JS : `http.get` vers google.com → `EAI_AGAIN` | Troisième scénario : tentative de connexion sortante. Le conteneur est lancé avec network-none, aucun paquet ne sort. Même la résolution DNS échoue. |
| 4:30 — 5:00 | Bascule côté recruteur, ouverture du rapport : score global, score anti-fraude 100, 6 pastes, 3 sorties d'onglet, synthèse IA | Je bascule côté recruteur. Le rapport s'ouvre. Score global modéré, score anti-fraude à cent sur cent : six copier-coller volumineux et trois sorties d'onglet détectés. La synthèse IA liste forces et faiblesses, mais c'est le recruteur qui décide. |

**Script complet** :

> « Le candidat tente d'attaquer la plateforme pendant son test. Trois scénarios.
>
> Premier scénario : lire des fichiers système sensibles depuis le conteneur PHP. Les quatre tentatives sont refusées : open_basedir côté PHP et readonly-rootfs côté Docker.
>
> Deuxième scénario : même attaque mais en JavaScript. Node 20 est lancé avec son Permission Model, qui restreint les lectures aux dossiers autorisés. Trois refus clairs avec le code ERR_ACCESS_DENIED.
>
> Troisième scénario : tentative de connexion réseau sortante. Le conteneur est lancé avec network-none, aucun paquet ne sort. Même la résolution DNS échoue.
>
> Je bascule côté recruteur. Le rapport s'ouvre. Score anti-fraude à cent sur cent : six copier-coller volumineux et trois sorties d'onglet détectés automatiquement. La synthèse IA liste les forces et faiblesses du candidat, mais la décision finale reste au recruteur. L'IA propose, le recruteur décide. »

**Transition vers slide 17** : « Fin de la démonstration. Je passe aux résultats mesurés. »

**Note** :
- C'est la slide avec le plus d'informations à faire passer. Si tu dépasses, c'est OK, grappiller 30 secondes sur la slide 17.
- La phrase « L'IA propose, le recruteur décide » doit être prononcée nettement — c'est le fil rouge du projet.
- Si quelqu'un dans le jury demande « c'est pré-enregistré ou live ? », répondre : « c'est une capture de la plateforme en production, enregistrée hier pour garantir la fluidité. La prod est bien active. »

---

### Slide 17/20 — Résultats mesurés (durée cible : 1 min 15)

**Action à l'écran** : avancer, pointer les quatre KPI du haut.

**Script** :

> « Les cinq objectifs se traduisent en chiffres. Analyse de CV : module fonctionnel, validé par l'encadreur. Génération : les trois types sont produits et contrôlés à 100 %. Sécurisation de l'exécution : zéro évasion sur cinquante scénarios, cent exécutions valides, médiane 330 millisecondes, p95 à 422 millisecondes. Charge sur vingt utilisateurs virtuels pendant soixante secondes avec k6 : 823 checks sur 823 réussis, zéro erreur, un p95 à 4,37 secondes, en dessous de la cible de six secondes. Rapport candidat : score, forces, faiblesses et anti-fraude livrés. En complément : OWASP ZAP n'a remonté aucune alerte de niveau élevé, moyen ou faible, et la base de tests JUnit compte 27 tests, tous validés avec succès. »

**Transition vers slide 18** : « Côté livrables maintenant. »

**Note** : chaque chiffre doit sortir sans hésitation — c'est la slide où le jury vérifie la cohérence avec le mémoire. S'entraîner spécifiquement sur « 4,37 secondes » et « 27 tests tous validés ».

---

### Slide 18/20 — Bilan des livrables (durée cible : 45 s)

**Action à l'écran** : avancer, laisser le tableau à l'écran.

**Script** :

> « Neuf livrables étaient prévus : l'application recruteur, l'interface candidat, l'analyse de CV, la génération de tests, la banque de questions, la sandbox, la correction automatique, le tableau de bord, la documentation technique. Les neuf sont testés ou finalisés à cent pour cent. Le budget réel du stage s'élève à 1 050 000 ariary, soit environ 211 euros, composé d'une prime projet d'un million et d'environ 50 000 ariary d'appels API. »

**Transition vers slide 19** : « J'en tire trois difficultés et quelques apports. »

**Note** : rythme calme, ne pas lire le tableau ligne à ligne. Prononcer clairement « 1 050 000 ariary, 211 euros ».

---

### Slide 19/20 — Difficultés, apports, perspectives (durée cible : 1 min 15)

**Action à l'écran** : avancer, pointer les trois colonnes.

**Script** :

> « Trois difficultés concrètes. Un : l'indisponibilité de GitHub Models en cours de projet, résolue par bascule vers OpenAI comme fournisseur principal via LlmClient — c'est la preuve que l'abstraction sert. Deux : les tests JavaScript dans la sandbox, qui ont nécessité un ajustement du harnais d'exécution. Trois : la qualité variable des générations IA, traitée par renforcement des prompts et validation humaine systématique. Côté apports : une plateforme fonctionnelle testée, une sandbox validée contre cinquante attaques, une architecture multi-LLM, et une base réutilisable pour Tsarajoro. Côté perspectives : la plateforme est actuellement en préproduction sur Vercel et Render, et la prochaine étape est le déploiement en production sur l'infrastructure interne de Tsarajoro, pour héberger les données candidats directement dans l'environnement de l'entreprise. Suivront la montée en charge, l'extension à d'autres langages comme Go, Rust ou C-sharp, l'intégration à un ATS, et un mode cent pour cent local via Ollama. Sur le plan personnel, ce stage m'a fait progresser sur la sécurité applicative, la conception de prompts et l'architecture orientée domaines, en lien direct avec les enseignements MBDS sur les bases, la sécurité et le génie logiciel. »

**Transition vers slide 20** : « Je conclus. »

**Note** : enchaîner les trois difficultés sans détailler. Le jury sait ce qu'est un prompt renforcé.

---

### Slide 20/20 — Conclusion et message clé (durée cible : 30 s)

**Action à l'écran** : avancer, s'arrêter face au jury, poser le pointeur.

**Script** :

> « Pour conclure : SkillForge industrialise l'évaluation technique chez Tsarajoro. L'IA propose, le recruteur décide, la sandbox protège. Neuf livrables sur neuf à cent pour cent, zéro évasion sur cinquante attaques, un p95 à 4,37 secondes, aucune alerte OWASP. Le dépôt et le mémoire sont accessibles via le QR code à l'écran. Je vous remercie pour votre attention et je suis prêt à répondre à vos questions. »

**Transition** : silence, regarder le jury, attendre les questions.

**Note** : prononcer le message clé lentement, c'est la dernière chose que le jury retient. Ne pas enchaîner trop vite sur « merci » — laisser 1 seconde entre la dernière phrase et le remerciement.

---

## 3. Repères de minutage pendant la soutenance

- **À 5 minutes** : on doit entrer dans la slide 7 ou 8 (fin de l'état de l'art).
- **À 10 minutes** : on doit entrer dans la slide 12 (sandbox) ou 13 (LLM).
- **À 13 min 30** : on doit démarrer la démo (slide 14).
- **À 16 min 30** : la démo doit être terminée, on entre dans les résultats.
- **À 20 minutes** : on doit avoir dit « merci pour votre attention ».

Si on est en retard à 10 min, raccourcir la démo (sauter l'étape 11 — le tableau de bord analytique — qui n'est pas critique).

Si on est en avance à 10 min, prendre un peu plus de temps sur la slide 17 (résultats), c'est elle qui porte le plus de valeur devant le jury.

---

## 4. Préparation aux questions du jury (hors soutenance mais à anticiper)

Questions probables, à préparer à part :
1. Pourquoi Docker et pas gVisor ou Firecracker ?
2. Comment êtes-vous sûr de la qualité des générations IA ?
3. La plateforme passera-t-elle à l'échelle à 100 candidats simultanés ?
4. Qui maintient la plateforme après votre départ ?
5. Que fait OpenAI du CV envoyé ? Comment la RGPD / loi 2014-038 est-elle respectée ?
6. Pourquoi 5 objectifs et pas 4 ?
7. Pourquoi ne pas avoir dit « zéro vulnérabilité » ?

Pour chaque question, préparer une réponse de 30 à 45 secondes maximum, factuelle, sans détour.

---

*Script rédigé le 2026-10-06. À chronométrer trois fois avant la soutenance, idéalement en conditions réelles (slides projetées, debout, chronomètre visible).*
