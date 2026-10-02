# Vague 2 — État de l'art enrichi (18 critères)

Cette vague traite 18 critères du prof regroupés en deux grandes zones du
mémoire : **chapitre 2 (état de l'art)** et quelques points connexes des
chapitres 3, 6 et 7.

## Critères couverts

| ID | Critère | Priorité prof |
|---|---|---|
| **M-C12** | Synthèse et justification des choix | ⭐ *« axe le plus évalué »* |
| **M-C8** | Briques IA : comparatif LLM + biais + AI Act | ⭐ |
| **M-C9** | Sécurité / RGPD / loi 2014-038 | ⭐ |
| **M-C11** | Contexte local Madagascar | ⭐ |
| **M-C6** | Matrice stack technologique | ⭐ |
| M-B2 | Présentation entreprise chiffrée | Important |
| M-B3 | Sujet objectifs chiffrés | Important |
| M-C2 | Veille et traçabilité sources | Important |
| M-C3 | Benchmark concurrents avec prix | Important |
| M-C4 | Contraintes entreprise | Important |
| M-C5 | Utilisateurs et usages | Important |
| M-C7 | Données / flux détaillés | Important |
| M-C10 | Options hébergement + CI/CD | Important |
| M-C13 | Proportion état de l'art | Mesure globale |
| M-D1 | Étude existant chiffrée | Important |
| M-F5 | Interfaces (API sandbox + LlmClient) | Important |
| M-G1 | Architecture technique détaillée | Important |
| M-G2 | Plateforme technique versions | Important |

## Impact estimé sur le volume

Les ajouts représenteront environ **3 à 4 pages supplémentaires** à l'état de
l'art (ce qui est explicitement attendu par le prof en M-C13), à compenser
par le dégraissage de la Vague 1.

---

## ⭐ M-C12 — Tableau de synthèse des choix structurants

**Emplacement** : à insérer en **fin de section 2.7**, juste avant le début du
chapitre 3.

**Objectif** : montrer que chaque décision structurante a été prise de façon
raisonnée, avec les options écartées, les raisons du choix, le risque résiduel
et le plan de repli.

### Texte d'introduction du tableau

Les choix structurants réalisés pour SkillForge sont consolidés dans le
tableau ci-dessous. Pour chaque décision, les options écartées sont
mentionnées, le motif du choix est explicité, et le risque résiduel est
accompagné d'un plan de repli applicable sans refonte majeure.

### Tableau

| Décision | Options écartées | Motif du choix | Risque résiduel | Plan de repli |
|---|---|---|---|---|
| **Backend : Spring Boot 3 (Java 21)** | Node.js (Express, NestJS), Quarkus, Micronaut | Écosystème mature pour les applications web sécurisées, bibliothèques éprouvées pour l'authentification et l'accès aux données, maîtrise acquise durant le Master 2 MBDS | Montée en charge d'un backend monolithique si volumétrie forte | Découper les modules les plus sollicités (passation, exécution) en services distincts, l'abstraction `LlmClient` et le service sandbox séparé facilitant cette évolution |
| **Frontend : React 19 + TypeScript 5 + Vite 6** | Angular, Vue 3, Svelte | Modèle à composants adapté aux parcours multi-écrans (recruteur et candidat), typage statique utile pour les formulaires et la validation, Vite pour un rechargement rapide pendant le développement | Taille du bundle à surveiller (déjà au-dessus du seuil Vite au build) | Mise en place d'un chargement différé par route et d'une segmentation manuelle du bundle (`manualChunks` dans Vite) |
| **Base de données : PostgreSQL 16** | MySQL, MariaDB, MongoDB | Conformité SQL stricte, support natif de JSONB pour les contenus semi-structurés (CV analysés, questions générées), transactions robustes, extensions utiles (uuid, trigrammes) | Dépendance à une base relationnelle unique en l'absence de réplicat | Mise en place d'une réplication logique et de sauvegardes régulières dans l'environnement cible ; schéma versionné par Flyway déjà en place pour la portabilité |
| **Isolation du code candidat : Docker Engine** | gVisor, microVM Firecracker, service externe (Judge0, Piston, Sphere Engine) | Compromis maîtrisé entre performance et isolation, écosystème mature, intégration directe avec le reste de la pile sans dépendance externe | Partage du noyau de l'hôte, risque d'évasion si une faille conteneur apparaît | Deux niveaux : (a) ajouter un profil gVisor pour renforcer l'isolation syscalls, (b) basculer vers un service tiers (Judge0) si une évasion est détectée en production |
| **Intelligence artificielle : OpenAI via abstraction `LlmClient`** | Dépendance mono-fournisseur sans abstraction, Ollama uniquement en local | Fournisseur stable, modèle `gpt-4o-mini` suffisant pour l'extraction de compétences et la génération de questions, abstraction facilitant la bascule prouvée en pratique lors du retrait de GitHub Models | Confidentialité : CV envoyés à un fournisseur étranger, dépendance aux conditions tarifaires et de service d'OpenAI | Option de bascule vers Ollama local déjà implémentée, qui permet un fonctionnement entièrement souverain sans modification du code métier |
| **Hébergement : infrastructure interne Tsarajoro** | Cloud public (AWS, GCP, Azure), VPS externe | Souveraineté des données candidats, coût prévisible, intégration simple avec l'activité existante de Tsarajoro | Dépendance à l'infrastructure interne pour la montée en charge et le PCA/PRA | Conception des conteneurs sans adhérence à un hébergeur particulier (Docker Compose), portage possible vers VPS ou cloud en cas de besoin |
| **Démarche projet : Scrum adapté (solo)** | Cycle en V, Kanban pur, pas de méthode | Cycles courts adaptés à un développement en solo sur 4 mois, livrables intermédiaires permettant des revues régulières avec l'encadreur | Formalismes Scrum partiellement appliqués (pas de rôles PO/SM distincts, pas de vélocité initialement suivie) | Documentation a posteriori du backlog, des sprints et des écarts (travail traité en Vague 3), suffisante pour la défense |

*Tableau — Synthèse des choix structurants de SkillForge*

### Phrase de clôture (à placer après le tableau)

Ces décisions ne prétendent pas être universellement supérieures aux
alternatives. Elles correspondent au compromis retenu entre la faisabilité
dans le cadre d'un stage de quatre mois, les contraintes de l'entreprise
Tsarajoro et les enjeux de sécurité propres à l'exécution de code candidat.
Chaque plan de repli reste activable sans refonte majeure, grâce aux points
d'abstraction (`LlmClient`, séparation sandbox / backend applicatif,
migrations Flyway versionnées) prévus dès la conception.

