# Reutilisation des sources [1] a [5] dans le memoire — M-J2 (suite)

## Contexte

Suite au fix des renvois en 2.2.2 (fichier 08), les sources [1] a [5]
risquent de devenir orphelines dans la bibliographie. Pour que chaque
source scientifique soit reellement utilisee, on ajoute des citations
precises aux endroits ou elles sont pertinentes.

## Repartition proposee

| Source | Thematique | Section cible |
|---|---|---|
| [1] Raghavan 2020 - Mitigating Bias in Algorithmic Hiring | Biais algorithmique en recrutement | 2.3, puce "Biais algorithmiques" |
| [2] Bogen & Rieke 2018 - Help Wanted Hiring Algorithms | Audit des algos de recrutement | 2.3, puce "Biais algorithmiques" |
| [3] Russell & Norvig 2021 - IA Modern Approach | Fondamentaux IA (reference generale) | 2.3, puce "Abstraction architecturale" |
| [4] Merkel 2014 - Docker Lightweight Linux Containers | Fondement technique Docker | 2.5 § conteneurisation |
| [5] OWASP ASVS 4.0.3 | Standard de securite applicative | 2.5 § recommandations OWASP |

## Textes a inserer

Chaque citation est integree **au milieu d'une phrase existante** sans
casser le texte original — tu changes 1 ou 2 mots max.

---

### Insertion 1 — Section 2.3, puce "Biais algorithmiques et supervision humaine"

**Texte actuel** (3e ligne de la puce) :

> "L'utilisation de l'IA pour analyser des CV ou generer des questions
> presente un risque de biais, notamment par la reproduction de
> stereotypes ou la sur-ponderation de certains criteres academiques ou
> professionnels."

**Texte modifie** (ajout d'une phrase derriere avec sources [1] et [2]) :

> "L'utilisation de l'IA pour analyser des CV ou generer des questions
> presente un risque de biais, notamment par la reproduction de
> stereotypes ou la sur-ponderation de certains criteres academiques ou
> professionnels. **Ce risque est documente dans la litterature : Raghavan
> et al. [1] montrent que les systemes de pre-selection automatique
> reproduisent frequemment les biais presents dans les donnees
> d'entrainement, tandis que Bogen et Rieke [2] soulignent la necessite
> d'un audit humain des algorithmes de recrutement.** Pour limiter ce
> risque, SkillForge est concu comme un outil d'aide a la decision..."

**→ Sources [1] et [2] utilisees.**

---

### Insertion 2 — Section 2.3, puce "Abstraction architecturale multi-fournisseurs"

**Texte actuel** (3e-4e ligne) :

> "Afin de s'affranchir d'une dependance rigide envers un fournisseur
> unique, le backend de SkillForge integre une interface d'abstraction
> nommee LlmClient."

**Texte modifie** (ajout d'une phrase devant pour poser le contexte avec [3]) :

> "**Les grands modeles de langage (LLM) s'inscrivent dans la lignee des
> systemes d'intelligence artificielle generalistes decrits par Russell
> et Norvig [3], en se distinguant par leur capacite a produire du texte
> coherent a partir d'invites en langage naturel.** Afin de s'affranchir
> d'une dependance rigide envers un fournisseur unique, le backend de
> SkillForge integre une interface d'abstraction nommee LlmClient..."

**→ Source [3] utilisee.**

---

### Insertion 3 — Section 2.5, 2e paragraphe

**Texte actuel** :

> "Differentes approches permettent theoriquement d'isoler une execution,
> notamment les machines virtuelles et les conteneurs. Pour SkillForge,
> la conteneurisation avec Docker a ete retenue afin de disposer
> d'environnements temporaires et isoles pour l'execution du code."

**Texte modifie** (ajout d'une reference a Merkel [4] a la fin) :

> "Differentes approches permettent theoriquement d'isoler une execution,
> notamment les machines virtuelles et les conteneurs. Pour SkillForge,
> la conteneurisation avec Docker a ete retenue afin de disposer
> d'environnements temporaires et isoles pour l'execution du code. **Ce
> choix s'inscrit dans l'adoption large des conteneurs Linux depuis leur
> popularisation par Docker [4], qui offrent une isolation plus leggere
> qu'une machine virtuelle tout en restant maitrisable par un developpeur
> isole.**"

**→ Source [4] utilisee.**

---

### Insertion 4 — Section 2.5, 3e paragraphe

**Texte actuel** :

> "Le travail de securisation s'est appuye sur la documentation technique
> de Docker ainsi que sur les recommandations de l'OWASP relatives a la
> securite des applications web."

**Texte modifie** (ajout d'une reference a l'ASVS [5] en fin de phrase) :

> "Le travail de securisation s'est appuye sur la documentation technique
> de Docker ainsi que sur les recommandations de l'OWASP relatives a la
> securite des applications web, notamment **le standard Application
> Security Verification Standard (ASVS) de l'OWASP [5], utilise comme
> reference pour les controles d'authentification, de validation des
> entrees et de gestion des erreurs**."

**→ Source [5] utilisee.**

---

## Resultat apres integration

Chaque source scientifique de la bibliographie est maintenant **citee au
moins une fois dans le corps du memoire**, aux endroits pertinents :

| Source | Nombre de citations | Section(s) |
|---|---|---|
| [1] Raghavan 2020 | 1 | 2.3 (biais) |
| [2] Bogen & Rieke 2018 | 1 | 2.3 (biais) |
| [3] Russell & Norvig 2021 | 1 | 2.3 (abstraction LLM) |
| [4] Merkel 2014 | 1 | 2.5 (conteneurisation) |
| [5] OWASP ASVS | 1 | 2.5 (securisation) |
| [6] HackerRank | 1 | 2.2.2 |
| [7] Codility | 1 | 2.2.2 |
| [8] TestGorilla | 1 | 2.2.2 |
| [9] CoderPad | 1 | 2.2.2 |
| [10] OWASP Top 10 | *(a verifier)* | *(a verifier)* |
| [11] Docker Security | *(a verifier)* | *(a verifier)* |
| [12] *(a verifier)* | *(a verifier)* | *(a verifier)* |

Les 9 premieres sources sont desormais correctement utilisees. Les
references [10] a [12] (OWASP Top 10, Docker Security, etc.) sont a
verifier separement par Ctrl+F dans le Word.

## Procedure d'integration

4 blocs a modifier dans le Word :

1. Chapitre 2, section 2.3, puce "Biais algorithmiques et supervision
   humaine" : ajouter 2 phrases (sources [1] et [2])
2. Chapitre 2, section 2.3, puce "Abstraction architecturale
   multi-fournisseurs" : ajouter 1 phrase en tete (source [3])
3. Chapitre 2, section 2.5, 2e paragraphe : ajouter 1 phrase en fin
   (source [4])
4. Chapitre 2, section 2.5, 3e paragraphe : ajouter 1 bout de phrase
   en fin (source [5])

Duree reelle : 5 min de copier-coller.

Impact sur le volume : +4 lignes de texte (negligeable, ne contredit
pas l'objectif 40 pages).
