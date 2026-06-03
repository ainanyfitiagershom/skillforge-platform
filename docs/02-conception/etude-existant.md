# Étude de l'existant — Processus de recrutement actuel chez Tsarajoro

## 1. Objectif de l'étude

Avant de concevoir SkillForge, nous documentons ici le processus de recrutement technique actuellement en vigueur chez Tsarajoro, en identifions les points faibles chiffrés, et précisons ce que la nouvelle solution doit améliorer.

## 2. Contexte

Tsarajoro est une entreprise du numérique qui recrute ponctuellement des profils techniques pour ses besoins internes : développeurs (PHP principalement), intégrateurs WordPress, développeurs front-end (Vue.js), assistants techniques, profils réseau, spécialistes SEO. Le recrutement intervient lors d'un départ ou d'un besoin de renforcement d'équipe.

## 3. Description du processus actuel

Le processus de recrutement technique se déroule aujourd'hui en six étapes successives :

| # | Étape | Acteur | Outil(s) | Durée estimée |
|---|---|---|---|---|
| 1 | Réception et pré-sélection des CV | RH | Boîte e-mail, dossier partagé | ~10 min / candidat |
| 2 | Convocation à un test technique | RH | E-mail | 5 min |
| 3 | Préparation du test technique | Responsable technique | Documents internes, mémoire personnelle | 15 à 30 min |
| 4 | Passage du test | Candidat | En ligne ou en local (présence physique ou à distance) | 1 à 2 h |
| 5 | Correction du test | Responsable technique | Lecture manuelle | 30 à 60 min / candidat |
| 6 | Décision et retour candidat | Responsable + RH | Échange oral / messagerie | 15 min |

## 4. Limites identifiées

### 4.1 Manque de standardisation

Chaque responsable technique conçoit son propre test à la volée, selon sa mémoire et ses préférences personnelles. Deux candidats pour le même poste peuvent recevoir des tests très différents, ce qui rend toute comparaison difficile et introduit un biais dans la décision finale.

### 4.2 Risque élevé de fraude

L'arrivée des intelligences artificielles génératives (ChatGPT, Claude, etc.) a profondément changé la donne : un candidat peut désormais soumettre un test à un assistant IA en quelques secondes et obtenir une réponse polie et structurée. Les tests envoyés par e-mail à réaliser à domicile sont particulièrement exposés. Aujourd'hui, aucun mécanisme ne permet de détecter ces fraudes chez Tsarajoro.

### 4.3 Charge importante sur les équipes techniques

La correction manuelle d'un test prend entre **30 et 60 minutes** par candidat, mobilisant un développeur expérimenté. Sur un recrutement type avec 4 à 5 candidats en short-list, cela représente **2 à 5 heures de temps senior**, soit l'équivalent d'une journée de travail effectif perdue par recrutement.

### 4.4 Absence de traçabilité analytique

Les résultats des tests passés ne sont pas centralisés. Il n'existe aucune base de données permettant de :
- savoir quelles questions ont été posées dans le passé ;
- mesurer quelles questions sont les plus discriminantes (qui distinguent réellement les bons des moins bons candidats) ;
- corréler les résultats au test avec la performance ultérieure des candidats embauchés.

### 4.5 Dépendance possible à des plateformes externes

Pour éviter les limites précédentes, l'option d'utiliser une plateforme externe (HackerRank, Codility, TestGorilla, etc.) a été envisagée. Mais ces plateformes :
- coûtent **400 à 800 € / mois** pour un usage modéré ;
- hébergent les données candidats à l'étranger (problématique RGPD) ;
- ne couvrent pas les profils spécifiques de Tsarajoro (intégrateur WordPress, spécialiste SEO).

## 5. Tableau de synthèse des limites

| Limite | Impact business | Impact mesurable |
|---|---|---|
| Manque de standardisation | Décisions biaisées | Tests différents pour 100 % des candidats |
| Risque de fraude IA | Embauches inappropriées | Non mesurable (aucun outil de détection) |
| Charge technique | Temps senior consommé | 30 à 60 min de correction / candidat |
| Absence de traçabilité | Pas d'amélioration possible | 0 question capitalisée, 0 indicateur statistique |
| Dépendance externe coûteuse | Coût récurrent + RGPD | 400 à 800 € / mois pour les solutions étudiées |

## 6. Ce que la nouvelle solution doit apporter

L'étude met en évidence cinq besoins prioritaires auxquels SkillForge doit répondre :

1. **Standardiser** les évaluations en proposant un test reproductible, calibré et comparable d'un candidat à l'autre.
2. **Automatiser** la correction pour libérer le temps des responsables techniques.
3. **Détecter** les tentatives de fraude au moins basiques (changement d'onglet, copier-coller suspect).
4. **Capitaliser** les questions posées dans une banque centralisée et alimenter une boucle d'amélioration continue par l'analyse statistique.
5. **Conserver la souveraineté** des données candidat en hébergeant la plateforme sur l'infrastructure interne de Tsarajoro, sans dépendance à un service tiers payant et hors UE.

Ces cinq besoins constituent les objectifs fondateurs de SkillForge, et chacun est traduit en un objectif spécifique mesurable dans le cahier des charges.
