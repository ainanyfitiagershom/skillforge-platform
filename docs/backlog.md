# Backlog produit SkillForge

Ce document reconstitue le backlog produit de SkillForge a partir du cahier
des charges, du plan de realisation, du code livre et des livrables du
memoire. Il sert de trace Scrum pour la soutenance : user stories, priorite
MoSCoW, sprint de realisation et statut final.

## Legende

| Champ | Signification |
|---|---|
| Priorite | Must, Should, Could, Won't |
| Statut | Livre, Partiel, Reporte |
| Sprint | Sprint principal de livraison ou de stabilisation |

## Backlog principal

| ID | User Story | Priorite | Sprint | Statut | Trace principale |
|---|---|---:|---:|---|---|
| US-01 | En tant que recruteur, je veux televerser un CV candidat afin d'en extraire automatiquement les competences et niveaux estimes. | Must | S2 | Livre | `CvController`, `cv_analyses`, parsing PDF/DOCX/OCR |
| US-02 | En tant que recruteur, je veux generer un test technique adapte au profil et aux competences detectees afin de reduire la preparation manuelle. | Must | S3 | Livre | `GenerationController`, `TestGenerationService`, page `NewTestPage` |
| US-03 | En tant que recruteur, je veux relire, modifier et valider les questions generees afin de garder un controle humain avant envoi au candidat. | Must | S3 | Livre | `ReviewController`, `QuestionController`, page `ReviewQuestionsPage` |
| US-04 | En tant que recruteur, je veux envoyer une invitation securisee au candidat afin qu'il puisse passer son test via un lien unique. | Must | S3/S4 | Livre | `InvitationController`, table `invitations`, Mailpit/SMTP |
| US-05 | En tant que candidat, je veux acceder a ma passation avec mon lien et un code d'acces afin que mon identite soit protegee. | Must | S4/S6 | Livre | `CandidateController`, `CandidatePassationService`, migration `V6` |
| US-06 | En tant que candidat, je veux repondre aux QCM, exercices de code et cas pratiques dans une interface unique afin de passer le test completement en ligne. | Must | S4 | Livre | `CandidatePassationPage`, endpoints `/candidate/passations/*` |
| US-07 | En tant que candidat, je veux executer mon code dans un environnement isole afin de verifier mes solutions sans risque pour la plateforme. | Must | S4 | Livre | `backend-sandbox`, `SandboxRunner`, Docker seccomp/cap-drop |
| US-08 | En tant que plateforme, je veux corriger automatiquement les reponses et calculer un score global afin de produire un resultat coherent et rapide. | Must | S5 | Livre | `PassationController`, table `answers`, page `CandidateDonePage` |
| US-09 | En tant que recruteur, je veux consulter le rapport detaille d'un candidat afin de comprendre ses points forts, ses faiblesses et la recommandation finale. | Must | S5 | Livre | `ResultDetailPage`, `reports`, generation IA du rapport |
| US-10 | En tant que recruteur, je veux detecter les signaux de fraude pendant la passation afin de contextualiser le score candidat. | Should | S5 | Livre | `fraud_events`, score de risque, indicateurs resultat |
| US-11 | En tant que recruteur, je veux consulter un tableau de bord analytique afin de suivre les scores, profils et questions discriminantes. | Should | S6 | Livre | `AnalyticsController`, `DashboardPage` |
| US-12 | En tant qu'administrateur ou recruteur habilite, je veux gerer la banque de questions afin de conserver un referentiel exploitable et evolutif. | Should | S2/S3 | Livre | `QuestionController`, `questions`, `question_skills` |
| US-13 | En tant qu'administrateur, je veux appliquer le droit a l'oubli sur un candidat afin de respecter les exigences RGPD. | Should | S2 | Livre | `RgpdController`, suppression candidat/CV |
| US-14 | En tant qu'exploitant, je veux changer de fournisseur LLM par configuration afin d'eviter la dependance a un seul service externe. | Should | S5/S6 | Livre | `LlmClient`, OpenAI/Groq/Gemini/Ollama/mock |
| US-15 | En tant qu'equipe projet, je veux une integration continue qui compile les backends, lance les tests et construit le frontend afin de limiter les regressions. | Should | S7 | Livre | `.github/workflows/ci.yml` |

## Details par User Story

### US-01 - Analyse automatique du CV candidat

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S2

**Description :**  
En tant que recruteur, je veux televerser un CV candidat au format PDF ou
DOCX afin d'obtenir automatiquement une liste de competences avec un niveau
estime.

**Criteres d'acceptation :**

- Le recruteur peut fournir un CV depuis l'interface de creation de test.
- Les formats PDF et DOCX sont pris en charge.
- Les competences extraites sont stockees avec le fournisseur LLM utilise.
- Un echec d'analyse reste visible et ne bloque pas silencieusement le flux.

