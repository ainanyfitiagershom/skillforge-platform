# Fiche d'améliorations — Chapitres 1 à 5.3.1 déjà rédigés dans MEMOIRE-itu-MBDS-v1.docx

**Objectif du document :** ne pas modifier ton mémoire à ta place, mais te lister honnêtement ce qui peut être amélioré dans ce que tu as déjà rédigé, avec pour chaque point une **suggestion concrète** de réécriture ou d'ajustement. Tu tranches ce que tu retiens ou pas.

**Base d'analyse :** relecture du fichier `MEMOIRE M2/MEMOIRE-itu-MBDS-v1-rediger-par-fitia.docx (1).pdf` daté du 15 septembre 2026 (56 pages).

**Verdict général :** le mémoire est **correct**, pas parfait. Le style est humain, cohérent, sans les gros tics IA classiques ("en effet" à chaque ligne, "premièrement/deuxièmement", "cependant" en pilotage automatique). La structure suit le plan-type MBDS. Les remarques ci-dessous portent sur des détails de rédaction et sur quelques points où le contenu peut être renforcé pour un jury M2.

**Légende :**
- 🔴 = à corriger (fautif, incohérent, contraire à une consigne du prof)
- 🟠 = à améliorer (fonctionnel mais gagnerait à être renforcé)
- 🟡 = suggestion (à prendre ou à laisser, préférence perso)

---

## 0. Style général — remarques transverses

### 🟠 « Cette approche permet de… »

Cette tournure revient un peu trop souvent (résumé, 1.1, 3.1.1, 4.1.5 au moins). Elle est correcte mais devient un tic. Elle sonne un peu IA-manuel à la longue.

**Suggestion :** varier avec « Cette organisation… », « Ce fonctionnement… », « Ce choix… », « Grâce à cela… », ou simplement supprimer la phrase quand elle n'ajoute rien.

### 🟠 « notamment » et « également »

Utilisés à bonne dose mais on les retrouve souvent 2-3 fois par page. Certains sont supprimables sans perte de sens.

**Suggestion :** en relecture, garde-en un sur deux. Le reste peut souvent sauter.

### 🟡 Adverbes de renforcement

« principalement », « également », « progressivement », « ainsi » reviennent régulièrement. Ce n'est pas grave, mais un jury attentif peut le remarquer.

---

## 1. Présentation du stage

### 🟠 1.2 — Le caractère innovant est présenté mais peu argumenté

Ton texte dit *« Le caractère innovant du projet repose principalement sur la personnalisation de l'évaluation grâce à l'intelligence artificielle. »* — c'est une affirmation, pas une démonstration. Le plan-type demande explicitement une **justification du caractère innovant**.

**Suggestion :** ajouter une ou deux phrases qui montrent que ce niveau d'intégration IA + validation humaine + sandbox durcie n'existe dans aucune des plateformes du marché étudiées au chapitre 2. Renvoyer explicitement au tableau comparatif du chapitre 2.3.

**Exemple de phrase à ajouter :** *« Le tableau comparatif présenté au chapitre 2.3 montre qu'aucune des quatre plateformes étudiées ne combine à la fois l'analyse automatique du CV pour piloter la génération, une sandbox durcie hébergée en interne et un référentiel de compétences propre à l'entreprise. C'est cette combinaison qui fait la singularité de SkillForge. »*

### 🟡 1.2 — Enjeux et risques listés mais dispersés

Le plan-type demande *« mise en avant de la criticité éventuelle du projet, des principaux enjeux et principaux risques »*. Chez toi, ces éléments sont éparpillés dans les paragraphes, sans être regroupés.

**Suggestion :** finir 1.2 par un petit paragraphe court, style *« Les principaux enjeux du projet sont donc la qualité des contenus IA, la sécurité de l'exécution du code candidat, la protection des données personnelles et la conservation du contrôle humain. Le plan de risques associé est présenté en détail au chapitre 4.2. »*

---

## 2. État de l'art

### 🟠 2.2 — Étude de chaque solution un peu courte

Chaque plateforme (HackerRank, Codility, TestGorilla, CoderPad) fait 3-4 lignes. Pour un jury M2, c'est un peu léger, surtout que l'état de l'art est un des chapitres où on juge la profondeur de recherche de l'étudiant.

**Suggestion :** allonger chaque paragraphe à 6-8 lignes en ajoutant, pour chaque plateforme :
- son positionnement de marché (grands comptes / PME / freelances)
- une force distinctive (par exemple, la banque d'exercices très large de HackerRank, l'environnement de collaboration temps réel de CoderPad)
- une limite qui explique pourquoi Tsarajoro ne l'a pas retenue

