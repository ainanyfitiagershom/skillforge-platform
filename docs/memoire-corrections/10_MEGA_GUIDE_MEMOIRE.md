# Mega-guide memoire — tout ce qui reste a coller dans le Word

Ce fichier contient **tout** ce qu'il te reste a corriger dans le memoire
v2 pour satisfaire la fiche de retour du prof. Chaque fix est auto-portant :
titre, instruction, texte final pret a coller.

**Deja fait** (ne pas refaire) :
- ✅ Titre du memoire (M-A1)
- ✅ Table d'acronymes + Glossaire separes (M-A4)
- ✅ Renvois biblio 2.2.2 (M-J2, premiere partie)
- ✅ Section 2.3 enrichie avec sources [1][2][3]

**A faire** (ordre d'apparition dans le Word, pour que tu avances
lineairement sans sauter) :

1. Mots-cles FR + EN dans Resume / Abstract (M-A2)
2. Section 2.5 enrichie avec sources [4] et [5] (M-J2 suite)
3. Renommer "Conclusion generale" en "Conclusion" (M-I1)
4. Numeroter les sous-sections 4.3.1 a 4.3.5 (M-A5)
5. Pagination x/N (M-A6) — tu as dit que tu le fais a la fin

---

## FIX 1 — Mots-cles FR + EN dans Resume / Abstract (M-A2)

### Instruction

Dans ton Resume (page du front matter apres la page de garde), **ajoute**
a la fin du resume francais une ligne "Mots-cles" avant le resume anglais.
Pareil pour l'Abstract anglais.

### Texte a ajouter — Resume francais (apres le dernier paragraphe)

```
Mots-cles : recrutement technique, evaluation de competences, LLM,
sandbox Docker, securite applicative, Spring Boot, React, Scrum.
```

### Texte a ajouter — Abstract anglais (apres le dernier paragraphe)

```
Keywords: technical recruitment, skills assessment, LLM, Docker sandbox,
application security, Spring Boot, React, Scrum.
```

### Mise en forme

- Puce ou simple paragraphe, au choix
- Mettre "Mots-cles" / "Keywords" en gras
- Font identique au reste du resume

---

## FIX 2 — Section 2.5 enrichie avec sources [4] et [5] (M-J2 suite)

### Instruction

Dans ton Word, va au chapitre 2, section 2.5 "Securite de l'execution du
code candidat". Remplace **l'integralite de la section** (jusqu'avant
"2.6 Qualite...") par ce bloc **tout pret a coller** :

### Texte complet pret a coller

```
2.5 Securite de l'execution du code candidat

L'execution de code soumis par un candidat constitue l'un des principaux
risques techniques de SkillForge. Un programme fourni par un utilisateur
externe peut contenir une erreur, consommer excessivement des ressources
ou tenter d'acceder a des elements qui ne lui sont pas destines.
L'executer directement dans le backend principal aurait donc cree une
exposition inutile pour le reste de l'application.

Differentes approches permettent theoriquement d'isoler une execution,
notamment les machines virtuelles et les conteneurs. Pour SkillForge, la
conteneurisation avec Docker a ete retenue afin de disposer
d'environnements temporaires et isoles pour l'execution du code. Ce choix
s'inscrit dans l'adoption large des conteneurs Linux depuis leur
popularisation par Docker [4], qui offrent une isolation plus legere
qu'une machine virtuelle tout en restant maitrisable par un developpeur
isole. La sandbox a egalement ete separee du backend principal afin de
reduire l'exposition des donnees et des fonctionnalites metier.

Le travail de securisation s'est appuye sur la documentation technique de
Docker ainsi que sur les recommandations de l'OWASP relatives a la
securite des applications web, notamment le standard Application Security
Verification Standard (ASVS) de l'OWASP [5], utilise comme reference pour
les controles d'authentification, de validation des entrees et de gestion
des erreurs. L'objectif n'est pas de considerer le conteneur comme une
protection absolue, mais de combiner plusieurs mecanismes d'isolation et
de restriction afin de reduire les possibilites d'action du code execute.

Cette problematique a occupe une place importante pendant le
developpement. La sandbox a fait l'objet de tests specifiques et de
plusieurs ameliorations successives. Les mecanismes effectivement mis en
oeuvre et les resultats obtenus sont detailles dans les chapitres
consacres a la conception et aux tests.
```

### Ce qui a change par rapport a ta version actuelle

- 2e paragraphe : ajout d'une phrase citant Merkel [4] apres "...execution
  du code."
