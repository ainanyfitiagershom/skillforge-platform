# Mémoire M2 MBDS — Contenu rédigé prêt à coller

**Sujet :** Conception et développement d'une plateforme nouvelle génération de recrutement technique entièrement assistée par IA, du CV au verdict.
**Auteur :** GERSHOM Ny Aina Fitia
**Encadreur professionnel :** RAVELOMANANTIANA Tahirintsoa Ulrich
**Entreprise :** Tsarajoro
**Année :** Octobre 2026

Ce fichier contient le contenu rédigé section par section, prêt à être copié dans `MEMOIRE-itu-MBDS-v1.docx`. Le ton, la longueur et la structure sont calibrés sur le mémoire ANDRIANAIVOSOA (paragraphes narratifs, phrases complètes, style pro-narratif).

---

## Résumé (½ page)

Le processus de recrutement technique chez Tsarajoro repose historiquement sur des entretiens en tête-à-tête et des exercices corrigés manuellement, mobilisant entre trente et soixante minutes de dévéloppeur senior par candidat. Ce mode opératoire limite la standardisation des évaluations, expose l'entreprise à un risque accru de fraude depuis l'apparition des intelligences artificielles génératives, et rend difficile toute analyse rétrospective des critères réellement discriminants pour un poste donné.

Le projet SkillForge, développé au cours de ce stage de fin d'études, répond à ces limites en proposant une plateforme web sécurisée d'évaluation technique du recrutement, entièrement assistée par intelligence artificielle. La plateforme couvre l'ensemble du cycle, depuis l'analyse automatique du CV jusqu'à la recommandation finale, en intégrant la génération adaptative de tests, l'exécution sécurisée du code candidat dans une sandbox Docker durcie, la notation automatique multi-critères et un compte rendu argumenté à destination du recruteur.

Le travail a été réalisé selon la méthode Scrum, structuré en huit sprints de deux semaines, avec une architecture modulaire à deux services Spring Boot 3 pour isoler la sandbox du reste du système. Le frontend a été développé en React 19 et TypeScript. La stratégie multi-fournisseurs de modèles de langage (OpenAI, Claude, Groq, Ollama) garantit une portabilité totale et l'absence de dépendance à un service externe unique.

Quatre preuves de concept ont validé les modules critiques : analyse de CV, génération adaptative, sandbox sécurisée et statistiques discriminantes. Les résultats mesurés montrent zéro évasion sur cinquante cas d'attaque appliqués à la sandbox, une conformité complète au top dix OWASP après onze itérations d'audit ZAP, et une latence médiane d'exécution de code inférieure à quatre cent millisecondes. Une boucle d'amélioration continue, appuyée sur le calcul du pouvoir discriminant et de l'indice de difficulté de chaque question, permet à la banque d'exercices de s'affiner à mesure que la plateforme est utilisée.

**Mots-clés :** recrutement technique, évaluation automatisée, intelligence artificielle générative, sandbox Docker sécurisée, statistiques psychométriques, souveraineté des données, RGPD.

---

## Abstract (½ page)

The technical recruitment process at Tsarajoro has historically relied on face-to-face interviews and manually graded exercises, requiring between thirty and sixty minutes of senior developer time per candidate. This approach limits the standardization of evaluations, exposes the company to a higher risk of fraud since the emergence of generative artificial intelligence, and makes any retrospective analysis of the criteria that actually discriminate candidates for a given position difficult.

The SkillForge project, developed during this end-of-studies internship, addresses these limitations by offering a secure web platform for technical recruitment assessment, fully assisted by artificial intelligence. The platform covers the entire cycle, from automatic CV analysis through to the final recommendation, including adaptive test generation, secure execution of candidate code in a hardened Docker sandbox, multi-criteria automated grading, and an argued report for the recruiter.

The work was carried out following the Scrum method, structured into eight two-week sprints, with a modular two-service Spring Boot 3 architecture to isolate the sandbox from the rest of the system. The frontend was developed in React 19 and TypeScript. The multi-provider large language model strategy (OpenAI, Claude, Groq, Ollama) ensures full portability and prevents lock-in to any single external service.

Four proofs of concept validated the critical modules: CV analysis, adaptive generation, secure sandbox and discriminating statistics. Measured results show zero escape across fifty attack cases applied to the sandbox, full compliance with the OWASP top ten after eleven ZAP audit iterations, and a median code execution latency below four hundred milliseconds. A continuous improvement loop, based on the calculation of each question's discriminant power and difficulty index, allows the exercise bank to refine itself as the platform is used.

**Keywords:** technical recruitment, automated assessment, generative artificial intelligence, hardened Docker sandbox, psychometric statistics, data sovereignty, GDPR.

---

## Glossaire

À placer par ordre alphabétique. Termes réellement utilisés dans SkillForge :

**API.** Interface de programmation applicative. Ensemble de règles et de protocoles qui permet à différentes applications informatiques de communiquer entre elles. Dans SkillForge, chaque échange entre le frontend et le backend s'effectue via l'API REST exposée par le service applicatif.

**Argon2id.** Algorithme de hachage de mot de passe recommandé par l'OWASP en 2025. Il combine résistance aux attaques par dictionnaire et aux attaques par matériel spécialisé. SkillForge l'utilise avec les paramètres saltLength 16, hashLength 32, parallelism 1, memory 19456 KiB et iterations 2.

**CAS_PRATIQUE.** Type de question consistant en un scénario métier accompagné d'une liste de points attendus. La notation est effectuée par un modèle de langage sur une échelle de zéro à cent.

**CDC.** Cahier des charges. Document contractuel décrivant le périmètre, les exigences fonctionnelles et non fonctionnelles, les critères de succès et le planning d'un projet.

**Docker.** Plateforme de conteneurisation permettant d'exécuter des applications dans des environnements isolés et reproductibles. SkillForge l'utilise pour la base de données, la sandbox d'exécution de code, le serveur de mails de développement et le modèle de langage local.

**Flyway.** Outil de gestion des migrations de schéma de base de données. Chaque évolution du schéma est versionnée et rejouée automatiquement au démarrage du backend.

**IHM.** Interface Homme-Machine. Ensemble des écrans, boutons et interactions permettant à un utilisateur d'utiliser un logiciel.

**JWT.** JSON Web Token. Jeton d'authentification signé, standardisé par la RFC 7519. SkillForge l'utilise pour authentifier les recruteurs, avec des jetons d'accès de trente minutes et des jetons de rafraîchissement de sept jours.

**LLM.** Large Language Model. Modèle de langage de grande taille capable de générer et d'analyser du texte en langage naturel. SkillForge s'appuie sur des LLM externes (OpenAI, Claude, Groq) et locaux (Ollama) pour l'analyse de CV, la génération de questions et la notation des cas pratiques.

**MCD.** Modèle Conceptuel de Données. Représentation graphique de la structure logique d'une base de données, sans référence à un système de gestion particulier.

**OCR.** Optical Character Recognition. Reconnaissance optique de caractères permettant de convertir une image contenant du texte (par exemple un CV scanné) en texte exploitable. SkillForge utilise Tesseract comme moteur OCR de secours.

**Ollama.** Runtime permettant de faire tourner localement des modèles de langage open source. SkillForge l'intègre pour proposer un fournisseur LLM totalement souverain, sans dépendance à un service externe.

**OpenAPI.** Standard de description d'API REST au format JSON ou YAML. SkillForge expose sa spécification OpenAPI sur l'endpoint /v3/api-docs, ce qui permet notamment à l'outil d'audit OWASP ZAP de découvrir automatiquement l'ensemble des endpoints à auditer.

**OWASP.** Open Web Application Security Project. Fondation à but non lucratif qui publie régulièrement le classement des dix risques de sécurité applicative les plus critiques (OWASP Top 10).

**POC.** Proof of Concept. Prototype de faisabilité destiné à démontrer qu'un module ou une approche technique fonctionne avant de généraliser son développement.

**PHPUnit.** Framework de tests unitaires pour PHP. Utilisé dans la sandbox pour exécuter les tests cachés fournis par le recruteur sur le code du candidat.

**QCM.** Question à Choix Multiples. Type de question comportant quatre options, une réponse correcte et des distracteurs plausibles. La notation est automatique et binaire.

**RGPD.** Règlement Général sur la Protection des Données. Cadre européen encadrant la collecte et le traitement des données personnelles. SkillForge s'y conforme via un consentement explicite du candidat, la purge automatique des CV après douze mois et le stockage exclusif des données sur l'infrastructure interne de Tsarajoro.

**Sandbox.** Environnement d'exécution isolé et durci, dans lequel un code externe (potentiellement malveillant) peut être exécuté sans risque pour le système hôte. La sandbox SkillForge s'appuie sur Docker, un profil seccomp restrictif, le retrait de toutes les capacités Linux et l'exécution sous un utilisateur non privilégié.

**Scrum.** Méthode agile de gestion de projet fondée sur des cycles courts appelés sprints, des rituels réguliers (planning, revue, rétrospective) et un backlog priorisé.

**Seccomp.** Secure Computing Mode. Mécanisme du noyau Linux qui filtre les appels système autorisés pour un processus. SkillForge maintient un profil seccomp restrictif dérivé du profil Docker par défaut.

**SPA.** Single-Page Application. Architecture d'application web où l'ensemble de l'interface est chargée une seule fois puis mise à jour dynamiquement en JavaScript. SkillForge côté recruteur est une SPA React.

**TLS.** Transport Layer Security. Protocole de chiffrement des communications réseau. SkillForge exige la version 1.3 en production.