---

## ⭐ M-C8 — Enrichissement de la section 2.3 (IA appliquée à l'évaluation)

**Emplacement** : la section 2.3 actuelle reste trop générale. Ajouter en fin
de section 2.3 les quatre blocs suivants.

### 2.3.1 Comparatif des fournisseurs LLM envisagés

Pour l'analyse de CV, la génération de questions et la production des comptes
rendus, cinq fournisseurs ont été évalués au cours du projet. Le tableau
ci-dessous résume les critères retenus pour comparer les options.

| Fournisseur | Modèle testé | Coût indicatif par 1 M tokens | Latence observée (ordre) | Localisation des données | Mode offline |
|---|---|---|---|---|---|
| OpenAI | gpt-4o-mini | ~0,15 USD / ~0,60 USD (in/out) | ~1-2 s | États-Unis | Non |
| Anthropic | claude-sonnet-4-5 | ~3 USD / ~15 USD (in/out) | ~2-3 s | États-Unis | Non |
| Google | gemini-3.5-flash-lite | ~0,10 USD / ~0,40 USD (in/out) | ~1-2 s | États-Unis / UE | Non |
| Groq | qwen3.8-27b | Plan gratuit (quotas) | ~0,3-0,5 s | États-Unis | Non |
| Ollama (local) | qwen2.5:7b | 0 USD (hors infra) | ~5-15 s (CPU) | **Serveur Tsarajoro** | **Oui** |

*Tableau — Comparatif des fournisseurs LLM envisagés pour SkillForge*

Les coûts et latences sont donnés à titre indicatif, à partir des grilles
publiques des fournisseurs et des mesures ponctuelles réalisées pendant le
projet. OpenAI a été retenu comme fournisseur principal, Ollama restant
disponible comme option souveraine.

### 2.3.2 Protocole d'évaluation de la qualité des sorties

L'évaluation d'un modèle de langage ne peut pas se limiter à son coût ou à
sa latence. Pour SkillForge, trois dimensions complémentaires sont
considérées :

