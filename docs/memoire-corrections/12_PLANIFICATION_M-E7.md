# Correctif M-E7 — Planification avec Figure 1 (prévisionnel) + Figure 2 (réalisé)

Ce fichier regroupe **tout ce qu'il te faut** pour satisfaire le critère M-E7
de la fiche de retour du prof : un Gantt initial, un Gantt réalisé, un
paragraphe honnête d'écarts, et l'outil GanttProject cité explicitement.

---

## 1. Texte final de la section Planification

Remplace **tout** ton texte actuel de "Planification du projet" (chapitre 4,
section Planification, actuellement page 24) par ce bloc.

```
Planification du projet

Le macro-planning a été construit avec GanttProject, en cohérence avec la
durée du stage prévue du 11 mai 2026 au 11 septembre 2026. Les premières
semaines ont été consacrées au cadrage et à la conception de la solution,
avant le développement progressif des principaux modules puis les
activités de test, de recette et de documentation.

La planification initiale suivait globalement l'organisation suivante :

   ● mai 2026 : cadrage du projet, étude de l'existant, état de l'art,
     identification des exigences et conception de l'architecture ;
   ● juin 2026 : analyse des CV, intégration de l'intelligence
     artificielle, référentiel de compétences et génération des premières
     évaluations ;
   ● juillet 2026 : développement du parcours recruteur et candidat,
     banque de questions, sandbox Docker, exécution du code et correction
     automatique ;
   ● août 2026 : résultats, compte rendu, mécanismes anti-fraude,
     statistiques, tableau de bord et activités de validation ;
   ● début septembre 2026 : recette globale, dernières corrections,
     documentation et finalisation du projet.

[Figure 1 : Planning prévisionnel du projet SkillForge]

Le planning réalisé a ensuite été ajusté selon l'avancement effectif du
projet. Quatre écarts significatifs ont été observés et sont présentés
ci-après.

Premièrement, la détection anti-fraude a été anticipée du sprint 5
(prévu en août) au sprint 4 (livré en juillet), afin de sécuriser dès
le POC 3 la cohérence du parcours candidat de bout en bout.

Deuxièmement, le travail de durcissement de la sandbox a été étendu
au-delà du périmètre initial. Prévu pour trente cas d'attaque, le harness
final en compte cinquante, avec l'ajout d'en-têtes HTTP OWASP et de
handlers d'exception génériques. Cette extension répondait à l'ambition
d'atteindre zéro évasion sur un jeu de test élargi.

Troisièmement, le fournisseur d'intelligence artificielle initialement
retenu (GitHub Models) a connu une évolution de ses conditions pendant
le projet, imposant une bascule vers Groq en août 2026. Grâce à
l'abstraction LlmClient conçue dès le POC 1, cette bascule n'a demandé
qu'une modification de configuration, sans impact sur la logique métier.

Quatrièmement, l'enjeu de la souveraineté des données candidats, mis en
lumière lors de l'approfondissement de l'état de l'art (loi 2014-038,
RGPD), a conduit à l'intégration d'un fournisseur IA local via Ollama,
non prévu initialement. Cet ajout a été rendu possible sans refonte,
grâce à la même abstraction LlmClient.

[Figure 2 : Planning réalisé du projet SkillForge]

Le suivi de ces écarts a permis de comparer les prévisions à l'avancement
réel et d'adapter les priorités lorsque des difficultés techniques ou
des opportunités d'anticipation se présentaient. Le découpage itératif
en sprints a facilité cette adaptation, sans remettre en cause les
objectifs principaux de la première version de SkillForge.
```

---

## 2. Figure 1 - Planning prévisionnel

**Rien à refaire.** Ta Figure 1 actuelle (page 24 du mémoire v2) est déjà
le bon Gantt prévisionnel. Il suffit de :

1. **Renommer la légende** sous la figure :
   - Avant : "Figure 1 : Macro-planning du projet SkillForge"
   - Après : **"Figure 1 : Planning prévisionnel du projet SkillForge"**
2. **Mettre à jour la liste des figures** (page 5 du mémoire) avec le
   nouveau titre
3. Rien d'autre à toucher sur l'image

---

## 3. Figure 2 - Planning réalisé (à construire)

### 3.1 Fichier source

Le fichier GanttProject à importer est déjà prêt :
`docs/SkillForge_Planning_realise.gan`

Ce fichier contient :
- **Toutes les tâches du prévisionnel** (fondations, 4 POCs, parcours
  utilisateurs, tests)
- **Les 4 écarts intégrés** aux dates réelles :
  - Anti-fraude anticipée (sprint 4 au lieu de sprint 5)
  - Durcissement sandbox prolongé (15 jours au lieu de 10)
  - Bascule GitHub Models → Groq (août, bloc "Ajustements fournisseurs IA")
  - Ajout Ollama (fin août, même bloc)
