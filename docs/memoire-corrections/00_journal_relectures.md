# Journal des relectures et corrections

Ce fichier regroupe, dans l'ordre, chaque remarque de relecture et la
correction appliquée. Il sert à garder une trace propre des échanges et à
éviter les régressions.

---

## R-01 — Chiffres budget inventés (01_degraissage.md)

**Date** : 2 octobre 2026
**Remarque** : les montants du tableau budgétaire (indemnité stagiaire,
consommation OpenAI à 28 USD, Groq/Gemini à 8 USD) étaient inventés et
présentés comme « consommation réelle mesurée ». Le prof demande précisément
des chiffres vérifiables.

**Analyse projet** : le rédacteur est en CDI chez Tsarajoro, pas stagiaire.
Il n'y a donc pas d'indemnité de stage. Une prime projet de 1 000 000 MGA a
été versée à la livraison. La seule consommation IA réellement engagée est
d'environ 10 USD sur OpenAI, les autres fournisseurs ayant été utilisés sur
leurs plans gratuits.

**Correction appliquée** : réécriture complète de 4.4 avec le vrai statut du
rédacteur (salarié CDI), la prime projet chiffrée (1 000 000 MGA), les
10 USD OpenAI confirmés et une mention explicite que le poste de travail,
les locaux et les charges indirectes sont mis à disposition par Tsarajoro
sans facturation spécifique au projet.

---

## R-02 — Phrase « échantillon représentatif » pour k6 (01_degraissage.md)

**Date** : 2 octobre 2026
**Remarque** : la phrase « tests de charge avec k6 ont été réalisés sur un
échantillon représentatif » affirme ce que le prof reproche justement comme
manquant (métriques du test de charge). Elle était trompeuse.