### 🔴 2.2 — Aucune source citée pour les affirmations

Tu écris *« HackerRank est spécialisé dans l'évaluation des compétences techniques »*, *« Il propose des exercices de programmation, des QCM, des entretiens techniques »*, etc. — puis à la fin de chaque paragraphe tu mets une référence [1], [2], etc.

**C'est bien** que tu cites, mais tu ne renvoies vers le site officiel du produit. Le prof Gabriel Mopolo insiste dans ses remarques (`RemarquesGabriel_Sur_les_rapports_de_stages_et_tpt.pdf`) sur la nécessité de sources tierces (comparatifs G2, Gartner, articles indépendants) pour être crédible.

**Suggestion :** compléter la bibliographie avec 2 ou 3 sources tierces :
- G2 : *HackerRank vs Codility Comparison*
- Selecthub : *Best Technical Assessment Tools 2026*
- iMocha : *Top Codility Alternatives 2026*

Ces sources donnent une lecture plus objective que les sites officiels des éditeurs.

### 🟡 2.3 — Le tableau comparatif ne montre pas assez SkillForge

Dans ta dernière colonne, tu mets des valeurs comme *« Analyse CV + génération »*, *« Solution interne »*, etc. C'est correct mais un peu bref.

**Suggestion :** rendre la colonne SkillForge plus détaillée que les autres, pour souligner ce qui te distingue. Par exemple :
- Personnalisation : *« CV analysé automatiquement + profil recherché »*
- IA & automatisation : *« Analyse CV + génération de questions + correction cas pratiques »*
- Sandbox : *« Docker durci — 0 évasion / 50 attaques »*
- Coût : *« Solution interne, LLM configurables gratuits »*

Cela met en relief ta contribution sans que tu aies besoin de le dire dans le texte.

---

## 3. Étude de l'existant et solution envisagée

### 🟢 Rien à redire de significatif

Cette partie est bien structurée. La critique de l'existant est équilibrée (points positifs puis limites), et les trois solutions envisagées sont clairement distinguées, avec une justification du choix retenu.

### 🟡 3.4 — Liste des livrables peu spécifique

Tu listes *« une application web destinée aux recruteurs »*, *« une interface candidat »*, *« un backend développé avec Spring Boot »*, etc. C'est correct mais générique.

**Suggestion :** pour chaque livrable, ajouter une précision qui rend le livrable identifiable :
- *« une application web destinée aux recruteurs, développée en React 19 et TypeScript »*
- *« un backend développé avec Spring Boot 3.4 exposant les API nécessaires »*
- *« un service sandbox séparé pour l'exécution sécurisée du code, avec durcissement Docker validé par un jeu de tests dédié »*

Cela donne du poids à la liste.

---

## 4. Démarche projet

### 🟠 4.1.4 — La liste des 10 outils est très longue

Tu décris Visual Studio Code, GitHub Projects, Git et GitHub, GitHub Actions, Docker, PostgreSQL, Spring Boot, React, TypeScript, Vite, Tailwind, shadcn/ui, JUnit 5, OWASP ZAP, k6, Mermaid et UML — soit **17 outils** décrits chacun sur 4-5 lignes. C'est beaucoup, et certaines descriptions (React, TypeScript) sont assez génériques.

**Suggestion :** réduire à **8-10 outils vraiment structurants** et regrouper les autres :
- Un paragraphe *« Environnement de développement »* : VSCode + terminal intégré
- Un paragraphe *« Versionnement et suivi »* : Git, GitHub, GitHub Projects, GitHub Actions
- Un paragraphe *« Runtime »* : Docker, PostgreSQL, Spring Boot 3, Node 20
- Un paragraphe *« Frontend »* : React 19, TypeScript, Vite, Tailwind, shadcn/ui
- Un paragraphe *« Qualité et sécurité »* : JUnit 5, Testcontainers, OWASP ZAP, k6

Tu gagnes en densité, tu perds en pages inutiles, et le jury voit mieux la cohérence de la stack.

### 🟡 4.1.4 — Pas de mention IntelliJ IDEA

Tu ne cites que VSCode, alors que la majorité des développeurs Java Spring Boot travaillent sous IntelliJ IDEA. Si tu utilises VSCode pour tout, garde-le mais explique pourquoi (par exemple : monorepo backend + frontend + docs dans un même workspace).

