# Dégraissage mémoire v2 — passer de 48 à 40 pages

Document audité : `MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v2.pdf` (70 pages PDF).
Mapping pagination : **page document = page PDF − 11** (Introduction = doc p.1 = PDF p.12, dernière page de corps "Bilan personnel" = doc p.48 = PDF p.59).
Objectif prof : ramener le corps à **40 pages**. Écart à combler : **−8 pages**.

---

## 0. Mesure page par page du mémoire v2

### 0.1 Détail PDF → section (corps)

| Page doc | Page PDF | Section / contenu dominant | Densité texte | Figures/tableaux |
|---|---|---|---|---|
| 1 | 12 | Introduction | Pleine | — |
| 2 | 13 | 1 Présentation du stage · 1.1 Entreprise · 1.2 Sujet (début) | Pleine | — |
| 3 | 14 | 1.2 Sujet (suite + "caractère innovant") | Pleine | — |
| 4 | 15 | 2 État de l'art · 2.1 Démarche · 2.2 Solutions (début) · 2.2.1 Critères | Pleine | — |
| 5 | 16 | 2.2.2 Étude de chaque solution | Pleine | — |
| 6 | 17 | 2.2.3 Tableau comparatif (Tab.1) · 2.3 IA (début) | Pleine | Tab. 1 |
| 7 | 18 | 2.3 IA (suite : abstraction, biais, RGPD) · 2.4 Techno (début) | Pleine | — |
| 8 | 19 | 2.5 Sécurité | Pleine | — |
| 9 | 20 | 2.5 (suite) · 2.6 Qualité et exploitation | Pleine | — |
| 10 | 21 | 2.7 Synthèse et justification | Pleine | — |
| 11 | 22 | 3.1 Étude de l'existant · 3.1.1 · 3.1.2 | Pleine | — |
| 12 | 23 | 3.2 Critique · 3.3 Solutions envisagées (début) | Pleine | — |
| 13 | 24 | 3.3 Solutions envisagées (suite) | Pleine | — |
| 14 | 25 | 3.4 Objectifs et livrables | **Aérée** (liste à puces + blancs) | — |
| 15 | 26 | 4 Démarche · 4.1 Principes · 4.1.1 Activités · 4.1.2 Gestion (début) | Pleine | — |
| 16 | 27 | 4.1.2 (suite) · 4.1.3 Rôles (début) | Pleine | — |
| 17 | 28 | 4.1.3 Rôles (Tab.2) | Pleine | Tab. 2 |
| 18 | 29 | 4.1.4 Outils (tableau) · 4.1.5 Gestion config (début) | Pleine | Tab. outils |
| 19 | 30 | 4.1.5 (fin, 3 lignes) · 4.2 Risques (Tab.3) | **Aérée** (basculement de section) | Tab. 3 |
| 20 | 31 | 4.3 Démarche mise en œuvre · Backlog (début Tab.4) | Pleine | Tab. 4 |
| 21 | 32 | 4.3 Backlog (suite Tab.4) | Pleine | Tab. 4 |
| 22 | 33 | 4.3 Estimation de la charge (Tab.5) | Pleine | Tab. 5 |
| 23 | 34 | 4.3 Découpage en 9 sprints (Tab.6) | Pleine | Tab. 6 |
| 24 | 35 | 4.3 Macro-planning (texte) | **Aérée** (puces mois par mois + blanc avant Fig 1) | — |
| 25 | 36 | Fig 1 (Gantt) · 4.4 Budget (tableau) | **Très aérée** (grand blanc après Fig 1, tableau budget condensé) | Fig. 1 + Tab. budget |
| 26 | 37 | 5 Exigences · 5.1 Cas d'utilisation · Tab.6 CU (début) | Pleine | Tab. 6 CU |
| 27 | 38 | Tab.6 CU (suite Cas-06 à Cas-14) | Pleine | Tab. 6 CU |
| 28 | 39 | Fig 2 (diag CU) · 5.1.1 Analyser le CV (début) | **Aérée** (Fig 2 + ~10 lignes) | Fig. 2 |
| 29 | 40 | 5.1.1 (fin) · 5.1.2 Génération test · 5.1.3 Passation (début) | Pleine | — |
| 30 | 41 | 5.1.3 (suite) · 5.1.4 Consultation | Pleine | — |
| 31 | 42 | 5.2 Exigences non fonctionnelles (Tab.7) · 5.3 Interfaces · 5.3.1 IHM (début) | Pleine | Tab. 7 |
| 32 | 43 | 5.3.1 IHM : création d'évaluation · **Fig 3** · passation (début) | **Mi-aérée** (Fig 3 + 2 courts paragraphes) | Fig. 3 |
| 33 | 44 | 5.3.1 (suite) · **Fig 5** · parcours candidat | **Très aérée** (Fig 5 + 4 lignes) | Fig. 5 |
| 34 | 45 | 5.3.2 Interfaces autres systèmes · 6 Architectures · 6.1 Archi logicielle | Pleine | — |
| 35 | 46 | **Fig 8** (Archi logicielle) · 6.2 Archi technique (3 lignes) | **Très aérée** (Fig 8 + 4 lignes) | Fig. 8 |
| 36 | 47 | **Fig 9** (Archi technique) · 7 Conception · 7.1 Plate-forme | **Mi-aérée** (Fig 9 + courte intro + 7.1 court) | Fig. 9 |
| 37 | 48 | 7.2 Conception du logiciel · 7.2.1 Code source · 7.2.2 Vue statique | Pleine | — |
| 38 | 49 | **Fig 10** (packages) · 7.2.3 Modélisation données | **Mi-aérée** (Fig 10 + 8 lignes) | Fig. 10 |
| 39 | 50 | **Fig 11** (MCD) uniquement | **Quasi vide** (figure + 1 ligne de légende) | Fig. 11 |
| 40 | 51 | 7.2.4 Réalisation cas d'utilisation · **Fig 12** (séquence) | **Mi-aérée** (texte court + figure) | Fig. 12 |
| 41 | 52 | 7.2.5 Composants et déploiement · 8 Tests · 8.1 Tests JUnit (début) | Pleine | — |
| 42 | 53 | 8.1 (suite Tab. JUnit) · 8.2 Tests fonctionnels | Pleine | Tab. JUnit |
| 43 | 54 | 8.3 Tests sécurité (Tab.8) · 8.4 Tests perf (début) | Pleine | Tab. 8 |
| 44 | 55 | 8.4 Tests charge (Tab.9) · 8.5 Qualité IA (début) | Pleine | Tab. 9 |
| 45 | 56 | 8.5 Qualité IA (fin) · 9 Conclusion · 9.1 Bilan livrables (Tab.) | Pleine | Tab. livrables |
| 46 | 57 | 9.1 (suite Tab.) · 9.2 Problèmes rencontrés | Pleine | Tab. livrables |
| 47 | 58 | 9.2 (fin) · 9.3 Perspectives · 9.4 Bilan personnel (début) | Pleine | — |
| 48 | 59 | 9.4 Bilan personnel (suite + remerciements) | Pleine | — |

