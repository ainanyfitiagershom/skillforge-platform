# Corrections du mémoire M2 MBDS — Mode d'emploi

Ce dossier regroupe les propositions de correction du mémoire SkillForge en
réponse à la fiche de retour du prof Rojo RABENANAHARY
(1er octobre 2026, verdict *« Corrections importantes »*).

**Objectif** : atteindre 18+/20 à la soutenance.

Deux générations de fichiers coexistent :
- **Vagues initiales** (dossiers 00, 02, 03, 04) : les premières propositions
  rédigées juste après la fiche prof. Elles ont servi à produire la version 3
  du mémoire.
- **Fix post-audit v2 et v3** (dossiers 06 à 16) : fix ciblés sur ce qui
  restait partiel après la v2, puis compléments pour la v3 et plan de
  dégraissage.

---

## Structure du dossier

### Suivi global

| Fichier | Rôle |
|---|---|
| `README.md` | Ce fichier — mode d'emploi |
| `00_journal_relectures.md` | Journal des relectures R-01 à R-08 (évite les régressions) |
| `00_suivi_consignes_prof.md` | **Tableau de bord des 54 critères du prof** avec statut par critère |
| `06_audit_v2.md` | Audit exhaustif de la v2 contre les 54 critères (septembre 2026) |

### Vagues initiales (premières propositions, sources de la v3)

| Fichier | Vague | Contenu |
|---|---|---|
| `02_etat_art.md` | V2 | État de l'art enrichi : IA + données + sécurité + synthèse choix (18 critères C) |
| `03_scrum_budget.md` | V3 | Scrum vérifiable + planning + risques + budget (5 critères E) |
| `04_finition.md` | V4 | Exigences, UML, tests, conclusion, bibliographie (17 critères A/B/D/F/G/H/I/J) |

### Fix post-audit (ciblés après v2, utilisés pour produire v3)

| Fichier | Critère | Contenu |
|---|---|---|
| `07_acronymes_glossaire.md` | M-A4 | Table d'acronymes (22 entrées) + glossaire (17 entrées) séparés |
| `08_renvois_biblio_222.md` | M-J2 | Corriger les 4 renvois biblio faux en 2.2.2 |
| `09_sources_orphelines.md` | M-J2 suite | Insérer les sources [1]-[5] dans le corps pour qu'elles ne soient pas orphelines |
| `10_MEGA_GUIDE_MEMOIRE.md` | multi | Guide des 5 fix de forme restants (mots-clés FR/EN, 2.5, Conclusion, 4.3.1-5, pagination x/N) |
| `12_PLANIFICATION_M-E7.md` | M-E7 | Nouvelle section Planification + Figure 1 (prévisionnel) + Figure 2 (réalisé) + 4 écarts |
| `13_UML_M-F2.md` | M-F2 | Diagramme d'activités + diagramme d'états de la passation (Mermaid prêts) |
| `14_BIBLIO_M-J1.md` | M-J1 | 5 nouvelles références (RGPD, loi 2014-038, AI Act, HELM, Combe) + 3 insertions dans le corps |
| `16_DEGRAISSAGE_v3_contenu.md` | M-A7 | **Plan de dégraissage courant** : passer de 48 à 40 pages uniquement par le contenu (10 fix, -7,1 pages) |

---

## Ordre d'application recommandé

### Si tu intègres pour la première fois dans le Word

Suivre l'ordre des vagues V2 → V3 → V4, puis appliquer les fix post-audit
dans l'ordre numérique (06, 07, 08, 09, 10, 12, 13, 14, 16).

### Si tu reprends la correction en cours de route

1. **Vérifier le statut dans `00_suivi_consignes_prof.md`** pour chaque critère
2. **Appliquer uniquement les fix non traités** selon la liste du suivi
3. **Terminer par le dégraissage** (`16_DEGRAISSAGE_v3_contenu.md`) une fois
   que toutes les corrections ont été intégrées

---

## Suivi d'avancement

Le fichier `00_suivi_consignes_prof.md` est la **source de vérité** sur
l'état des 54 critères. Il utilise les statuts suivants :

| Icône | Statut |
|---|---|
| ⏳ | À faire (non démarré) |
| 🟡 | Proposition prête, non intégrée au Word |
| 🟠 | Intégré au Word, à relire |
| ✅ | Intégré au Word, validé |
| ⚪ | Pas d'action nécessaire (déjà Conforme) |
| ❌ | Décision explicite de ne pas traiter |

---

## Règles de rédaction tenues sur toutes les corrections

Issues des relectures successives (voir `00_journal_relectures.md`) :

1. **Pas de phrase IA générique** — vocabulaire précis, pas de triade
   artificielle, pas de « notamment » à répétition
2. **Analyse réelle du projet avant d'affirmer** — vérifier dans le code,
   le repo Git et les fichiers de configuration
3. **Chaque chiffre doit être vérifiable** — relevé réel, montant confirmé,
   mesure exécutée. Si pas de source, mentionner *[à confirmer]* et ne pas
   inventer
4. **Rester fidèle aux consignes du prof** — chaque correction renvoie
   à un identifiant de critère (M-A1, M-C12, S-5, etc.)
5. **Accents français obligatoires** dans tous les textes (y compris
   majuscules : `État`, `À`, `École`)

---

## Zones intouchables (après v3)

Toute nouvelle itération doit préserver :

- **Chapitre 2 complet** — le prof demande à le renforcer, pas à le réduire
- **Les corrections déjà intégrées en v3** :
  - 2 diagrammes UML en 5.1 (séquence/activités + états passation) — M-F2
  - Tableau 7 enrichi des exigences non fonctionnelles — M-F3
  - Extraits de code (LlmClient + config sandbox) — M-G3
  - Section 5.3.2 Interfaces enrichie — M-F5
  - Section Planification + Figures 1 et 2 + 4 écarts — M-E7
  - Bibliographie enrichie [13]-[17] + 3 insertions dans 2.3 et 2.5 — M-J1
  - Table d'acronymes + glossaire séparés — M-A4
  - Renvois biblio corrigés en 2.2.2 — M-J2
  - Figure 11 (MCD) déplacée en annexe, Figure 12 condensée
- **Tableaux chiffrés** : budget 1 050 000 MGA, k6 p95 4,37 s, JUnit 27 tests,
  OWASP ZAP, livrables, risques, 90 jours, sprints, NFR

---

## Pour les slides et la soutenance

Les corrections liées aux slides et à la soutenance ne sont **plus dans ce
dossier** mais dans `docs/soutenance/` :

- `06_PLAN_SLIDES_V2.md` — plan complet des 20 slides v2
- `07_SCRIPT_ORAL_V2.md` — script oral à mémoriser (20 min)
- `08_SCRIPT_VIDEO_DEMO_V2.md` — script vidéo démo (5 min pile)

---

## Pour revenir sur une correction

Si une relecture ultérieure du prof ou de l'encadreur demande une nouvelle
itération :

1. Ouvrir le fichier concerné (`xx_sujet.md`)
2. Appliquer la modification demandée
3. Ajouter une entrée R-NN dans `00_journal_relectures.md` avec la date,
   la remarque reçue et la correction appliquée
4. Mettre à jour le statut dans `00_suivi_consignes_prof.md`