**UML.** Unified Modeling Language. Langage graphique standardisé pour modéliser un système logiciel (classes, séquences, activités, cas d'utilisation).

**XSS.** Cross-Site Scripting. Vulnérabilité permettant à un attaquant d'injecter du code JavaScript dans une page web consultée par une autre victime. SkillForge s'en prémunit via une Content-Security-Policy stricte et l'échappement systématique des sorties.

---

## Introduction (1 page maximum)

Chaque année, plusieurs milliers de développeurs postulent à des offres techniques dans les entreprises du numérique malgache. Chez Tsarajoro, chaque recrutement mobilise historiquement entre trente et soixante minutes de développeur senior par candidat rien que pour la correction des exercices techniques, soit plusieurs heures cumulées pour la seule phase d'évaluation d'un profil. À cette charge s'ajoute désormais une difficulté nouvelle : l'apparition en 2023 des assistants de génération de code alimentés par intelligence artificielle a rendu les exercices classiques de programmation aisément contournables, sans que les entreprises disposent des outils pour distinguer la production réelle du candidat de celle d'un assistant.

Le Master 2 MBDS de l'Université Côte d'Azur, opéré en délocalisé par IT University à Antananarivo, offre une formation professionnalisante en ingénierie logicielle, systèmes distribués, cybersécurité et intelligence artificielle. Ce cadre pédagogique m'a préparé à concevoir et développer des systèmes complets, sécurisés et industrialisables. C'est ce profil que Tsarajoro a souhaité mobiliser pour ce stage de fin d'études : concevoir et développer une plateforme interne d'évaluation technique, capable d'automatiser l'ensemble du cycle depuis la réception du CV jusqu'à la recommandation finale du recruteur.

Le stage a démarré en avril 2026 pour une durée de quatre mois, avec la mission suivante : livrer une plateforme opérationnelle appelée SkillForge, hébergée sur l'infrastructure interne de Tsarajoro, capable d'analyser un CV, de générer un test technique adapté au profil visé, de le faire passer au candidat dans un environnement sécurisé, de noter automatiquement chaque type de question, puis de produire un compte rendu argumenté avec une recommandation. La problématique centrale du projet peut se formuler ainsi : *comment automatiser à la fois l'évaluation technique et la sécurité d'un test candidat, tout en garantissant l'intégrité des données personnelles conformément au RGPD et en s'affranchissant de toute dépendance à un service externe payant ou en voie de retrait ?*

Le présent rapport suit le plan type recommandé par le Master 2 MBDS. Au chapitre un, je présente Tsarajoro et le sujet confié. Le chapitre deux compare les plateformes existantes du marché selon un ensemble de critères. Le chapitre trois analyse la situation avant le projet et justifie la solution retenue. Le chapitre quatre détaille la démarche projet mise en œuvre, incluant les risques et la planification. Le chapitre cinq décrit les exigences fonctionnelles et non fonctionnelles réalisées. Le chapitre six présente les architectures logicielle et technique. Le chapitre sept détaille la conception interne. Le chapitre huit rassemble les tests fonctionnels, unitaires, de sécurité et de performance. La conclusion dresse le bilan des résultats, des problèmes rencontrés, des perspectives et l'apport personnel du stage.

---

## 1. Présentation du stage

### 1.1 Présentation de l'entreprise

Tsarajoro est une entreprise malgache évoluant dans le secteur du numérique. Son activité repose sur la réalisation et l'exploitation de différents projets web nécessitant des compétences variées, aussi bien techniques que liées à la production et à la visibilité de contenus en ligne.

L'entreprise s'appuie ainsi sur plusieurs profils complémentaires, notamment des développeurs, des intégrateurs WordPress, des rédacteurs et des profils spécialisés dans le référencement et le netlinking. Cette diversité de métiers lui permet de prendre en charge différentes étapes d'un projet numérique, de sa réalisation technique jusqu'à son exploitation.

Son fonctionnement favorise également le développement d'outils internes répondant à des besoins directement rencontrés dans ses activités. Cette approche permet à l'entreprise d'adapter ses solutions à ses propres processus et de les faire évoluer progressivement selon les besoins identifiés.

C'est dans ce contexte qu'a été confié le projet SkillForge, dont l'objectif est de doter Tsarajoro d'une plateforme interne d'évaluation technique de ses futurs candidats au recrutement. J'ai été encadré durant le stage par Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich, en charge de la validation des livrables et de la priorisation fonctionnelle à chaque revue de sprint.

### 1.2 Présentation du sujet et objectifs du projet

Le projet consiste à concevoir et développer une plateforme web sécurisée d'évaluation technique du recrutement, entièrement assistée par intelligence artificielle. La plateforme prend en entrée le CV du candidat et le profil cible du poste, et produit en sortie un compte rendu argumenté avec une recommandation à embaucher, à approfondir en entretien ou à écarter. Elle couvre ainsi l'ensemble du cycle sans intervention manuelle systématique du recruteur pour la correction des réponses.

Le caractère innovant du projet réside dans la combinaison de plusieurs briques rarement réunies dans un même produit : l'analyse sémantique d'un CV pour extraire les compétences déclarées et leur niveau présumé, la génération adaptative d'un test personnalisé à partir de ces compétences, l'exécution du code candidat dans une sandbox Docker durcie, la notation multi-critères mêlant tests automatisés et évaluation par modèle de langage, et le calcul en continu d'indicateurs psychométriques permettant à la banque de questions de s'auto-améliorer. Les plateformes existantes du marché, étudiées au chapitre suivant, ne couvrent chacune qu'une partie de ce cycle.

Les objectifs mesurables du projet, définis dans le cahier des charges initial, sont les suivants. Premièrement, centraliser cent pour cent des évaluations techniques de Tsarajoro dans une plateforme unique sécurisée hébergée en interne. Deuxièmement, réduire d'au moins soixante pour cent le temps consacré par les développeurs à la correction des exercices techniques. Troisièmement, diviser par trois le délai moyen entre la candidature et la décision technique grâce à l'auto-évaluation. Quatrièmement, atteindre une précision d'analyse des CV supérieure à quatre-vingt-cinq pour cent sur un échantillon représentatif. Cinquièmement, obtenir un taux d'acceptation supérieur à soixante-quinze pour cent des questions générées par l'intelligence artificielle après relecture par le recruteur.

Les principaux enjeux du projet sont la sécurité de la sandbox d'exécution de code, la souveraineté des données candidat au regard du RGPD, la fiabilité de la notation automatique et la reproductibilité des mesures présentées à l'appui du choix technique.

---

## 2. État de l'art sur le sujet traité

L'état de l'art vise à situer SkillForge par rapport aux principales plateformes du marché du recrutement technique automatisé. Il n'est pas confondu avec l'étude de l'existant, présentée au chapitre trois, qui porte sur la solution en usage chez Tsarajoro avant le projet.

### 2.1 Critères de comparaison

Six critères ont été retenus pour comparer les solutions du marché. Le premier concerne l'analyse automatique du CV : la plateforme est-elle capable d'extraire les compétences déclarées et d'en estimer le niveau ? Le deuxième porte sur la génération de questions par intelligence artificielle : la plateforme génère-t-elle un test adapté au profil, ou se contente-t-elle d'une banque figée ? Le troisième concerne la sandbox d'exécution de code : quel niveau de durcissement Docker et quels langages sont supportés ? Le quatrième cible la personnalisation aux profils métier internes, notamment aux profils spécifiques de Tsarajoro comme les intégrateurs WordPress ou les spécialistes SEO. Le cinquième est l'hébergement : la plateforme est-elle hébergeable en interne pour respecter le RGPD, ou impose-t-elle un service SaaS étranger ? Le sixième est le modèle tarifaire et son adéquation à une PME.

### 2.2 Étude de chaque solution

HackerRank est la plateforme historique du secteur, positionnée sur l'évaluation approfondie de développeurs pour des postes d'ingénieur logiciel. Elle propose une large bibliothèque d'exercices, un environnement de développement en ligne pour les entretiens en direct, un système de score comparé à la population des candidats et des mécanismes de détection de plagiat. Elle ne propose pas d'analyse automatique du CV et sa personnalisation aux profils métier hors ingénierie logicielle standard reste limitée. L'hébergement est intégralement SaaS, sur des serveurs situés hors Union européenne, ce qui pose une contrainte forte au regard du RGPD pour une entreprise malgache travaillant régulièrement avec des clients européens.

Codility se positionne principalement sur l'évaluation des ingénieurs logiciels et l'analyse des compétences internes d'une équipe existante. La plateforme offre des évaluations asynchrones, un environnement de développement pour les entretiens en direct et des tableaux de bord analytiques riches. Elle partage avec HackerRank l'absence d'analyse automatique du CV et l'hébergement SaaS exclusif. Sa focalisation sur les métiers de l'ingénierie logicielle la rend peu adaptée aux profils WordPress, intégrateurs frontend ou spécialistes SEO présents chez Tsarajoro.

TestGorilla adopte un positionnement plus généraliste et couvre des évaluations mixtes combinant tests de personnalité, tests cognitifs et tests techniques de premier niveau. Sa tarification débute autour de trente dollars par mois et monte à deux cents dollars par mois selon le volume, ce qui la rend accessible aux PME. Elle est cependant moins pertinente pour une évaluation technique approfondie et n'offre pas de sandbox d'exécution de code aussi complète que HackerRank ou Codility. L'hébergement est également SaaS étranger.

CodeSignal est la plateforme du marché qui investit le plus dans l'intelligence artificielle. Elle a introduit en 2025 des évaluations assistées par un modèle de langage embarqué appelé Cosmo, qui accompagne le candidat pendant les exercices dans une logique proche du travail réel. La plateforme propose un score standardisé, un environnement de développement complet, un système anti-triche appelé Suspicion Score et de la télésurveillance à distance. Elle ne propose pas d'analyse automatique du CV documentée publiquement et reste positionnée sur les grands comptes.

Karat propose un modèle radicalement différent des quatre précédents. Il ne s'agit pas d'une plateforme logicielle mais d'un service d'entretiens techniques externalisés, réalisés par des intervieweurs entraînés au format Karat. Ce service supprime la charge de correction pour l'entreprise cliente mais introduit une dépendance forte à un prestataire externe, un coût élevé par candidat et l'impossibilité de personnaliser la grille aux métiers internes de Tsarajoro.

### 2.3 Tableau comparatif des solutions au vu des critères

| Critère | HackerRank | Codility | TestGorilla | CodeSignal | Karat | **SkillForge** |
|---|---|---|---|---|---|---|
| Analyse automatique du CV | Non | Non | Non | Non | Non | **Oui, avec extraction compétences et niveau** |
| Génération de questions par IA | Non (banque figée) | Non (banque figée) | Non | Partielle (assistant Cosmo) | Non | **Oui, adaptée au CV et au profil cible** |
| Sandbox d'exécution durcie | Oui, plusieurs langages | Oui, plusieurs langages | Basique | Oui, plusieurs langages | Sans objet | **Oui, Docker durci avec zéro évasion mesurée sur 50 attaques** |
| Adaptation aux profils métier internes (WordPress, SEO, PHP…) | Limitée | Limitée | Partielle | Limitée | Sur mesure mais coûteux | **Complète, profils configurables** |
| Hébergement interne possible (RGPD) | Non, SaaS US | Non, SaaS US | Non, SaaS US | Non, SaaS US | Non, service externe | **Oui, on-premise avec LLM local Ollama** |
| Modèle tarifaire adapté PME | Élevé | Élevé | Accessible | Élevé | Très élevé | **Coût maîtrisé, LLM gratuits en option** |

*Tableau 1 : Tableau comparatif des plateformes d'évaluation technique du recrutement. Source : auteur (2026), d'après les sites officiels des plateformes et les comparatifs indépendants publiés sur G2, SelectHub et iMocha.*

Aucune des plateformes étudiées ne combine à la fois l'analyse automatique du CV, la génération adaptative de tests par intelligence artificielle, l'hébergement interne pour la conformité RGPD et l'adaptation aux profils métier spécifiques de Tsarajoro. C'est précisément cette combinaison que SkillForge propose.

---

## 3. Étude de l'existant et solution envisagée

### 3.1 Étude de l'existant

#### 3.1.1 Description externe du système logiciel existant

Avant le projet SkillForge, le processus de recrutement technique chez Tsarajoro se déroulait selon une chaîne principalement manuelle. Le recruteur recevait le CV du candidat par courrier électronique, en prenait connaissance à la lecture, puis identifiait à la main les compétences potentiellement mobilisables pour le poste. Le recruteur préparait ensuite un exercice technique, généralement sous la forme d'un fichier PDF ou d'un lien vers un dépôt Git, qu'il envoyait au candidat avec une consigne de rendu par courrier électronique. À réception, un développeur senior corrigeait manuellement la production du candidat et rédigeait une appréciation libre à destination du recruteur.

L'utilisateur du système, en l'occurrence le recruteur et le développeur senior en charge de la correction, s'appuyait donc sur une combinaison d'outils bureautiques classiques : logiciel de traitement de texte pour le CV et les consignes, courrier électronique pour les échanges, tableur pour le suivi des candidats en cours d'évaluation.

#### 3.1.2 Description interne du système logiciel existant

D'un point de vue conception, il n'existait pas de système logiciel dédié. L'ensemble de la chaîne reposait sur des outils bureautiques du marché, sans base de données centralisée, sans référentiel de compétences partagé et sans traçabilité des évaluations passées. Chaque recrutement redémarrait à zéro, sans capitalisation possible sur les exercices précédemment utilisés ni analyse rétrospective des critères réellement discriminants.

### 3.2 Critique de l'existant

Ce fonctionnement présente plusieurs limites clairement identifiées avec l'encadreur professionnel dès le premier sprint de cadrage. Positivement, il offre une souplesse totale : chaque recruteur peut adapter l'exercice au poste et au candidat, et le contrôle humain reste maximal à chaque étape. Négativement, il présente cinq faiblesses structurelles. La première est le temps de correction, qui mobilise entre trente et soixante minutes de développeur senior par candidat pour la seule évaluation technique. La deuxième est l'absence de standardisation : deux candidats postulant au même poste peuvent recevoir des exercices différents et être évalués selon des grilles implicites, ce qui rend les comparaisons inéquitables. La troisième est l'exposition à la fraude : depuis la démocratisation des assistants de génération de code en 2023, un exercice classique envoyé par courrier électronique peut être partiellement ou totalement résolu par une intelligence artificielle sans que l'entreprise puisse le détecter. La quatrième est l'absence de traçabilité : aucun historique n'est conservé pour analyser après coup quelles compétences ont réellement fait la différence entre candidats retenus et candidats écartés. La cinquième est la dépendance à la disponibilité du développeur senior : si celui-ci est mobilisé sur un projet client, la correction peut prendre plusieurs jours et la décision technique s'en trouve retardée d'autant.

### 3.3 Solutions envisagées

Trois solutions ont été étudiées lors du sprint de cadrage. La première consistait à souscrire à une licence d'une plateforme du marché parmi celles étudiées au chapitre deux. Elle a été écartée pour trois raisons : le coût par candidat évalué, l'hébergement systématiquement SaaS étranger incompatible avec les contraintes RGPD, et la faible adaptation aux profils métier internes de Tsarajoro comme les intégrateurs WordPress ou les spécialistes SEO.

La deuxième solution consistait à développer un simple gestionnaire d'exercices interne, essentiellement un CRUD permettant d'organiser une banque de tests et de collecter les rendus. Elle a été écartée car elle n'aurait résolu ni le problème du temps de correction ni celui de la fraude, et n'aurait pas valorisé les compétences apportées par le cadre pédagogique du Master 2 MBDS.

La troisième solution, retenue, est le projet SkillForge tel que présenté au chapitre 1.2 : une plateforme interne complète intégrant l'analyse de CV, la génération adaptative de tests, la sandbox durcie, la notation automatique multi-critères et les statistiques discriminantes.

### 3.4 Objectifs principaux et livrables

Les objectifs principaux ont été détaillés au chapitre 1.2. Les livrables du stage sont les suivants : le cahier des charges consolidé en annexe, la plateforme SkillForge sous forme de dépôt Git versionné, les quatre rapports de preuve de concept, le rapport d'audit OWASP ZAP, la fiche de tests manuels, la documentation d'installation et le présent mémoire.

---

## 4. Démarche projet

### 4.1 Principes de la démarche projet

#### 4.1.1 Activités d'ingénierie logicielle

Les activités d'ingénierie logicielle mises en œuvre couvrent l'ensemble du cycle. Une phase initiale de recueil des exigences a produit le cahier des charges validé par l'encadreur professionnel avant tout démarrage de développement. La conception s'est appuyée sur des modèles UML pour l'architecture logicielle et sur un modèle conceptuel de données pour la persistance. Le codage a été réalisé en Java 21 côté backend et en TypeScript côté frontend. Les tests recouvrent trois niveaux : tests unitaires avec JUnit et Vitest, tests d'intégration avec Testcontainers, tests de sécurité offensive avec le harness POC 3 pour la sandbox et l'outil OWASP ZAP pour l'audit HTTP. L'ensemble de ces activités a été réalisé par moi-même.

#### 4.1.2 Méthode de gestion de projet utilisée

Le projet a été piloté selon la méthode Scrum, avec un découpage en huit sprints de deux semaines. Chaque sprint débutait par une session de sprint planning au cours de laquelle l'encadreur professionnel priorisait les éléments du backlog restant. En fin de sprint, une revue asynchrone présentait à l'encadreur les livrables produits sous la forme d'une démonstration enregistrée et d'un compte rendu écrit. Compte tenu de la taille de l'équipe projet réduite à moi-même, les rituels quotidiens (daily standup) ont été remplacés par un journal de bord tenu à chaque commit Git, ce qui a permis à l'encadreur de suivre l'avancement en temps réel via l'historique du dépôt.

Mon rôle a combiné trois postures de la méthode Scrum : celle de développeur pour la réalisation, celle de tech lead pour les choix d'architecture et celle de product owner en soutien de l'encadreur professionnel pour l'affinage du backlog.

#### 4.1.3 Rôles et responsabilités

Les parties prenantes du projet sont les suivantes. Le client est Tsarajoro, représenté par son encadreur professionnel Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich, qui a la responsabilité de la priorisation fonctionnelle, de la validation des livrables et de l'acceptation finale du produit. L'encadreur pédagogique côté IT University a la responsabilité de la validation académique du projet et de la relecture du mémoire avant dépôt. Ma responsabilité, en tant qu'étudiant stagiaire, couvre la conception, le développement, les tests et la documentation.

#### 4.1.4 Outils

Les outils utilisés ont été choisis par moi-même en début de stage, en cohérence avec les technologies enseignées au Master 2 MBDS et avec les usages internes de Tsarajoro. IntelliJ IDEA a servi d'environnement de développement principal côté backend Java, complété par Visual Studio Code côté frontend TypeScript. La gestion de configuration s'appuie sur Git avec hébergement sur GitHub sur un compte personnel dédié aux projets d'école. Maven assure la compilation et la gestion des dépendances côté backend, pnpm côté frontend. Docker Desktop pilote les conteneurs de développement (PostgreSQL, Mailpit, Ollama, sandbox durcie). Postman et Swagger UI facilitent les tests manuels de l'API REST. Les diagrammes UML et d'architecture sont produits avec Mermaid, dont la syntaxe textuelle permet de versionner les schémas au même titre que le code source.

#### 4.1.5 Gestion de la configuration

Le dépôt principal skillforge-platform est structuré en trois grandes zones. Le dossier apps contient les trois applications déployables : backend-app pour l'API principale sur le port 8090, backend-sandbox pour le service isolé sur le port 8091, et frontend-web pour l'interface React. Le dossier docs regroupe les livrables documentaires : cahier des charges initial dans docs/01-cahier-des-charges, dossier de conception dans docs/02-conception, rapports de preuve de concept dans docs/03-poc, fiches de test dans docs/04-tests. Le dossier infra rassemble les fichiers d'infrastructure : docker-compose de développement, profil seccomp de durcissement de la sandbox, Dockerfiles des images d'exécution.

Les règles de nommage sont les suivantes. Les classes Java suivent la convention PascalCase, dans l'espace de nommage com.tsarajoro.skillforge suivi du module métier. Les tables PostgreSQL utilisent snake_case. Les migrations Flyway respectent le format V numéro suivi de deux underscores et d'une description courte, par exemple V6__invitation_access_code.sql. Chaque commit Git est atomique, en français, et se conforme aux règles internes du projet interdisant toute mention d'un outil de génération de code par intelligence artificielle.

L'organisation des sauvegardes repose sur les pousses réguliers vers le dépôt distant GitHub, en général au minimum une fois par jour de développement effectif.

### 4.2 Contraintes et risques sur le projet

Sept risques principaux ont été identifiés en début de stage puis actualisés à chaque revue de sprint. Le tableau ci-dessous en présente la synthèse.

| N° | Libellé du risque | Priorité | Facteur contribuant | Solution proposée | Statut |
|---|---|---|---|---|---|
| R1 | Sandbox Docker non sécurisée | Critique | Peu d'expérience préalable des mécanismes seccomp et capabilities Linux | Consacrer un POC dédié à la sécurité de la sandbox, avec un harness de cent cinquante cas d'attaque exécutables | ✅ Réalisé, zéro évasion mesurée |
| R2 | Génération de questions par IA de qualité insuffisante | Moyen | JSON parfois tronqué ou malformé par les modèles Groq | Compactage du prompt système, ajout d'un auto-repair côté service, intégration d'un fournisseur local Ollama en secours | ✅ Résolu |
| R3 | Précision d'analyse de CV insuffisante | Moyen | Hétérogénéité des formats reçus (PDF natif, PDF scanné, DOCX) | Multiplication des bibliothèques de parsing (PDFBox, Apache POI) et ajout d'un OCR Tesseract en secours | ✅ Réalisé |
| R4 | Retrait annoncé du service GitHub Models fin 2026 | Élevé | Décision unilatérale du fournisseur | Bascule sur le fournisseur Groq et ajout du provider local Ollama pour supprimer toute dépendance externe | ✅ Résolu |
| R5 | Retard de validation par l'encadreur professionnel | Critique | Charge de travail parallèle de l'encadreur | Planification des revues bi-mensuelles dès le début du stage, dépôts documentaires accessibles à tout moment | 🔄 En cours de suivi |
| R6 | Fuite de données candidat vers une API LLM externe (non-conformité RGPD) | Élevé | Dépendance à un modèle SaaS étranger pour l'analyse CV et la génération | Ajout du fournisseur local Ollama permettant un déploiement complètement souverain | ✅ Résolu |
| R7 | Coûts d'API LLM disproportionnés en cas de volume élevé de passations | Faible | Facturation à la requête chez OpenAI et Claude | Utilisation prioritaire du provider Groq gratuit, mise en cache des prompts récurrents, mode mock disponible pour les tests | ✅ Contrôlé |

*Tableau 2 : Contraintes et risques sur le projet SkillForge. Source : auteur (2026).*

### 4.3 Démarche projet mise en œuvre

Le projet a été découpé en huit sprints de deux semaines, soit seize semaines correspondant aux quatre mois de stage effectif. Le tableau ci-dessous rappelle le découpage prévu au cahier des charges et le statut à date de dépôt du présent mémoire.

| Sprint | Objectif principal | Statut |
|---|---|---|
| S0 | Cadrage, état de l'art, étude de l'existant, cahier des charges consolidé | ✅ 100 % |
| S1 | Conception UML et MCD, architecture générale, MVP backend | ✅ 100 % |
| S2 | POC 1 Analyse CV, banque de questions initiale, mise en conformité RGPD | ✅ 100 % |
| S3 | POC 2 Génération adaptative de tests, interface recruteur | ✅ 100 % |
| S4 | POC 3 Sandbox sécurisée, interface candidat | ✅ 100 % |
| S5 | Auto-grading du code candidat, compte rendu IA, anti-fraude comportemental | ✅ 100 % |
| S6 | POC 4 Statistiques discriminantes, boucle d'amélioration continue, tableau de bord | ✅ 100 % |
| S7 | Tests sécurité (harness POC 3 renforcé, audit OWASP ZAP), tests de charge (k6) | 🔄 En cours |
| S8 | Recette fonctionnelle, correction des bugs remontés, préparation de la mise en production | ⏳ Planifié |

*Tableau 3 : Découpage en sprints du projet SkillForge. Source : auteur (2026).*

À la date de dépôt du présent mémoire, les sprints S0 à S6 sont clos, le sprint S7 est en cours avec les livrables sécurité déjà validés (audit OWASP ZAP à zéro vulnérabilité, harness POC 3 à zéro évasion), et le sprint S8 est planifié pour la mise en production sur l'infrastructure interne de Tsarajoro.

### 4.4 Planification

*Un diagramme de Gantt macro à insérer ici, présentant les huit sprints sur une frise chronologique avec les principaux jalons de livraison. Le diagramme peut être produit avec Mermaid ou avec un outil comme GanttProject, puis inséré comme figure.*

Le planning initial et le planning réalisé coïncident sur les sept premiers sprints. Un écart d'environ dix jours est constaté sur le sprint S7 en raison du retrait imprévu du service GitHub Models qui a nécessité la bascule sur Groq puis l'intégration d'Ollama, non prévue initialement. Cet écart a été absorbé sur le sprint S8, dont le périmètre a été légèrement resserré autour des tâches strictement nécessaires à la mise en production.

### 4.5 Budget du projet

Les coûts directement associés à ma contribution sont les suivants. Le salaire de stagiaire a été convenu contractuellement avec Tsarajoro pour la durée de quatre mois. La machine de développement (ordinateur portable personnel) et la connexion Internet ne représentent pas de coût additionnel puisqu'ils étaient préexistants. Aucune licence logicielle payante n'a été nécessaire : l'ensemble des outils utilisés est disponible en version communautaire ou entièrement open source. Les appels aux API de LLM externes durant les phases de tests initiaux ont représenté un coût cumulé inférieur à cinq euros grâce à l'utilisation prioritaire des fournisseurs gratuits (Groq, puis Ollama en local). Aucun coût de licence Docker Desktop n'est facturé dans le cadre d'un usage personnel de développement.

---

## 5. Exigences réalisées dans le projet (vision externe / utilisateur)

Le cahier des charges complet, présentant l'ensemble des exigences fonctionnelles sous forme de user stories, est joint en annexe. Le présent chapitre en retient quatre représentatives correspondant aux moments-clés du cycle utilisateur.

### 5.1 Exigences fonctionnelles — User Stories principales

#### 5.1.1 US-01 : Analyse automatique du CV candidat

**En tant que** recruteur, **je veux** téléverser le CV d'un candidat au format PDF ou DOCX, **afin de** obtenir automatiquement la liste de ses compétences déclarées avec leur niveau estimé et le nombre d'années d'expérience détecté, sans avoir à parcourir manuellement le document.

Préconditions : le recruteur est authentifié avec un rôle RECRUTEUR ou ADMIN, le fichier est de taille inférieure à dix mégaoctets, le format est parmi PDF natif, PDF scanné ou DOCX.

Postconditions : une entité CvAnalysis est persistée en base, contenant la liste des compétences détectées, leur niveau (JUNIOR, CONFIRME, SENIOR ou UNKNOWN), le nombre d'années d'expérience associé, l'identifiant du fournisseur LLM utilisé et le nombre de jetons consommés.

Codes d'erreur retournés : 415 pour un format non supporté, 400 pour un fichier corrompu ou vide, 502 en cas d'indisponibilité du fournisseur LLM.

*Un diagramme de séquence UML au niveau système (boîte noire) est à insérer ici pour montrer le flux : recruteur → interface web → API /cv/upload → service de parsing (PDFBox, POI ou Tesseract selon le type) → service LLM → persistance en base.*

Une capture d'écran de la page « Nouveau test » présentant le badge du fournisseur LLM utilisé et la liste des compétences détectées est également à insérer.

#### 5.1.2 US-02 : Génération adaptative du test technique

**En tant que** recruteur, **je veux** générer un test technique à partir des compétences détectées et du profil cible du poste, **afin de** disposer d'un ensemble de questions QCM, d'exercices de code et de cas pratiques adaptés sans avoir à les rédiger manuellement.

Préconditions : au moins une compétence a été détectée à l'étape précédente, le recruteur a sélectionné le profil cible parmi la liste configurée dans Tsarajoro (Développeur PHP, Intégrateur WordPress, Développeur Vue.js, Spécialiste SEO technique, entre autres).

Postconditions : un ensemble de questions est persisté en base avec le statut PENDING_REVIEW, chaque question étant associée à son type (QCM, CODE ou CAS_PRATIQUE), à sa difficulté sur une échelle de un à cinq, à ses compétences visées et à son payload spécifique au type.

Le recruteur conserve la maîtrise complète sur les questions générées : chacune peut être approuvée en l'état, modifiée puis approuvée, ou rejetée. Cette étape de validation humaine est un choix explicite de conception, destiné à éviter que des questions imparfaites soient envoyées à un candidat sans relecture préalable.

#### 5.1.3 US-03 : Passation candidat sécurisée avec code d'accès

**En tant que** candidat, **je veux** démarrer ma passation à partir du lien reçu par courrier électronique et du code d'accès à six chiffres transmis dans le même courrier, **afin de** garantir que je suis bien la personne à qui l'invitation a été adressée par le recruteur.

Préconditions : le candidat a reçu un courrier électronique contenant un lien unique et un code d'accès à six chiffres, l'invitation associée au lien n'est ni expirée ni déjà utilisée.

Postconditions : une entité Passation est créée avec l'identifiant du candidat pré-établi par le recruteur, la question courante est initialisée sur la première question du test, un consentement RGPD sur l'analyse anti-fraude est enregistré.

Cas d'erreur : 410 pour un lien inconnu, expiré ou déjà utilisé (statut uniforme évitant l'énumération des tokens valides), 403 avec le message « Code d'accès invalide » en cas de saisie incorrecte, 403 avec le message « Trop de tentatives, réessayez dans quinze minutes » après cinq échecs consécutifs pour bloquer un éventuel brute force sur le code à six chiffres.