### 0.2 Synthèse par chapitre

| Chapitre | Pages doc | Nb pages | Appréciation volumétrique |
|---|---|---|---|
| Introduction | 1 | 1 | Dense, à conserver tel quel |
| 1. Présentation stage | 2–3 | 2 | Correct |
| 2. État de l'art | 4–10 | 7 | Dense, cœur académique, à préserver |
| 3. Étude de l'existant | 11–14 | 4 | p.14 aérée (−0,3 p récupérable) |
| 4. Démarche projet | 15–25 | 11 | p.19 et p.25 aérées (−1 p récupérable) ; 4.1.5 à condenser |
| 5. Exigences | 26–34 | 9 | p.28, p.32, p.33 aérées (Fig 2/3/5 captures IHM) — **principal gisement** |
| 6. Architectures | 35–36 | 2 | p.35 et p.36 aérées (Fig 8 + Fig 9) — gisement |
| 7. Conception | 37–41 | 5 | p.38, p.39, p.40 aérées (Fig 10, Fig 11, Fig 12) — gisement |
| 8. Tests | 42–44 | 3 | Pleines, à conserver |
| 9. Conclusion | 45–48 | 4 | p.45 et p.47 raisonnablement remplies |
| **Total corps** | **1–48** | **48** | — |

---