- 3e paragraphe : la mention OWASP est enrichie avec la reference ASVS [5]

Les 1er et 4e paragraphes sont inchanges.

---

## FIX 3 — Renommer "Conclusion generale" en "Conclusion" (M-I1)

### Instruction

Dans la Table des matieres **ET** sur la page de titre du chapitre 9 du
mémoire :

| Avant | Apres |
|---|---|
| **9. Conclusion generale** | **9. Conclusion** |

### Procedure Word

1. Utilise Ctrl+F → "Conclusion generale" → Remplacer par "Conclusion"
2. Clique "Remplacer tout" (il devrait trouver 2 occurrences : la ToC
   et le titre du chapitre)
3. Mets a jour la ToC : clic droit sur la ToC → "Mettre a jour les
   champs" → "Mettre a jour toute la table"

### Verification

Dans la ToC, la ligne doit maintenant afficher **"9. Conclusion"** (sans
"generale"). Pareil sur la page du chapitre.

---

## FIX 4 — Numeroter les sous-sections 4.3.1 a 4.3.5 (M-A5)

### Instruction

Dans ton chapitre 4, section 4.3 "Planification et pilotage" (ou nom
proche), les 5 intertitres actuels n'ont **pas de numerotation**. Il faut
les numeroter.

### Avant / Apres

| Avant (sans numerotation) | Apres (numerote) |
|---|---|
| Backlog du projet : | **4.3.1 Backlog du projet** |
| Estimation de la charge : | **4.3.2 Estimation de la charge** |
| Decoupage en iterations : | **4.3.3 Decoupage en iterations** |
| Suivi et pilotage : | **4.3.4 Suivi et pilotage** |
| Planification : | **4.3.5 Planification** |

### Procedure Word

1. Pour chacun des 5 intertitres, applique le style "Titre 3" (si tes
   titres 4.1, 4.2 sont en "Titre 2")
2. Si tes niveaux de titre sont numerotes automatiquement, Word
   generera 4.3.1 a 4.3.5 tout seul
3. Si numerotation manuelle : tape "4.3.1 ", "4.3.2 ", etc. devant
   chaque intertitre
4. Retire les ":" en fin de titre (c'est redondant avec le numero)
5. Mets a jour la ToC (clic droit → Mettre a jour toute la table)

### Verification

Dans la ToC, tu dois voir maintenant la section 4.3 developpee avec ses
5 sous-sections numerotees :

```
4.3 Planification et pilotage ................. XX
    4.3.1 Backlog du projet .................. XX
    4.3.2 Estimation de la charge ............ XX
    4.3.3 Decoupage en iterations ............ XX
    4.3.4 Suivi et pilotage .................. XX
    4.3.5 Planification ...................... XX
```

---

## FIX 5 — Pagination x/N (M-A6)

Tu as dit que tu le fais toi-meme a la fin. Pour memo :

- Format attendu : "12 / 48" (ou "Page 12 de 48")
- Appliquer sur **toutes les pages du corps** (de l'Introduction a la fin
  des annexes)
- Pas sur le front matter (page de garde, resume, abstract, ToC,
  acronymes, glossaire) si tu as un systeme de pagination separe
- Dans Word : Insertion → Numero de page → Position actuelle → "Page X de Y"
- Si Word met "Page X sur Y" c'est OK aussi

---

## Verification finale avant impression / envoi

Apres avoir fait les 5 fix ci-dessus :

- [ ] FIX 1 : Mots-cles presents en bas du resume ET de l'abstract
- [ ] FIX 2 : Phrases Merkel [4] et ASVS [5] bien ajoutees dans 2.5
- [ ] FIX 3 : "Conclusion generale" devenu "Conclusion" partout (ToC + chapitre)
- [ ] FIX 4 : Sous-sections 4.3.1 a 4.3.5 numerotees et visibles dans la ToC
- [ ] FIX 5 : Pagination au format x/N sur toutes les pages du corps
- [ ] ToC mise a jour (clic droit → Mettre a jour toute la table)
- [ ] Verification visuelle : aucun orphelin "[1]" a "[9]" non utilise
- [ ] Verification visuelle : les tableaux Acronymes et Glossaire
      apparaissent juste apres la Liste des tableaux

## Export final

Export du Word en PDF :
- Fichier → Exporter → Creer PDF/XPS
- Nommer : `MEMOIRE-ETU1776-GERSHOM-Fitia-MBDS-v3.pdf`
- Verifier que le PDF genere contient bien les corrections