Cette user story a été enrichie en cours de recette à la suite d'une remarque de l'encadreur portant sur l'usurpation d'identité potentielle. Le développement initial ne demandait que le nom et le courrier électronique librement saisis par le candidat, ce qui laissait la porte ouverte à un candidat déclarant une identité différente de celle attendue. L'ajout du verrouillage d'identité côté serveur (l'email saisi doit correspondre au candidat pré-établi sur le test) et du code d'accès à six chiffres transmis par courrier constitue une défense en profondeur.

#### 5.1.4 US-04 : Notation automatique et compte rendu IA

**En tant que** recruteur, **je veux** disposer d'un compte rendu structuré immédiatement après la soumission du test par le candidat, **afin de** prendre une décision éclairée sans devoir corriger manuellement les réponses.

Postconditions : chaque question est notée automatiquement selon son type (comparaison binaire pour les QCM, exécution des tests unitaires cachés dans la sandbox pour les CODE, évaluation par LLM sur cent points pour les CAS_PRATIQUE) ; un score global pondéré est calculé (trente pour cent QCM, cinquante pour cent CODE, vingt pour cent CAS_PRATIQUE) ; un compte rendu textuel est produit par le LLM, listant les points forts, les points faibles et une recommandation parmi HIRE, INTERVIEW ou REJECT.

Le rapport est également exportable en PDF pour archivage ou partage avec d'autres décideurs de Tsarajoro.

### 5.2 Exigences non fonctionnelles transverses

Les exigences non fonctionnelles sont regroupées dans le tableau ci-dessous. Chacune est associée à une valeur cible chiffrée issue du cahier des charges et à la valeur effectivement mesurée à date.

| Catégorie | Exigence | Valeur cible | Valeur mesurée |
|---|---|---|---|
| Utilisabilité | Interface responsive avec mode clair et mode sombre | Support Chrome et Firefox sur desktop et mobile | Validé, thèmes commutables via une propriété data-theme sur l'élément racine |
| Performance | Latence d'analyse d'un CV | < 15 s | ~5-10 s avec le fournisseur Groq |
| Performance | Latence de génération d'un test | < 30 s | ~10-20 s pour un test de trois questions |
| Performance | Latence d'exécution d'un exercice de code en sandbox | < 5 s (timeout dur) | Médiane 330 ms, P95 422 ms (POC 3) |
| Robustesse | Disponibilité de la plateforme | ≥ 99 % | Non mesuré en production, non applicable en phase de développement |
| Capacité | Nombre de candidats simultanés supportés | 20 | À mesurer en sprint S7 avec l'outil k6 |
| Sécurité | Audit OWASP Top 10 | 0 vulnérabilité High, Medium ou Low | ✅ Atteint après onze itérations d'audit ZAP |
| Sécurité | Évasion de la sandbox | 0 sur 30 cas d'attaque (cible CDC) | ✅ 0 sur 50 cas d'attaque (dépassement de la cible) |
| Sécurité | Chiffrement des mots de passe | Argon2id avec paramètres OWASP 2025 | Validé |
| Sécurité | Chiffrement des communications | TLS 1.3 en production | À mettre en place lors de la mise en production S8 |
| RGPD | Consentement explicite du candidat | Case à cocher préalable au démarrage | Validé |
| RGPD | Purge automatique des CV | Après 12 mois de rétention | Validé, batch quotidien |
| RGPD | Hébergement des données | Infrastructure interne Tsarajoro | Validé, aucun stockage tiers |

*Tableau 4 : Exigences non fonctionnelles transverses et niveaux mesurés. Source : auteur (2026).*

### 5.3 Interfaces détaillées

#### 5.3.1 Interface Homme-Machine

*Cinq à sept captures d'écran commentées sont à insérer ici. Pour chaque capture, une phrase introductive présente le rôle de l'écran et son placement dans le parcours utilisateur, suivie d'une description courte de son fonctionnement.*

Les écrans principaux à documenter sont : la page d'accueil du recruteur, la page « Nouveau test » avec le badge du fournisseur LLM et la liste des compétences détectées, la page de validation des questions à valider (interface « inbox intelligent » de la page /app/review), la page d'accueil du candidat avec le bloc vert d'identité verrouillée et le champ de code d'accès à six chiffres, l'écran de passation avec l'éditeur Monaco et le chronomètre, l'écran de fin de passation avec la grille de scores et la bannière ambre en mode démonstration, et le tableau de bord analytique du recruteur avec les indicateurs discriminants.

#### 5.3.2 Interfaces avec d'autres systèmes

Trois interfaces externes sont mobilisées. La première est l'API des fournisseurs de modèles de langage : elle suit le standard OpenAI (endpoint /v1/chat/completions), ce qui permet d'utiliser indifféremment OpenAI, Anthropic Claude, Groq et Ollama en changeant uniquement la variable d'environnement LLM_PROVIDER et la clé associée. La deuxième est le serveur SMTP : Mailpit est utilisé en développement pour capturer les courriers électroniques sans les envoyer vers l'extérieur, et un vrai SMTP est configurable en production via les variables d'environnement SMTP_HOST, SMTP_PORT, SMTP_USERNAME et SMTP_PASSWORD. La troisième est l'API Docker : la sandbox utilise la bibliothèque Docker Java pour piloter le démon Docker et lancer un conteneur éphémère par exécution de code candidat.

---

## 6. Architectures système

L'architecture du projet SkillForge est présentée sous deux vues complémentaires, conformément au plan type recommandé par le Master 2 MBDS : une vue logicielle centrée sur l'organisation interne des modules, et une vue technique centrée sur les composants d'infrastructure.

### 6.1 Architecture logicielle

L'architecture logicielle repose sur une séparation en deux services Spring Boot indépendants, dictée par un enjeu majeur de sécurité. Le premier service, backend-app, expose l'ensemble de l'API métier consommée par le frontend : authentification, gestion des CV, génération de tests, gestion des invitations, passations candidats, notation, rapports et analytique. Il a accès à la base de données PostgreSQL et détient l'ensemble des données sensibles (identifiants, tokens JWT, CV, réponses candidats). Le second service, backend-sandbox, est un service isolé dont l'unique responsabilité est d'exécuter le code soumis par le candidat dans un conteneur Docker durci. Il ne dispose d'aucun accès à la base de données et communique avec backend-app uniquement via une API HTTP interne protégée par une clé partagée.

Cette séparation est directement liée à la nature du code exécuté dans la sandbox : par définition, il provient de l'extérieur et peut être malveillant. Même si le harness POC 3 démontre qu'aucune évasion n'est possible dans l'état actuel du durcissement, l'isolation physique du service garantit que, dans le cas hypothétique où une évasion serait découverte, l'attaquant n'atteindrait qu'un service vide de données, sans accès à la base et sans capacité de latéralisation vers backend-app.

Le frontend est une Single-Page Application React 19 unique, servie via Vite en développement et via un serveur statique en production. Il consomme exclusivement l'API de backend-app et n'a aucune connaissance directe de l'existence de backend-sandbox.

*Un diagramme de composants à insérer ici, présentant les trois blocs (frontend-web, backend-app, backend-sandbox), leurs relations et le positionnement de la base de données PostgreSQL.*

### 6.2 Architecture technique

L'architecture technique décrit l'infrastructure sur laquelle les composants logiciels sont déployés. En production sur l'infrastructure interne de Tsarajoro, un serveur Linux héberge le reverse proxy (Traefik ou Nginx), qui expose sur l'extérieur les deux endpoints publics : celui du frontend et celui de l'API. La base de données PostgreSQL est déployée dans un conteneur Docker persistant. La sandbox utilise le démon Docker local du serveur pour lancer ses conteneurs éphémères, protégés par un profil seccomp restrictif, la suppression de toutes les capacités Linux, l'absence totale de réseau (no-network), le système de fichiers racine en lecture seule et l'exécution sous un utilisateur non privilégié.

Le fournisseur de modèle de langage est soit une API externe (Groq, OpenAI, Anthropic) accessible depuis le serveur via HTTPS, soit une instance Ollama locale déployée dans un conteneur Docker sur le même serveur. Cette flexibilité, configurée via une simple variable d'environnement, permet à Tsarajoro de choisir en production le fournisseur le plus adapté à son contexte réglementaire et budgétaire, avec la possibilité de basculer intégralement en local pour un fonctionnement complètement souverain.

*Un diagramme d'architecture technique à insérer ici, présentant l'ensemble des composants d'infrastructure et leurs interconnexions.*

Ma contribution personnelle sur ces deux architectures est de cent pour cent : le projet ayant été mené en solo, la conception logicielle, le découpage en deux services, le choix des technologies et la mise en place de l'infrastructure de développement sont tous mon fait, sous validation de l'encadreur professionnel à chaque revue de sprint.

---

## 7. Conception du système logiciel (vision interne / développeur)

### 7.1 Plate-forme technique

La plate-forme technique retenue combine les choix suivants. Côté runtime backend, Java 21 sur la JVM OpenJDK, avec Spring Boot 3.4 comme framework applicatif. Le choix de Spring Boot 3 se justifie par sa maturité, son écosystème étendu (Spring Security pour l'authentification, Spring Data JPA pour la persistance, Spring Boot Starter Mail pour les envois) et sa conformité aux enseignements du Master 2 MBDS. Côté runtime sandbox, les images Docker Alpine PHP 8.3 et Node 20 sont retenues pour leur légèreté (moins de 200 mégaoctets chacune) et pour leur alignement avec les profils métier réellement recrutés chez Tsarajoro. Côté runtime frontend, Node 20 est utilisé pour Vite 6 et pnpm 10, avec React 19 et TypeScript 5. La base de données est PostgreSQL 16, retenue pour sa robustesse, ses fonctionnalités avancées (JSONB natif, indexation GIN, extensions statistiques) et sa gratuité totale. En production, un reverse proxy Traefik ou Nginx est prévu pour la terminaison TLS et le routage.

### 7.2 Conception du logiciel développé

#### 7.2.1 Conception du code source

Le code source du backend est organisé en modules métier au sein de l'espace de nommage com.tsarajoro.skillforge. Chaque module regroupe les classes participant à un domaine fonctionnel bien identifié : le module auth pour l'authentification et la gestion des sessions JWT, le module cv pour le parsing et l'analyse des CV, le module generation pour la génération de tests par LLM, le module candidate pour les passations candidat, le module report pour les comptes rendus IA, le module analytics pour le tableau de bord discriminant, le module mail pour l'envoi transactionnel des invitations, le module sandbox pour l'interface avec le service sandbox, le module llm pour l'abstraction multi-fournisseurs, le module security pour la configuration Spring Security, le module exception pour la gestion centralisée des erreurs HTTP.

Cette organisation applique les bonnes pratiques de conception dites « package by feature » : chaque package est autonome, chaque dépendance entre packages est explicite. Les inversions de dépendance passent par des interfaces définies dans le package qui les utilise, en particulier LlmClient qui est une interface unique implémentée par cinq classes selon le fournisseur configuré (MockLlmClient, OpenAiLlmClient, ClaudeLlmClient, GroqLlmClient, OllamaLlmClient).

Les règles de nommage adoptées sont classiques en Java : les classes en PascalCase, les méthodes et variables en camelCase, les constantes en MAJUSCULES_AVEC_UNDERSCORE. Les entités JPA portent le nom du concept métier au singulier (Passation, Candidate, Invitation), les repositories ajoutent le suffixe Repository, les services le suffixe Service, les contrôleurs le suffixe Controller. Les tables PostgreSQL suivent la convention snake_case (invitations, cv_analyses, fraud_events).

#### 7.2.2 Le code source — vue statique

*Un diagramme de packages à insérer ici, produit avec IntelliJ IDEA ou avec PlantUML, montrant les principaux packages du backend et leurs relations de dépendance.*

Trois classes clés méritent une mise en avant. La première est CandidatePassationService, qui orchestre l'intégralité du cycle candidat : démarrage de la passation avec vérification du code d'accès, sauvegarde des réponses, exécution du code via la sandbox, soumission finale avec notation multi-critères. La deuxième est SandboxRunner, qui applique les onze flags de durcissement Docker à chaque conteneur d'exécution (no-network, readonly-rootfs, cap-drop=ALL, no-new-privileges, memory limit, PID limit, seccomp profile, user non privilégié, entrypoint clear, workdir en lecture seule, timeout). La troisième est LlmClient, l'interface qui abstrait les cinq fournisseurs et permet la bascule à chaud via une variable d'environnement.

#### 7.2.3 Modélisation des données

Le modèle conceptuel de données regroupe onze entités principales, dont les principales relations sont les suivantes.

Un User représente un compte de la plateforme (recruteur, admin) avec son mot de passe haché en Argon2id.

Un Candidate représente un candidat au recrutement, identifié par son adresse électronique. Un candidat possède zéro ou plusieurs CV, chaque CV pouvant avoir une CvAnalysis associée listant les compétences détectées.

Un Test est un ensemble de questions généré pour un candidat et un profil cible. Un test possède plusieurs Questions, chaque question étant de type QCM, CODE ou CAS_PRATIQUE et portant sur une ou plusieurs compétences (Skills) via la table de liaison question_skills.

Une Invitation matérialise l'envoi d'un test à un candidat. Elle contient un token unique, un code d'accès à six chiffres généré cryptographiquement, une date d'expiration et un statut d'utilisation.

Une Passation est instanciée lorsque le candidat démarre effectivement le test à partir d'une invitation. Elle contient les Answers du candidat, une pour chaque question du test.

Les FraudEvents sont enregistrés au fil de la passation lorsque le frontend détecte un signal anti-fraude (perte de focus onglet, tentative de copier-coller volumineux, sortie du plein écran).

Un Report est produit à la fin de la passation, contenant le score global, la répartition par type de question, la recommandation IA et l'explication textuelle.

*Un diagramme de classes UML ou un MCD Merise à insérer ici, produit avec un outil comme Draw.io ou PlantUML.*

Le schéma évolue au fil du projet via sept migrations Flyway numérotées V1 à V7. La migration V1 pose le schéma initial. La V2 ajoute la relation Test-Candidate. La V3 enrichit les colonnes d'Answer avec les détails d'exécution du code. La V4 ajoute les métadonnées LLM aux rapports. La V5 introduit les métadonnées de fraude. La V6 ajoute le code d'accès à six chiffres sur les invitations (livrable UX-01 issu de la recette). La V7 rétro-remplit les invitations pré-existantes avec un code aléatoire et fait passer la colonne en NOT NULL, pour supprimer tout risque de bypass silencieux.

#### 7.2.4 Réalisation d'un cas d'utilisation

*Un diagramme de séquence UML boîte blanche à insérer ici, décrivant en interne le cas d'utilisation US-03 (démarrage sécurisé d'une passation avec code d'accès).*

Le scénario est le suivant. Le candidat soumet un POST sur l'endpoint /candidate/passations/start avec le token de son invitation, son adresse électronique, son nom et le code d'accès à six chiffres. Le contrôleur CandidateController transmet la requête au service CandidatePassationService. Ce dernier vérifie d'abord la validité de l'invitation via le repository InvitationRepository (existence, non-expiration, non-utilisation) ; en cas d'échec sur l'un des trois critères, il lève une InvitationInvalidException qui est mappée en HTTP 410 uniforme par le GlobalExceptionHandler. Il vérifie ensuite si une Passation existe déjà pour cette invitation, auquel cas il la retourne (comportement idempotent pour la reprise après F5). Sinon, il appelle la méthode privée verifyAccessCode qui consulte le compteur d'échecs AccessCodeAttemptTracker : si l'invitation est verrouillée après cinq échecs, une SecurityException est levée avec le message « Trop de tentatives ». Sinon, la comparaison du code saisi et du code stocké est effectuée en temps constant via MessageDigest.isEqual, pour neutraliser une éventuelle attaque par mesure de temps. En cas d'échec, le compteur est incrémenté ; en cas de succès, il est remis à zéro. Enfin, l'identité du candidat est verrouillée en vérifiant que l'email saisi correspond au candidat pré-établi sur le test. Si toutes les vérifications passent, une nouvelle Passation est créée et retournée au client.

#### 7.2.5 Les composants et leur déploiement

Trois composants déployables sont produits par le projet.

Le premier est backend-app, packagé en JAR fat via Maven, exécutable directement avec java -jar. En développement, il est lancé via mvn spring-boot:run avec les variables d'environnement chargées depuis le fichier .env grâce à la bibliothèque spring-dotenv. En production, il sera déployé sous forme d'image Docker multi-stage sur l'infrastructure Tsarajoro.

Le second est backend-sandbox, identique dans son mode de packaging, avec la contrainte supplémentaire de disposer d'un démon Docker accessible localement pour lancer les conteneurs de sandbox.

Le troisième est frontend-web, dont la commande vite build produit un ensemble de fichiers statiques (HTML, CSS, JavaScript) servis par un serveur Nginx en production. En développement, la commande pnpm dev lance le serveur de développement Vite sur le port 5173 avec rechargement à chaud.

En complément, trois conteneurs d'infrastructure sont fournis dans le fichier infra/docker-compose.yml : skillforge-postgres pour la base de données, skillforge-mailpit pour le serveur SMTP de développement, skillforge-ollama pour l'exécution locale des modèles de langage.

Les règles de nommage des artefacts déployables sont : les images Docker Tsarajoro suivent le format tsarajoro/skillforge-<service>:<version>, les volumes persistants le format skillforge_<usage> (par exemple skillforge_pgdata, skillforge_ollama_models).

---

## 8. Tests du système logiciel

La stratégie de tests s'articule autour de quatre niveaux : tests fonctionnels manuels, tests unitaires et d'intégration automatisés, tests de sécurité offensive et tests de performance.

### 8.1 Tests fonctionnels manuels

Une fiche de tests manuels a été rédigée en cours de projet et couvre environ cent scénarios d'utilisation, structurés autour des grandes fonctionnalités de la plateforme. La fiche est jointe en annexe. Elle a été déroulée en deux passes de recette successives, avec l'encadreur professionnel comme testeur bénévole, ce qui a permis de faire remonter deux anomalies significatives corrigées avant le dépôt du présent mémoire.

La première anomalie, référencée BUG-01, portait sur la notation des cas pratiques en mode démonstration (fournisseur LLM configuré sur « mock »). Le mock notait les réponses uniquement à leur longueur, ce qui permettait à une réponse incohérente mais suffisamment longue d'être comptée réussie. La correction a plafonné le score du mock à quarante sur cent (soit sous le seuil de réussite de soixante), enrichi le message d'explication d'un préfixe explicite « SIMULE — mode démo » et ajouté une bannière visuelle ambre sur la page finale du candidat lorsque le mock est utilisé.

La seconde anomalie, référencée UX-01, portait sur l'usurpation potentielle d'identité candidat lors du démarrage d'une passation. Le formulaire d'origine laissait le candidat saisir librement son nom, ce qui rendait possible qu'un tiers récupérant le lien démarre la passation sous une identité différente de celle attendue. La correction a introduit trois mécanismes complémentaires détaillés au chapitre 5.1.3 : verrouillage de l'identité côté serveur, code d'accès à six chiffres transmis par courrier électronique, et rate limiting sur les tentatives de saisie du code.

### 8.2 Tests unitaires et d'intégration

Les tests unitaires couvrent la logique métier isolée : parsing des payloads JSON des questions, calcul du score pondéré, vérification du code d'accès en temps constant, génération du code aléatoire à six chiffres. Ils sont écrits en JUnit 5 avec les assertions AssertJ, exécutés à chaque compilation via Maven.

Les tests d'intégration s'appuient sur la bibliothèque Testcontainers, qui permet de démarrer une vraie base PostgreSQL dans un conteneur Docker pour la durée de la classe de test. Cela permet de vérifier le comportement réel des repositories JPA, des migrations Flyway et des transactions, sans mocker la couche persistance.

### 8.3 Tests de sécurité offensive

C'est le niveau de tests le plus valorisant pour le présent mémoire, dans la mesure où il apporte des mesures chiffrées et reproductibles à l'appui du choix technique de sécurité.

#### 8.3.1 POC 3 — Sandbox Docker sécurisée

Un harness de tests a été développé spécifiquement pour valider les critères de sécurité de la sandbox définis dans le cahier des charges. Ce harness, sous forme de test JUnit exécutable via la commande mvn test avec le paramètre poc3.run à true, applique cent cinquante cas de test à la sandbox réelle : cent cas d'exécutions valides censées réussir (cinquante en PHP, cinquante en JavaScript), et cinquante cas d'attaque censés être bloqués. Les cinquante attaques sont réparties en sept catégories : fork bomb et déni de service CPU, tentative d'accès réseau, lecture de fichiers système, écriture ou persistance sur le système, épuisement de mémoire, exécution de processus enfant pour échapper au conteneur, et attaques bonus créatives (contournement d'open_basedir, import dynamique).

Le harness a démarré à dix-sept évasions détectées sur cinquante tentatives, ce qui a déclenché onze itérations de durcissement successives. Chaque itération a corrigé une classe précise de vulnérabilité : ajout des appels système clone et clone3 au profil seccomp pour permettre à Node de créer ses threads, désactivation via php.ini des fonctions shell_exec, system, exec, popen et de leurs équivalents, ajout d'open_basedir restrictif, retrait des droits d'exécution des utilitaires shell (cat, ls, whoami) pour l'utilisateur non privilégié du conteneur, activation de la Permission API expérimentale de Node avec --allow-fs-read restreint. Les cinq dernières évasions étaient en réalité des faux positifs du harness lui-même (par exemple, un Buffer.alloc de cinq cent douze mégaoctets sans écriture ne consomme pas réellement la mémoire, l'OOM killer ne se déclenche donc pas). Ces cas ont été réécrits pour forcer l'écriture effective dans la zone mémoire, avec cette fois un déclenchement correct de l'OOM killer.

