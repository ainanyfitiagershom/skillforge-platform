# Rapport POC 3 — Sandbox Docker sécurisée

**Date :** 2026-08-05T09:15:42.757873331Z  
**Cas exécutés :** 150 (100 VALID + 50 ATTACK)  
**Sandbox :** conteneur Docker éphémère, no-network + readonly-rootfs + seccomp + drop-caps + memory 256 Mo + PID limit 64 + timeout 5 s

## Critères de succès CDC (§5 POC 3)

| Critère | Cible CDC | Mesuré | Verdict |
|---|---|---|---|
| Succès exécutions valides | ≥ 95 % | 100.0 % | ✅ |
| Latence médiane valides | < 2 000 ms | 330 ms | ✅ |
| Latence p95 valides | (info) | 422 ms | ℹ️ |
| Évasions attaques | 0 | 0 | ✅ |

## Matrice attaques par catégorie

| Catégorie | Total | Bloqués | Évasions | Verdict |
|---|---|---|---|---|
| bonus | 2 | 2 | 0 | ✅ |
| escape | 8 | 8 | 0 | ✅ |
| fork-dos | 8 | 8 | 0 | ✅ |
| fs-read | 8 | 8 | 0 | ✅ |
| fs-write | 8 | 8 | 0 | ✅ |
| memory | 8 | 8 | 0 | ✅ |
| network | 8 | 8 | 0 | ✅ |

## Latences (ms)

- Médiane VALID : 330 ms
- P95 VALID : 422 ms
- Médiane ATTACK (majoritairement timeouts/kills, valeur informative) : 326 ms

## Fichiers produits

- CSV brut : `results/results-2026-08-05_09-15-42.csv`
- CSV dernier : `results/latest.csv`
- Ce rapport : `RAPPORT_POC3.md` (généré automatiquement à chaque run)