## 1. Diagnostic : où sont les 8 pages à retirer ?

### 1.1 Trois typologies de gaspillage identifiées

1. **Figures d'IHM et d'architecture occupant presque la totalité d'une page** (Fig 3, Fig 5, Fig 8, Fig 9, Fig 10, Fig 11, Fig 12 chacune laisse 4 à 10 lignes de texte autour) — 7 figures candidates.
2. **Sections courtes qui déclenchent un demi-saut de page** parce que la section suivante ne tient plus (4.1.5 fin + 4.2 début p.19 ; 4.4 Budget p.25 ; 3.4 Objectifs p.14).
3. **Hiérarchie Scrum lourde en p.20–23** (4 tableaux consécutifs US + sprints + macro-planning) : à conserver car demandé par le prof, mais mise en page peut être compactée.

### 1.2 Pages mesurables en "demi-pages récupérables"

| Page doc | Raison | Récup. estimée |
|---|---|---|
| 14 | 3.4 Objectifs : liste à puces aérée | 0,3 p |
| 19 | 4.1.5 ne tient que sur 3 lignes avant blanc | 0,5 p |
| 25 | Budget + fin Fig 1 : grand blanc entre figure et tableau | 0,4 p |
| 28 | Fig 2 occupe ~55 % + 10 lignes 5.1.1 | 0,4 p |
| 32 | Fig 3 occupe ~40 % + courts paragraphes | 0,3 p |
| 33 | Fig 5 occupe ~55 % + 4 lignes | 0,6 p |
| 35 | Fig 8 occupe ~75 % + 4 lignes 6.2 | 0,8 p |
| 36 | Fig 9 occupe ~55 % + 7 intro + 7.1 court | 0,5 p |
| 38 | Fig 10 occupe ~45 % + 8 lignes 7.2.3 | 0,4 p |
| 39 | Fig 11 occupe ~90 % de la page | **0,8 p** |
| 40 | Fig 12 occupe ~45 % + courte intro 7.2.4 | 0,4 p |
| **Total gisement théorique** | | **≈ 5,4 pages** |

Le gisement "typographique pur" (sans toucher au contenu) couvre donc ~5 pages. Pour atteindre −8 pages, il faut combiner :
- déplacement de figures en annexe (gain net : 1 figure déplacée ≈ 0,6 à 0,8 p récupérée côté corps) ;
- condensation ciblée de 4.1.5 et de 5.3.1 ;
- compactage de mise en page Word (marges, saut de page avant les chapitres, interligne des blocs listes-à-puces).

---

## 2. Plan de dégraissage proposé (gain visé : −8 pages)

Actions ordonnées par ratio gain / risque.

| # | Action | Section touchée | Gain estimé | Risque |
|---|---|---|---|---|
| 1 | Déplacer Fig 3 et Fig 5 (captures IHM recruteur + candidat) en annexe | 5.3.1 | **−1,5 p** | Faible (prof le demande explicitement) |
| 2 | Fusionner Fig 10 (packages) et Fig 11 (MCD) dans l'annexe existante — ne garder que Fig 2 et Fig 12 dans le corps pour 7.x | 7.2.2 / 7.2.3 | **−1,5 p** | Faible (Fig 11 est déjà dupliquée en annexe = Fig 13 "modèle physique") |
| 3 | Condenser 4.1.5 "Gestion de la configuration" à 1 paragraphe tenant sur ½ page | 4.1.5 | **−0,5 p** | Nul (le prof le demande explicitement) |
| 4 | Marges Word : passer de 2,5 cm à 2 cm haut/bas (gardant 2,5 cm gauche pour reliure) + resserrer titres (12 pt avant / 6 pt après → 6 / 3) | tout le document | **−3 p** | Nul |
| 5 | Décocher "saut de page avant" sur style Titre 1 (chapitres 2 à 9 enchaînent dans le flux) | tout | **−1,5 p** | Nul (A4, lecture fluide) |
| 6 | Compacter Fig 8 (archi logicielle) et Fig 9 (archi technique) : ramener leur hauteur à 11 cm max dans Word pour laisser 6.1 + 6.2 sur la même page qu'elles | 6.1 / 6.2 | **−1 p** | Faible (lisibilité à vérifier) |
| **Total estimé** | | | **−9 p** | — |

