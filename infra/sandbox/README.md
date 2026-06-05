# Sandbox runtime — Images Docker durcies

Ce dossier contient les images Docker minimales utilisees par le service
`backend-sandbox` pour executer le code candidat en environnement isole.

## Construire les images

```bash
# Depuis la racine du repo
docker build -t skillforge-runtime-php:8.3 infra/sandbox/php8.3/
docker build -t skillforge-runtime-node:20 infra/sandbox/node20/
```

A faire une seule fois (les images sont mises en cache localement).

## Tester rapidement qu'elles fonctionnent

```bash
docker run --rm skillforge-runtime-php:8.3 php -r 'echo "ok\n";'
docker run --rm skillforge-runtime-node:20 node -e 'console.log("ok")'
```

## Configuration de durcissement appliquee au runtime

Les images sont volontairement minimales (Alpine + langage + outil de test).
Le **vrai durcissement** est applique par le SandboxRunner (cote Java) au moment
de chaque execution `docker run`, via les flags suivants :

| Flag | Effet |
|---|---|
| `--network none` | Aucun acces reseau possible |
| `--read-only` | Systeme de fichiers en lecture seule |
| `--user 1001:1001` | Pas d'execution en root |
| `--cap-drop=ALL` | Aucune capability Linux |
| `--security-opt seccomp=skillforge-seccomp.json` | Filtre d'appels systeme |
| `--security-opt no-new-privileges` | Pas d'escalade de privileges |
| `--memory=256m` | Limite RAM |
| `--cpus=1` | Limite CPU |
| `--pids-limit=64` | Bloque les fork bombs |
| `--tmpfs /tmp:rw,noexec,nosuid,size=64m` | Tmpfs sans execution possible |

## Profil seccomp

`seccomp/skillforge-seccomp.json` definit la liste des appels systeme autorises
et refuses. Il refuse explicitement :

- `mount`, `umount` : pas de modification du systeme de fichiers
- `ptrace` : pas de debug d'autres processus
- `reboot`, `kexec_load` : pas d'arret du systeme
- `bpf`, `perf_event_open` : pas de profilage kernel
- `setns`, `unshare`, `clone` (partiel) : pas d'evasion de namespace
- `init_module`, `delete_module` : pas de chargement de module kernel
- `ptrace`, `process_vm_readv/writev` : pas de lecture/ecriture memoire d'autres processus

Tous les appels classiques (read, write, mmap, open, etc.) restent autorises
pour ne pas casser le runtime du langage.

## Cas d'attaque testes au POC 3

Cf. `docs/03-poc/poc-03-sandbox.md` :

1. **Fork bomb** (`:(){ :|:& };:`) → bloque par `--pids-limit=64`
2. **Acces reseau** (`curl https://...`) → bloque par `--network none`
3. **Lecture /etc/passwd** → bloque par `--read-only` + `--user 1001`
4. **Ecriture disque** (`echo > /etc/x`) → bloque par `--read-only`
5. **Depassement memoire** (allocation de 1 Go) → tue par `--memory=256m`
6. **Depassement temps** (boucle infinie) → tue par timeout 5s du runner