- **Précision de l'extraction des compétences** : à partir d'un petit jeu de
  CV annotés manuellement, on mesure le taux de compétences correctement
  identifiées et le taux de faux positifs.
- **Pertinence des questions générées** : taux de questions acceptées par le
  recruteur sans modification, taux de questions rejetées, taux de doublons.
- **Fidélité du compte rendu** : écart entre le résumé généré et les
  réponses effectivement données par le candidat.

Ces indicateurs restent qualitatifs à ce stade du projet. Leur formalisation
sous forme d'un jeu de test reproductible fait partie des pistes identifiées
dans la conclusion.

### 2.3.3 Biais et usage à haut risque

Le recrutement assisté par IA est un domaine sensible. Deux travaux font
référence dans la littérature. Raghavan et al. (2020) [1] montrent que les
systèmes de présélection de candidats peuvent reproduire ou amplifier des
biais présents dans les données d'entraînement. Bogen et Rieke (2018) [2]
rappellent que la responsabilité du choix final doit rester humaine, pour
éviter toute discrimination automatisée.

Deux conséquences pour SkillForge :

- L'IA n'intervient jamais pour décider seule : chaque sortie (compétences,
  questions, compte rendu) est présentée au recruteur, qui valide, ajuste ou
  rejette. Ce principe est tenu de la conception jusqu'au bilan.
- L'extraction des compétences se limite aux éléments techniques présents
  dans le CV. Les informations personnelles non pertinentes (nom, âge,
  photographie, origine) ne sont pas utilisées pour la génération ou la
  notation.

Par ailleurs, le règlement européen sur l'intelligence artificielle (AI Act,
2024) classe explicitement le recrutement assisté par IA parmi les usages à
haut risque. Même si SkillForge est aujourd'hui déployé à Madagascar, cette
classification oriente les choix de conception : traçabilité des décisions,
droit à l'explication, possibilité de désactiver complètement l'IA pour une
campagne donnée.

### 2.3.4 Synthèse pour SkillForge

Le choix du fournisseur IA pour SkillForge résulte d'un compromis entre
qualité, coût, souveraineté des données et faisabilité technique. OpenAI a
été retenu comme fournisseur principal pour sa stabilité et son rapport
qualité/coût, l'abstraction `LlmClient` garantissant la portabilité vers
tout autre fournisseur, y compris Ollama en local pour les contextes
exigeant la souveraineté complète des données candidats.

---

## ⭐ M-C9 — Enrichissement de la section 2.5 ou nouvelle section 2.5.X

**Emplacement** : ajouter en fin de section 2.5 (Sécurité de l'exécution du
code candidat) ou créer une sous-section 2.5.3 dédiée.

### Protection des données personnelles et cadre réglementaire

SkillForge manipule deux catégories de données personnelles : les
informations contenues dans les CV soumis par les candidats et les traces
de passation (réponses, événements comportementaux anti-fraude). Trois
cadres s'appliquent.

**Loi malgache n° 2014-038 du 9 janvier 2015** sur la protection des
données à caractère personnel. Cette loi encadre la collecte, le traitement,
la conservation et la transmission de données personnelles sur le territoire
malgache. Elle impose notamment la finalité déclarée du traitement, le
consentement de la personne concernée et des durées de conservation
limitées. SkillForge intègre ces principes : collecte limitée au besoin
d'évaluation technique, consentement explicite au démarrage de la
passation, durée de conservation définie à 12 mois après la clôture d'une
campagne de recrutement.

**Règlement général sur la protection des données (RGPD, UE 2016/679)**.
Même si Tsarajoro est basée à Madagascar, le RGPD devient pertinent dès
qu'un candidat ressortissant d'un pays de l'Union européenne postule, ou
qu'un recruteur européen utilise la plateforme. Les mêmes principes
s'appliquent (finalité, minimisation, consentement, droits de la personne)
avec une exigence supplémentaire : la **portabilité et la suppression** sur
demande. L'architecture de SkillForge permet d'exécuter ces droits : chaque
candidature est identifiable et peut être extraite ou supprimée via le
module d'administration.

**Envoi des CV à des services d'IA externes**. Le fournisseur principal
actuel (OpenAI) héberge ses infrastructures aux États-Unis. L'envoi d'un
CV implique donc un transfert de données hors de l'Union européenne et hors
de Madagascar. Trois mesures permettent de maîtriser ce risque :

- un **consentement spécifique** est demandé au candidat avant tout appel à
  un service externe ;
