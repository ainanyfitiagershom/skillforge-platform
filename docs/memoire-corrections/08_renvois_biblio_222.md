# Correction des renvois bibliographiques en 2.2.2 — M-J2

## Diagnostic

Dans la section 2.2.2 "Étude de chaque solution au vu des critères" du
mémoire v2, les 4 renvois bibliographiques pointent vers des sources
scientifiques au lieu des entrées officielles des plateformes commerciales :

| Plateforme | Renvoi actuel (FAUX) | Pointe vers |
|---|---|---|
| HackerRank | `[1]` | Raghavan et al. — biais algorithmiques en recrutement |
| Codility | `[2][3]` | Bogen & Rieke + Russell & Norvig — IA et éthique |
| TestGorilla | `[4][5]` | Merkel + OWASP ASVS — Docker et sécurité |
| CoderPad | `[6][7]` | HackerRank + Codility (!) |

Les **vraies entrées commerciales** dans la bibliographie sont [6] à [9].
Le prof signale explicitement ce défaut (M-J2).

## Correction

Remplacer dans la section 2.2.2 :

| Renvoi actuel | Renvoi correct |
|---|---|
| HackerRank `[1]` | HackerRank `[6]` |
| Codility `[2][3]` | Codility `[7]` |
| TestGorilla `[4][5]` | TestGorilla `[8]` |
| CoderPad `[6][7]` | CoderPad `[9]` |

## Texte complet reformulé (à copier dans le Word)

Remplace les 4 puces actuelles par ces 4 puces (le texte reste identique,
seuls les numéros de renvoi changent) :

> ● **HackerRank** est spécialisé dans l'évaluation des compétences
> techniques. Il propose des exercices de programmation, des QCM, des
> entretiens techniques et différents mécanismes de correction et de
> contrôle de l'intégrité des tests. La plateforme permet également
> d'adapter les évaluations au poste et aux compétences recherchées **[6]**.
>
> ● **Codility** est principalement orienté vers l'évaluation des
> développeurs. Il propose des tests de programmation, des entretiens
> techniques, une correction automatique ainsi que des mécanismes de
> détection de comportements suspects. Certaines fonctionnalités d'IA
> permettent également de compléter l'évaluation du candidat **[7]**.
>
> ● **TestGorilla** adopte une approche plus généraliste. La plateforme
> combine tests techniques, questions personnalisées, exercices de
> programmation et outils d'aide à la présélection. Elle propose également
> certaines fonctionnalités liées à l'IA et à l'analyse des candidatures
> **[8]**.
>
> ● **CoderPad** se concentre davantage sur l'évaluation pratique du code.
> Il fournit un environnement permettant d'écrire, d'exécuter et de tester
> du code dans des conditions proches du développement réel. La plateforme
> propose également des fonctions anti-fraude et des outils d'IA pour
> assister la préparation des évaluations **[9]**.

## Procédure d'intégration dans le Word

1. Ouvre ton mémoire v2 au chapitre 2, section 2.2.2
2. Repère les 4 puces (HackerRank, Codility, TestGorilla, CoderPad)
3. Pour chaque puce, change juste le ou les chiffres entre crochets :
   - `[1]` → `[6]`
   - `[2][3]` → `[7]`
   - `[4][5]` → `[8]`
   - `[6][7]` → `[9]`
4. Sauvegarde

Total : 4 remplacements. Durée réelle : 2 min.

## Vérification après correction

- Chaque plateforme pointe maintenant vers son entrée officielle dans la
  bibliographie (les URL hackerrank.com, codility.com, testgorilla.com,
  coderpad.io consultées le 20 août 2026).
- Les sources scientifiques [1] à [5] restent dans la biblio mais ne sont
  plus faussement citées en 2.2.2.
- Si tu veux que [1] à [5] soient réellement cités quelque part, c'est en
  2.3 (biais algorithmiques, IA en recrutement) et 2.5 (sécurité Docker,
  OWASP ASVS). Vérifier qu'ils y sont bien avant publication (sinon elles
  deviennent orphelines).

Note : la vérification « sources scientifiques effectivement citées
ailleurs » n'est pas dans la fiche du prof mais c'est une bonne pratique.
Un passage rapide par Ctrl+F dans le Word sur `[1]`, `[2]`, `[3]`, `[4]`,
`[5]` suffira à confirmer ou à ajouter 1 renvoi dans le texte.
