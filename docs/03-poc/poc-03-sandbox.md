# POC 3 — Sandbox Docker sécurisée

## 1. Objectif

Démontrer que l'exécution du code candidat dans une sandbox Docker durcie est :

- **sécurisée** : aucune évasion possible sur 30 cas d'attaque connus,
- **performante** : latence médiane < 2 secondes pour du code valide,
- **fiable** : ≥ 95 % de succès sur 100 exécutions valides (50 PHP + 50 JS).

## 2. Architecture

Le POC implique deux services Spring Boot séparés (cf. `docs/02-conception/conception.md`) :

```
backend-app  ──(REST + X-Internal-Key)──> backend-sandbox  ──(Docker API)──> conteneur PHP/Node éphémère
```

La séparation **physique** des services est elle-même une mesure de sécurité : si un attaquant
parvenait à s'évader d'un conteneur, il arriverait dans `backend-sandbox`, qui ne contient
ni la base de données ni les utilisateurs.

## 3. Couches de durcissement

Chaque exécution applique simultanément les protections suivantes :

| Couche | Mécanisme | Effet |
|---|---|---|
| Réseau | `--network none` | Aucune sortie réseau possible (curl, wget, etc. bloqués) |
| Système de fichiers | `--read-only` + tmpfs `/tmp` | Aucune écriture persistante |
| Utilisateur | `--user 1001:1001` + image préparée avec utilisateur non root | Pas d'écriture en `/etc/`, `/root/`, etc. |
| Capabilities | `--cap-drop=ALL` | Aucune capability Linux (pas de `setuid`, `net_admin`, etc.) |
| Appels système | `--security-opt seccomp=skillforge-seccomp.json` | Filtre custom (cf. `infra/sandbox/seccomp/`) |
| Privilèges | `--security-opt no-new-privileges` | Pas d'escalade via `setuid` |
| Mémoire | `--memory=256m --memory-swap=256m` | OOM killer à 256 Mo, pas de swap supplémentaire |
| CPU | `--cpus=1` | 1 seul vCPU dédié |
| Fork bomb | `--pids-limit=64` | Maximum 64 processus dans le conteneur |
| Timeout | géré par le `SandboxRunner` Java (5 s par défaut) | Conteneur tué si execution > timeout |
| Logs | tronquage à 64 Ko | Pas de DoS log spam |

## 4. Protocole de validation

### 4.1 Jeu de test "exécutions valides" (100 cas)

| Langage | Type | Nombre |
|---|---|---|
| PHP | code de solution + tests PHPUnit, tous passants | 25 |
| PHP | code de solution + tests PHPUnit, partiels (1-3 failures) | 15 |
| PHP | code de solution sans tests (juste php solution.php) | 10 |
| JS | code de solution + tests Jest, tous passants | 25 |
| JS | code de solution + tests Jest, partiels | 15 |
| JS | code de solution sans tests (juste node solution.js) | 10 |

Pour chaque cas, on vérifie :
- `status` = OK
- `exitCode` = 0
- `score` cohérent avec les tests
- `durationMs` < 2000 ms (médiane)

### 4.2 Jeu de test "attaques" (30 cas)

| # | Famille | Exemple | Attendu |
|---|---|---|---|
| 1-5 | Fork bomb | `while(true){ pcntl_fork(); }` en PHP | `OOM` ou `ERROR`, pas de freeze hôte |
| 6-10 | Accès réseau | `file_get_contents("http://attacker.com/")` | `ERROR` (réseau bloqué) |
| 11-15 | Lecture FS sensible | `cat /etc/passwd`, `file_get_contents("/root/.ssh/id_rsa")` | `ERROR` ou contenu vide (read-only + user 1001) |
| 16-20 | Écriture FS | `echo "x" > /etc/x`, `file_put_contents("/x")` | `ERROR` (read-only) |
| 21-23 | Évasion namespace | `nsenter`, `setns()` | `ERROR` (seccomp bloque) |
| 24-26 | Escalade | `setuid(0)`, `setresuid()` | `ERROR` (cap-drop + no-new-privileges) |
| 27-28 | Dépassement mémoire | allocation de 1 Go | `OOM` |
| 29-30 | Dépassement temps | `while(true);` | `TIMEOUT` |

### 4.3 Critère de validation

Le POC est validé si simultanément :
- ≥ 95 % des cas valides retournent `status = OK`
- **0 cas d'attaque** ne parvient à compromettre l'hôte
- Latence médiane (P50) < 2 secondes
- Latence P95 < 5 secondes

## 5. État actuel

| Élément | Statut |
|---|---|
| Service `backend-sandbox` (Spring Boot) | ✅ Implémenté |
| `SandboxRunner` avec Docker Java API | ✅ Implémenté |
| Tous les flags de durcissement appliqués | ✅ Implémenté |
| Profil seccomp custom | ✅ `infra/sandbox/seccomp/skillforge-seccomp.json` |
| Images Docker minimales PHP + Node | ✅ `infra/sandbox/php8.3/`, `infra/sandbox/node20/` |
| Endpoint `POST /sandbox/execute` | ✅ Avec validation Jakarta + clé interne |
| Parsing PHPUnit / Jest pour scoring | ✅ Avec tests unitaires |
| Filtre `X-Internal-Key` entre backend-app et backend-sandbox | ✅ |
| Client `SandboxApiClient` côté backend-app | ✅ |
| Endpoint candidat `POST /candidate/passations/{id}/run-code` | ✅ |
| Jeu de test "100 valides" | ⏳ À constituer (peut être généré avec ChatGPT ou GitHub Models) |
| Jeu de test "30 attaques" | ⏳ À constituer manuellement (CWE / OWASP) |
| Mesure réelle sur 130 cas | ⏳ À exécuter une fois les images Docker construites |
| Rapport chiffré final | ⏳ |

## 6. Risques traités par ce POC

- **R1 — Sandbox Docker non sécurisée (CRITIQUE)** : le cœur du POC est exactement cette vérification.
- **R5 — Coûts API** : aucun lien (la sandbox n'utilise pas de LLM).

## 7. Plan post-POC

Si validé :
- Documenter les flags dans le rapport de stage (chapitre Cybersécurité).
- Faire relire la configuration par M. Tsinjo (tuteur Cybersécurité).
- Passer au Sprint 5 (auto-grading + compte rendu IA).

Si partiellement validé (par exemple 1 attaque sur 30 réussit) :
- Analyser la faille précisément (CVE applicable ?).
- Restreindre davantage seccomp si possible.
- Documenter le risque résiduel et la mitigation supplémentaire (déploiement sur un nœud Kubernetes dédié, etc.).
