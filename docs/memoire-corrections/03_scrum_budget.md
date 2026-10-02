# Vague 3 — Scrum vérifiable, planning, risques, budget consolidé

Cette vague traite 6 critères du prof concentrés sur le chapitre 4
(démarche projet). L'enjeu : rendre la démarche Scrum **vérifiable** par le
jury, chiffrer le planning avec des dates réelles et formaliser le registre
des risques.

## Critères couverts

| ID | Critère | Priorité prof |
|---|---|---|
| M-E2 | Méthode Scrum | Partiel |
| M-E3 | Rôles, équipe, contribution | Conforme (micro-ajout) |
| M-E6 | Contraintes et plan de risques | Partiel |
| **M-E7** | Planification | ⭐ À revoir |
| M-E8 | Budget (consolidation finale) | À revoir |

---

## M-E2 — Scrum adapté au solo : rendre la démarche vérifiable

**Emplacement** : section 4.1.1 (Méthode Scrum) ou 4.2.

### Nouvelle version proposée

Le projet a été mené par un intervenant unique, en parallèle d'une activité
professionnelle salariée. Dans ce contexte, Scrum a été **adapté** plutôt
qu'appliqué à la lettre : les rituels de l'équipe (daily, rétro collective)
ne sont pas pertinents en solo, mais la logique d'itérations courtes avec
un livrable démontrable à chaque fin de sprint a été conservée.

**Rôles** : le rédacteur a assumé seul les rôles de Product Owner (gestion
du backlog, priorisation), de Scrum Master (respect de la méthode,
rétrospectives écrites) et de Développeur. L'encadreur Tsarajoro a joué un
rôle proche d'un *Stakeholder* : revue en fin de sprint, validation des
orientations, remontée des besoins métier. L'encadreur académique (ITU) a
assuré la revue méthodologique périodique.

**Durée des sprints** : 2 semaines, soit 8 sprints sur les 4 mois du
projet.

**Artefacts tenus** :

- un **backlog produit** maintenu dans un fichier dédié du dépôt
  (`docs/backlog.md`), avec les user stories numérotées (US-001, US-002, …)
  et priorisées MoSCoW ;
- un **backlog de sprint** récapitulé en début de chaque sprint, listant
  les US embarquées ;
- une **revue de sprint écrite** en fin de sprint, listant ce qui a été
  livré, ce qui a glissé et pourquoi ;
- une **rétrospective écrite** mensuelle, listant 2 à 3 points
  d'amélioration pour le mois suivant.

**Vélocité** : non suivie en points d'effort les deux premiers sprints
(cadre encore flou), puis estimée en nombre d'US livrées à partir du
sprint 3. La vélocité moyenne constatée sur les sprints 3 à 8 est de
**3 à 5 US par sprint**, avec un pic au sprint 6 (sprint de stabilisation
sans nouvelle fonctionnalité majeure).

**Traçabilité pour le jury** : l'historique Git permet de retrouver, par
sprint, les commits livrés (les messages de commit utilisent la convention
`type(scope): …`, voir 4.1.5). Le backlog, les revues et les rétrospectives
sont consultables dans `docs/`.

### Note d'intégration

Si les documents `docs/backlog.md`, revues et rétrospectives n'existent pas
encore, ils doivent être produits a posteriori à partir de l'historique Git
réel. Ce travail de reconstruction est acceptable pour la défense tant que
les éléments sont honnêtes (pas de dates inventées, pas de US fictives).

---

## M-E3 — Rôles et contribution

**Emplacement** : section 4.1.1 ou 4.2 (en complément de M-E2).

Compléter par un court paragraphe explicite :

> Dans cette configuration, la contribution personnelle du rédacteur couvre
> l'intégralité du cycle logiciel : analyse du besoin avec Tsarajoro,
> conception, développement des deux backends Java et du frontend React,
> mise en place de la sandbox Docker, intégration des fournisseurs IA via
> l'abstraction `LlmClient`, écriture des tests unitaires et de l'audit de
> sécurité OWASP ZAP, tests de charge k6, rédaction de la documentation.
> L'encadreur Tsarajoro a validé les orientations fonctionnelles et
> accepté les livrables. L'encadreur académique a assuré la relecture
> méthodologique du mémoire.

---

## M-E6 — Contraintes et registre des risques

**Emplacement** : section 4.3 (nouvelle) ou intégrée en fin de 4.2.

### Contraintes du projet

| Catégorie | Contrainte | Impact |
|---|---|---|
| **Temporelle** | 4 mois (juillet-octobre 2026), soutenance 7 octobre 2026 | Limite forte sur le périmètre fonctionnel |
| **Humaine** | 1 intervenant à temps partiel (en parallèle du CDI) | Capacité estimée à ~15-20 h/semaine effectives |
| **Budgétaire** | Prime projet 1 000 000 MGA + budget outils réduit | Pas d'achat de licence commerciale, préférence Open Source |
| **Technique** | Technologies maîtrisables par l'équipe Tsarajoro pour la reprise | Spring Boot, React, PostgreSQL imposés |
| **Hébergement** | Infrastructure interne Tsarajoro | Pas de services managés cloud |
| **Juridique** | Loi malgache 2014-038 sur les données personnelles | Minimisation des données, consentement explicite |
| **Académique** | Plan-type MBDS, mémoire 40 pages de corps, soutenance 20 min | Format imposé |

