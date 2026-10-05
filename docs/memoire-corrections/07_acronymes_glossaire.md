# Table d'acronymes + Glossaire — contenus prets a coller dans le Word

Correctif M-A4 : le glossaire actuel du memoire v2 (p. 7-9) melange acronymes
et termes. Le prof demande deux tables distinctes.

Instructions d'integration dans le Word :

1. Remplacer la section actuelle "Glossaire" par **deux sections distinctes
   et consecutives** : d'abord "Acronymes", puis "Glossaire".
2. Les placer dans le meme emplacement (apres la Liste des tableaux et
   avant l'Introduction, dans le front matter non numerote).
3. Mettre en forme en tableau Word a deux colonnes : Acronyme | Signification
   pour la premiere, Terme | Definition pour la seconde.

---

## 1. Section "Acronymes" (nouvelle)

### Intitule a utiliser
```
Acronymes
```

### Phrase d'introduction (optionnelle, 1 ligne)
```
Les acronymes utilises dans le present memoire sont listes ci-dessous
par ordre alphabetique.
```

### Table a 2 colonnes

| Acronyme | Signification |
|---|---|
| **API** | Application Programming Interface (interface de programmation d'application) |
| **ASVS** | Application Security Verification Standard (standard OWASP de verification de la securite des applications) |
| **CSS** | Cascading Style Sheets (langage de mise en forme des pages web) |
| **CV** | Curriculum Vitae |
| **DOCX** | Document Office Open XML (format bureautique Microsoft Word) |
| **HTTP** | HyperText Transfer Protocol (protocole d'echange utilise sur le Web) |
| **IA** | Intelligence Artificielle |
| **IHM** | Interface Homme-Machine |
| **LLM** | Large Language Model (grand modele de langage) |
| **MBDS** | Master Business Intelligence, Big Data et Systemes |
| **MCD** | Modele Conceptuel de Donnees |
| **OWASP** | Open Worldwide Application Security Project (fondation dediee a la securite applicative) |
| **PDF** | Portable Document Format (format de document fixe d'Adobe) |
| **QCM** | Questionnaire a Choix Multiples |
| **REST** | REpresentational State Transfer (style d'architecture d'APIs web) |
| **RGPD** | Reglement General sur la Protection des Donnees (reglement UE 2016/679) |
| **SMTP** | Simple Mail Transfer Protocol (protocole d'envoi d'emails) |
| **SPA** | Single Page Application (application web monopage) |
| **SQL** | Structured Query Language (langage de requete relationnelle) |
| **UI** | User Interface (interface utilisateur, synonyme pratique d'IHM) |
| **UML** | Unified Modeling Language (langage de modelisation unifie) |
| **ZAP** | Zed Attack Proxy (outil OWASP de test de securite des applications web) |

**22 acronymes au total** — chacun apparait au moins une fois dans le corps
du memoire (verifie par grep sur le PDF v2 : API 15x, ASVS 1x, CSS 3x,
CV 54x, DOCX 1x, HTTP 4x, IA 20x, IHM 1x, LLM 3x, MBDS 3x, MCD 1x,
OWASP 15x, PDF 3x, QCM 7x, REST 7x, RGPD 2x, SMTP 1x, SPA 1x, SQL 2x,
UI 1x, UML 2x, ZAP 6x).

Les acronymes CRUD, CU, ENF, HTML, HTTPS, JPA, JSON, JWT, MLD, TLS, UCA,
US ont ete ecartes car **absents du mémoire v2** (zero occurrence au grep).
Les definir sans les utiliser risquait une remarque du prof.

---

## 2. Section "Glossaire" (reduite aux termes, hors acronymes)

### Intitule a utiliser
```
Glossaire
```

### Phrase d'introduction (optionnelle, 1 ligne)
```
Les termes techniques et metier utilises dans le present memoire sont
definis ci-dessous.
```

### Table a 2 colonnes

| Terme | Definition |
|---|---|
| **Anti-fraude** | Ensemble des mecanismes de SkillForge visant a detecter les comportements candidat suspects pendant une passation : perte de focus de la fenetre, collage de code depuis l'exterieur, reponses anormalement rapides. |
| **Backend** | Partie serveur d'une application, chargee des traitements metier, de l'acces aux donnees et de l'exposition des APIs. Dans SkillForge, il y a deux backends distincts : applicatif (Spring Boot) et sandbox (Spring Boot egalement). |
| **Backlog** | Liste priorisee des fonctionnalites a developper, structuree en user stories. Document vivant mis a jour a chaque sprint. |
| **Cas d'utilisation** | Scenario decrivant une interaction entre un acteur (utilisateur ou systeme externe) et le systeme etudie, visant un objectif metier. |
| **Docker** | Technologie de conteneurisation permettant d'isoler l'execution d'un processus (code candidat dans SkillForge) dans un environnement maitrise et jetable. |
| **Flyway** | Outil de gestion des migrations de schema PostgreSQL par scripts SQL versionnes (V1, V2...). Garantit la coherence du schema entre les environnements. |
| **Frontend** | Partie cliente d'une application, executee dans le navigateur de l'utilisateur. Pour SkillForge, developpee en React + TypeScript et servie par Vite. |
| **Mailpit** | Serveur SMTP de developpement qui capture les mails sortants sans les envoyer, pour les visualiser dans une interface web. |
| **Ollama** | Serveur local permettant d'executer des LLM open source (ex. qwen2.5:7b) directement sur l'infrastructure Tsarajoro, sans appel reseau externe. |
| **Passation** | Session d'evaluation d'un candidat sur SkillForge, de la saisie du code d'acces jusqu'a la soumission des reponses. |
| **React** | Bibliotheque JavaScript developpee par Meta pour construire des interfaces utilisateur a base de composants. Version 19 dans SkillForge. |
| **Sandbox** | Environnement isole dedie a l'execution controlee du code candidat, construit sur Docker avec des restrictions seccomp, cap-drop ALL et no-network. |
| **Scrum** | Methode Agile de gestion de projet organisee en sprints courts, avec backlog, rituels (planification, revue, retrospective) et roles definis (Product Owner, Scrum Master, developpeurs). |
| **Seccomp** | Mecanisme Linux (secure computing mode) permettant de restreindre les appels systeme autorises a un processus. Utilise dans la sandbox pour bloquer les appels systeme dangereux. |
| **Spring Boot** | Framework Java simplifiant la creation d'applications web prod-ready. Base de nos deux backends. Version 3.4 dans SkillForge. |
| **Sprint** | Iteration de duree fixe (deux semaines dans SkillForge) a l'issue de laquelle une version demontrable est livree. |
| **Vite** | Outil de build moderne pour applications web, utilise pour servir et empaqueter le frontend React de SkillForge. |

**17 termes au total** — chacun apparait au moins une fois dans le corps
du memoire (verifie par grep : Anti-fraude 10x, Backend 40x, Backlog 11x,
Cas d'utilisation 1x, Docker 28x, Flyway 5x, Frontend 17x, Mailpit 2x,
Ollama 6x, Passation 29x, React 11x, Sandbox 60x, Scrum 5x, Seccomp 6x,
Spring Boot 10x, Sprint 18x, Vite 5x).

Les termes Burndown chart, Resend et Supabase ont ete ecartes car **absents
du mémoire v2** (zero occurrence au grep). Resend et Supabase sont utilises
en production cloud mais pas encore documentes dans la v2 ; ils pourront
etre ajoutes quand le chapitre deploiement sera enrichi.

---

## 3. Verification croisee avec le PDF v2

Verification realisee par `pdftotext` + grep sur le PDF v2 complet (70 pages).

### Elements du glossaire v1 (p. 7-9) : nouvelle place

| Element de la v1 | Nouvelle place | Nb occurrences |
|---|---|---|
| API | → Acronymes | 15 |
| IA | → Acronymes | 20 |
| IHM | → Acronymes | 1 |
| LLM | → Acronymes | 3 |
| MCD | → Acronymes | 1 |
| OWASP | → Acronymes | 15 |
| QCM | → Acronymes | 7 |
| RGPD | → Acronymes | 2 |
| UML | → Acronymes | 2 |
| Backend | → Glossaire | 40 |
| Docker | → Glossaire | 28 |
| Scrum | → Glossaire | 5 |
| Sprint | → Glossaire | 18 |
| React | → Glossaire | 11 |
| Spring Boot | → Glossaire | 10 |
| Vite | → Glossaire | 5 |

### Elements supplementaires ajoutes (deja presents dans le texte v2)

Acronymes : ASVS, CSS, CV, DOCX, HTTP, MBDS, PDF, REST, SMTP, SPA, SQL, UI, ZAP
Glossaire : Anti-fraude, Backlog, Cas d'utilisation, Flyway, Frontend, Mailpit, Ollama, Passation, Seccomp

### Elements ecartes (absents du PDF v2)

- Acronymes : CRUD, CU, ENF, HTML, HTTPS, JPA, JSON, JWT, MLD, TLS, UCA, US
- Glossaire : Burndown chart, Resend, Supabase

Rien n'est perdu : tout ce qui etait dans la v1 est reclasse, et seuls
les acronymes/termes reellement utilises ont ete conserves.

---

## 4. Mise en page recommandee dans le Word

Les deux sections doivent apparaitre **l'une apres l'autre** dans le front
matter, juste apres la Liste des tableaux et avant l'Introduction :

```
Table des matieres
Liste des figures
Liste des tableaux
Acronymes          <-- NOUVEAU
Glossaire          <-- REDUIT aux termes seulement
---------------------------------------------
1. Introduction (page affichee 1)
```

Format de chaque table :
- Tableau Word a 2 colonnes
- Largeur colonne 1 : ~25 % (acronyme / terme)
- Largeur colonne 2 : ~75 % (definition)
- En-tete de colonne gras, bordure fine
- Lignes alternees (zebrage) si ton style de memoire les utilise
- Font 10 ou 11 pt (meme que le reste du corps)
