# Codes d'attaque prêts à coller pour la démo soutenance

Chaque code fait volontairement plus de 200 caractères pour déclencher le signal
anti-fraude `PASTE_SUSPICIOUS` au moment de la démo, en plus de la défense
sandbox elle-même.

**Astuce démo** : coller les 3 codes à la suite dans la même évaluation permet
de montrer à la fois :

- l'anti-fraude (3 copier-coller volumineux détectés)
- 3 types de protection sandbox différents (FS, timeout, réseau)

**Important** : attendre **plus de 3 secondes** entre deux copier-coller, sinon
le second est filtré par l'anti-doublon frontend (TYPE_THROTTLE_MS).

---

## Attaque 1 — Lecture de fichier système sensible

**But démo** : montrer que la sandbox refuse l'accès au système de fichiers
hors `/work`.

```javascript
// Attaque : tenter de lire un fichier systeme sensible depuis le conteneur
// La sandbox utilise le Permission Model de Node 20 pour bloquer tout
// acces au systeme de fichiers en dehors de /work et /usr.
const fs = require('fs');
const cibles = ['/etc/passwd', '/etc/shadow', '/proc/self/environ'];
for (const cible of cibles) {
    try {
        const contenu = fs.readFileSync(cible, 'utf8');
        console.log('FUITE sur ' + cible + ' : ' + contenu.substring(0, 60));
    } catch (e) {
        console.log('BLOQUE ' + cible + ' : ' + e.code);
    }
}
```

**Résultat attendu dans la sortie candidat** :

```
BLOQUE /etc/passwd : ERR_ACCESS_DENIED
BLOQUE /etc/shadow : ERR_ACCESS_DENIED
BLOQUE /proc/self/environ : ERR_ACCESS_DENIED
```

**Ce que tu dis au jury** : *« Trois tentatives de lecture, trois blocages par
le Permission Model de Node. Même `/etc/passwd` qui est world-readable au
niveau Linux reste inaccessible. »*

---

## Attaque 2 — Déni de service par boucle infinie

**But démo** : montrer que le timeout 5 s tue l'exécution.

```javascript
// Attaque : boucle de calcul infinie pour saturer le CPU du conteneur.
// La sandbox impose un timeout wall-clock de 5 secondes, apres quoi
// Docker envoie SIGKILL au processus (exit code 137).
let compteur = 0;
let total = 0;
console.log('Demarrage de la boucle infinie...');
while (true) {
    compteur++;
    total += Math.sqrt(compteur) * Math.sin(compteur);
    if (compteur % 1000000 === 0) {
        console.log('Iteration ' + compteur + ', total ' + total);
    }
}
```

**Résultat attendu** :

- Au bout de 5 secondes, le conteneur est tué
- Côté UI candidat : message « Exécution interrompue : temps dépassé »
- Côté API : `status: TIMEOUT, exitCode: 137`

**Ce que tu dis au jury** : *« Même une boucle totalement légitime ne peut
pas monopoliser la plateforme. Le timeout wall-clock à 5 secondes garantit
qu'une évaluation reste maîtrisable, quel que soit le code soumis. »*

---

## Attaque 3 — Tentative de connexion réseau externe

**But démo** : montrer que le flag `--network=none` isole le conteneur du
réseau.

```javascript
// Attaque : essayer de communiquer avec un serveur externe pour exfiltrer
// des donnees ou telecharger du code additionnel.
// La sandbox est lancee avec --network=none : aucun paquet reseau ne
// peut sortir du conteneur, meme la resolution DNS echoue.
const http = require('http');
const https = require('https');
const cibles = ['http://google.com', 'https://api.github.com'];
console.log('Tentative de connexion a ' + cibles.length + ' cibles...');
for (const url of cibles) {
    const mod = url.startsWith('https') ? https : http;
    try {
        mod.get(url, r => console.log('CONNECTE ' + url + ' : ' + r.statusCode));
    } catch (e) {
        console.log('BLOQUE ' + url + ' : ' + e.message);
    }
}
setTimeout(() => console.log('Fin'), 3000);
```

**Résultat attendu** :

- Dans stderr : `Error: getaddrinfo EAI_AGAIN google.com`
- Dans stderr : erreur similaire pour github.com
- Côté API : `status: ERROR, exitCode: 1`

**Ce que tu dis au jury** : *« Le conteneur n'a aucune carte réseau utilisable.
Même la résolution DNS échoue. Un candidat ne peut ni exfiltrer de données,
ni télécharger du code supplémentaire pour contourner la sandbox. »*

---

## Rappel sur l'anti-fraude affiché côté recruteur

Après avoir collé les 3 blocs **en espaçant d'au moins 3 secondes**, le compte
rendu recruteur doit afficher **3 événements `PASTE_SUSPICIOUS`** avec, pour
chacun, le nombre de caractères collés.

Si tu ne vois pas tous les événements :

1. Chaque bloc fait bien plus de 200 caractères (seuil `PASTE_THRESHOLD`)
2. Mais le frontend applique un throttle de 3 secondes entre deux événements
   du même type. Attends 3 secondes entre deux pastes.
3. Autre signal possible : si tu changes d'onglet entre les pastes, tu
   déclenches aussi `FOCUS_LOSS`.

## Ordre recommandé pour une démo propre (environ 90 secondes)

1. Coller le bloc **Attaque 1** (fichier système)
2. Cliquer **Exécuter** → montrer les 3 lignes `BLOQUE`
3. Attendre 4 secondes
4. Coller le bloc **Attaque 2** (boucle infinie)
5. Cliquer **Exécuter** → attendre les 5 secondes du timeout
6. Attendre 4 secondes
7. Coller le bloc **Attaque 3** (réseau)
8. Cliquer **Exécuter** → montrer les erreurs DNS
9. Soumettre l'évaluation
10. Revenir côté recruteur → ouvrir le compte rendu → montrer les 3
    événements `PASTE_SUSPICIOUS` et les 3 attaques bloquées