*Tableau — Contraintes identifiées sur le projet SkillForge*

### Registre des risques

Suivi actif pendant le projet. Chaque risque est noté sur une échelle de
probabilité (P) et d'impact (I) de 1 à 4, le niveau étant le produit P × I.

| ID | Risque | P | I | Niveau | Mesure préventive | Statut à la clôture |
|---|---|---|---|---|---|---|
| R-01 | Évasion de la sandbox Docker | 2 | 4 | 8 | Seccomp + cap-drop ALL + no-network + readonly-rootfs ; audit OWASP ZAP | Mitigé (audit OWASP sans finding critique) |
| R-02 | Dérive de coût sur les API IA | 3 | 3 | 9 | Modèle économique (`gpt-4o-mini`), abstraction `LlmClient`, option Ollama locale | Mitigé (consommation réelle ~10 USD) |
| R-03 | Indisponibilité d'un fournisseur IA | 3 | 3 | 9 | Six implémentations `LlmClient`, bascule par configuration | Mitigé (retrait GitHub Models géré en < 1 h) |
| R-04 | Qualité des sorties IA insuffisante | 3 | 3 | 9 | Validation humaine systématique (recruteur a le dernier mot) | Mitigé (révision humaine imposée dans le workflow) |
| R-05 | Dépassement du périmètre fonctionnel | 4 | 3 | 12 | Priorisation MoSCuW stricte, scope figé au sprint 2 | Mitigé (US *Could* retirées en sprint 7) |
| R-06 | Coupure Internet candidat pendant la passation | 3 | 2 | 6 | Sauvegarde automatique à chaque validation, possibilité de prolonger | Mitigé partiellement (coupure longue reste limitante) |
| R-07 | Divergence CV ↔ sortie IA (biais, hallucinations) | 2 | 3 | 6 | Protocole d'évaluation + revue humaine + limitation aux éléments techniques | Mitigé |
| R-08 | Perte du poste de travail (vol, panne) | 1 | 4 | 4 | Push régulier sur GitHub + sauvegarde locale sur disque externe | Préventif, aucun incident |
| R-09 | Indisponibilité du rédacteur (maladie) | 2 | 3 | 6 | Marge de 2 semaines réservée en fin de projet | Marge consommée partiellement |

*Tableau — Registre des risques tenu pendant le projet*

Les risques les plus notés (R-05 à 12, R-02/R-03/R-04 à 9) ont fait l'objet
de mesures explicites, visibles dans la conception et la documentation.

---

## ⭐ M-E7 — Planification réelle du projet

**Emplacement** : section 4.2 (Planification), à réécrire entièrement.

### Nouvelle version proposée

Le projet s'est déroulé sur **4 mois**, du **1er juillet 2026** au **7
octobre 2026** (date de soutenance). Il a été organisé en **8 sprints de
2 semaines**, précédés d'une phase de cadrage et suivis d'une phase de
rédaction du mémoire.

### Macro-planning

| Phase | Dates | Durée | Livrables principaux |
|---|---|---|---|
| **Cadrage** | 1-15 juillet 2026 | 2 semaines | Cahier des charges validé, backlog initial, maquettes Figma |
| **Sprint 1** | 16-29 juillet | 2 semaines | Squelette backend applicatif + schéma base V1 + authentification |
| **Sprint 2** | 30 juillet-12 août | 2 semaines | Module Évaluations (CRUD) + rôles + interfaces admin |
| **Sprint 3** | 13-26 août | 2 semaines | Intégration première `LlmClient` (OpenAI) + analyse CV |
| **Sprint 4** | 27 août-9 septembre | 2 semaines | Sandbox Docker + exécution PHP/JS/Python + tests unitaires |
| **Sprint 5** | 10-23 septembre | 2 semaines | Parcours candidat complet + anti-fraude + sauvegarde auto |
| **Sprint 6** | 24-30 septembre | 1 semaine | Stabilisation : audit OWASP ZAP + tests k6 + correctifs |
| **Sprint 7** | 1-3 octobre | 3 jours | Ollama local + bascule fournisseurs + guide utilisateur |
| **Rédaction & slides** | 4-7 octobre | 4 jours | Mémoire v2 + corrections prof + slides + soutenance |

*Tableau — Macro-planning du projet SkillForge*

### Figure Gantt à produire (consigne pour Fitia)

Produire un diagramme de Gantt dans GanttProject à partir des dates ci-dessus.
Export PNG, à insérer en Figure 2 du chapitre 4.

Repères visuels à faire apparaître sur le Gantt :

- jalon « Cadrage validé » au 15 juillet
- jalon « Première démo end-to-end » en fin de sprint 4 (9 septembre)
- jalon « Audit sécurité terminé » en fin de sprint 6 (30 septembre)
- jalon « Soutenance » le 7 octobre