**Correction appliquée** : remplacée par « k6 — Tests de charge sur 20
utilisateurs simultanés », factuel. Les métriques détaillées (moyenne,
médiane, p95, taux d'erreur) seront ajoutées en Vague 4 (M-H1), une fois
les relevés disponibles.

---

## R-03 — Convention de branches inventée (4.1.5)

**Date** : 2 octobre 2026
**Remarque** : le paragraphe mentionnait une convention de nommage de branches
`feature/*`, `fix/*`, `chore/*` qui n'existe pas dans le projet.

**Analyse projet** :

- `git branch -a` → une seule branche `main`, localement et sur `origin`.
- Aucun `feature/*`, `fix/*`, `chore/*` dans l'historique.
- En revanche, les **messages de commit** suivent une vraie convention,
  vérifiable sur l'historique :
  - préfixes : `feat`, `fix`, `docs`, `test`, `chore`, `ci`
  - scope entre parenthèses : `feat(sandbox)`, `fix(groq)`, `docs(memoire)`,
    `feat(anti-fraude)`, `feat(ollama)`, `ci`, etc.

**Correction appliquée** : réécriture du paragraphe pour décrire la vraie
pratique :

- un seul tronc `main` (approche adaptée à un développement solo),
- une convention sur les **messages de commit** (type + scope + description).

Pas d'invention. Chaque élément est défendable en montrant l'historique Git
au jury.

---

## R-04 — Amortissement du poste de travail (01_degraissage.md)

**Date** : 2 octobre 2026
**Remarque** : la ligne « amortissement du poste de travail : 400 000 MGA »
reposait sur un calcul théorique (prix d'achat estimé × 4 mois sur 36 mois),
non vérifiable, puisque le poste existait déjà chez Tsarajoro et que le prix
d'achat réel n'est pas connu du rédacteur.

**Correction appliquée** : la ligne reste présente dans le tableau budget
(le prof demande explicitement « poste » en M-E8), mais avec la mention
« *Non facturé au projet* » et une note en-dessous expliquant que le
matériel a été mis à disposition par Tsarajoro dans le cadre de son
activité normale. Même traitement pour les locaux, Internet et électricité.

---

## R-05 — GitHub Actions et StarUML dans le tableau outils

**Date** : 2 octobre 2026
**Remarque** : la première version du tableau 4.1.4 citait GitHub Actions et
StarUML. Vérification demandée avant d'affirmer leur usage réel.

**Analyse projet** :

- `.github/workflows/` : inexistant au moment de la relecture → GitHub
  Actions **pas utilisé**.
- Fichiers `.mdj`, `.staruml` : aucun dans le dépôt → StarUML **pas
  utilisé**, les diagrammes ont été produits avec Mermaid uniquement.

**Correction appliquée (étape 1)** : StarUML retiré du tableau, Mermaid
conservé seul. GitHub Actions également retiré dans un premier temps.

**Décision complémentaire (étape 2)** : mise en place effective d'un
pipeline GitHub Actions dans `.github/workflows/ci.yml`, pour que la mention
dans le tableau 4.1.4 soit vraie. Le workflow couvre la compilation et les
tests des deux backends Java 21 ainsi que la build du frontend
React/Vite/pnpm. Il sera réintégré dans le tableau une fois le résultat
vert confirmé sur GitHub.

---

## R-06 — Doublon potentiel 4.4 ↔ futur comparatif LLM

**Date** : 2 octobre 2026
**Remarque** : la première version de 4.4 détaillait longuement la
consommation par fournisseur (OpenAI, Groq, Gemini, Claude, Ollama). Risque
de doublon avec le comparatif LLM demandé par le prof dans l'état de l'art
enrichi (Vague 2, M-C8).

**Correction appliquée** : 4.4 Budget garde uniquement la consommation
globale et un rappel que les fournisseurs sont connectés via `LlmClient`.
Le comparatif détaillé (coût par CV, qualité, latence, localisation des
données) sera traité en Vague 2 dans la section 2.3 ou 2.4 enrichie.

---

## R-07 — Estimation « 8 pages gagnées » à présenter comme hypothèse

**Date** : 2 octobre 2026
**Remarque** : écrire « gain : 8 pages » sans vérification réelle dans Word
risque de paraître surestimé.

**Correction appliquée** : chaque gain est désormais suivi de la mention
« à vérifier dans Word après intégration ». Le récapitulatif rappelle que la
cible du prof reste 40 pages, et que deux pistes supplémentaires (2.4 et
3.1.2) ne doivent être activées qu'après vérification réelle du contenu, car
la Vague 2 va justement ajouter 2 à 3 pages à l'état de l'art.

---

## R-08 — Paragraphe intro de 4.1.4 anticipait la justification des choix

**Date** : 2 octobre 2026
**Remarque** : la phrase « le choix s'est appuyé sur trois critères :
familiarité MBDS, compatibilité web moderne, gratuité des licences »
anticipait la justification comparative des choix technologiques, qui doit
être traitée dans l'état de l'art enrichi (M-C6, M-C12), pas en 4.1.4.

**Correction appliquée** : paragraphe d'introduction de 4.1.4 simplifié,
avec un renvoi explicite au chapitre 2 pour la justification comparative.
4.1.4 décrit uniquement l'usage effectif de chaque outil dans SkillForge,
sans anticipation.

---

## Récap des vagues et de leur périmètre

| Vague | Contenu | Statut |
|---|---|---|
| **Vague 1** | Dégraissage : 4.1.4, 4.1.5, 4.4, 5.3.1 | En cours (R-01 à R-08) |
| **Vague 2** | État de l'art enrichi : M-C6, M-C8, M-C9, M-C11, M-C12 | À venir |
| **Vague 3** | Scrum vérifiable : M-E2, M-E7, budget réel finalisé M-E8 | À venir |
| **Vague 4** | Tests chiffrés + qualité IA + livrables : M-H1, M-I1 | À venir |
| **Vague 5** | Harmonisation slides ↔ mémoire corrigé | À venir |

---

## Règles de rédaction retenues pour toutes les vagues

Issues des remarques successives du rédacteur :

1. **Pas de phrase IA générique** : vocabulaire précis, pas de triade
   artificielle, pas de « notamment » à répétition.
2. **Analyse réelle du projet avant d'affirmer** : vérifier dans le code,
   le repo Git, les fichiers de configuration, avant toute phrase factuelle
   sur l'outillage ou la méthode.
3. **Chaque chiffre doit être vérifiable** : relevé fournisseur, montant
   confirmé par Tsarajoro, mesure exécutée dans le projet. Si pas de source,
   ne pas inventer.
4. **Rester fidèle aux consignes du prof** (fiche de retour du 1er octobre
   2026) : chaque correction renvoie à un identifiant de critère (M-A1,
   M-C12, etc.).
5. **Garder tous les retours dans ce fichier** pour éviter de refaire les
   mêmes erreurs d'une vague à l'autre.
