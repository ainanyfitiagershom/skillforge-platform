# Fiche technique complète — SkillForge

Objectif : te permettre de **maîtriser à 100 %** ton projet avant la soutenance.
Ce document t'apprend tout, comme si tu redécouvrais le projet.

Lecture recommandée : **2 à 3 fois avant la soutenance**, en marquant les points que tu ne comprends pas encore pour y revenir.

---

## Sommaire

1. [Vue d'ensemble en 60 secondes](#1-vue-densemble-en-60-secondes)
2. [Architecture générale](#2-architecture-générale)
3. [Composant 1 : Frontend Web](#3-composant-1--frontend-web)
4. [Composant 2 : Backend applicatif](#4-composant-2--backend-applicatif)
5. [Composant 3 : Backend sandbox](#5-composant-3--backend-sandbox)
6. [Intelligence artificielle et abstraction multi-LLM](#6-intelligence-artificielle-et-abstraction-multi-llm)
7. [Sécurité en profondeur](#7-sécurité-en-profondeur)
8. [Base de données et migrations](#8-base-de-données-et-migrations)
9. [Anti-fraude comportementale](#9-anti-fraude-comportementale)
10. [Tests et validation](#10-tests-et-validation)
11. [Justification des choix techniques](#11-justification-des-choix-techniques)
12. [Questions probables du jury et réponses](#12-questions-probables-du-jury-et-réponses)

---

## 1. Vue d'ensemble en 60 secondes

**SkillForge** est une plateforme web de recrutement technique développée pour Tsarajoro, capable de :

1. **Analyser un CV** automatiquement pour en extraire les compétences (via IA)
2. **Générer un test** adapté au profil du candidat (via IA)
3. **Envoyer une invitation** par e-mail au candidat
4. **Faire passer le test** dans un environnement sécurisé (sandbox Docker isolée)
5. **Produire un rapport détaillé** avec score, forces, faiblesses et recommandation (via IA)

Le projet est composé de **trois services indépendants** qui communiquent entre eux :

| Service | Techno | Rôle |
|---|---|---|
| Frontend web | React 19 + TypeScript + Vite | Interface recruteur et interface candidat |
| Backend applicatif | Spring Boot 3 + Java 21 | Logique métier, API REST, IA, données |
| Backend sandbox | Spring Boot + Docker | Exécution isolée du code candidat |

**Volumétrie** : ~15 000 lignes de code Java + ~10 000 lignes de TypeScript, 7 migrations Flyway pour la base PostgreSQL.

---

## 2. Architecture générale

### Le principe : trois tiers séparés

L'architecture repose sur une **séparation stricte des responsabilités** entre trois composants indépendants.

```
┌─────────────────┐
│  Navigateur     │  (utilisateur : recruteur ou candidat)
│  (recruteur     │
│   ou candidat)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Frontend Web   │  React + TypeScript
│  (React/Vite)   │  Servi par un serveur web statique
└────────┬────────┘
         │ REST / JSON
         ▼
┌─────────────────┐         ┌──────────────────┐
│  Backend App    │────────>│  Fournisseurs    │
│  (Spring Boot)  │  HTTPS  │  IA (OpenAI...)  │
└────────┬────────┘         └──────────────────┘
         │
         │ JDBC              ┌──────────────────┐
         ├─────────────────>│  PostgreSQL 16   │
         │                   │  (données)       │
         │                   └──────────────────┘
         │
         │ HTTP interne      ┌──────────────────┐
         └──────────────────>│  Backend Sandbox │
                             │  (Spring Boot)   │
                             └────────┬─────────┘
                                      │ docker run
                                      ▼
                             ┌──────────────────┐
                             │  Conteneur       │
                             │  éphémère        │
                             │  (code candidat) │
                             └──────────────────┘
```

### Pourquoi cette séparation ?

**Défense en profondeur** : si un attaquant compromet un composant, il ne compromet pas les autres.

Concrètement :
- Le frontend n'a **pas accès direct à la base de données** (il passe par le backend)
- La base de données n'est **pas exposée sur internet** (accessible uniquement depuis le backend)
- La sandbox est **totalement séparée du backend applicatif** : si un code malveillant s'échappe de la sandbox, il ne compromet ni la base ni l'API métier

**Scalabilité** : chaque composant peut être mis à l'échelle indépendamment. Si beaucoup de candidats passent des tests en même temps, on peut monter en puissance juste sur les sandboxes.

**Maintenabilité** : chaque composant a un rôle clair, une équipe pourrait travailler sur un composant sans casser les autres.

---

## 3. Composant 1 : Frontend Web

### Technologies

- **React 19** : bibliothèque JavaScript pour construire des interfaces utilisateurs
- **TypeScript 5** : JavaScript typé, réduit les bugs à l'exécution
- **Vite 6** : outil de build ultra rapide (bundler moderne)
- **Tailwind CSS** : framework CSS utilitaire (classes prêtes à l'emploi)
- **Shadcn/UI** : bibliothèque de composants réutilisables (boutons, modales, tables)
- **React Router** : gestion des routes (URLs, navigation)
- **Axios** : client HTTP pour parler au backend
- **Zustand** : gestion d'état légère (alternative à Redux)

### Pourquoi ces choix ?

| Choix | Raison |
|---|---|
| **React** plutôt que Angular ou Vue | Écosystème le plus mature en 2026, dev senior facile à trouver, communauté immense |
| **TypeScript** plutôt que JavaScript pur | Détection des erreurs à la compilation, refactorings sûrs, autocomplétion IDE |
| **Vite** plutôt que Webpack | 10x plus rapide en dev, hot reload instantané |
| **Tailwind** plutôt que CSS classique | Rapidité de développement, cohérence visuelle, pas de conflits de nommage |
| **Shadcn/UI** plutôt que Material UI | Composants copiés dans le projet (pas de dépendance externe), personnalisation totale |

### Rôle dans le projet

Le frontend a **deux interfaces distinctes** :

1. **Interface recruteur** (`/app/...`) : création d'évaluations, invitation candidats, consultation des rapports, tableau de bord
2. **Interface candidat** (`/passation/:token`) : formulaire de connexion par code, passation du test avec éditeur de code, soumission

### Structure du code

```
apps/frontend-web/
├── src/
│   ├── pages/          # Composants "page" (une route = une page)
│   ├── components/     # Composants réutilisables (Button, Modal...)
│   ├── hooks/          # Hooks React personnalisés
│   ├── api/            # Client HTTP (appels au backend)
│   ├── stores/         # Zustand stores (état global)
│   └── App.tsx         # Point d'entrée
└── package.json
```

---

## 4. Composant 2 : Backend applicatif

### Technologies

- **Java 21** : dernière version LTS (Long Term Support) de Java
- **Spring Boot 3.4** : framework Java pour construire des API REST
- **Spring Security 6** : gestion de l'authentification et des autorisations
- **Spring Data JPA** : accès à la base via ORM (Object-Relational Mapping)
- **PostgreSQL 16** : base de données relationnelle
- **Flyway** : versionnement des migrations SQL
- **Argon2id** : algorithme de hachage des mots de passe (résistant aux attaques modernes)
- **JWT** (JSON Web Tokens) : jetons d'authentification stateless
- **Maven** : gestionnaire de dépendances Java
- **Testcontainers** : tests d'intégration avec une vraie base PostgreSQL en Docker

### Pourquoi ces choix ?

| Choix | Raison |
|---|---|
| **Java 21** plutôt que Node.js | Écosystème mature pour les projets sensibles, JVM stable, sécurité éprouvée, formation MBDS |
| **Spring Boot** plutôt que Quarkus ou Micronaut | Écosystème le plus complet, communauté immense, documentation exhaustive |
| **PostgreSQL** plutôt que MySQL | Support JSONB (JSON binaire optimisé), meilleure conformité SQL standard, gestion des transactions plus robuste |
| **Argon2id** plutôt que bcrypt ou SHA-256 | Gagnant du concours de hachage de mots de passe (PHC 2015), résistant aux attaques GPU/ASIC |
| **JWT** plutôt que sessions serveur | Stateless, permet la scalabilité horizontale, standardisé |
| **Flyway** plutôt que Liquibase | Plus simple à utiliser, migrations en SQL pur (pas de DSL propriétaire) |
| **Testcontainers** plutôt que H2 en mémoire | Tests contre une vraie PostgreSQL = pas de surprise en prod |

### Rôle dans le projet

Le backend applicatif expose une **API REST** consommée par le frontend. Il gère :

- **Authentification** : login, refresh token, réinitialisation mot de passe
- **CV** : upload, analyse par IA, stockage
- **Tests** : création, génération de questions par IA, invitation candidats
- **Passations** : création à partir d'une invitation, sauvegarde des réponses
- **Rapports** : calcul du score, génération du texte explicatif par IA
- **Anti-fraude** : enregistrement des événements comportementaux

### Structure du code

```
apps/backend-app/
├── src/main/java/com/tsarajoro/skillforge/
│   ├── auth/              # Authentification (JWT, Argon2id)
│   ├── security/          # Configuration Spring Security
│   ├── cv/                # Upload et analyse de CV
│   ├── test/              # Création et gestion des évaluations
│   ├── question/          # Banque de questions
│   ├── invitation/        # Envoi d'invitations par e-mail
│   ├── candidate/         # Passations et réponses
│   ├── report/            # Génération des rapports
│   ├── llm/               # Abstraction multi-fournisseurs IA
│   ├── mail/              # Envoi d'e-mails
│   └── SkillforgeApplication.java  # Point d'entrée
├── src/main/resources/
│   ├── db/migration/      # Flyway V1 à V7
│   └── application.yml    # Configuration
└── pom.xml
```

---

## 5. Composant 3 : Backend sandbox

### Technologies

- **Java 21** + **Spring Boot** : même stack que le backend applicatif (cohérence)
- **Docker Engine** : gestion des conteneurs
- **seccomp** : filtrage des appels système Linux (Secure Computing mode)
- **Bash / shell** : orchestration des `docker run`
- **Images Docker de langages** : `openjdk`, `node`, `python`, `php`

### Rôle dans le projet

Le backend sandbox est un **service séparé** dont le seul rôle est d'**exécuter le code du candidat en toute sécurité**.

**Flux typique** :

1. Le candidat écrit son code et clique sur « Exécuter »
2. Le frontend envoie le code au backend applicatif
3. Le backend applicatif transmet la requête au backend sandbox (via HTTP interne)
4. Le backend sandbox :
   - Écrit le code dans un fichier temporaire
   - Lance `docker run` avec de nombreux verrous de sécurité
   - Capture stdout, stderr, exit code
   - Détruit le conteneur
5. Le résultat remonte jusqu'au frontend

### Pourquoi un service séparé ?

**Isolation totale**. Si un code malveillant du candidat parvenait à s'échapper de la sandbox (ce qui n'est pas arrivé sur les 50 attaques testées), il ne trouverait qu'un service minimaliste, sans accès à la base de données ni à l'API métier.

C'est le principe de la **défense en profondeur** : si une couche tombe, les autres tiennent.

### Structure du code

```
apps/backend-sandbox/
├── src/main/java/com/tsarajoro/skillforge/sandbox/
│   ├── runner/            # Orchestration docker run
│   ├── controller/        # API REST minimaliste
│   └── SandboxApplication.java
├── src/main/resources/
│   ├── seccomp-profiles/  # Profils seccomp par langage
│   └── application.yml
└── pom.xml
```

---

## 6. Intelligence artificielle et abstraction multi-LLM

### Le principe : une interface, six implémentations

Plutôt que de dépendre d'un fournisseur IA unique, SkillForge repose sur une **interface d'abstraction** appelée `LlmClient`.

```java
public interface LlmClient {
    String analyzeCV(String cvText, String jobProfile);
    List<Question> generateQuestions(List<String> skills, int count);
    Report generateReport(Passation passation);
}
```

**Six implémentations** sont connectées :

| Implémentation | Fournisseur | Modèle | Notes |
|---|---|---|---|
| `OpenAiLlmClient` | OpenAI | GPT-4o | Fournisseur principal actuel |
| `GroqLlmClient` | Groq | Llama 3.1 70B | Très rapide, moins cher |
| `GeminiLlmClient` | Google | Gemini 3.5 Flash | Alternative Google |
| `ClaudeLlmClient` | Anthropic | Claude Sonnet | Alternative Anthropic |
| `GithubModelsLlmClient` | GitHub | GPT-4o via GitHub | Utilisé au début (retiré depuis) |
| `OllamaLlmClient` | Ollama (local) | Mistral, Llama... | **Exécution 100 % locale, souveraine** |

### Comment ça marche concrètement ?

**Le service métier** appelle toujours l'interface, jamais une implémentation directement :

```java
@Service
public class CvAnalysisService {
    private final LlmClient llmClient;   // ← injecté par Spring
    
    public List<Skill> analyze(String cvText) {
        return llmClient.analyzeCV(cvText, jobProfile);
    }
}
```

Le choix du fournisseur actif est fait par **une simple variable de configuration** :

```yaml
# application.yml
llm:
  provider: openai   # ou "groq", "gemini", "claude", "ollama"...
```

Grâce à Spring, changer cette variable et redémarrer suffit pour basculer de fournisseur, **sans modifier une seule ligne de code métier**.

### La preuve empirique de la valeur

Pendant le stage, **GitHub Models a été retiré pour les nouveaux comptes**. Cela aurait pu casser le projet si le code métier avait été couplé à GitHub Models.

Grâce à l'abstraction, la bascule vers OpenAI a été réalisée **en moins d'une heure**, uniquement par changement de configuration. Aucune modification de la logique métier n'a été nécessaire.

### Pourquoi c'est important pour le jury

C'est une application concrète du principe **SOLID / Dependency Inversion** (le "D" de SOLID) : **dépendre des abstractions, pas des implémentations**. Ce qui semblait être une sur-ingénierie à l'origine s'est révélé être un investissement essentiel face à un incident réel.

---

## 7. Sécurité en profondeur

### Les 7 verrous de la sandbox

Chaque conteneur d'exécution est lancé avec ces **7 protections cumulatives** :

| Verrou | Rôle | Attaque bloquée |
|---|---|---|
| **`--security-opt seccomp=profile.json`** | Filtrage des appels système Linux | Appels dangereux comme `ptrace`, `mount`, `reboot` |
| **`--cap-drop=ALL`** | Retire toutes les capabilities Linux | Escalade de privilèges (CAP_NET_ADMIN, CAP_SYS_MODULE...) |
| **`--network=none`** | Aucun réseau | Exfiltration de données, appels vers l'extérieur |
| **`--read-only`** | Système de fichiers en lecture seule | Modification de fichiers système, persistance de malware |
| **`--pids-limit=64`** | Maximum 64 processus | Fork bomb (`:(){:|:&};:`) |
| **`--memory=256M --cpus=1`** | Ressources plafonnées | Attaque par épuisement de ressources (DoS local) |
| **`--user=1001`** | Exécution sous UID non privilégié | Accès aux fichiers système protégés |

### Comment cela a été validé ?

J'ai construit un **harnais de tests reproductible** avec **50 scénarios d'attaque** :

- Tentatives d'accès réseau : `curl`, `wget`, `nc`
- Tentatives d'accès filesystem : lecture de `/etc/shadow`, écriture dans `/tmp`
- Escalade de privilèges : `sudo`, `su`, `chmod +s`
- Fork bombs et bombes mémoire
- Exécution de binaires arbitraires téléchargés
- Tentatives de sortie de conteneur (mount, ptrace, /proc)

Résultat : **0 évasion détectée sur les 50 attaques**.

De plus, un audit **OWASP ZAP** complet de l'application web n'a remonté **aucune vulnérabilité de niveau élevé, moyen ni faible**.

### Authentification et mots de passe

- **Argon2id** : algorithme de hachage résistant aux attaques modernes (GPU, ASIC)
- **JWT** : jeton signé avec HMAC-SHA256, expiration courte (15 min), rafraîchi via refresh token
- **Rate limiting** : blocage temporaire après 5 échecs consécutifs (protection brute force)
- **Comparaison en temps constant** (`MessageDigest.isEqual`) pour éviter les timing attacks sur les codes d'accès

### RGPD et souveraineté

- Hébergement possible **on-premise** (chez Tsarajoro) grâce à Ollama
- Purge automatique des données candidats après **12 mois**
- Consentement explicite du candidat au démarrage du test
- Aucune donnée ne quitte l'infrastructure si Ollama est activé

---

## 8. Base de données et migrations

### Modèle de données

Les principales tables :

| Table | Rôle |
|---|---|
| `users` | Comptes recruteurs |
| `candidates` | Candidats évalués |
| `cvs` | CV uploadés (fichiers binaires en BYTEA) |
| `cv_analyses` | Résultats d'analyse IA des CV |
| `tests` | Évaluations créées par les recruteurs |
| `questions` | Banque de questions générées |
| `invitations` | Invitations envoyées aux candidats (token unique + code) |
| `passations` | Sessions de test en cours ou terminées |
| `answers` | Réponses du candidat par question |
| `fraud_events` | Événements comportementaux anti-fraude |
| `reports` | Rapports finaux générés |

### Migrations Flyway

Sept migrations SQL versionnées, jouées automatiquement au démarrage :

- **V1** : schéma initial (users, tests, questions)
- **V2** : ajout candidats et invitations
- **V3** : ajout passations et answers
- **V4** : ajout anti-fraude et rapports
- **V5** : ajout indexation et optimisations
- **V6** : ajout `test_submitted_at` et autres colonnes utiles
- **V7** : ajout analytics et statistiques

### Pourquoi Flyway ?

- **Rejouable** : depuis une base vide, on obtient toujours le même schéma
- **Traçable** : chaque migration est un fichier SQL versionné dans Git
- **Pas de DSL** : SQL pur, lisible par tout le monde
- **Sûr** : impossible de rejouer une migration déjà appliquée

---

## 9. Anti-fraude comportementale

### Événements détectés côté frontend

Pendant la passation, le frontend surveille :

| Événement | Comment détecté | Interprétation |
|---|---|---|
| **Changement d'onglet** | `window.addEventListener('blur')` | Le candidat consulte une autre page (aide extérieure ?) |
| **Perte de focus fenêtre** | `document.visibilitychange` | Le candidat sort de l'application |
| **Copier-coller entrant** | `paste` event sur les éditeurs de code | Le candidat colle du code venant d'ailleurs |
| **Ouverture DevTools** | Détection de la taille de la fenêtre + heuristiques | Le candidat inspecte le code de la page |
| **Multi-écran** | `window.screen.availWidth vs screen.width` | Le candidat a un second écran |

Chaque événement est envoyé au backend en temps réel et stocké dans la table `fraud_events`.

### Rapport pour le recruteur

À la fin de l'évaluation, le rapport affiche :
- **Aucune anomalie** (badge vert) si zéro événement critique
- **X anomalies détectées** (badge orange/rouge) sinon, avec le détail

Le recruteur **décide seul** ce qu'il fait de cette information (rejeter, questionner, ignorer).

---

## 10. Tests et validation

### Types de tests mis en place

| Type de test | Outil | Couverture |
|---|---|---|
| **Tests unitaires backend** | JUnit 5 | Services métier, helpers |
| **Tests d'intégration** | Testcontainers | Vraie PostgreSQL en Docker |
| **Tests de sandbox** | Harnais Bash + Docker | 50 scénarios d'attaque |
| **Tests de sécurité web** | OWASP ZAP | Scan actif complet |
| **Tests de charge** | k6 | 20 utilisateurs simultanés |
| **Tests frontend** | Vitest (partiel) | Composants critiques (ScoreRing, filtres) |

### Résultats clés

- **0 évasion** de la sandbox sur 50 attaques
- **0 vulnérabilité** OWASP ZAP (niveau élevé, moyen ou faible)
- **20 candidats simultanés** validés en charge sans dégradation
- **Bascule fournisseur IA en < 1h** validée en production

### Ce qui reste à améliorer

- **Couverture des tests frontend** : à renforcer (actuellement partielle)
- **Tests de charge > 20 utilisateurs** : à mener en conditions plus stressantes
- **Tests end-to-end** avec Playwright : à implémenter pour couvrir les parcours complets

---

## 11. Justification des choix techniques

Cette section synthétise **pourquoi** chaque décision a été prise. Le jury va probablement questionner ces choix.

### Pourquoi Java plutôt que Node.js, Go ou Python ?

- **Écosystème Spring Boot** : le plus mature au monde pour les API REST sécurisées
- **JVM stable** : après 25 ans, la JVM est un standard industriel pour les projets sensibles
- **Sécurité éprouvée** : très peu de CVE critiques sur Spring Boot ces dernières années
- **Formation MBDS** : le cursus utilise Java, ce qui garantit ma maîtrise
- **Marché** : facile de trouver un développeur Java senior pour reprendre le projet

### Pourquoi PostgreSQL plutôt que MySQL ou MongoDB ?

- **Support JSONB** : les CV analysés et les payloads de questions sont stockés en JSON binaire indexable
- **Meilleure conformité SQL standard** : moins de surprises, plus portable
- **Transactions plus robustes** : niveau d'isolation Serializable réellement respecté
- **Extensions** : PostGIS, pg_trgm, uuid-ossp disponibles si besoin

### Pourquoi Docker pour la sandbox plutôt qu'une VM ou une seccomp seule ?

- **VM** : trop lourde (démarrage en secondes, RAM énorme), rendrait la plateforme inutilisable
- **seccomp seul** : ne suffit pas, ne bloque pas l'accès réseau ni le filesystem
- **Docker** : bon compromis performance/sécurité, écosystème mature, isolation renforcée par cgroups + namespaces + seccomp

### Pourquoi 6 fournisseurs IA plutôt qu'un seul ?

- **Anti-vendor-lock-in** : ne dépendre d'aucun fournisseur unique
- **Résilience** : si un fournisseur tombe, on bascule (prouvé avec GitHub Models)
- **Souveraineté** : Ollama permet le 100 % local pour les clients sensibles
- **Optimisation coût/qualité** : on peut utiliser Groq (rapide/pas cher) pour l'analyse CV et OpenAI (qualité) pour la génération des rapports

### Pourquoi Scrum plutôt qu'un cycle en V ?

- **Adapté au solo** : les cycles courts de 2 semaines permettent de valider souvent
- **Absorption des imprévus** : quand GitHub Models a été retiré, le sprint en cours a intégré la bascule sans casser le planning global
- **Traçabilité** : chaque sprint a un livrable clair, facile à défendre devant un jury

### Pourquoi séparer backend-app et backend-sandbox ?

- **Défense en profondeur** : si la sandbox est compromise, l'API métier reste isolée
- **Scalabilité** : les sandboxes peuvent être multipliées sans toucher au backend applicatif
- **Testabilité** : chaque service se teste indépendamment

---

## 12. Questions probables du jury et réponses

Cette section est **la plus importante à préparer**. Chaque question est suivie d'une réponse structurée.

### Questions sur l'architecture

#### Q1 : Pourquoi Java plutôt que Node.js ?

> Trois raisons principales.
>
> D'abord, l'écosystème Spring Boot est le plus mature au monde pour construire des API REST sécurisées, avec Spring Security, Spring Data JPA et une communauté immense.
>
> Ensuite, la JVM est un standard industriel après 25 ans, particulièrement stable pour les projets sensibles comme le recrutement.
>
> Enfin, ma formation en Master MBDS m'a donné une maîtrise réelle de Java, ce qui me permet d'aller loin en profondeur, notamment sur la sécurité.

#### Q2 : Pourquoi séparer backend-app et backend-sandbox ?

> Pour la défense en profondeur. Le principe est simple : si un attaquant compromet la sandbox — ce qui n'est pas arrivé sur les 50 attaques testées — il ne compromet ni la base de données, ni l'API métier, ni les données des autres candidats.
>
> C'est un principe classique de sécurité : ne jamais mettre les composants sensibles et les composants exposés au risque dans le même processus.

#### Q3 : Pourquoi ne pas utiliser Kubernetes pour la sandbox ?

> Kubernetes est excellent pour orchestrer des services de longue durée, mais ici chaque exécution de code dure moins de 30 secondes. Le surcoût d'orchestration Kubernetes serait disproportionné.
>
> Docker seul, avec un simple orchestrateur maison en Java, est suffisant à cette échelle. Si le projet devait passer à des milliers de sandboxes simultanées, migrer vers Kubernetes serait une évolution naturelle.

### Questions sur l'IA

#### Q4 : Que se passe-t-il si OpenAI ferme demain ?

> Rien, en réalité, grâce à l'architecture multi-fournisseurs.
>
> J'ai six implémentations de l'interface LlmClient : OpenAI, Groq, Google Gemini, Anthropic Claude, GitHub Models et Ollama en local.
>
> J'ai déjà prouvé en pratique que la bascule fonctionne : quand GitHub Models a été retiré pour les nouveaux comptes pendant le stage, je suis passé à OpenAI en moins d'une heure, uniquement par changement de configuration, sans modifier une seule ligne de code métier.
>
> Et si tous les fournisseurs cloud fermaient, Ollama permet de tout exécuter en local, chez Tsarajoro, en 100 % souverain.

#### Q5 : Comment garantir la qualité des questions générées par l'IA ?

> Trois niveaux de contrôle.
>
> D'abord, les prompts sont renforcés avec des règles strictes par type de question : format PHPUnit pour les tests PHP, format Jest pour JavaScript, structure QCM stricte.
>
> Ensuite, chaque question passe par une validation manuelle du recruteur avant d'être envoyée au candidat. C'est le principe "l'IA propose, l'humain décide".
>
> Enfin, une banque de questions validées est constituée au fil du temps : les meilleures questions sont réutilisées, ce qui améliore la qualité globale.

#### Q6 : Comment évaluez-vous que le score produit par l'IA est fiable ?

> Le score n'est pas produit par l'IA de manière opaque. Il est calculé de façon déterministe à partir des réponses :
>
> - Les QCM ont une bonne réponse, le score est objectif.
> - Les exercices de code sont validés par des tests unitaires : le score est le pourcentage de tests qui passent.
> - Les cas pratiques sont notés par l'IA, mais avec un barème structuré (couverture, cohérence, clarté), et le recruteur peut ajuster.
>
> L'IA n'a la main que sur la notation qualitative des cas pratiques, et son travail reste vérifiable par le recruteur.

### Questions sur la sécurité

#### Q7 : Comment prouvez-vous que la sandbox est vraiment sécurisée ?

> Par un harnais de tests reproductible.
>
> J'ai construit 50 scénarios d'attaque couvrant les principales classes de menaces : tentatives d'accès réseau, escalade de privilèges, fork bombs, exfiltration de données, sortie de conteneur.
>
> Le harnais est rejouable à volonté : à chaque modification de la sandbox, je peux relancer les 50 tests en quelques minutes.
>
> Résultat à la clôture du projet : zéro évasion détectée. Ce n'est pas une déclaration de sécurité, c'est une preuve empirique.

#### Q8 : Que se passe-t-il si un candidat trouve une nouvelle façon d'attaquer la sandbox non testée ?

> Je serais transparent : mon harnais couvre les 50 scénarios connus, pas les vulnérabilités futures. C'est vrai pour toute solution de sécurité.
>
> Cependant, la défense en profondeur limite les dégâts : même si un attaquant sortait de la sandbox, il tomberait sur un service minimaliste sans accès à la base ni à l'API métier.
>
> Et l'architecture est faite pour évoluer : dès qu'une nouvelle attaque est identifiée, elle peut être ajoutée au harnais et corrigée dans les verrous.

#### Q9 : Comment garantissez-vous le RGPD ?

> Quatre points principaux.
>
> Premièrement, hébergement possible en local via Ollama : les données candidats ne quittent jamais l'infrastructure Tsarajoro.
>
> Deuxièmement, purge automatique après 12 mois, conformément à l'article 5 du RGPD.
>
> Troisièmement, consentement explicite du candidat au démarrage de l'évaluation.
>
> Quatrièmement, chaque candidat peut demander l'accès, la rectification ou la suppression de ses données via un e-mail dédié.

### Questions sur la méthode

#### Q10 : Pourquoi Scrum en solo ? N'est-ce pas contradictoire ?

> Le vrai Scrum en équipe est effectivement conçu pour plusieurs personnes. Mais l'esprit reste utile en solo : cycles courts, livrable clair par sprint, rétrospective régulière.
>
> J'ai adapté : pas de daily stand-up évidemment, mais des revues bi-hebdomadaires avec mon encadreur, une planification en début de sprint, et une démo/rétrospective en fin.
>
> Cette discipline m'a évité de me perdre dans le projet et a facilité l'absorption des imprévus comme le retrait de GitHub Models.

#### Q11 : Quelle est votre couverture de tests ?

> Sur le backend Java, la couverture est bonne sur les services critiques : authentification, sécurité, sandbox, calcul des scores.
>
> Sur le frontend, la couverture est partielle : les composants critiques comme le ScoreRing ou les filtres de recherche sont testés, mais l'ensemble reste à renforcer.
>
> C'est une des perspectives explicitement identifiées dans le mémoire : renforcer la couverture frontend est la première tâche pour la suite du projet.

### Questions sur les résultats

#### Q12 : Combien de lignes de code ?

> Environ 15 000 lignes de Java pour les deux backends, et 10 000 lignes de TypeScript pour le frontend. Auxquelles s'ajoutent 7 migrations Flyway et environ 3 000 lignes de tests.

#### Q13 : Pourquoi le déploiement en production n'a pas été fait ?

> Le sprint 8 dédié au déploiement était planifié mais sort du périmètre des 4 mois du stage. La mise en production nécessite des étapes supplémentaires : provisionnement d'un serveur, configuration DNS et TLS, backup automatique, monitoring.
>
> C'est explicitement identifié comme la prochaine étape dans les perspectives. La plateforme est prête techniquement, il ne manque que l'opérationnel.

### Questions sur le bilan

#### Q14 : Qu'est-ce qui a été le plus difficile ?

> Trois moments marquants.
>
> Le retrait de GitHub Models : j'ai découvert un lundi matin que mon fournisseur IA principal n'était plus disponible. C'était stressant, mais la bascule vers OpenAI en une heure grâce à l'abstraction a été très satisfaisante.
>
> L'incompatibilité Node Permission API et Jest : cinq itérations sur le harnais sandbox pour supporter les tests JavaScript. Cela m'a appris la valeur d'un environnement de test reproductible.
>
> La qualité des générations IA au démarrage : les premiers prompts produisaient des questions médiocres. Le passage à des prompts structurés avec règles strictes a été un vrai changement de niveau.

#### Q15 : Qu'est-ce que vous feriez différemment si vous recommenciez ?

> Deux choses.
>
> D'abord, j'aurais investi plus tôt dans les tests frontend. Les avoir dès le départ aurait accéléré les refactorings.
>
> Ensuite, j'aurais fait tourner Ollama en local dès le sprint 2, pour être indépendant des fournisseurs cloud dès le départ. J'ai attendu trop longtemps, ce qui m'a fait dépendre de GitHub Models plus que nécessaire.

---

## Récap des choses à absolument retenir

Si le jury pose une question et que tu bloques, retiens **ces 10 chiffres et ces 10 concepts** :

### Les 10 chiffres à connaître par cœur

1. **17 slides** de présentation
2. **20 min** d'exposé + 10 min de questions
3. **4 mois** de stage (mai à septembre 2026)
4. **7 sprints** Scrum de 2 semaines
5. **6 fournisseurs IA** connectés
6. **7 verrous** de sécurité sur la sandbox
7. **50 scénarios** d'attaque testés
8. **0 évasion** détectée
9. **0 vulnérabilité** OWASP ZAP
10. **1 heure** pour basculer de fournisseur IA (GitHub Models → OpenAI)

### Les 10 concepts clés à savoir expliquer

1. **Défense en profondeur** : plusieurs couches de sécurité indépendantes
2. **Abstraction LlmClient** : interface + 6 implémentations, dépendance vers l'abstraction
3. **Sandbox Docker durcie** : conteneur éphémère avec seccomp + cap-drop + network=none
4. **JWT + Argon2id** : authentification stateless + hachage résistant
5. **Anti-fraude comportementale** : détection changement d'onglet, copier-coller, DevTools
6. **Flyway** : migrations SQL versionnées, rejouables
7. **Testcontainers** : tests d'intégration avec vraie PostgreSQL en Docker
8. **RGPD** : hébergement local possible, purge 12 mois, consentement explicite
9. **Scrum** : cycles courts de 2 semaines, livrable clair par sprint
10. **Défense IA "l'IA propose, l'humain décide"** : chaque décision IA est validable par le recruteur

---

*Ce document est ta référence unique. Relis-le au moins 2 fois avant la soutenance. À chaque doute pendant la préparation, reviens ici.*