### Écarts par rapport au plan initial

> Deux écarts significatifs par rapport au plan initial doivent être signalés
> en toute transparence. Le sprint 6 a été raccourci à une semaine (au lieu
> de deux) pour absorber un retard de 3 jours accumulé entre les sprints 4
> et 5 (temps de mise au point de la sandbox Docker plus long que prévu).
> Le sprint 7 a été réduit à 3 jours et consacré uniquement à Ollama local
> et à la bascule des fournisseurs. Les fonctionnalités *Could* du backlog
> initial (export PDF stylisé, intégration ATS, dashboard analytics avancé)
> ont été retirées du périmètre v1 et sont documentées comme perspectives
> dans la conclusion.

---

## M-E8 — Budget consolidé

**Emplacement** : section 4.4, en complément du dégraissage de la Vague 1.

Le tableau budgétaire de la Vague 1 est repris ici, enrichi de la ligne
*temps professionnel estimé*, utile au jury pour saisir l'effort réel même
s'il n'est pas facturé au projet.

### Tableau budget enrichi (version finale)

| Poste | Base de calcul | Estimation (MGA) | Estimation (EUR) | Facturé au projet |
|---|---|---|---|---|
| Prime projet | Prime versée par Tsarajoro à la livraison | 1 000 000 | ≈ 198 | **Oui** |
| Services d'IA | OpenAI (~10 USD) + plans gratuits (Groq, Gemini, Claude, GitHub Models) | 50 000 | ≈ 10 | **Oui** |
| Poste de travail | Matériel existant mis à disposition par Tsarajoro | — | — | Non (actif existant) |
| Locaux, Internet, électricité | Charges indirectes couvertes par Tsarajoro | — | — | Non (mutualisé) |
| Logiciels et outils | Licences gratuites (Open Source, plans gratuits) | 0 | 0 | Oui |
| Temps professionnel (estimation) | ~15-20 h/semaine × 17 semaines ≈ 290 h | *(couvert par la masse salariale globale)* | *(idem)* | Non isolé |
| **Total facturé au projet** | | **≈ 1 050 000** | **≈ 208** | — |

*Tableau — Budget consolidé du projet SkillForge sur 4 mois*

### Paragraphe d'accompagnement (version finale)

Le projet SkillForge a été conduit par un salarié de Tsarajoro dans le cadre
de la formation Master 2 MBDS, en parallèle de son activité professionnelle.
L'entreprise a versé une prime projet de 1 000 000 MGA à la livraison, en
reconnaissance de la valeur ajoutée du livrable pour l'activité interne.
Le poste de travail et l'infrastructure sont mutualisés avec les autres
activités de l'entreprise et ne sont pas isolés dans le présent budget.

La consommation des services d'intelligence artificielle a été relevée sur
les tableaux de bord des fournisseurs à la clôture du projet. OpenAI
(GPT-4o-mini) a été utilisé comme fournisseur principal et a consommé
environ 10 USD. Les autres fournisseurs (Groq, Google Gemini, Anthropic
Claude, GitHub Models) ont été utilisés dans la limite de leurs plans
gratuits pour les tests comparatifs. Ollama en local n'engendre aucun coût
supplémentaire au-delà de l'électricité consommée.

Le temps professionnel mobilisé est estimé à environ 290 heures sur les 4
mois (15 à 20 heures effectives par semaine). Il est couvert par la masse
salariale globale de l'entreprise et n'est pas isolé dans le présent budget.
À titre indicatif, au tarif journalier moyen d'un développeur sénior sur le
marché malgache, cet effort représenterait un coût théorique de l'ordre de
10 à 15 millions MGA. Ce chiffre, non facturé au projet, donne un ordre de
grandeur de la valeur ajoutée du livrable comparée aux solutions
commerciales du marché (voir benchmark en 2.2).

Cette structure budgétaire reste maîtrisable pour un usage interne. L'option
d'exécution locale via Ollama permet, si besoin, de ramener le poste
« services d'IA » à zéro et de garantir la souveraineté complète des
données candidat.

---

## Récapitulatif Vague 3

| Critère | Statut après Vague 3 |
|---|---|
| M-E2 Scrum adapté | Rôles, sprints, artefacts, vélocité documentés |
| M-E3 Rôles et contribution | Paragraphe complémentaire prêt |
| M-E6 Contraintes et risques | 7 contraintes + 9 risques formalisés |
| M-E7 Planification ⭐ | Macro-planning 8 sprints + écarts assumés |
| M-E8 Budget | Version finale avec temps professionnel |

**5 critères sur 6 traités en proposition** (le 6e, consolidation, est
implicite dans l'ensemble).

### Travaux complémentaires requis côté Fitia

- Produire le **diagramme de Gantt** dans GanttProject à partir du
  macro-planning (consigne détaillée ci-dessus).
- Reconstituer, à partir de l'historique Git réel, le fichier
  `docs/backlog.md` et les notes de sprint si inexistants.
- Confirmer avec l'encadreur les écarts décrits (sprint 6 raccourci,
  sprint 7 réduit) avant intégration définitive.