Le résultat final, reproductible avec la version courante du code sur toute machine disposant de Docker, est le suivant : zéro évasion sur les cinquante cas d'attaque, cent pour cent de succès sur les cent exécutions valides, latence médiane de trois cent trente millisecondes, latence en quatre-vingt-quinzième centile de quatre cent vingt-deux millisecondes. Ces chiffres dépassent les critères de succès fixés dans le cahier des charges (zéro évasion sur trente cas d'attaque, latence médiane inférieure à deux secondes).

#### 8.3.2 Audit OWASP Top 10 avec ZAP

Un audit de sécurité selon le classement OWASP Top 10 a été mené avec l'outil OWASP ZAP en Docker, sous deux formes complémentaires : un scan baseline passif qui analyse les réponses HTTP sans envoyer d'attaque, et un scan full actif qui envoie de vraies charges utiles (injection SQL, XSS, path traversal, injection de commande, XXE, SSRF).

La chaîne d'analyse repose sur un script shell reproductible qui automatise le démarrage du backend en mode audit, le login recruteur, l'import de la spécification OpenAPI du backend pour permettre à ZAP de découvrir automatiquement l'ensemble des endpoints, l'exécution des scans et la génération de rapports HTML et JSON datés.

L'audit initial a fait remonter dix-sept alertes Low, principalement de la catégorie Information Disclosure via exposition de stacktraces sur des endpoints renvoyant HTTP 500 (par exemple sur un UUID malformé). Onze itérations de correction ont été appliquées : ajout des six en-têtes HTTP de sécurité manquants (Content-Security-Policy strict, X-Frame-Options DENY, X-Content-Type-Options nosniff, Strict-Transport-Security 1 an, Referrer-Policy et Permissions-Policy), et enrichissement du GlobalExceptionHandler avec six nouveaux gestionnaires d'exception mappant proprement les erreurs Spring vers les codes HTTP 400, 404, 405, 409, 415 ou 500 génériques, sans jamais renvoyer de stacktrace au client.