Un gain cumulé théorique de **~9 pages** laisse une marge d'1 page face à l'objectif strict de −8 : prudent, car marges Word et sauts de page peuvent se montrer un peu moins productifs que prévu.

---

## 3. Fix 1 : Déplacement des captures IHM en annexe (−1,5 p)

### 3.1 Instruction

Dans la section 5.3.1 actuelle (doc p.31 à p.33), **retirer** les Figures 3 et 5 ainsi que leurs légendes. Ne conserver dans le corps qu'une description textuelle condensée des parcours recruteur et candidat. **Ajouter dans l'annexe "Interfaces complémentaires de l'application SkillForge"** (actuelle Annexe 2) les Figures 3 et 5 déplacées, pour qu'elles rejoignent les Figures 4, 6, 7 déjà présentes.

Note : les Figures 4, 6, 7 sont déjà en annexe (PDF p.65–67). La demande du prof "déplacer figures 3, 4, 5, 6 en annexe" est donc **à moitié satisfaite** ; il reste à y envoyer 3 et 5.

### 3.2 Texte complet prêt à coller — nouvelle section 5.3.1

```
5.3  Interfaces détaillées

5.3.1  Interface Homme-Machine

L'interface de SkillForge repose sur deux parcours distincts : celui du
recruteur, accessible après authentification, et celui du candidat,
accessible à partir de l'invitation qui lui est transmise. Cette séparation
permet de proposer à chaque utilisateur uniquement les fonctionnalités
nécessaires à son rôle.

Parcours recruteur. Après authentification, le recruteur enregistre un
candidat et son profil cible, puis importe le CV. L'analyse automatique
restitue les compétences détectées avec leur niveau estimé ; le recruteur
les corrige si nécessaire avant la génération du test. Les questions
proposées (QCM, exercices de programmation, cas pratiques) sont
présentées pour validation, modification ou rejet avant l'envoi d'une
invitation sécurisée au candidat. Après soumission, le compte rendu
regroupe le score, les réponses détaillées et les indicateurs de fraude ;
il peut être exporté en PDF. Les captures correspondantes figurent en
Annexe 2 (Figures 3, 4, 6 et 7).

Parcours candidat. Le candidat accède à l'évaluation via son lien
d'invitation et un code à six chiffres transmis par courriel. Après
acceptation des conditions, il parcourt les questions ; pour les exercices
de programmation, un éditeur de code intégré lui permet de rédiger et
d'exécuter sa solution dans la sandbox Docker avant soumission. Les
réponses sont sauvegardées au fil de l'eau pour prévenir toute perte
accidentelle. La capture correspondante figure en Annexe 2 (Figure 5).

Les choix d'ergonomie (clarté des étapes, retour visuel immédiat,
accessibilité clavier) ont été vérifiés tout au long des itérations avec
l'encadreur professionnel.
```

Longueur cible : **~24 lignes** → tient confortablement sur **1 page** avec le titre 5.3 + 5.3.1 + 2 paragraphes recruteur/candidat.

### 3.3 Ajout dans l'Annexe 2 (bloc à insérer)

Dans l'annexe actuelle "11.2 Annexe 2 : Interfaces complémentaires de l'application SkillForge" (PDF p.63–67), **insérer les deux figures manquantes** à l'endroit logique :

- Insérer **Figure 3 : Interface de création d'une évaluation et d'analyse du CV** immédiatement avant la Figure 4 (validation des questions), avec une courte légende d'une ligne :

  ```
  Figure 3 : Interface de création d'une évaluation et d'analyse du CV
  Vue recruteur. L'écran de création d'évaluation réunit la saisie du
  candidat, l'import du CV et la restitution des compétences détectées
  avant la génération automatique des questions.
  ```