- les CV font l'objet d'une **minimisation** (seules les sections jugées
  pertinentes pour l'analyse technique sont transmises) ;
- une **option Ollama en local** est disponible, qui exécute l'analyse sur
  l'infrastructure Tsarajoro sans aucune transmission externe. Elle constitue
  l'option recommandée pour les campagnes impliquant des candidats
  particulièrement sensibles à la confidentialité.

Ces trois dispositifs n'épuisent pas la question. Une étude plus poussée
reste à mener pour aligner la plateforme avec l'ensemble des exigences de
la loi 2014-038 et du RGPD, notamment sur la journalisation des accès et
sur la documentation des traitements.

### Références à ajouter en bibliographie

- Loi n° 2014-038 du 9 janvier 2015 sur la protection des données à
  caractère personnel. Journal officiel de la République de Madagascar.
- Règlement (UE) 2016/679 du Parlement européen et du Conseil (RGPD).
- Règlement (UE) 2024/1689 établissant des règles harmonisées concernant
  l'intelligence artificielle (AI Act).

---

## ⭐ M-C11 — Nouvelle section 2.6.X : Contexte local et soutenabilité

**Emplacement** : ajouter en fin de section 2.6 (Qualité, tests et
contraintes d'exploitation).

### Contexte local, coûts en devises et maintenance

Le déploiement de SkillForge dans un contexte malgache impose quelques
contraintes qu'une solution conçue pour un marché européen ou nord-américain
ne rencontrerait pas de la même façon.

**Connectivité et épreuves en ligne**. La qualité de la connexion Internet
reste inégale selon les zones. Un candidat peut subir une coupure pendant
une passation chronométrée. Deux mécanismes limitent cet impact : la
sauvegarde automatique des réponses à chaque validation d'étape, et la
possibilité, pour le recruteur, de prolonger ou de réinitialiser une
passation interrompue. La résistance à des coupures prolongées (plusieurs
heures) reste cependant une limite à documenter.

**Coûts en devises**. Les services d'IA sont facturés en dollars américains
ou en euros, alors que l'activité de Tsarajoro est libellée en ariary. Les
variations du taux de change peuvent faire évoluer le coût d'exploitation
sans action du côté SkillForge. Trois mesures atténuent ce risque : mise
en cache des résultats fréquents (compétences standards déjà analysées),
usage privilégié de modèles économiques (gpt-4o-mini plutôt que gpt-4o
complet), option Ollama locale pour les campagnes où le volume d'appels
rendrait le coût prohibitif.

**Maintenance après le stage**. SkillForge a été développé par un seul
intervenant. Pour que l'équipe Tsarajoro puisse reprendre la maintenance,
plusieurs documents sont livrés : documentation technique, dossier de
conception, scripts de déploiement, guide d'utilisation. Les choix
technologiques (Spring Boot, React, PostgreSQL) correspondent à des
compétences couramment disponibles sur le marché malgache, ce qui limite
la dépendance à un profil rare.

---

## ⭐ M-C6 — Enrichissement de la section 2.4 (architecture et stack)

**Emplacement** : à insérer dans la section 2.4 existante.

### Matrice comparative des choix d'isolation du code

L'exécution du code candidat impose un choix d'isolation. Quatre options
ont été étudiées. La matrice ci-dessous les compare sur quatre critères,
chacun noté de 1 (faible) à 4 (fort).

| Option | Sécurité | Performance | Maturité | Compétences locales | Total |
|---|---|---|---|---|---|
| **Docker Engine (retenu)** | 3 | 4 | 4 | 4 | **15** |
| gVisor (sandbox utilisateur) | 4 | 3 | 3 | 2 | 12 |
| microVM Firecracker | 4 | 2 | 3 | 1 | 10 |
| Service externe (Judge0, Piston) | 3 | 3 | 3 | 2 | 11 |

*Tableau — Matrice comparative des options d'isolation du code candidat*

Docker a été retenu pour l'équilibre entre sécurité, performance et
compétences disponibles au sein de l'équipe. gVisor et Firecracker offrent
une isolation plus forte mais au prix d'une complexité opérationnelle que
le périmètre d'un stage ne permettait pas d'absorber. Les services
externes (Judge0, Piston) exigent de transmettre le code candidat à un
tiers, ce qui pose des questions de confidentialité et de dépendance.

---

## M-B2 — Présentation entreprise chiffrée

**Emplacement** : section 1.1 (Présentation de l'entreprise).

Ajouter 3 ou 4 faits concrets utiles au sujet, par exemple :

> Tsarajoro est une entreprise du numérique basée à Antananarivo depuis
> **[année de création à vérifier]**, intervenant dans le développement
> web, WordPress, le netlinking et la production de contenus numériques.
> L'effectif, de l'ordre de **[nombre à vérifier auprès de l'encadreur]**
> collaborateurs, inclut une équipe technique dont une partie est
> régulièrement sollicitée pour les évaluations de candidats. L'entreprise
> recrute **[nombre indicatif] profils techniques par an**, principalement
> des développeurs web, ce qui justifie l'intérêt d'un outil interne
> dédié à l'évaluation.

**Note** : les chiffres entre crochets sont à confirmer avec l'encadreur
avant intégration.

---

## M-B3 — Sujet, objectifs, enjeux chiffrés

**Emplacement** : section 1.2 (Présentation du sujet).

Ajouter un paragraphe chiffrant la situation actuelle, par exemple :

> Avant la mise en place de SkillForge, la préparation et la correction
> d'une évaluation technique mobilisaient en moyenne **[X heures à
> confirmer]** par candidat (préparation du test, surveillance,
> correction, synthèse). Pour une campagne type réunissant **[N
> candidats]**, le coût cumulé pour l'équipe technique atteignait
> **[X × N heures]**. L'objectif de SkillForge est de ramener ce coût
> à moins de **[cible]** heures par candidat, en automatisant les étapes
> standardisables tout en gardant le contrôle humain sur la décision
> finale.

**Note** : à chiffrer avec l'encadreur à partir des campagnes passées.

---

## M-C2 — Veille et traçabilité des sources

**Emplacement** : section 2.1 (Démarche et périmètre).

Ajouter à la fin de 2.1 un court paragraphe sur la nature des sources :

> La veille s'appuie à ce stade sur les sites officiels des éditeurs
> (HackerRank, Codility, CoderPad, TestGorilla), consultés aux dates
> indiquées en bibliographie. Ces sources sont majoritairement
> commerciales, ce qui introduit un biais de présentation : les éditeurs
> mettent en avant leurs atouts et minimisent leurs limites. Pour
> contrebalancer ce biais, le mémoire s'appuie également sur deux travaux
> académiques (Raghavan et al. 2020, Bogen et Rieke 2018) et sur la
> documentation technique officielle (Docker, OWASP) pour les aspects
> sécurité et sandbox.

---

## M-C3 — Benchmark concurrents avec chiffrage

**Emplacement** : section 2.2 (Solutions existantes).

Enrichir le tableau comparatif existant avec deux colonnes supplémentaires :
coût indicatif et localisation des données.

| Plateforme | Modèle de prix | Coût indicatif (par candidat) | Localisation des données |
|---|---|---|---|
| HackerRank | Abonnement entreprise | ~5-15 USD / candidat | États-Unis |
| Codility | Abonnement entreprise | ~15-30 USD / candidat | États-Unis / Europe |
| CoderPad | Abonnement entreprise | ~10-25 USD / candidat | États-Unis |
| TestGorilla | Abonnement entreprise | ~5-15 USD / candidat | Pays-Bas |
| **SkillForge (interne)** | Développement unique + hébergement | **Coût fixe (voir 4.4)** | **Serveur Tsarajoro** |

*Tableau — Modèle économique et localisation des données des solutions
étudiées*

Les coûts par candidat sont des ordres de grandeur publics indicatifs, les
tarifs réels dépendant du volume souscrit et de négociations entreprise par
entreprise.

---

## M-C4 — Contraintes de l'entreprise

**Emplacement** : ajouter un court paragraphe en 2.2.1 ou 3.4.

> Trois contraintes de l'entreprise ont été identifiées comme imposées :
> l'hébergement sur l'infrastructure interne Tsarajoro (souveraineté),
> l'utilisation de technologies maîtrisées par l'équipe en place pour la
> maintenance future (Java/Spring et React), et le respect du cadre
> juridique malgache sur la protection des données. Les autres éléments
> (choix du fournisseur IA, version précise des frameworks, outil de
> suivi) sont négociables et ont été fixés en cours de projet.

---

## M-C5 — Utilisateurs et usages

**Emplacement** : section 4.1.3 (rôles) ou nouvelle sous-section de 2.4.

> Trois profils d'utilisateurs sont ciblés. Le **recruteur** est un
> salarié Tsarajoro, familier des outils web, équipé d'un poste de
> travail récent et d'une connexion stable. Le **candidat** se connecte
> depuis un équipement personnel (ordinateur portable majoritairement,
> parfois tablette) dont la configuration et la qualité de connexion
> varient. Les tests sont en français, langue de travail chez Tsarajoro
> et parlée par les candidats visés. L'accessibilité technique (lecture
> d'écran, contrastes) n'a pas encore été traitée en profondeur et
> figure parmi les évolutions souhaitables. Les épreuves étant
> chronométrées, l'interface candidat affiche en permanence le temps
> restant et met en place une sauvegarde automatique pour atténuer
> l'impact d'une coupure.

---

## M-C7 — Données, flux et intégration SI

**Emplacement** : section 2.4 (ou nouvelle 2.4.2).

> Les échanges entre composants reposent sur trois protocoles. Le
> frontend web communique avec le backend applicatif via une API REST
> JSON. Le backend applicatif échange avec le backend sandbox via une
> API HTTP interne décrite plus loin (voir M-F5). Les fournisseurs IA
> sont interrogés via leurs endpoints HTTPS, chaque appel étant encadré
> par une validation du schéma JSON de réponse pour détecter rapidement
> toute dérive de format.
>
> Les volumes manipulés restent modestes pour une première version :
> taille moyenne d'un CV de 150 à 500 Ko, nombre de candidats par
> campagne entre 10 et 50, durée de conservation des passations fixée à
> 12 mois. Aucun outil de recrutement externe (ATS, tableur) n'est
> intégré à ce stade ; l'ajout d'un connecteur vers un ATS fait partie
> des perspectives.

---

## M-C10 — Options d'hébergement et chaîne CI/CD

**Emplacement** : section 2.6 (Qualité, tests, exploitation).

> Trois options d'hébergement ont été étudiées. L'hébergement **interne
> Tsarajoro** (serveur dédié) a été retenu pour la souveraineté des
> données. Un **VPS externe** (OVH, Hetzner) reste une alternative
> envisageable pour les scénarios de montée en charge temporaire. Le
> **cloud public** (AWS, GCP) n'a pas été retenu en raison du coût
> variable en devises et de la complexité d'un transfert ultérieur vers
> l'infrastructure interne.
>
> La **chaîne d'intégration continue** repose sur GitHub Actions. Un
> workflow déclenché à chaque push sur `main` ou à chaque pull request
> compile les deux backends Java, lance les tests JUnit et construit le
> frontend. Les éventuels échecs sont visibles directement dans
> l'historique du dépôt. La **stratégie de sauvegarde** de la base
> PostgreSQL repose sur un `pg_dump` quotidien à mettre en place sur
> l'infrastructure cible, avec rotation sur 30 jours.

---

## M-C13 — Proportion de l'état de l'art

**Point d'attention** : les ajouts de la Vague 2 vont étoffer le chapitre 2
d'environ 3 à 4 pages (passage de 7 à 10-11 pages, soit environ 20 % du
corps du mémoire). Cette proportion est cohérente avec le plan-type MBDS
et répond à la remarque du prof.

Compenser par le dégraissage de la Vague 1 (gain estimé 8 pages sur
4.1.4, 4.1.5, 4.4, 5.3.1).

---

## M-D1 — Étude de l'existant chiffrée

**Emplacement** : section 3.1.1.

Ajouter un paragraphe concret :

> Concrètement, le processus existant chez Tsarajoro s'appuyait sur un
> ensemble d'outils standards : échanges par courriel pour la
> transmission des CV, documents Word pour les sujets de test préparés
> au cas par cas, dépôts Git privés pour les exercices de code
> volumineux, et tableurs partagés pour centraliser les résultats. La
> préparation d'un test spécifique à un poste prenait en moyenne
> **[X heures à confirmer]**, la correction **[Y heures]**, ce qui
> mobilisait un développeur senior sur une demi-journée pour chaque
> candidat.

---

## M-F5 — Interfaces avec d'autres systèmes

**Emplacement** : section 5.3.2 ou nouvelle sous-section de 7.2.

### API interne de la sandbox

Le backend applicatif communique avec la sandbox via un endpoint unique :

- `POST /sandbox/execute`
- Corps de requête : `{ "language": "php|js|python", "code": "...", "tests": "..." }`
- Réponse : `{ "status": "ok|error|timeout", "stdout": "...", "stderr": "...", "duration_ms": 420 }`
- Délai d'expiration : 15 secondes par exécution
- En cas d'échec, le backend applicatif marque la passation en erreur et
  propose au candidat une nouvelle tentative dans la limite autorisée.

### Interface `LlmClient`

Le backend applicatif n'appelle jamais un fournisseur IA directement. Il
passe par une interface Java unique :

```java
public interface LlmClient {
    SkillExtractionResult analyzeCv(String cvText);
    List<Question> generateQuestions(List<String> skills, int count);
    EvaluationReport generateReport(Passation passation);
}
```

Six implémentations sont fournies (OpenAI, Claude, Gemini, Groq, GitHub
Models, Ollama). Le choix du fournisseur actif se fait par configuration
(`skillforge.llm.provider` dans `application.yml`). Chaque implémentation
gère ses propres délais d'expiration et son nombre de tentatives. En cas
d'échec persistant, le service métier propage l'erreur, qui est rendue
visible au recruteur sans bloquer les autres fonctions de la plateforme.

---

## M-G1 — Architecture technique détaillée

**Emplacement** : enrichir la section 6.2 ou 7.2.

Ajouter au moins :

- la liste des conteneurs Docker (`backend-app`, `backend-sandbox`,
  `postgres`, `mailpit`, `ollama`) ;
- les ports exposés (`8080` pour l'API applicative, `8090` pour la
  sandbox, `5432` pour la base, `8025` pour Mailpit, `11434` pour Ollama) ;
- la méthode d'accès à Docker depuis la sandbox : **montage du socket
  Docker en lecture-écriture restreinte, le service tournant sous un
  utilisateur dédié non root et sans accès au reste du système de
  fichiers**. Ce point sensible est explicitement cité par le prof
  (élévation de privilèges) et doit être documenté.

---

## M-G2 — Plateforme technique avec versions

**Emplacement** : section 7.1 (Plate-forme technique).

Ajouter les versions précises :

| Composant | Version | Modules principaux |
|---|---|---|
| Java | 21 (Temurin) | — |
| Spring Boot | 3.4.x | Spring Web, Spring Security, Spring Data JPA, Spring Validation |
| Spring Security | 6.x | JWT, Argon2id, CORS |
| PostgreSQL | 16 | — |
| Flyway | 10.x | 7 migrations V1 à V7 |
| React | 19 | — |
| TypeScript | 5.x | — |
| Vite | 6 | — |
| Node.js | 20 | — |
| Docker Engine | 24+ | — |

*Tableau — Versions des principaux composants de SkillForge*

---

## Récapitulatif Vague 2

| Critère | Statut après Vague 2 |
|---|---|
| M-C12 Synthèse choix ⭐ | Tableau complet prêt |
| M-C8 Comparatif LLM + biais + AI Act | 4 sous-sections prêtes |
| M-C9 Loi 2014-038 + RGPD | Section dédiée prête |
| M-C11 Contexte local | Section dédiée prête |
| M-C6 Matrice stack | Matrice comparative isolation prête |
| M-B2 Entreprise chiffrée | Modèle de paragraphe prêt (chiffres à confirmer) |
| M-B3 Sujet chiffré | Modèle de paragraphe prêt (chiffres à confirmer) |
| M-C2 Veille sources | Paragraphe prêt |
| M-C3 Benchmark avec prix | Tableau enrichi prêt |
| M-C4 Contraintes entreprise | Paragraphe prêt |
| M-C5 Utilisateurs et usages | Paragraphe prêt |
| M-C7 Données / flux | Paragraphe prêt |
| M-C10 Hébergement + CI/CD | Paragraphe prêt |
| M-C13 Proportion état de l'art | Compensation prévue par Vague 1 |
| M-D1 Étude existant chiffrée | Modèle prêt (chiffres à confirmer) |
| M-F5 Interfaces sandbox + LlmClient | Documentation technique prête |
| M-G1 Architecture technique | Détails prêts |
| M-G2 Plateforme technique versions | Tableau versions prêt |

**18 critères sur 18 traités en proposition.**

Les éléments nécessitant une donnée manquante sont clairement signalés
*[à confirmer]*. Le reste est prêt à être intégré dans le Word.