Le résultat final est : zéro vulnérabilité High, zéro vulnérabilité Medium, zéro vulnérabilité Low sur le scan baseline comme sur le scan full. Seules deux alertes Informationnelles subsistent (identification d'un endpoint d'authentification et bruit du fuzzer d'User-Agent), qui sont des observations attendues et non des failles.

#### 8.3.3 Autres mesures sécurité

Trois mécanismes complémentaires renforcent la sécurité au-delà du top dix OWASP. Un compteur d'échecs de saisie du code d'accès verrouille toute invitation après cinq échecs consécutifs pendant quinze minutes, ce qui rend impossible un brute force du code à six chiffres (le million de combinaisons possibles est ramené à un maximum de cinq tentatives par intervalle de quinze minutes). La comparaison du code saisi et du code attendu utilise la méthode MessageDigest.isEqual, qui s'exécute en temps constant indépendamment de la longueur du préfixe commun, neutralisant ainsi une éventuelle attaque par mesure de temps. Enfin, l'intégration du fournisseur LLM local Ollama supprime toute fuite potentielle des données candidat vers un service tiers étranger, ce qui constitue une garantie supplémentaire au regard du RGPD.

### 8.4 Tests de performance

*Section à compléter à l'issue du sprint S7 en cours. Le cahier des charges cible une capacité de vingt candidats simultanés en passation. Un jeu de tests k6 est en cours de rédaction pour simuler ces vingt candidats en parallèle et mesurer les latences API et sandbox sous charge. Les résultats seront insérés ici avant dépôt final du mémoire.*

---

## 9. Conclusion générale

### 9.1 Bilan des résultats obtenus pour l'entreprise

À la date de dépôt du présent mémoire, l'ensemble des livrables du cahier des charges initial sont produits, à l'exception des tests de performance k6 en cours d'implémentation et de la mise en production sur l'infrastructure interne de Tsarajoro planifiée au sprint S8.

Concrètement, la plateforme SkillForge se compose de trois applications déployables (backend-app, backend-sandbox et frontend-web), d'un fichier docker-compose complet pour l'infrastructure de développement, de quatre rapports de preuve de concept, d'un rapport d'audit OWASP ZAP, d'une fiche de tests manuels, d'un guide d'installation d'Ollama et du présent mémoire. Le code source représente environ quinze mille lignes de code Java côté backend, dix mille lignes de TypeScript côté frontend, et sept migrations Flyway de base de données. L'historique Git compte une quarantaine de commits versionnés sur un compte personnel dédié aux projets d'école.

Les cinq critères de succès mesurables définis dans le cahier des charges sont atteints à date : la sandbox Docker est validée à zéro évasion sur cinquante cas d'attaque (au lieu des trente ciblés), l'audit OWASP est validé à zéro vulnérabilité, l'analyse de CV extrait correctement les compétences déclarées avec niveaux JUNIOR, CONFIRME ou SENIOR, la génération de questions produit des tests exploitables acceptables par le recruteur après relecture, les statistiques discriminantes sont calibrées contre l'implémentation de référence Python scipy.

Le statut des principaux livrables est le suivant : sprints S0 à S6 clos à cent pour cent, sprint S7 clos à quatre-vingt-dix pour cent (reste k6 tests charge), sprint S8 planifié pour la mise en production. La plateforme est fonctionnellement complète pour le périmètre V1 du cahier des charges.

### 9.2 Bilan des problèmes rencontrés et solutions apportées

Cinq difficultés majeures ont été rencontrées et surmontées durant le stage.

La première a été le retrait annoncé du service GitHub Models par GitHub à la fin de l'année 2026, initialement retenu comme fournisseur LLM gratuit du projet. Ce service est passé en HTTP 410 « brownout » de manière intermittente puis quasi-continue à partir du sprint S6. La solution a été de basculer d'abord sur Groq, puis d'intégrer une architecture multi-fournisseur avec un provider local Ollama supprimant toute dépendance externe.

La deuxième difficulté a porté sur la génération de JSON structuré par le modèle Qwen sur Groq : le modèle produisait fréquemment du JSON tronqué au niveau de la limite de jetons de sortie ou malformé avec des guillemets mal échappés. La solution a été triple : compactage du prompt système pour économiser des jetons, ajout d'un mécanisme d'auto-repair côté service qui referme les containers JSON non fermés en fin de chaîne, et proposition d'Ollama en fournisseur alternatif au comportement JSON plus stable.

La troisième difficulté a été une race condition lors des doubles clics sur le bouton de démarrage de passation : deux requêtes simultanées tentaient de créer deux Passations pour la même Invitation, ce qui violait la contrainte UNIQUE et retournait une HTTP 500 avec stacktrace exposée au candidat. La solution a été d'ajouter un gestionnaire dédié à DataIntegrityViolationException, mappant proprement l'erreur vers HTTP 409 Conflict sans stacktrace.

La quatrième difficulté est le bug BUG-01 mis en évidence lors de la recette : le mock LLM notait les cas pratiques selon leur longueur uniquement, permettant à une réponse incohérente d'être comptée réussie. La solution a été détaillée au chapitre 8.1 : plafonnement du score mock sous le seuil de réussite, préfixe explicite dans l'explication et bannière visuelle sur la page finale.

La cinquième difficulté est l'exigence UX-01 également issue de la recette : le risque d'usurpation d'identité candidat via un lien intercepté. La solution combine trois mécanismes détaillés au chapitre 5.1.3 : verrouillage de l'identité côté serveur, code d'accès à six chiffres, rate limiting après cinq échecs.

### 9.3 Perspectives du projet

Trois catégories de perspectives se dégagent à l'issue de ce stage.

À court terme, en sprint S7 en cours, l'implémentation des tests de charge k6 permettra de valider la capacité à supporter vingt candidats en passation simultanée conformément au cahier des charges. En sprint S8, la mise en production sur l'infrastructure interne de Tsarajoro concrétisera la livraison effective.

À moyen terme, plusieurs axes d'évolution mentionnés dans le périmètre exclu V2 du cahier des charges pourront être adressés : application mobile candidat, proctoring vision avancé par webcam, tests adaptatifs de type IRT (Item Response Theory), détection de plagiat de code par comparaison externe avec des dépôts GitHub publics, intégration avec des systèmes ATS externes, mise en place d'une authentification unique SSO interne, extension de la sandbox à d'autres langages (Python, Java, Go).

À long terme, la valeur la plus riche du produit résidera dans l'exploitation de la boucle d'amélioration continue via les statistiques discriminantes. À mesure que le nombre de passations augmente, les questions à fort pouvoir discriminant seront automatiquement priorisées pour les futures générations de tests, et les questions à faible pouvoir discriminant pourront être proposées automatiquement à la régénération par le LLM. Cette boucle transforme la plateforme en un système apprenant qui s'améliore sans intervention manuelle systématique.

### 9.4 Bilan personnel

Ce stage de fin d'études représente pour moi un aboutissement de la formation Master 2 MBDS et l'occasion de mobiliser en un seul projet un large spectre de compétences acquises durant l'année.

Au plan technique, l'approfondissement de Spring Security, du durcissement Docker et des mécanismes seccomp constitue le premier apport majeur. La confrontation directe à un vrai retrait d'API en production (GitHub Models) m'a également enseigné l'importance concrète du principe d'inversion de dépendance : sans l'abstraction LlmClient et le multi-fournisseurs prévu dès la conception initiale, ce retrait aurait pu compromettre le projet entier. La découverte pratique d'Ollama et du déploiement de modèles de langage locaux ouvre par ailleurs des perspectives d'architecture souveraine qui dépassent le cadre du présent stage.

Au plan méthodologique, la démarche de preuve de concept avec validation chiffrée m'a marqué durablement. Le POC 3 en particulier, où le harness a fait remonter dix-sept évasions puis a permis de les corriger une par une jusqu'à zéro, m'a fait passer d'une approche déclarative de la sécurité (« la sandbox est durcie car j'ai appliqué ces flags Docker ») à une approche empirique (« la sandbox est durcie car cinquante attaques ne parviennent pas à s'en échapper, mesuré et reproductible sur toute machine »). Cette différence de posture est probablement le plus grand acquis du stage.

Au plan humain, la posture d'ownership complet du produit, depuis le cadrage du cahier des charges jusqu'à la livraison finale, a été enrichissante et parfois exigeante. Elle m'a appris à hiérarchiser mes efforts en fonction de la valeur pour Tsarajoro plutôt qu'en fonction de mon confort technique, à documenter systématiquement pour permettre à un tiers de reprendre le projet, et à confronter régulièrement mes choix à l'encadreur professionnel plutôt qu'à décider seul dans le silence.

Je remercie chaleureusement Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich pour la confiance accordée dès le premier sprint et la qualité de son encadrement, ainsi que l'ensemble de l'équipe pédagogique du Master 2 MBDS pour la formation qui a rendu ce projet possible.

---

## 10. Références et Bibliographie

Style APA (Auteur, Année). Ordre alphabétique. Retrait suspendu à respecter dans le document Word.

**Standards, spécifications et documentation officielle**

Docker Inc. (2026). *Docker security — Seccomp security profiles*. Consulté le [date à préciser], sur https://docs.docker.com/engine/security/seccomp/

Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT) — RFC 7519*. Internet Engineering Task Force.