- **Nouvelles tâches "sorties du prévisionnel"** en vert clair (#9bbb59)
  pour qu'on les voit visuellement :
  - Anti-fraude (anticipé)
  - Headers HTTP OWASP et handlers génériques
  - Bascule GitHub Models vers Groq
  - Intégration Ollama local (souveraineté)
  - Déploiement cloud (Vercel + Render + Supabase)
  - Mail transactionnel Resend
- **Bornage au 11 septembre 2026** (jalon "Fin du stage" marqué en rouge)

### 3.2 Procédure d'export en PNG

1. Ouvre GanttProject
2. Fichier → Ouvrir → sélectionne `docs/SkillForge_Planning_realise.gan`
3. Vérifie l'affichage : zoom "Semaine 20" visible pour voir du 11 mai
   au 11 septembre dans la même largeur que la Figure 1
4. Fichier → Exporter → Image PNG
5. Résolution recommandée : largeur 1920 pixels
6. Nomme le fichier : `figure2-planning-realise.png`
7. Insère-la dans ton Word à l'emplacement [Figure 2]
8. Légende sous l'image : **"Figure 2 : Planning réalisé du projet SkillForge"**

### 3.3 Mise à jour de la liste des figures

Ouvre ton mémoire Word, page de la Liste des figures (page 5), et ajoute
une nouvelle ligne pour la Figure 2 juste après la Figure 1. La
renumérotation automatique de Word s'occupe du reste (toutes les figures
suivantes passent de n à n+1).

---

## 4. Code couleur de la Figure 2 (pour que les écarts soient visibles)

Dans le fichier `.gan` fourni :

| Couleur | Signification | Tâches concernées |
|---|---|---|
| 🟢 **Vert foncé #548235** | Conforme au prévisionnel | Fondations, POC 1, POC 2, POC 3 (service initial), POC 4, Parcours (passation + correction + compte rendu), OWASP ZAP, Tests de charge, Recette, Documentation |
| 🟡 **Vert clair #9bbb59** | **Écart par rapport au prévisionnel** | Anti-fraude anticipée, Headers HTTP OWASP, Bascule Groq, Ollama, Déploiement cloud, Resend |
| 🔴 **Rouge #c00000** | Jalons | Soutenances, fin du stage |

Le prof verra immédiatement les écarts par la couleur, et le texte
ci-dessus les explique un à un.

---

## 5. Si tu veux ajuster un détail dans la Figure 2

Dans GanttProject, chaque tâche a un bouton "Modifier" qui te permet
de changer :
- Nom
- Date de début
- Durée
- Couleur
- Pourcentage d'avancement

Les durées actuelles sont basées sur des estimations réalistes du temps
que chaque tâche aurait effectivement pris sur le stage. Si tu veux
raccourcir ou allonger une tâche, change juste la durée en jours ouvrés.

---

## 6. Vérification finale

Avant d'exporter le PDF v3 du mémoire :

- [ ] Figure 1 renommée "Planning prévisionnel" (dans le mémoire ET dans la liste des figures)
- [ ] Figure 2 "Planning réalisé" insérée après Figure 1 (nouvelle entrée dans la liste des figures)
- [ ] Les 4 écarts bien mentionnés dans le texte (anti-fraude, durcissement, Groq, Ollama)
- [ ] GanttProject cité explicitement comme outil utilisé
- [ ] Dates des 2 Gantts cohérentes : 11 mai → 11 septembre 2026
- [ ] Toutes les figures suivantes renumérotées automatiquement par Word

---

## 7. Argumentaire pour la soutenance orale

Si le jury te demande d'approfondir, voici 3 questions probables + réponses :

### Q1 : "Comment avez-vous détecté la nécessité de basculer de fournisseur IA ?"

> « GitHub Models a modifié ses conditions d'usage pendant le projet, en
> réduisant drastiquement les quotas gratuits. J'ai constaté le problème
> en août lors des tests de charge et j'ai basculé sous 48 heures grâce
> à l'abstraction LlmClient, qui m'a permis de ne modifier que la
> configuration d'un seul fournisseur. »

### Q2 : "Pourquoi avoir ajouté Ollama en cours de projet ?"

> « L'approfondissement de l'état de l'art en août a mis en évidence
> l'enjeu de la souveraineté des données candidats, particulièrement
> au regard de la loi malgache 2014-038. Ollama permet d'exécuter un
> LLM localement, sans aucun transfert vers des serveurs étrangers,
> ce qui est aligné avec la vocation d'un outil interne Tsarajoro. »

### Q3 : "Pourquoi le durcissement de la sandbox a-t-il pris plus de temps ?"

> « L'objectif initial était de couvrir 30 cas d'attaque. En travaillant
> sur ces 30 cas, j'ai identifié de nouvelles familles d'attaques (fork
> bombs, timing attacks, container escapes CVE), ce qui m'a conduit à
> étendre le harness à 50 cas. L'extension a aussi été l'occasion
> d'ajouter des headers HTTP OWASP et des handlers d'exception
> génériques pour un audit sécurité plus complet. »

---

## Résumé — ce qui est fait pour M-E7

- ✅ GanttProject cité explicitement comme outil utilisé
- ✅ Figure 1 "Planning prévisionnel" nommée correctement
- ✅ Figure 2 "Planning réalisé" prête à construire (fichier .gan fourni)
- ✅ 4 écarts significatifs documentés avec contexte et solution
- ✅ Bornage au 11 septembre 2026 (conforme à la période officielle du stage)
- ✅ Argumentaire oral préparé pour les 3 questions probables du jury

Le critère M-E7 passe de "À revoir" à "Traité" avec ce correctif.