- Insérer **Figure 5 : Interface de passation d'une évaluation technique** immédiatement avant la Figure 6 (exercice de programmation), avec :

  ```
  Figure 5 : Interface de passation d'une évaluation technique
  Vue candidat. Après vérification de son invitation et de son code
  d'accès, le candidat parcourt les questions et dispose d'un éditeur
  de code intégré pour les exercices de programmation.
  ```

Gain net attendu : **−1,5 p** (les deux pages 32 et 33 fusionnent en une seule page de description textuelle).

---

## 4. Fix 2 : Condensation de 4.1.5 Gestion de la configuration (−0,5 p)

### 4.1 Texte actuel (v2, doc p.18–19)

Le texte s'étend sur ~20 lignes réparties sur 2 pages. Il décrit :
- Git / GitHub + branche `main` + Conventional Commits ;
- GitHub Actions (compile backend, JUnit 5, build frontend) ;
- Flyway pour les migrations SQL V1 à V7.

### 4.2 Texte condensé prêt à coller (6 lignes, tient en demi-page)

```
4.1.5  Gestion de la configuration

Le code source est versionné avec Git et hébergé sur GitHub ; chaque
modification donne lieu à un commit explicite respectant la convention
Conventional Commits (feat, fix, docs, ci, chore). GitHub Actions
assure l'intégration continue : à chaque poussée sur la branche main,
le pipeline compile les deux backends Spring Boot, exécute les tests
JUnit 5 et vérifie le build du frontend React/TypeScript. Les
évolutions du schéma PostgreSQL sont pilotées par Flyway, qui applique
sept scripts de migration SQL versionnés (V1 à V7) et garantit la
reproductibilité du schéma sur l'ensemble des environnements.
```

Gain net : **−0,5 p** (passage de ~20 lignes dispersées sur 2 pages à 8 lignes compactes sur 1 demi-page, le reste de la page accueillant alors le début de 4.2).

---

## 5. Fix 3 : Compactage de la mise en page Word (−5,5 p)

Ce fix ne touche à aucun contenu. Il repose exclusivement sur les paramètres de style du document Word.

### 5.1 Marges du document

- Menu **Mise en page → Marges → Marges personnalisées**.
- Appliquer : **Haut 2 cm / Bas 2 cm / Gauche 2,5 cm / Droite 2 cm** (le 2,5 cm à gauche conserve l'espace de reliure).
- **Gain estimé : −2 à −2,5 pages** sur l'ensemble du document.

### 5.2 Saut de page avant les titres de chapitre

- Dans le volet **Styles**, cliquer droit sur **Titre 1 → Modifier → Format → Paragraphe → Enchaînements**.
- **Décocher** "Saut de page avant".
- Les chapitres 2 à 9 enchaîneront alors dans le flux sans forcer une page quasi vide. L'Introduction et le chapitre 1 peuvent conserver leur saut de page si besoin (modifier manuellement sur ces deux-là uniquement).
- **Gain estimé : −1 à −1,5 pages**.

### 5.3 Espacement avant/après des titres

- Toujours dans **Modifier le style**, onglet **Paragraphe → Espacement** :
  - **Titre 1** : avant 18 pt → 12 pt ; après 12 pt → 6 pt.
  - **Titre 2** : avant 12 pt → 6 pt ; après 6 pt → 3 pt.
  - **Titre 3** : avant 6 pt → 3 pt ; après 3 pt → 0 pt.
- **Gain estimé : −0,5 à −1 page**.

### 5.4 Interligne et espacement des paragraphes de corps

- **Normal / Corps de texte** : interligne 1,15 (si actuellement 1,5), espacement après 6 pt (si > 6 pt). Vérifier que ce n'est pas déjà en place ; sinon appliquer.
- Pour les **listes à puces** (fréquentes p.14, p.24, p.35) : réduire l'espacement entre items à 0 pt (actuellement visible ~6 pt entre chaque puce → c'est ce qui aère p.24 et p.14).
- **Gain estimé : −0,5 à −1 page**.

