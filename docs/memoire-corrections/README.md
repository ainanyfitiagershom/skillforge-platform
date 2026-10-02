# Corrections du mémoire M2 MBDS — Mode d'emploi

Ce dossier regroupe **toutes les propositions de correction** du mémoire
SkillForge, en réponse à la fiche de retour du prof Rojo RABENANAHARY
(1er octobre 2026, verdict *« Corrections importantes »*).

**Objectif** : atteindre 18+/20 à la soutenance du 7 octobre 2026.

---

## Structure du dossier

| Fichier | Rôle |
|---|---|
| `README.md` | Ce fichier — mode d'emploi |
| `00_suivi_consignes_prof.md` | **Tableau de bord** des 54 critères du prof avec statut par critère |
| `00_journal_relectures.md` | Journal des relectures et corrections (R-01, R-02, …) pour éviter les régressions |
| `01_degraissage.md` | **Vague 1** — Dégraissage (passage de 50 à 40 pages) |
| `02_etat_art.md` | **Vague 2** — État de l'art enrichi (le gros morceau IA + données + sécurité) |
| `03_scrum_budget.md` | **Vague 3** — Scrum vérifiable + planning + risques + budget consolidé |
| `04_finition.md` | **Vague 4** — Exigences, UML, tests, conclusion, bibliographie |
| `05_slides.md` | **Vague 5** — Harmonisation des slides avec le mémoire corrigé |

---

## Ordre d'application recommandé

Les vagues sont **numérotées dans l'ordre où elles doivent être
intégrées** dans le Word. Cet ordre n'est pas arbitraire : chaque vague
prépare la suivante.

### Pourquoi cet ordre ?

```
V1 Dégraissage      →  libère ~8 pages dans le Word
                       (pour accueillir les ajouts de V2)

V2 État de l'art    →  ajoute ~3-4 pages d'IA / RGPD / choix
                       (le chapitre 2 prend sa forme finale)

V3 Scrum + budget   →  rend la démarche vérifiable
                       (chapitre 4 complet et chiffré)

V4 Finition         →  UML, tests, conclusion, biblio
                       (le mémoire est complet et prêt à relire)

V5 Slides           →  harmonisation finale avec le mémoire corrigé
                       (les slides reflètent le document écrit)
```

**Règle** : ne pas commencer V5 avant que V1 à V4 soient intégrées, sinon
les slides vont diverger du mémoire.

---

## Procédure détaillée par vague

### Vague 1 — Dégraissage (`01_degraissage.md`)

1. Ouvrir le Word du mémoire v2.
2. **Section 4.1.4 Outils** → remplacer par le paragraphe + tableau proposés.
3. **Section 4.1.5 Gestion configuration** → remplacer par la version condensée.
4. **Section 4.4 Budget** → remplacer par la version condensée (sera
   enrichie en Vague 3).
5. **Section 5.3.1 IHM** → garder uniquement 2 captures, déplacer les 3
   autres en Annexe 2.
6. **Corriger le titre de la Figure 5** (M-F4).
7. Vérifier le compte de pages : objectif ~42 pages après V1.

### Vague 2 — État de l'art (`02_etat_art.md`)

Vague la plus volumineuse (18 critères). À intégrer section par section
dans le chapitre 2.

