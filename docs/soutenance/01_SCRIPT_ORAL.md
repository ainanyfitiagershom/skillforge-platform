# Script oral — Soutenance M2 MBDS SkillForge

Durée cible : **20 minutes** exposé + 10 minutes questions.
Répartition : **~11 minutes de parole sur les slides + 8 à 10 minutes de vidéo démo**.

Règles générales pour l'oral :
- Parler lentement, respirer entre les phrases
- Regarder le jury, pas les slides
- Ne pas lire mot pour mot ce qui est écrit
- Signaler les transitions (« passons maintenant à... », « c'est ce qui nous amène à... »)

---

## Slide 1 — Couverture (30 secondes)

*Se placer face au jury, sourire, attendre l'attention.*

> Monsieur le Président du jury, Mesdames et Messieurs les membres du jury, bonjour.
>
> Je vous remercie de me donner la parole pour vous présenter mon mémoire de fin d'études en Master 2 MBDS.
>
> Je m'appelle GERSHOM Ny Aina Fitia, et je vais vous présenter aujourd'hui **SkillForge**, une plateforme nouvelle génération de recrutement technique entièrement assistée par intelligence artificielle, du CV au verdict.

*Passer au slide suivant.*

---

## Slide 2 — Plan (30 secondes)

> Ma présentation s'organise en huit temps.
>
> Nous commencerons par le **contexte** du recrutement technique aujourd'hui, puis nous verrons **l'existant** sur le marché et la **solution** proposée.
>
> Je détaillerai ensuite les **objectifs** du projet, la **gestion de projet** mise en place, la **réalisation** technique, avant une **démonstration vidéo** de la plateforme.
>
> Enfin, je présenterai les **résultats** obtenus et je conclurai par le **bilan** du stage et ses perspectives.

*Enchaîner directement.*

---

## Slide 3 — Contexte : le recrutement technique aujourd'hui (1 min 30)

*Poser un chiffre à la fois, laisser le jury absorber.*

> Le recrutement technique traverse une crise silencieuse, que quatre chiffres résument bien.
>
> **[Pointer le 30 min]** En moyenne, un recruteur passe **30 minutes** sur chaque CV, à trier à la main, au risque de laisser passer un bon profil ou de retenir un mauvais.
>
> **[Pointer le 70 %]** Une fois les entretiens techniques réalisés, on estime que **70 % des évaluations biaisent le verdict final**, parce qu'elles reposent sur des outils rigides qui reflètent mal les compétences réelles.
>
> **[Pointer le 1 sur 3]** Depuis la démocratisation de l'IA générative, **un candidat sur trois** utilise une aide extérieure sur les tests non surveillés, rendant la fraude quasi invisible.
>
> **[Pointer le 1 sur 2]** Et au final, **un recrutement technique sur deux est regretté dans l'année**, soit parce que le candidat quitte l'entreprise, soit parce que ses compétences réelles ne correspondent pas à ce qui était annoncé.
>
> Le constat est simple : le processus actuel est **lent, peu fiable, vulnérable et globalement décevant**. C'est pour répondre à ces quatre défis que SkillForge a été conçu.

*Transition.*

---

## Slides 4 et 5 — Solutions existantes sur le marché (1 min 30, cumulé)

*Sur la première moitié (HackerRank + Codility) :*

> Le marché du recrutement technique compte déjà plusieurs acteurs bien établis.
>
> **HackerRank** est le leader mondial, avec une banque de tests très étendue et une forte communauté. Ses limites : un coût élevé, une faible personnalisation, et l'hébergement des données à l'étranger — un problème pour Tsarajoro et le contexte malgache.
>
> **Codility** est reconnu pour ses tests d'algorithmique et son détecteur de plagiat. Mais il reste focalisé sur le code pur, avec peu de QCM et une expérience candidat austère.

*Passer au slide 5.*

> **CoderPad** propose du pair programming en direct, dans un IDE partagé. Très utile pour l'entretien synchrone, mais sans scoring automatique.
>
> **TestGorilla** offre une bibliothèque très large de tests généralistes, y compris sur les soft skills. Mais sa profondeur sur le code est faible : c'est un outil orienté profils non techniques.
>
> Aucune de ces solutions ne combine à la fois **analyse de CV par IA, génération adaptative, sandbox sécurisée, verdict explicable et souveraineté des données**. C'est précisément le vide que SkillForge vient combler.

*Transition.*

---

## Slide 6 — Tsarajoro et la mission du stage (1 min)

> Le stage s'est déroulé au sein de **Tsarajoro**, une entreprise du numérique basée à Antananarivo, active dans le développement web, WordPress, le netlinking et la production de contenus numériques.
>
> Tsarajoro développe également ses propres solutions internes lorsque le besoin le justifie, ce qui a rendu possible ce projet.
>
> **La mission qui m'a été confiée** est de concevoir et développer SkillForge : une plateforme interne de recrutement technique assistée par IA, pour accompagner Tsarajoro dans ses propres recrutements de profils techniques, du CV jusqu'au verdict final.
>
> Le stage s'est déroulé sur **4 mois, de mai à septembre 2026**, sous l'encadrement de Monsieur RAVELOMANANTIANA Tahirintsoa Ulrich.

*Transition.*

---

## Slide 7 — Quatre objectifs mesurables (1 min)

> La mission se décline en **quatre objectifs concrets**, chacun associé à un indicateur mesurable.
>
> **[Pointer objectif 1]** Analyser automatiquement les CV grâce à l'IA, en moins de 30 secondes par CV.
>
> **[Pointer objectif 2]** Générer des évaluations adaptées au profil du candidat, avec trois types de questions : QCM, exercices de code, cas pratiques.
>
> **[Pointer objectif 3]** Sécuriser l'exécution du code candidat dans une sandbox durcie, avec l'objectif de résister à toutes les tentatives d'évasion connues.
>
> **[Pointer objectif 4]** Produire un verdict explicable pour le recruteur : un score global, les forces et faiblesses du candidat, et une recommandation.
>
> Chaque objectif a été validé à la clôture du projet, je reviendrai sur les chiffres exacts dans la partie résultats.

*Transition.*

---

## Slide 8 — Gestion de projet Scrum (45 s)

> Le projet a été mené en **Scrum**, sur sept sprints de deux semaines, chacun associé à un livrable clair.
>
> Les fondations d'abord — cahier des charges, architecture, UML. Puis les **quatre preuves de concept** qui structurent le projet : l'analyse de CV par IA, la génération de tests, la sandbox durcie, et enfin les statistiques. Enfin, une phase de tests, de sécurisation et de livraison.
>
> Les outils utilisés : GitHub pour le code, Docker pour l'environnement, GanttProject pour le suivi, DBeaver pour la base de données.
>
> L'équipe : moi-même en développement, un encadreur professionnel côté Tsarajoro, avec des revues bi-hebdomadaires.

*Transition.*

---

## Slide 9 — Architecture logicielle (1 min 15)

> Sur le plan technique, SkillForge repose sur une **architecture trois tiers**, avec **trois composants isolés** pour la défense en profondeur.
>
> **[Pointer le frontend]** Un frontend web développé en **React 19 avec TypeScript et Vite**, utilisé par le recruteur et par le candidat.
>
> **[Pointer le backend applicatif]** Un backend applicatif en **Spring Boot 3 sur Java 21**, qui centralise la logique métier, l'authentification, l'accès aux données et les appels à l'IA.
>
> **[Pointer la base]** Une base de données **PostgreSQL 16**, versionnée par sept migrations Flyway.
>
> **[Pointer la sandbox]** Un service **backend-sandbox** totalement séparé, qui exécute le code du candidat dans un conteneur Docker isolé. C'est un point de sécurité majeur.
>
> **[Pointer l'IA]** Et une couche d'abstraction pour l'intelligence artificielle, qui permet de basculer entre six fournisseurs IA sans modifier le code métier.
>
> Cette architecture nous a permis d'obtenir de la robustesse à plusieurs niveaux. J'y reviens dans les slides suivants.

*Transition.*

---

## Slide 10 — Pipeline IA : du CV au verdict (1 min)

> Le cœur fonctionnel de SkillForge se résume en **cinq étapes chaînées**, du CV au verdict.
>
> **[Étape 1]** **Analyser** : le CV est déposé, le texte extrait, et l'IA détecte les compétences du candidat.
>
> **[Étape 2]** **Générer** : à partir des compétences détectées et du poste recherché, l'IA génère des questions ciblées de trois types.
>
> **[Étape 3]** **Valider** : le recruteur relit et ajuste les questions avant de les envoyer. C'est un point essentiel : **l'IA propose, l'humain décide.**
>
> **[Étape 4]** **Passer** : le candidat reçoit une invitation par e-mail, se connecte, et compose dans un environnement sécurisé.
>
> **[Étape 5]** **Décider** : à la fin de l'évaluation, SkillForge produit un rapport avec un score global, les forces, les faiblesses et une recommandation.
>
> Ce pipeline garantit à la fois **rapidité** — quelques minutes de bout en bout — et **traçabilité** — chaque décision de l'IA reste validable par le recruteur.

*Transition.*

---

## Slide 11 — Sandbox durcie : sept verrous de sécurité (1 min)

> La sandbox est la brique où j'ai investi le plus d'efforts. Elle exécute le code du candidat, ce qui est potentiellement dangereux : imaginez un candidat qui tenterait de lire vos données ou d'attaquer votre serveur.
>
> J'ai mis en place **sept verrous de sécurité**, chacun bloquant une classe d'attaque différente : **seccomp** filtre les appels système, **cap-drop=ALL** retire toutes les capacités Linux, **network=none** coupe le réseau, **read-only rootfs** empêche toute modification du système de fichiers, **pids-limit** stoppe les fork bombs, **memory** plafonne la RAM, et l'exécution se fait sous un utilisateur **non-root**.
>
> J'ai ensuite construit un **harnais de tests** avec **50 scénarios d'attaque** différents. Résultat : **zéro évasion détectée**, et zéro vulnérabilité remontée par l'audit OWASP ZAP complet.
>
> Ce n'est pas une déclaration de sécurité, c'est une preuve empirique reproductible.

*Transition.*

---

## Slide 12 — Multi-LLM : six fournisseurs interchangeables (1 min)

> Un choix d'architecture m'a particulièrement marqué : **l'abstraction multi-fournisseurs IA**.
>
> Plutôt que de dépendre d'un fournisseur unique, j'ai introduit une interface appelée **LlmClient**, à laquelle six implémentations sont connectées : OpenAI, Groq, Google Gemini, Anthropic Claude, GitHub Models, et Ollama en local.
>
> Cette architecture a montré sa valeur en pratique. Pendant le stage, **GitHub Models a cessé d'être disponible pour les nouveaux comptes**. Grâce à l'abstraction, la bascule vers un autre fournisseur a été réalisée **en moins d'une heure**, uniquement par changement de configuration, sans aucune modification du code métier.
>
> Elle permet également d'envisager un fonctionnement **totalement local**, via Ollama, pour ne jamais transmettre les données candidats à un service externe.

*Transition — annoncer la vidéo.*

---

## Slide 13 — Démonstration (transition 20 secondes)

> Plutôt que de continuer à décrire SkillForge, je vous propose de voir la plateforme fonctionner **en conditions réelles**.
>
> La vidéo qui suit dure environ dix minutes. Vous y verrez un cas d'usage complet : de l'analyse d'un CV jusqu'à la consultation du rapport final.

*Lancer la vidéo. Rester silencieux pendant sa diffusion.*

**[VIDÉO : 8 à 10 minutes]**

*Après la vidéo, revenir face au jury.*

> Voilà pour la démonstration. Passons maintenant aux résultats mesurés.

---

## Slide 14 — Résultats fonctionnels (45 s)

> Sur les six objectifs annoncés au démarrage du projet, **cinq sont pleinement atteints à la clôture**.
>
> L'analyse de CV, la génération adaptative, la sandbox durcie, le verdict explicable et l'anti-fraude comportementale sont tous opérationnels et validés.
>
> Le seul objectif partiellement atteint est le **déploiement en production**, qui était planifié en sprint 8 mais qui sort du périmètre du stage. Il reste la prochaine étape naturelle du projet.

*Transition.*

---

## Slide 15 — Résultats mesurés (45 s)

> Côté chiffres, quatre résultats me semblent particulièrement importants.
>
> **[Pointer chaque KPI]** **Zéro évasion** détectée sur les cinquante scénarios d'attaque testés. **Zéro vulnérabilité** remontée par l'audit OWASP ZAP complet, tous niveaux. **Vingt candidats simultanés** validés en charge avec l'outil k6, sans aucune dégradation. Et cette **bascule fournisseur IA en moins d'une heure** dont je vous parlais tout à l'heure.
>
> Ces chiffres correspondent au périmètre des scénarios effectivement testés durant le stage.

*Transition.*

---

## Slide 16 — Difficultés rencontrées (1 min)

> Trois difficultés majeures ont marqué le projet, chacune résolue par une décision d'architecture.
>
> **Première difficulté** : le retrait de GitHub Models. Résolu par la bascule OpenAI en une heure, grâce à l'abstraction LlmClient. Preuve que l'investissement initial en abstraction paie.
>
> **Deuxième difficulté** : une incompatibilité découverte tard entre l'API Node Permission et Jest, qui faisait planter tous les tests JavaScript dans la sandbox. Résolu par cinq itérations successives sur le harnais.
>
> **Troisième difficulté** : les premières générations de l'IA produisaient des questions de qualité variable. Résolu par un renforcement des prompts, avec des règles strictes par type de question.
>
> Ces trois épisodes ont été **formateurs** : ils ont validé les choix d'architecture initiaux et enrichi ma compréhension des systèmes multi-composants.

*Transition finale.*

---

## Slide 17 — Apports, limites et perspectives (1 min 15)

> Je termine avec un bilan honnête, en trois blocs.
>
> **[Apports]** Côté apports, SkillForge est aujourd'hui une plateforme complète, testée et documentée. Environ 15 000 lignes de Java et 10 000 lignes de TypeScript. Une sandbox validée par un harnais reproductible. Une architecture multi-LLM prouvée en pratique. Une base réutilisable pour les prochains recrutements de Tsarajoro.
>
> **[Limites]** Côté limites, je suis transparent : la mise en production n'a pas été exécutée, la couverture des tests frontend reste à renforcer, le guide utilisateur reste à formaliser, et les tests de charge doivent aller au-delà de vingt candidats simultanés.
>
> **[Perspectives]** Côté perspectives, plusieurs axes s'ouvrent : le déploiement chez Tsarajoro, l'extension à d'autres langages comme Go ou Rust, l'intégration avec des ATS externes, et le développement d'une offre 100 % on-premise via Ollama pour les clients qui exigent la souveraineté totale.
>
> Ce projet m'a fait passer d'une posture de développeur à une posture d'ingénieur logiciel, en autonomie complète pendant quatre mois.
>
> Je vous remercie de votre attention et je suis à votre disposition pour vos questions.

*Marquer une pause, sourire, attendre les questions.*

---

## Récap timing (à respecter absolument)

| Slide | Durée cible | Cumul |
|---|---|---|
| 1 Couverture | 0:30 | 0:30 |
| 2 Plan | 0:30 | 1:00 |
| 3 Contexte KPI (4 chiffres) | 1:30 | 2:30 |
| 4-5 Existant | 1:30 | 3:45 |
| 6 Tsarajoro + mission | 1:00 | 4:45 |
| 7 Objectifs | 1:00 | 5:45 |
| 8 Gestion projet | 0:45 | 6:30 |
| 9 Architecture | 1:15 | 7:45 |
| 10 Pipeline IA | 1:00 | 8:45 |
| 11 Sandbox | 1:00 | 9:45 |
| 12 Multi-LLM | 1:00 | 10:45 |
| 13 Démo (transition) | 0:20 | 11:05 |
| **VIDÉO** | **8:00** | **19:05** |
| 14 Résultats fonctionnels | 0:45 | 19:50 |
| 15 Résultats mesurés | 0:45 | 20:35 → 20:35 |
| 16 Difficultés | 1:00 | 21:35 |
| 17 Bilan | 1:15 | 22:50 |

**Attention** : le total tourne autour de 22-23 minutes si la vidéo dépasse 8 min. Si la vidéo fait 10 min, il faut couper certains commentaires (voir "options d'ajustement" ci-dessous).

## Options d'ajustement si tu dépasses

Si tu vois qu'il te manque du temps :

- **Slide 4-5 existant** : parler d'un seul outil au lieu de deux par slide
- **Slide 11 sandbox** : citer que 3 verrous au lieu des 7 (« seccomp, cap-drop et network=none pour ne citer que les principaux »)
- **Slide 16 difficultés** : ne détailler qu'une seule difficulté au lieu de trois

Si tu as trop de temps :

- **Slide 15 KPI** : donner un exemple concret pour chaque chiffre
- **Slide 17 perspectives** : citer un exemple d'usage on-premise

## Points de vigilance à l'oral

**Ne PAS dire** :
- « Euh », « du coup », « voilà » (mots parasites)
- « Je pense que » (affirmer, ne pas hésiter)
- « C'est un petit projet » (jamais déprécier)
- « On » (dire « j'ai » ou « nous avons » selon le contexte)

**Toujours dire** :
- « J'ai choisi de... parce que... » (justifier les choix)
- « Le résultat mesuré est... » (chiffres précis)
- « Ce choix a été validé par... » (preuve empirique)
- « La prochaine étape serait... » (ouverture)

**Gestion du stress** :
- Respirer profondément avant de commencer
- Boire une gorgée d'eau si nécessaire (pas plus de 2 fois)
- Regarder les 3 membres du jury à tour de rôle
- Ne PAS lire les slides mot pour mot