### 5.5 Taille des figures encombrantes

- **Fig 1 (Gantt)** : largeur conservée mais hauteur réduite de ~20 % → p.25 récupère un demi-cadre pour le tableau budget.
- **Fig 8 (archi logicielle)** et **Fig 9 (archi technique)** : hauteur ≤ 11 cm chacune → chacune peut cohabiter sur la même page avec son titre 6.1 ou 6.2 et quelques lignes de texte.
- **Fig 11 (MCD)** : au vu de la page quasi vide (doc p.39), **remplacer dans le corps par un renvoi** « Le modèle de données complet est présenté en Annexe 1 (Figure 13) », puisque la Figure 13 en annexe est **déjà** le MCD physique complet. Gain net : **−0,8 p** à elle seule.
- **Fig 10 (packages)** : laissée dans le corps mais hauteur ≤ 10 cm → cohabite avec 7.2.2 et le début de 7.2.3.
- **Gain estimé : −1,5 pages**.

**Gain cumulé Fix 3 : −5,5 à −7 pages** (fourchette basse retenue : −5,5).

---

## 6. Fix bonus (si on dépasse encore 40 pages)

### 6.1 Scinder le Tableau 6 (CU) sur 2 pages compactes (gain ~0,3 p)

Le Tableau 6 "Principaux cas d'utilisation" occupe doc p.26 (Cas-01 à Cas-05) et p.27 (Cas-06 à Cas-14). Si le resserrement de l'interligne du tableau à **espacement 0 avant/après** et le passage de la police à **10,5 pt** le fait tenir sur **une seule page**, c'est 0,3 p gagnée.

### 6.2 Fusionner 5.1.2 et 5.1.3 en un seul bloc "Génération et passation" (gain ~0,3 p)

Si l'objectif 40 n'est toujours pas atteint, condenser ces deux cas d'utilisation en un paragraphe commun (Préconditions / Déroulement partagé) sans supprimer de contenu technique.

### 6.3 Compacter 9.1 Bilan des livrables (gain ~0,3 p)

Le Tableau des livrables (doc p.45–46) peut passer sur 1 seule page en réduisant la police à 10 pt et en retirant les lignes vides du tableau.

### 6.4 Texte prêt à coller si fusion 5.1.2 + 5.1.3

```
5.1.2  Génération du test et passation sécurisée

À partir du profil recherché et des compétences détectées, SkillForge
propose des questions adaptées (QCM, exercices de programmation, cas
pratiques). Le recruteur peut les conserver, modifier ou supprimer avant
validation. Les questions retenues constituent le test final, auquel le
candidat accède ensuite à partir de l'invitation reçue par courriel.

Déroulement côté candidat :
1. ouverture du lien d'invitation ;
2. saisie du code d'accès à six chiffres ;
3. vérification de l'invitation et de l'identité associée ;
4. acceptation des conditions puis démarrage du test ;
5. réponse aux questions et exécution éventuelle du code dans la
   sandbox pour les exercices de programmation ;
6. soumission finale de l'évaluation.

Un lien expiré ou déjà utilisé est refusé. Après plusieurs codes
incorrects, l'accès est temporairement bloqué afin de limiter les
tentatives abusives.

Résultat : un test validé par le recruteur est passé par le candidat,
les réponses sont enregistrées et la passation peut être corrigée.
```

---

## 7. Vérification finale

