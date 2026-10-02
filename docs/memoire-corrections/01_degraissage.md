# Vague 1 — Dégraissage du mémoire (M-A7)

Objectif : passer de 50 pages de corps à 40 pages, pour respecter la contrainte
du plan-type MBDS et pour libérer de la marge en vue des ajouts à venir.

**Périmètre de cette vague** : dégraissage uniquement.
Les éléments qui demandent des vraies données (budget chiffré, consommation
IA réelle, résultats k6, comparatif LLM) sont traités dans des vagues
dédiées :

- **Vague 2** : état de l'art IA + données + choix technologiques (M-C8, M-C9, M-C12)
- **Vague 3** : Scrum vérifiable + planning réel + risques + **budget réel** (M-E2, M-E7, M-E8)
- **Vague 4** : tests chiffrés + qualité IA + livrables (M-H1, M-I1)

Les quatre sections ciblées par le prof sont réécrites ici en version
condensée. Chaque bloc commence par un rappel du gain estimé en pages.

---

## 4.1.4 Outils — passage en tableau

Gain estimé : **~2 pages** (à vérifier dans Word après intégration)

### Remplacer tout le contenu actuel de 4.1.4 par ce paragraphe + ce tableau

Les outils retenus couvrent le développement, le versionnement, les tests et
la modélisation du projet. Le tableau ci-dessous précise l'usage effectif de
chaque outil dans SkillForge. Les choix comparatifs entre outils et
alternatives sont traités dans le chapitre 2 (état de l'art) et dans la
synthèse 2.7.

| Catégorie | Outil | Usage dans SkillForge |
|---|---|---|
| **Développement backend** | Visual Studio Code | Édition du code, débogage, terminal intégré |
| | Spring Boot 3.4 (Java 21) | API REST, authentification, orchestration de l'exécution de code |
| | Maven | Gestion des dépendances backend et de la compilation |
| **Développement frontend** | React 19 + TypeScript 5 | Interfaces recruteur et candidat (SPA) |
| | Vite 6 | Serveur de développement et build du frontend |
| | Tailwind CSS + Shadcn/UI | Composants d'interface et mise en forme |
| **Données** | PostgreSQL 16 | Persistance (utilisateurs, évaluations, passations, résultats) |
| | Flyway | Migrations SQL versionnées (V1 à V7) |
| **Exécution isolée** | Docker Engine | Conteneurs éphémères pour exécuter le code candidat |
| **Versionnement et suivi** | Git + GitHub | Historique du code, dépôt distant et suivi des modifications |
| | GanttProject | Élaboration du macro-planning initial et suivi du projet |
| **Tests et sécurité** | JUnit 5 | Tests unitaires du backend, notamment des règles métier et du scoring |
| | OWASP ZAP | Analyse de sécurité de l'application web |
| | k6 | Tests de charge sur 20 utilisateurs simultanés |
| **Modélisation** | Mermaid | Réalisation des diagrammes de cas d'utilisation, de séquence, de packages et de données |

*Tableau — Outils utilisés dans le projet SkillForge*

Deux outils ont joué un rôle structurant dans la réalisation. Docker
conditionne l'isolation de l'exécution du code candidat. Git et GitHub assurent
le versionnement du code et le suivi des évolutions du projet.

---

## 4.1.5 Gestion de la configuration — version condensée

Gain estimé : **~1 page** (à vérifier dans Word après intégration)

### Remplacer tout le contenu actuel de 4.1.5 par cette version

La gestion de la configuration couvre deux volets : le code source et les
documents du projet. L'objectif est de garder une trace fiable des évolutions
et de pouvoir retrouver, à tout moment, l'état exact des livrables.

Le code source est hébergé sur GitHub et versionné avec Git. Le projet
étant mené en solo, le développement s'appuie sur un seul tronc, la branche
`main`, sans arborescence de branches intermédiaires. Chaque modification
significative donne lieu à un commit descriptif. Les messages de commit
suivent une convention simple inspirée des Conventional Commits, avec un
préfixe de type et un scope entre parenthèses : par exemple `feat(sandbox)`
pour une évolution de la sandbox, `fix(groq)` pour un correctif sur le
fournisseur Groq, `docs(memoire)` pour une mise à jour documentaire ou
`ci:` pour une évolution du pipeline d'intégration continue. Cette
convention rend l'historique Git lisible et permet de retrouver rapidement
la nature d'une modification sans ouvrir le code.

Les documents du projet (cahier des charges, dossiers de conception, plans
de recette, documentation technique) suivent une règle de nommage simple :
`SkillForge_[Nature]`, avec un suffixe de version lorsqu'une évolution
importante est consolidée (`SkillForge_CahierDesCharges_v2`, par exemple).
Les versions de référence sont conservées dans le dépôt du projet, de sorte
que les documents et le code évoluent sous le même versionnement.

Cette organisation reste légère mais suffit à garantir la cohérence entre
le code livré, les documents de conception associés et les versions
effectivement testées.

---

## 4.4 Budget du projet — version condensée

Gain estimé : **~1 page** (à vérifier dans Word après intégration)

### Remplacer tout le contenu actuel de 4.4 par cette version

Le développement a été réalisé en interne, sans acquisition de plateforme
externe. Le budget se limite donc à la prime projet versée par Tsarajoro, aux
licences logicielles et à la consommation des services d'intelligence
artificielle. Le poste de travail, les locaux et les charges indirectes ont
été mis à disposition par l'entreprise dans le cadre de son activité normale
et n'ont pas donné lieu à une facturation spécifique au projet.

Les montants ci-dessous sont donnés en ariary (MGA) et en euros (EUR, taux de
référence au 1er octobre 2026 : 1 EUR ≈ 5 050 MGA).

| Poste | Base de calcul | Estimation (MGA) | Estimation (EUR) |
|---|---|---|---|
| **Prime projet** | Prime versée par Tsarajoro à la livraison | 1 000 000 | ≈ 198 |
| Poste de travail | Matériel existant mis à disposition par Tsarajoro | *Non facturé au projet* | — |
| Locaux, Internet, électricité | Charges indirectes couvertes par Tsarajoro | *Non facturé au projet* | — |
| Logiciels et outils | Licences gratuites (Open Source) | 0 | 0 |
| Services d'IA | OpenAI (~10 USD) + essais ponctuels sur plans gratuits | 50 000 | ≈ 10 |
| **Total facturé au projet** | | **≈ 1 050 000** | **≈ 208** |

*Tableau — Estimation budgétaire du projet SkillForge sur 4 mois*

Le projet SkillForge a été conduit par un salarié de Tsarajoro dans le cadre
de la formation Master 2 MBDS, en parallèle de son activité professionnelle.
L'entreprise a versé une prime projet à la livraison plutôt qu'une indemnité
de stage, en reconnaissance de la valeur ajoutée du livrable pour l'activité
interne. Le temps professionnel mobilisé est déjà couvert par la masse
salariale globale de l'entreprise et n'est pas isolé dans le présent budget.

La consommation des services d'intelligence artificielle a été relevée sur
les tableaux de bord des fournisseurs à la clôture du projet. OpenAI
(GPT-4o-mini) a servi de fournisseur principal pour l'analyse de CV, la
génération de questions et les comptes rendus. Les autres fournisseurs
connectés via l'abstraction `LlmClient` (Groq, Google Gemini, Anthropic
Claude, GitHub Models, Ollama en local) ont été utilisés pour des essais
comparatifs ponctuels, dans la limite des plans gratuits.