### US-02 - Generation adaptative du test technique

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S3

**Description :**  
En tant que recruteur, je veux generer automatiquement un test a partir du
profil cible, des competences et du niveau de difficulte afin de gagner du
temps dans la preparation.

**Criteres d'acceptation :**

- Le recruteur choisit le profil, le nombre de questions et la difficulte.
- Le test genere contient des QCM, exercices de code et cas pratiques.
- Les questions sont rattachees a des competences.
- Le resultat reste relisible avant envoi.

### US-03 - Relecture et validation des questions

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S3

**Description :**  
En tant que recruteur, je veux relire, modifier, approuver ou rejeter les
questions generees afin de garder un controle humain sur l'evaluation.

**Criteres d'acceptation :**

- Les questions generees apparaissent dans une page de revue.
- Le recruteur peut modifier l'enonce, la difficulte et le contenu technique.
- Les statuts `PENDING_REVIEW`, `APPROVED` et `REJECTED` sont supportes.
- Les questions non validees ne sont pas envoyees au candidat.

### US-04 - Invitation securisee du candidat

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S3/S4

**Description :**  
En tant que recruteur, je veux envoyer au candidat un lien unique afin qu'il
accede uniquement a son test.

**Criteres d'acceptation :**

- Une invitation possede un token unique et une date d'expiration.
- Le lien candidat ne donne acces qu'au test associe.
- L'email peut etre intercepte en developpement avec Mailpit.
- Une invitation expiree ou deja utilisee est refusee.

### US-05 - Demarrage securise par code d'acces

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S4/S6

**Description :**  
En tant que candidat, je veux demarrer ma passation avec mon lien, mon email
et un code d'acces afin d'eviter l'usurpation d'identite.

**Criteres d'acceptation :**

- Le candidat doit fournir le code d'acces a six chiffres.
- L'email saisi est compare a l'identite attendue.
- Les erreurs ne revelent pas si le token existe.
- Le nombre d'essais incorrects est limite.

### US-06 - Passation candidat complete

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S4

**Description :**  
En tant que candidat, je veux passer l'ensemble du test dans une interface web
unique afin de repondre aux QCM, aux exercices de code et aux cas pratiques.

**Criteres d'acceptation :**

- Le candidat voit les questions du test dans l'ordre defini.
- Les reponses sont sauvegardees et soumises.
- Un chronometre et des informations de progression sont affiches.
- La page finale confirme la soumission.

### US-07 - Execution de code en sandbox

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S4

**Description :**  
En tant que candidat, je veux executer mon code pendant la passation afin de
verifier mes solutions. En tant que plateforme, cette execution doit rester
isolee.

**Criteres d'acceptation :**

- Le code est transmis au service `backend-sandbox`.
- L'execution se fait dans un conteneur ephemere.
- Le conteneur applique les restrictions reseau, memoire, processus, seccomp
  et capabilities.
- Le resultat retourne stdout, stderr, code de sortie et score de tests.

### US-08 - Correction automatique et score global

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S5

**Description :**  
En tant que plateforme, je veux corriger automatiquement les reponses afin de
produire un score global exploitable par le recruteur.

**Criteres d'acceptation :**

- Les QCM sont corriges selon l'index attendu.
- Les exercices de code utilisent les tests caches.
- Les cas pratiques peuvent etre evalues par le fournisseur LLM actif.
- Le score global est stocke dans la passation.

### US-09 - Rapport candidat detaille

**Priorite :** Must  
**Statut :** Livre  
**Sprint principal :** S5

**Description :**  
En tant que recruteur, je veux lire un rapport synthetique et detaille afin
d'aider la decision de recrutement.

**Criteres d'acceptation :**

- Le rapport presente le score global.
- Il liste forces, faiblesses et recommandation.
- Il indique le fournisseur LLM utilise lorsque le rapport est genere.
- Le rapport est accessible depuis la liste des resultats.

### US-10 - Detection anti-fraude

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S5

**Description :**  
En tant que recruteur, je veux disposer d'indicateurs de risque afin de
contextualiser une passation suspecte.

**Criteres d'acceptation :**

- Les evenements suspects sont enregistres.
- Un score de risque est associe a la passation.
- Le rapport permet d'identifier les passations a verifier.
- Les evenements ne bloquent pas automatiquement le candidat sans preuve.

### US-11 - Dashboard analytique recruteur

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S6

**Description :**  
En tant que recruteur, je veux visualiser les indicateurs globaux de la
plateforme afin de piloter les evaluations.

**Criteres d'acceptation :**