- [ ] Nombre de pages du corps : ___ (cible : 40 ; marge de sécurité : ≤ 41)
- [ ] Figure 3 déplacée en Annexe 2
- [ ] Figure 5 déplacée en Annexe 2
- [ ] Figure 11 remplacée par un renvoi vers Annexe 1 (Figure 13)
- [ ] 4.1.5 Gestion de la configuration condensée (6 lignes, 1 demi-page)
- [ ] 5.3.1 IHM condensée en 24 lignes textuelles
- [ ] Marges Word : 2 / 2 / 2,5 / 2 cm appliquées
- [ ] "Saut de page avant" décoché sur style Titre 1 (chap. 2 à 9)
- [ ] Espacement Titres 1/2/3 réduit (12/6/3)
- [ ] Espacement listes à puces : 0 pt entre items
- [ ] Fig 8 et Fig 9 réduites à ≤ 11 cm de hauteur chacune
- [ ] Fig 1 (Gantt) réduite de 20 %
- [ ] Table des matières régénérée (Références → clic droit → Mettre à jour les champs → Mettre à jour toute la table)
- [ ] Liste des figures régénérée (18 figures devenues 16 si Fig 3, 5 et 11 déplacées : la Liste des figures reste correcte car les figures sont en annexe, numérotation à vérifier)
- [ ] Numérotation des figures renumérotée si besoin (Fig 11 supprimée du corps → vérifier que Fig 12, 13 restent cohérentes)
- [ ] Pagination x/N appliquée (demande résiduelle du prof)

---

## 8. Si on dépasse encore malgré tout — Plan B

### 8.1 Diagnostic de rattrapage

Si après tous les fix la page compteur affiche > 40, mesurer précisément quelles sections ont débordé en comparant la nouvelle pagination à la table du §0.1 ci-dessus. Deux causes probables :

1. le changement de marges n'a rendu que ~1,5 p au lieu des 2–2,5 p attendues (le résultat dépend de la densité de texte originale) ;
2. les figures Fig 8 / Fig 9 n'ont pas pu être compactées sans perdre en lisibilité.

### 8.2 Trois leviers supplémentaires (ordre d'application recommandé)

**Levier B1 — Déplacer Fig 12 (séquence passation) en annexe** (gain ~0,4 p)
Le diagramme de séquence du 7.2.4 peut rejoindre l'annexe 3 (sandbox) puisque c'est précisément la passation sandbox. Remplacer dans le corps par :
```
Cette vérification implique successivement l'interface web, le
contrôleur, le service métier et les composants d'accès aux données.
Le diagramme de séquence détaillé est fourni en Annexe 3.
```

**Levier B2 — Fusion 4.1.1 + 4.1.2** (gain ~0,4 p)
Les sections "Activités d'ingénierie logicielle" et "Méthode de gestion de projet utilisée" (doc p.15–16) peuvent être regroupées sous "4.1.1 Démarche d'ingénierie et méthode projet".

**Levier B3 — Condenser 9.2 Problèmes rencontrés** (gain ~0,3 p)
Les trois paragraphes (GitHub Models, tests JS sandbox, qualité IA) peuvent passer à une liste à puces compacte sans perdre le contenu :
```
9.2  Problèmes rencontrés et solutions apportées

Trois difficultés principales ont jalonné le développement de
SkillForge :

- Indisponibilité de GitHub Models pour les nouveaux comptes. La
  bascule vers OpenAI s'est effectuée sans toucher à la logique métier
  grâce à l'abstraction LlmClient, confirmant l'intérêt du modèle
  multi-fournisseurs.
- Instabilité des tests JavaScript exécutés en sandbox. Le harnais a
  été adapté pour mieux gérer le répertoire temporaire, le cache npm
  et le cycle d'exécution, tout en conservant l'isolation complète.
- Variabilité qualitative des premières générations IA. Les prompts
  ont été renforcés par type de question et une validation humaine
  obligatoire a été ajoutée avant tout envoi au candidat.
```

**Total plan B disponible : ~1,1 p** supplémentaires.

### 8.3 Verdict d'atteignabilité

L'objectif **40 pages est atteignable** avec les Fix 1 + 2 + 3 (gain net cumulé ≈ 8 à 9 p). Le Plan B apporte 1 p de sécurité additionnelle si les marges / sauts de page produisent moins que prévu. **La principale incertitude reste typographique** : le gain exact des §5.1–5.3 dépend de la mise en page actuelle du Word source (non audité ici — seul le PDF rendu l'a été). Prévoir une mesure intermédiaire après avoir appliqué Fix 1 + Fix 2 + §5.1 (marges), avant d'enchaîner le reste.