Cette structure budgétaire reste maîtrisable pour un usage interne. L'option
d'exécution locale via Ollama permet, si besoin, de ramener le poste « services
d'IA » à zéro et de garantir la souveraineté complète des données candidat.

---

## 5.3.1 Interface Homme-Machine — déplacement partiel en annexe

Gain estimé : **~4 pages** (à vérifier dans Word après intégration)

### Instructions à appliquer dans le Word

1. **Garder dans le corps du mémoire** (5.3.1) uniquement **deux captures
   représentatives** :
   - **Figure 3** — Interface de création d'une évaluation et d'analyse du CV
     (représente le point d'entrée du parcours recruteur)
   - **Figure 5** — Interface de saisie du code d'accès et de démarrage d'une
     évaluation (représente le point d'entrée du parcours candidat)

   Le texte explicatif associé à ces deux figures reste dans le corps.

2. **Déplacer en Annexe 2** les trois autres captures :
   - Figure 4 — Interface de vérification et de validation des questions
   - Figure 6 — Interface de réalisation d'un exercice de programmation
   - Figure 7 — Interface de consultation des résultats d'une évaluation

   L'Annexe 2 actuelle *« Interfaces complémentaires de l'application
   SkillForge »* accueille déjà d'autres captures : il suffit d'y ajouter ces
   trois figures, avec leur texte descriptif raccourci à deux ou trois phrases
   chacune.

3. **Dans le corps du mémoire**, remplacer la phrase d'introduction de 5.3.1
   par celle-ci :

   > Cette section présente deux interfaces représentatives du parcours
   > recruteur et du parcours candidat. Les trois autres écrans de la
   > plateforme (validation des questions, éditeur de code, consultation des
   > résultats) sont présentés dans l'Annexe 2.

4. **Corriger le titre de la Figure 5** (noté dans M-F4) : le titre actuel
   annonce « passation » mais l'image montre la saisie du code d'accès.
   Nouveau titre :

   > *Figure 5 — Interface de saisie du code d'accès et de démarrage d'une
   > évaluation*

### Bénéfice

En plus du gain de pages, ce déplacement rend le chapitre 5 plus lisible et
dirige le lecteur vers l'annexe uniquement s'il souhaite plus de détails sur
l'ergonomie.

---

## Récapitulatif du gain

| Section | Gain estimé |
|---|---|
| 4.1.4 Outils → tableau | ~2 pages |
| 4.1.5 Gestion configuration → condensé | ~1 page |
| 4.4 Budget → condensé (chiffres en Vague 3) | ~1 page |
| 5.3.1 IHM → captures en annexe | ~4 pages |
| **Total estimé** | **~8 pages** |

**Attention** : cette estimation reste à vérifier dans Word après intégration.
L'objectif du prof est de passer de **50 à 40 pages**. Si après cette vague le
mémoire se situe autour de 42 pages, deux pistes complémentaires peuvent être
étudiées, mais seulement après lecture du contenu réel :

- **2.4 Technologies et architecture envisagée** : à alléger uniquement si des
  passages recoupent 4.1.4, et sans supprimer ce qui sera utile pour la
  justification comparative demandée par le prof dans l'état de l'art.
- **3.1.2 Description interne du système logiciel existant** : à compresser si
  des passages anticipent la conception traitée en 7.2.

**Ne pas couper ces deux sections sans vérifier** : la Vague 2 va justement
ajouter 2 à 3 pages à l'état de l'art (comparatif LLM, biais, RGPD, etc.), il
faut donc préserver le volume disponible.
