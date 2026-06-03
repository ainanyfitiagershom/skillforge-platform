# Cadrage V1 et référentiel de compétences

## 1. Objet

Ce document précise le périmètre fonctionnel exact de la V1 de SkillForge, les profils métier ciblés en priorité, et le référentiel des compétences techniques qui sera utilisé pour mapper les résultats de l'analyse de CV.

Il sera révisé et validé par le tuteur entreprise lors d'une réunion dédiée au début du Sprint 0.

## 2. Profils ciblés en V1

Quatre profils métier sont prioritaires en V1, car ils correspondent aux recrutements les plus fréquents chez Tsarajoro.

| Code | Profil | Description courte |
|---|---|---|
| `DEV_PHP` | Développeur PHP | Développement back-end PHP, intégration de modules, optimisation |
| `INT_WORDPRESS` | Intégrateur WordPress | Création et maintenance de sites WordPress, thèmes, plugins, SEO on-site |
| `DEV_VUE` | Développeur Front-end Vue.js | Création d'interfaces réactives, composants, intégration d'API REST |
| `SEO_TECH` | Spécialiste SEO technique | Optimisation technique, performances, structure de données, netlinking |

D'autres profils (réseau, assistants techniques) sont prévus pour une V2 ultérieure.

## 3. Référentiel des compétences techniques

Le référentiel ci-dessous est utilisé pour deux choses :

1. **Mapper** automatiquement les compétences extraites du CV par l'IA vers un identifiant interne stable.
2. **Étiqueter** les questions de la banque pour pouvoir générer un test ciblé.

Chaque compétence a un identifiant interne (`skill_code`), un nom affiché, une catégorie et la liste des profils cibles concernés.

### 3.1 Langages de programmation

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `LANG_PHP` | PHP | Langage | DEV_PHP, INT_WORDPRESS |
| `LANG_JS` | JavaScript | Langage | DEV_VUE, INT_WORDPRESS |
| `LANG_TS` | TypeScript | Langage | DEV_VUE |
| `LANG_HTML` | HTML 5 | Langage | INT_WORDPRESS, DEV_VUE |
| `LANG_CSS` | CSS 3 | Langage | INT_WORDPRESS, DEV_VUE |
| `LANG_SQL` | SQL | Langage | DEV_PHP, INT_WORDPRESS |

### 3.2 Frameworks et bibliothèques

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `FW_LARAVEL` | Laravel | Framework PHP | DEV_PHP |
| `FW_SYMFONY` | Symfony | Framework PHP | DEV_PHP |
| `FW_VUE` | Vue.js | Framework JS | DEV_VUE |
| `FW_NUXT` | Nuxt | Framework Vue | DEV_VUE |
| `FW_REACT` | React | Framework JS | DEV_VUE (transverse) |
| `FW_TAILWIND` | Tailwind CSS | Framework CSS | INT_WORDPRESS, DEV_VUE |

### 3.3 Plateformes et CMS

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `CMS_WP` | WordPress | CMS | INT_WORDPRESS |
| `CMS_WP_HOOKS` | WordPress Hooks (actions / filters) | CMS avancé | INT_WORDPRESS |
| `CMS_WP_THEME` | Développement de thème WordPress | CMS | INT_WORDPRESS |
| `CMS_WP_PLUGIN` | Développement de plugin WordPress | CMS | INT_WORDPRESS |

### 3.4 Bases de données

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `DB_MYSQL` | MySQL | SGBD | DEV_PHP, INT_WORDPRESS |
| `DB_MARIADB` | MariaDB | SGBD | DEV_PHP, INT_WORDPRESS |
| `DB_POSTGRES` | PostgreSQL | SGBD | DEV_PHP |

### 3.5 SEO et performance

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `SEO_ONPAGE` | SEO on-page | SEO | INT_WORDPRESS, SEO_TECH |
| `SEO_TECHNIQUE` | SEO technique (Core Web Vitals, sitemap) | SEO avancé | SEO_TECH |
| `SEO_NETLINKING` | Netlinking et backlinks | SEO | SEO_TECH |
| `SEO_SCHEMA` | Données structurées (schema.org) | SEO avancé | SEO_TECH |
| `PERF_WEB` | Performances web (caching, CDN) | Perf | SEO_TECH, DEV_VUE |

### 3.6 Outils et écosystème

| Code | Nom affiché | Catégorie | Profils cibles |
|---|---|---|---|
| `TOOL_GIT` | Git | Versioning | Tous |
| `TOOL_DOCKER` | Docker | Devops | DEV_PHP, DEV_VUE |
| `TOOL_COMPOSER` | Composer | Gestion paquets PHP | DEV_PHP, INT_WORDPRESS |
| `TOOL_NPM` | npm / pnpm | Gestion paquets JS | DEV_VUE |

## 4. Périmètre fonctionnel V1 — récapitulatif

### 4.1 Inclus

- Analyse intelligente du CV par IA (extraction des compétences listées au §3).
- Génération adaptative de tests sur mesure (QCM, exercices de code, cas pratiques).
- Sandbox sécurisée d'exécution de code (PHP et JavaScript).
- Compte rendu IA avec recommandation argumentée.
- Banque de questions réutilisable et composition manuelle en fallback.
- Gestion des utilisateurs et liens candidats sécurisés.
- Analyse statistique des questions et boucle d'amélioration continue.
- Tableau de bord analytique recruteur.
- Détection navigateur basique anti-fraude.

### 4.2 Exclu (perspectives V2)

- Application mobile candidat.
- Proctoring vision avancé par webcam.
- Tests adaptatifs IRT (Item Response Theory).
- Détection de plagiat code par comparaison avec GitHub public.
- Intégration directe avec un ATS externe.
- SSO Tsarajoro intégré.
- Internationalisation (interfaces FR uniquement en V1).
- Sandbox multi-langage étendue (Python, Java, Go, etc.).

## 5. Points à valider avec le tuteur entreprise

Avant de démarrer le développement, les points suivants doivent être confirmés lors d'une réunion :

- [ ] Les quatre profils prioritaires (DEV_PHP, INT_WORDPRESS, DEV_VUE, SEO_TECH) sont-ils les bons ?
- [ ] Le référentiel de compétences est-il complet ? Manque-t-il des éléments spécifiques à Tsarajoro ?
- [ ] La validation des questions générées par l'IA sera-t-elle faite par : le tuteur entreprise, un comité de 2-3 développeurs seniors, ou autre ?
- [ ] Quel est le canal officiel pour envoyer le lien d'invitation au candidat (e-mail seul, ou aussi WhatsApp / Slack) ?
- [ ] L'export PDF du compte rendu doit-il suivre une charte graphique Tsarajoro particulière ?
- [ ] La purge automatique des CV au bout de 12 mois doit-elle pouvoir être suspendue manuellement (ex. dossiers RH actifs) ?