- Le dashboard affiche le nombre de candidats evalues.
- Il affiche la distribution des scores.
- Il affiche le score moyen par profil.
- Il calcule le pouvoir discriminant des questions lorsque les donnees sont
  suffisantes.

### US-12 - Banque de questions

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S2/S3

**Description :**  
En tant qu'administrateur ou recruteur habilite, je veux gerer une banque de
questions afin de reutiliser et ameliorer les evaluations.

**Criteres d'acceptation :**

- Les questions possedent un type, un statut, une difficulte et un payload.
- Les questions peuvent etre reliees a des competences.
- Les versions et statuts permettent de distinguer brouillon et question
  exploitable.
- Les questions rejetees ou archivees ne sont pas selectionnees pour un test.

### US-13 - Droit a l'oubli RGPD

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S2

**Description :**  
En tant qu'administrateur, je veux supprimer les donnees d'un candidat afin de
respecter les obligations RGPD.

**Criteres d'acceptation :**

- Un endpoint permet la suppression d'un candidat.
- Les CV et donnees rattachees sont supprimes par cascade lorsque pertinent.
- La fonctionnalite est reservee aux roles autorises.
- Le comportement est documente dans le dossier de tests.

### US-14 - Multi-fournisseurs LLM

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S5/S6

**Description :**  
En tant qu'exploitant, je veux changer de fournisseur LLM par configuration
afin de maitriser les couts, la disponibilite et la localisation des donnees.

**Criteres d'acceptation :**

- Le code metier depend d'une interface commune `LlmClient`.
- Le fournisseur actif est choisi par variable d'environnement.
- Le mode `mock` permet les demonstrations sans API payante.
- Un fournisseur local Ollama est disponible pour les donnees sensibles.

### US-15 - Integration continue

**Priorite :** Should  
**Statut :** Livre  
**Sprint principal :** S7

**Description :**  
En tant qu'equipe projet, je veux automatiser les controles de build afin de
detecter rapidement les regressions.

**Criteres d'acceptation :**

- GitHub Actions se declenche sur push et pull request vers `main`.
- Les deux backends Spring Boot sont compiles.
- Les tests unitaires Maven sont lances.
- Le frontend React/Vite est construit avec pnpm.

## Fonctionnalites sorties du perimetre V1

| ID | Fonctionnalite | Priorite initiale | Decision | Justification |
|---|---|---:|---|---|
| US-C01 | Proctoring webcam | Could | Reporte V2 | Sensibilite RGPD et effort important pour une V1 |
| US-C02 | Integration ATS externe | Could | Reporte V2 | Aucun ATS cible confirme pendant le stage |
| US-C03 | SSO recruteur | Could | Reporte V2 | Non necessaire pour la demonstration locale et la recette V1 |
| US-C04 | Sandbox Python/Java/Go | Could | Reporte V2 | PHP et JavaScript suffisants pour valider l'architecture |
| US-C05 | Tests adaptatifs IRT | Could | Reporte V2 | Besoin d'un volume important de passations historiques |

## Lecture par sprint

| Sprint | Objectif principal | User Stories concernees |
|---|---|---|
| S0 | Cadrage, architecture cible, environnement local | Preparation backlog, risques, choix stack |
| S1 | Socle backend, auth, modele initial, PostgreSQL/Flyway | Base technique des US |
| S2 | Analyse CV, banque de questions, RGPD | US-01, US-12, US-13 |
| S3 | Generation adaptative, revue recruteur, invitations | US-02, US-03, US-04 |
| S4 | UI candidat et sandbox Docker durcie | US-05, US-06, US-07 |
| S5 | Correction automatique, rapports IA, anti-fraude | US-08, US-09, US-10, US-14 |
| S6 | Analytics, dashboard, amelioration continue | US-11, stabilisation US-14 |
| S7 | Stabilisation, tests, CI, documentation | US-15, recette generale |
| S8 | Preparation deploiement et soutenance | Packaging, memoire, annexes |

## Note de tracabilite

Ce backlog n'a pas ete tenu comme outil projet unique des le premier jour :
il a ete consolide a posteriori pour la soutenance a partir des sources
suivantes :

- `plan.md`, qui conserve le decoupage par phases et sprints ;
- `docs/MEMOIRE_DIAGNOSTIC.md`, qui liste les user stories principales et
  les criteres du memoire ;
- `docs/MEMOIRE_REDIGE.md`, qui decrit les livrables effectifs ;
- le code source des modules `backend-app`, `backend-sandbox` et
  `frontend-web` ;
- les migrations Flyway `V1` a `V7`.

Cette reconstruction evite d'affirmer l'existence d'un suivi Scrum plus
formel qu'il ne l'a ete pendant le developpement solo, tout en donnant au
jury une vue claire du perimetre fonctionnel livre.