OWASP Foundation. (2025). *OWASP Top 10 – 2025 Edition*. Consulté le [date à préciser], sur https://owasp.org/Top10/

OWASP Foundation. (2025). *Password Storage Cheat Sheet*. Consulté le [date à préciser], sur https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

PostgreSQL Global Development Group. (2025). *PostgreSQL 16 Documentation*. Consulté le [date à préciser], sur https://www.postgresql.org/docs/16/

Spring Team. (2026). *Spring Boot 3.4 Reference Documentation*. Pivotal / VMware. Consulté le [date à préciser], sur https://docs.spring.io/spring-boot/docs/3.4.x/reference/html/

**Articles scientifiques et livres**

Biryukov, A., Dinu, D., & Khovratovich, D. (2016). Argon2: New Generation of Memory-Hard Functions for Password Hashing and Other Applications. *IEEE European Symposium on Security and Privacy*.

Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2ᵉ éd.). Addison-Wesley.

Zheng, L., Chiang, W.-L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., … Stoica, I. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. *NeurIPS 2023 Datasets and Benchmarks Track*.

**Ressources spécifiques SkillForge (rapports internes)**

GERSHOM, N. A. F. (2026). *Rapport POC 3 — Sandbox Docker sécurisée SkillForge : cent cinquante cas de test, zéro évasion*. Rapport interne Tsarajoro, disponible dans docs/03-poc/poc3-sandbox/RAPPORT_POC3.md du dépôt Git skillforge-platform.