1. ⭐ **M-C12** → insérer le tableau de synthèse des choix **en fin de 2.7**.
2. ⭐ **M-C8** → enrichir 2.3 avec les 4 sous-sections IA (comparatif LLM,
   protocole d'évaluation, biais + AI Act, synthèse).
3. ⭐ **M-C9** → ajouter la sous-section RGPD / loi 2014-038 en fin de 2.5.
4. ⭐ **M-C11** → ajouter la section contexte local Madagascar en fin de 2.6.
5. ⭐ **M-C6** → insérer la matrice d'isolation dans 2.4.
6. Puis dérouler les critères secondaires (M-B2, M-B3, M-C2 à M-C13,
   M-D1, M-F5, M-G1, M-G2) selon leur emplacement indiqué dans le
   fichier.
7. Chaque entrée précédée de *« [à confirmer] »* nécessite une donnée
   réelle (demander à l'encadreur Tsarajoro).

### Vague 3 — Scrum + budget (`03_scrum_budget.md`)

1. **M-E2** → réécrire 4.1.1 avec Scrum adapté solo, rôles, sprints,
   artefacts.
2. **M-E3** → ajouter le paragraphe de contribution personnelle.
3. **M-E6** → créer la section 4.3 avec le tableau des contraintes et le
   registre des risques (9 risques).
4. ⭐ **M-E7** → réécrire 4.2 avec le macro-planning 8 sprints + écarts
   assumés + **produire le diagramme de Gantt** dans GanttProject.
5. **M-E8** → mettre à jour 4.4 avec le tableau budget consolidé final.

### Vague 4 — Finition (`04_finition.md`)

Les 17 critères sont regroupés par chapitre. Suggestion d'ordre :

1. 🔴 **M-F2** → produire les 3 diagrammes Mermaid (séquence, états,
   composants + ER de M-G4). *Seul critère noté « Absent » par le prof.*
2. **M-A2** → remplacer le résumé/abstract par les versions FR + EN.
3. **M-A4** → ajouter la liste d'acronymes après la table des matières.
4. **M-A6** → activer la pagination x/N dans Word.
5. **M-B1** → ajouter le paragraphe d'annonce du plan en fin
   d'introduction.
6. **M-D4** → ajouter les objectifs SMART et la liste des livrables.
7. **M-F1 / M-F3** → formaliser 14 exigences fonctionnelles + 10 non
   fonctionnelles.
8. **M-G3 / M-G4 / M-G6** → compléter la conception du code, le modèle
   de données et le déploiement.
9. **M-H1** → **lancer les 3 campagnes de tests** (JUnit, OWASP ZAP, k6)
   et remplir les cases *[à relever]*.
10. **M-I1 / M-I2** → remplacer la conclusion par les versions
    enrichies.
11. **M-J1** → remplacer la bibliographie par la liste de 17 références.
12. **M-J2** → **relire chaque renvoi `[n]`** dans tout le mémoire
    (renumérotation complète après l'ajout des nouvelles sources).
13. **M-A8** → passer le correcteur orthographique sur l'ensemble.

### Vague 5 — Slides (`05_slides.md`)

À ne commencer **qu'après avoir intégré V1 à V4** dans le mémoire.

1. **S-1** → nouvelle slide de titre avec le titre validé.
2. **S-3** → activer la numérotation x/N.
3. **S-4 / S-5** → réordonner les slides selon la table de
   correspondance (21 slides).
4. **S-6 à S-11** → reconstruire chaque slide en reprenant les
   figures et tableaux du mémoire corrigé.
5. Enregistrer la **vidéo de secours** de la démo.
6. Préparer les **questions probables du jury** (fichier à part dans
   `docs/soutenance/`).

---

## Règles de rédaction tenues sur toutes les vagues

Issues des relectures successives (voir `00_journal_relectures.md`) :

1. **Pas de phrase IA générique** — vocabulaire précis, pas de triade
   artificielle, pas de « notamment » à répétition.
2. **Analyse réelle du projet avant d'affirmer** — vérifier dans le
   code, le repo Git et les fichiers de configuration avant toute
   phrase factuelle sur l'outillage ou la méthode.
3. **Chaque chiffre doit être vérifiable** — relevé fournisseur,
   montant confirmé par Tsarajoro, mesure exécutée dans le projet. Si
   pas de source, mentionner *[à confirmer]* et ne pas inventer.
4. **Rester fidèle aux consignes du prof** — chaque correction renvoie
   à un identifiant de critère (M-A1, M-C12, S-5, etc.).
5. **Accents français obligatoires** dans tous les textes (y compris
   majuscules : `État`, `À`, `École`).

---

## Suivi d'avancement

Le fichier `00_suivi_consignes_prof.md` est la **source de vérité** sur
l'état des 54 critères. Il utilise les statuts suivants :

| Icône | Statut |
|---|---|
| ⏳ | À faire (non démarré) |
| 🟡 | Proposition prête, non intégrée au Word |
| 🟠 | Intégré au Word, à relire |
| ✅ | Intégré au Word, validé |
| ⚪ | Pas d'action nécessaire (déjà Conforme) |
| ❌ | Décision explicite de ne pas traiter |

À la clôture de la production : **54/54 critères en statut 🟡**
(propositions prêtes). Le passage à 🟠 puis ✅ se fait au fur et à mesure
de l'intégration dans le Word.

---

## Travaux restants qui ne figurent pas dans ces fichiers

Ces points demandent une action manuelle ou des données que seul le
rédacteur peut fournir :

1. **Intégration dans le Word** du mémoire (V1 à V4).
2. **Production des diagrammes** (séquence, états, composants, ER,
   Gantt) depuis les codes Mermaid et le macro-planning.
3. **Lancement des 3 campagnes de tests** (JUnit, OWASP ZAP, k6) pour
   remplir les cases *[à relever]* dans 04_finition.md.
4. **Confirmation des chiffres entreprise** avec l'encadreur Tsarajoro
   (effectif, année de création, nombre de recrutements/an, heures par
   candidat avant SkillForge).
5. **Reconstruction du PPTX** à partir de la table de correspondance de
   la Vague 5 (21 slides).
6. **Enregistrement de la vidéo de secours** de la démo.
7. **Push du workflow GitHub Actions** (commit `8b62abf` dans
   `.github/workflows/ci.yml`).
8. **Reconstitution a posteriori** du `docs/backlog.md` et des notes de
   sprint si inexistants, à partir de l'historique Git réel.

---

## Pour revenir sur une vague

Si une relecture ultérieure du prof ou de l'encadreur demande une
nouvelle itération :

1. Ouvrir le fichier de la vague concernée.
2. Appliquer la modification demandée.
3. Ajouter une entrée R-NN dans `00_journal_relectures.md` avec la date,
   la remarque reçue, l'analyse projet effectuée et la correction
   appliquée.
4. Mettre à jour le statut dans `00_suivi_consignes_prof.md` si
   nécessaire.