### 🟠 4.2 — Le tableau des 7 risques est solide

Le contenu est bon (R1 à R7 bien identifiés, statut concret). Deux remarques :

**🟠 Cellule R2 « Moyenne » scindée** : dans le PDF ta cellule affiche « Moyenn e » — c'est un problème de rendu, mais qui reste visible. À vérifier dans le Word.

**🟡 Ajouter un risque R8 sur les modèles IA** : *« Retrait ou dégradation d'un fournisseur LLM externe »* avec facteur contribuant *« Politique unilatérale du fournisseur (GitHub Models retiré, Groq rate-limit, modèles renommés) »* et solution *« Architecture multi-fournisseur avec bascule par variable d'environnement — cas réel du stage »*. Ce risque a été rencontré en pratique et sa gestion est un des points forts du projet.

### 🟠 4.3 — Le découpage 8 sprints est bon

Tableau clair, colonnes bien choisies. Deux points :

**🟡 Ajouter une colonne « Livrables clés »** avec pour chaque sprint 1-2 livrables identifiables (par exemple S4 : *« Interface candidat + service sandbox durci »*).

**🟠 Section « Suivi et pilotage du projet »** : la phrase *« [INSÉRER ICI UNE CAPTURE D'ÉCRAN RÉELLE DE TON GITHUB PROJECTS] »* est un rappel à toi-même resté visible. À supprimer avant dépôt.

### 🟠 4.3 — Section « Vélocité »

Tu écris *« Aucun chiffre artificiel n'est donc présenté dans ce mémoire. »* — c'est honnête et j'apprécie, mais dit ainsi c'est presque un aveu de faiblesse.

**Suggestion :** reformuler positivement, par exemple : *« La vélocité n'a pas été chiffrée finement au cours du projet. Le suivi s'est fait par tâches terminées dans GitHub Projects, ce qui a suffi pour piloter les priorités à l'échelle d'un projet mené en solo. »*

### 🟠 4.4 — Planification : blocs vraiment date-time

Tu donnes les dates *11 mai – 22 mai*, *25 mai – 5 juin*, etc. C'est très bien, cela rend le planning crédible. Assure-toi que le diagramme de Gantt inséré à côté reprend exactement ces dates.

### 🟡 4.5 — Budget

Bien traité, pas de chiffre inventé. Une petite précision utile : *« Le coût des appels aux modèles de langage a été maintenu sous cinq euros au total, grâce à l'utilisation prioritaire des fournisseurs disposant d'un free tier généreux (Groq, puis Google Gemini). »*

---

## 5. Exigences réalisées dans le projet

### 🟢 5.1 — Tableau des 14 cas d'utilisation + diagramme use-case

Excellente base. Ce tableau et le diagramme sont exactement ce que le plan-type attend. Aucune remarque.

### 🟠 5.1.1 à 5.1.4 — Cas détaillés un peu génériques

Les quatre cas détaillés (Analyser CV, Générer test, Passation candidat, Consultation résultats) sont corrects mais restent à un niveau descriptif. Le plan-type demande aussi les **cas d'erreur** et les **règles métier** de chaque cas.

**Suggestion :** pour chaque cas, ajouter un petit encadré ou une phrase :

**5.1.1 (Analyser CV) — cas d'erreur :** *« Fichier de format non supporté : le recruteur reçoit un message clair et peut réessayer avec un autre fichier. Indisponibilité temporaire du service IA : l'analyse peut être relancée sans perte de la sélection précédente. »*

**5.1.2 (Générer test) — règle métier :** *« Toute question générée par l'IA passe obligatoirement en statut PENDING_REVIEW. Aucune question ne peut être envoyée au candidat sans avoir été explicitement approuvée par le recruteur. »*

**5.1.3 (Passation candidat) — cas d'erreur :** *« Lien inconnu, expiré ou déjà utilisé : réponse HTTP 410 uniforme pour ne pas exposer l'existence des tokens valides. Cinq codes d'accès erronés d'affilée : blocage temporaire de quinze minutes pour l'invitation concernée. »*

**5.1.4 (Consultation résultats) — règle métier :** *« La recommandation produite par le compte rendu (HIRE, INTERVIEW, REJECT) n'est qu'une aide à la décision. La décision finale reste à la charge du recruteur, qui peut passer outre la recommandation à tout moment. »*

Ces précisions ancrent le mémoire dans la réalité opérationnelle du produit et impressionnent un jury.

### 🟠 5.2 — Tableau des exigences non fonctionnelles

Le tableau est bien mais gagnerait à afficher les valeurs numériques plus systématiquement. Actuellement :
- *Performance — Analyse d'un CV en moins de 15 s → Environ 5 à 10 s avec Groq* ✅ bien
- *Performance — Exécution du code en moins de 5 s → Médiane mesurée : 330 ms* ✅ bien
- *Sécurité — Isolation du code candidat → 0 évasion sur 50 attaques testées* ✅ bien
- *Sécurité — Contrôle des vulnérabilités web → Audit réalisé avec OWASP ZAP* 🟠 imprécis
- *Protection des données — Consentement avant la passation → Réalisé* 🟠 très générique
- *Évolutivité — Plusieurs fournisseurs de modèles de langage → Réalisé* 🟠 dommage

**Suggestion :** remplacer les *« Réalisé »* vagues par des mesures concrètes :
- *« Zéro vulnérabilité High, Medium ou Low après onze itérations d'audit ZAP »*
- *« Consentement obligatoire coché à l'ouverture de l'invitation, refus = blocage du démarrage »*
- *« Six fournisseurs interchangeables par variable d'environnement : mock, OpenAI, Anthropic, Groq, Gemini, Ollama »*

Ces valeurs sont ta preuve mesurable. Ne les cache pas dans un « Réalisé ».

### 🟠 5.3.1 — IHM : les captures sont là mais mal légendées

Tes captures sont bien intégrées (interface création test, validation questions, passation, résultats). Deux points :

**🔴 Les figures sont toutes numérotées « Figure X »**. À remplacer par les vrais numéros (Figure 2, 3, 4, 5) avant dépôt.

**🟡 Les légendes sont un peu sèches** : *« Interface de création d'une évaluation et d'analyse du CV »*. Le plan-type demande une phrase introductive + description du fonctionnement.

**Suggestion pour la légende de la figure de l'interface Nouveau test :** *« Figure 2 — Interface de création d'un test. Le recruteur choisit le profil cible, saisit l'identité du candidat, téléverse le CV puis lance l'analyse. Les compétences détectées apparaissent en badge, avec le niveau estimé et l'indication du fournisseur IA utilisé (openai · 1041 tokens · 0.0805205 EUR sur la capture). »*

**🟡 Ajouter une capture manquante : le tableau de bord analytique du recruteur**. Actuellement tu montres la page « Performances des candidats » mais pas le tableau de bord avec les indicateurs statistiques (pouvoir discriminant, indice de difficulté). Or c'est un élément clé du projet.

---

## Récapitulatif priorisé

| Priorité | Section | Action |
|---|---|---|
| 🔴 Haut | 2.2 | Ajouter 2-3 sources tierces (G2, Selecthub, iMocha) à la bibliographie |
| 🔴 Haut | 5.3.1 | Remplacer les « Figure X » par les vrais numéros |
| 🔴 Moyen | 4.3 | Supprimer les « [INSÉRER ICI...] » restants avant dépôt |
| 🟠 Haut | 1.2 | Ajouter un paragraphe qui justifie explicitement le caractère innovant en renvoyant au tableau 2.3 |
| 🟠 Haut | 5.1.1-5.1.4 | Ajouter cas d'erreur + règle métier à chaque cas détaillé |
| 🟠 Haut | 5.2 | Remplacer les « Réalisé » vagues par des mesures concrètes |
| 🟠 Moyen | 2.2 | Allonger chaque plateforme de 3-4 à 6-8 lignes |
| 🟠 Moyen | 2.3 | Enrichir la colonne SkillForge avec des chiffres |
| 🟠 Moyen | 4.1.4 | Réduire de 17 à 8-10 outils, regroupés par famille |
| 🟠 Moyen | 4.2 | Corriger le rendu « Moyenn e » de la cellule R2 et ajouter R8 (fournisseur LLM) |
| 🟡 Bas | 3.4 | Ajouter une précision technique par livrable |
| 🟡 Bas | 4.3 | Ajouter colonne « Livrables clés » au tableau des sprints |
| 🟡 Bas | 5.3.1 | Ajouter une capture du tableau de bord analytique |

---

*Fiche produite le 2026-09-15 après relecture complète du fichier PDF exporté du .docx. Les remarques portent uniquement sur le contenu déjà rédigé (chapitres 1 à 5.3.1). Les chapitres 5.3.2 à 11 restants à rédiger sont livrés dans le fichier docs/MEMOIRE_REDIGE.md.*