GERSHOM, N. A. F. (2026). *Rapport OWASP ZAP — Audit sécurité SkillForge*. Rapport interne Tsarajoro, disponible dans docs/03-poc/poc-owasp-zap/RAPPORT_ZAP.md du dépôt Git skillforge-platform.

GERSHOM, N. A. F. (2026). *Cahier des charges SkillForge — Master 2 MBDS*. Version consolidée disponible dans docs/01-cahier-des-charges/ du dépôt Git skillforge-platform.

**Mémoires de référence**

ANDRIANAIVOSOA, T. (2023). *Participation au développement du système de gestion des solutions de mobilités en Île-de-France* [Mémoire de Master 2, IT University / MBDS].

**Comparatifs plateformes recrutement (état de l'art chapitre 2)**

Selecthub. (2026). *HackerRank vs Codility — Technical Assessment Tools Comparison*. Consulté le [date à préciser], sur https://www.selecthub.com/technical-assessment-tools/hackerrank-vs-codility/

CodeSignal. (2025). *Introducing AI-Assisted Coding Assessments and Interviews*. Consulté le [date à préciser], sur https://codesignal.com/blog/introducing-ai-assisted-coding-assessments-interviews/

iMocha. (2026). *Top 20 Best Codility Alternatives & Competitors in 2026*. Consulté le [date à préciser], sur https://www.imocha.io/blog/codility-alternatives

**Réglementaire**

Commission Nationale de l'Informatique et des Libertés — CNIL. (2018). *Règlement Général sur la Protection des Données (RGPD) — texte intégral*. Consulté le [date à préciser], sur https://www.cnil.fr/fr/reglement-europeen-protection-donnees

---

## 11. Annexes

À référencer dans le rapport principal quand pertinent. Chaque annexe peut être livrée dans un fichier séparé fourni avec le mémoire.

**Annexe 1 — Cahier des charges consolidé.** Version complète du cahier des charges initial signé avec l'encadreur professionnel, incluant toutes les user stories, les exigences non fonctionnelles chiffrées, les critères de succès des quatre POC et le plan de risques initial. Correspond au fichier docs/01-cahier-des-charges/CAHIER_DES_CHARGES_FITIA_M2_MBDS.pdf.

**Annexe 2 — Modèle Conceptuel de Données et diagramme de classes UML.** Vue conceptuelle complète avec les onze entités principales, leurs attributs, leurs relations et les cardinalités. Vue physique correspondante générée par introspection de la base PostgreSQL après application des sept migrations Flyway.

**Annexe 3 — Dossier technique — extraits de code clés commentés.** Trois extraits représentatifs : la classe SandboxRunner avec les onze flags de durcissement Docker et l'entrypoint personnalisé, la classe CandidatePassationService avec la méthode verifyAccessCode et son mécanisme de temps constant, la classe GroqLlmClient avec le prompt système compact et l'appel à l'API.

**Annexe 4 — User Stories complètes.** Ensemble des user stories du cahier des charges non détaillées dans le chapitre 5 du présent mémoire.

**Annexe 5 — Fiche de tests manuels complète.** Environ cent scénarios de recette structurés par domaine fonctionnel, avec le format standard (préconditions, étapes, résultat attendu, résultat observé, gravité, capture).

**Annexe 6 — Diagramme de Gantt détaillé.** Frise chronologique sprint par sprint avec les tâches individuelles, les jalons de livraison et la comparaison entre planning initial et planning réalisé.

**Annexe 7 — Rapport POC 3 complet.** Reproduction intégrale du fichier docs/03-poc/poc3-sandbox/RAPPORT_POC3.md avec la matrice détaillée par catégorie d'attaque, la comparaison avant/après onze itérations et les instructions de reproduction.

**Annexe 8 — Rapport OWASP ZAP complet.** Reproduction intégrale du fichier docs/03-poc/poc-owasp-zap/RAPPORT_ZAP.md avec la matrice OWASP Top 10, l'historique des onze corrections et les captures d'écran des rapports HTML générés par ZAP.

**Annexe 9 — Guide d'installation Ollama.** Reproduction intégrale du fichier docs/GUIDE_OLLAMA.md, permettant à toute personne de déployer un fournisseur LLM local pour la plateforme SkillForge.

---

*Contenu rédigé le 2026-08-28 pour intégration dans le document Word MEMOIRE-itu-MBDS-v1.docx. Style calibré sur le mémoire de référence ANDRIANAIVOSOA (2023). À relire, adapter selon les remarques de l'encadreur professionnel et de l'encadreur pédagogique, puis compléter les zones marquées entre astérisques (diagrammes UML, captures d'écran, planning Gantt).*
