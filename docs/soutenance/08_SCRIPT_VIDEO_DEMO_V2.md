# Script vidéo démo SkillForge v2 — 5 min pile, alignée slides 14-15-16

> Document rédigé le 2026-10-06. Aligné sur `06_PLAN_SLIDES_V2.md` (slides 14/20, 15/20, 16/20) et `07_SCRIPT_ORAL_V2.md` (bloc démo 13:35 → 16:35).
> Objectif : vidéo muette de 5 min 00 pile, projetée pendant les slides 14/20, 15/20 et 16/20 de la soutenance. L'étudiant commente en direct avec les phrases exactes du script oral v2.

---

## 0. Vue d'ensemble

- **Durée totale** : **5 min 00 pile** (bornée, non négociable)
- **Format** : MP4 1920×1080, 30 fps, H.264, bitrate 8 Mbps minimum
- **Son** : muette (ou son UI léger, clics discrets autorisés)
- **Sous-titres** : NON (la slide porte le titre, les labels doivent se voir à l'écran)
- **Lecture** : plein écran pendant les slides 14/20 → 15/20 → 16/20 de la soutenance
- **Rôle** : support visuel, l'étudiant commente en direct avec le script oral v2
- **Rôle secondaire** : sert aussi de vidéo de secours intégrale si plantage réseau pendant la soutenance

| Bloc | Slide | Fenêtre vidéo | Durée | Contenu principal |
|---|---|---|---|---|
| 1 | 14/20 Recruteur | 0:00 → 1:45 | 1 min 45 | Connexion, création évaluation, upload CV, analyse IA, génération questions, invitation Mailpit |
| 2 | 15/20 Candidat | 1:45 → 3:30 | 1 min 45 | Lien unique, consentement, QCM, exercice code, exécution sandbox OK, signaux anti-fraude |
| 3 | 16/20 Attaque bloquée | 3:30 → 5:00 | 1 min 30 | Code malveillant, SECURITY_VIOLATION, log seccomp, rapport recruteur anti-fraude |

**Total : 5:00 pile.**

---

## 1. Préparation setup avant tournage

### 1.1 Matériel et logiciel

- Enregistreur : OBS Studio (recommandé) ou SimpleScreenRecorder
- Résolution de capture : 1920×1080, 30 fps
- Fichiers sortie : `demo-skillforge-v2.mp4` sur le bureau + copie sur clé USB
- Pas de micro, pas de voix off
- Son UI du système autorisé (clics, bip de validation), désactiver notifications système

### 1.2 Comptes et données préparés

- Compte recruteur : `recruteur@tsarajoro.mg`, déjà connecté sur `http://localhost:3000`
- CV de démo : `cv-demo.pdf` (candidat fictif « Rakoto Jean, développeur Java/React 3 ans »), déposé sur le bureau
- Compte candidat : lien d'invitation unique généré pendant le tournage
- Mailpit lancé sur `http://localhost:8025`
- Backend Spring Boot lancé en local (profil `demo`)
- Docker daemon actif, image sandbox préchargée (`skillforge-sandbox:latest`)
- Terminal visible dans un coin pour les logs sandbox du bloc 3

### 1.3 Fenêtres à préparer avant d'enregistrer

- Fenêtre 1 (Chrome) : navigateur normal, onglet 1 = dashboard recruteur, onglet 2 = Mailpit `:8025`
- Fenêtre 2 (Chrome navigation privée) : vierge, prête à recevoir le lien candidat
- Fenêtre 3 (terminal) : affiche les logs backend (`tail -f` sur le log Spring Boot filtré sur `sandbox`)
- Toutes les fenêtres positionnées à l'avance, raccourcis clavier testés
- Zoom navigateur à 110 % pour que les labels soient lisibles de loin

### 1.4 Fichier d'attaque préparé

Fichier `attaque-demo.txt` dans le presse-papier au moment du bloc 3 — code Java minimal :

```java
import java.io.*;
import java.net.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        // Attaque 1 : lecture /etc/passwd
        BufferedReader r = new BufferedReader(new FileReader("/etc/passwd"));
        System.out.println(r.readLine());
        // Attaque 2 : appel réseau sortant
        Socket s = new Socket("example.com", 80);
        s.getOutputStream().write("GET / HTTP/1.0\n\n".getBytes());
    }
}
```

### 1.5 Vérifications finales avant « rec »

- Horloge système : masquée ou neutralisée
- Barre de tâches : masquée (plein écran)
- Fenêtre Mailpit : vidée des anciens mails
- Base PostgreSQL : évaluation précédente supprimée (dashboard vierge sauf une évaluation témoin pour montrer que le compte est vivant)
- Chronomètre à l'écran : NON, le repère de temps se fait sur la timeline de montage

---

## 2. Bloc 1 — Slide 14/20 Parcours recruteur (0:00 → 1:45)

### 2.1 Pré-conditions à l'image

- Chrome plein écran, zoom 110 %
- Déjà connecté sur `recruteur@tsarajoro.mg`, dashboard recruteur affiché
- Le dashboard montre : 1 ancienne évaluation témoin, le bouton « + Nouvelle évaluation » bien visible
- Pas de curseur de souris visible au démarrage, apparaît à 0:03

### 2.2 Séquence détaillée

| Time | Action à l'écran | Détail visuel |
|---|---|---|
| 0:00 | Dashboard recruteur affiché, immobile | Statistiques en haut, liste évaluations en dessous |
| 0:03 | Curseur apparaît, survole la barre de nav | Montrer brièvement « SkillForge » en haut à gauche |
| 0:06 | Clic sur « + Nouvelle évaluation » | Modal s'ouvre |
| 0:12 | Saisie titre évaluation : « Développeur Java/React — Rakoto Jean » | Frappe clavier visible |
| 0:20 | Clic sur « Importer CV » | Zone de drop apparaît |
| 0:23 | Drag & drop de `cv-demo.pdf` depuis le bureau | Pictogramme PDF visible 1 s |
| 0:28 | Clic « Lancer l'analyse IA » | Indicateur de chargement circulaire |
| 0:30 | Attente analyse IA (loader animé) | Loader + texte « Analyse en cours... » |
| 0:40 | Résultat analyse IA s'affiche | Panneau « Compétences détectées » |
| 0:42 | **Zoom** sur la liste compétences 2 s | Java, Spring Boot, React, SQL, Git (5 compétences surlignées) |
| 0:50 | Clic sur « Valider les compétences » | Bouton primaire |
| 0:55 | Clic « Générer les questions » | Loader bref |
| 1:00 | Attente génération IA | Loader + texte « Génération en cours... » |
| 1:12 | Résultat : 3 blocs de questions apparaissent | QCM (5 questions) + Exercice code (1) + Cas pratique (1) |
| 1:15 | **Zoom** sur le bloc QCM 2 s | Montrer un intitulé QCM Java |
| 1:19 | Scroll vers le bloc exercice code | Montrer l'énoncé « Implémenter une fonction... » |
| 1:23 | Scroll vers le cas pratique | Titre + résumé |
| 1:27 | Clic « Valider le lot de questions » | Toast de confirmation |
| 1:30 | Clic « Inviter le candidat » | Modal avec email pré-rempli |
| 1:33 | Clic « Envoyer l'invitation » | Toast « Invitation envoyée » |
| 1:36 | **Switch** vers l'onglet Mailpit `:8025` | Boîte Mailpit affiche 1 nouveau mail |
| 1:39 | Clic sur le mail reçu | Mail s'ouvre : objet « Votre évaluation technique SkillForge » |
| 1:42 | **Zoom** sur le lien d'invitation unique | Flèche visuelle ou surlignage jaune 2 s |
| 1:45 | **Transition** : fondu court (0.3 s) vers bloc 2 | — |

### 2.3 Ce que l'étudiant dit en direct (script oral slide 14/20)

> « Voici la plateforme en direct. Je me connecte comme recruteur. Je crée une nouvelle évaluation et j'importe le CV du candidat. L'analyse IA tourne — en quelques secondes, les compétences détectées s'affichent. Je peux les ajuster manuellement avant validation. Une fois validées, je lance la génération des questions. La plateforme propose trois types de contenu : un QCM, un exercice de code, et un cas pratique, tous adaptés au profil extrait. Je valide le lot, puis j'invite le candidat. L'email part — je vous le montre dans Mailpit — avec un lien unique et un consentement à cocher. »

### 2.4 Points visuels critiques à filmer

- Compétences détectées lisibles à l'écran (surlignage 2 s)
- Les 3 types de questions bien distincts
- Mail Mailpit avec lien unique visible

---

## 3. Bloc 2 — Slide 15/20 Parcours candidat (1:45 → 3:30)

### 3.1 Pré-conditions à l'image

- Switch sur la fenêtre Chrome navigation privée (fond gris foncé caractéristique)
- Barre d'adresse vide au début, lien candidat prêt dans le presse-papier

### 3.2 Séquence détaillée

| Time | Action à l'écran | Détail visuel |
|---|---|---|
| 1:45 | Fenêtre navigation privée vide | Reconnaissable au thème sombre |
| 1:48 | Collage du lien candidat dans la barre d'adresse | Paste visible (Ctrl+V) |
| 1:50 | Chargement page candidat | Logo SkillForge + titre évaluation |
| 1:53 | Page d'accueil candidat affichée | Nom candidat, titre évaluation, bouton « Commencer » |
| 1:56 | Scroll vers la section consentement | Texte RGPD + case à cocher |
| 2:00 | Clic sur la case consentement | Case passe en coché, texte visible |
| 2:03 | Clic « Commencer l'évaluation » | Transition vers la 1re question |
| 2:06 | Question QCM 1/5 affichée | « Quelle annotation Spring déclare un bean de service ? » |
| 2:10 | Clic sur réponse « @Service » | Réponse surlignée |
| 2:13 | Clic « Question suivante » | Transition |
| 2:16 | Question QCM 2/5 | « Quelle méthode HTTP est idempotente ? » |
| 2:20 | Clic sur « PUT » | Réponse surlignée |
| 2:23 | Scroll rapide à la question code | Transition vers l'éditeur |
| 2:28 | Éditeur Monaco affiché, squelette Java visible | Code `public class Solution { ... }` |
| 2:32 | **Zoom** sur l'éditeur 2 s | Montrer la coloration syntaxique |
| 2:36 | Frappe d'une solution simple (10 lignes) | Fonction qui retourne une somme |
| 2:52 | Clic « Exécuter dans la sandbox » | Loader + texte « Exécution... » |
| 2:55 | Attente sandbox (loader) | — |
| 3:00 | Résultat affiché : **statut OK**, durée **0,34 s** | Panneau vert « Exécution réussie » |
| 3:02 | **Zoom** sur le panneau résultat 2 s | Statut + durée bien visibles |
| 3:06 | Clic « Soumettre la réponse » | Toast de confirmation |
| 3:10 | Déclenchement volontaire anti-fraude 1 : copier-coller massif (Ctrl+A puis Ctrl+V du presse-papier) | Petit badge rouge « Événement détecté » en haut à droite 2 s |
| 3:16 | Déclenchement volontaire anti-fraude 2 : changement d'onglet puis retour | Badge « Changement d'onglet détecté » 2 s |
| 3:22 | Clic « Soumettre l'évaluation complète » | Toast « Évaluation envoyée » |
| 3:26 | Page de confirmation candidat | « Merci, vos résultats ont été transmis au recruteur » |
| 3:30 | **Transition** : fondu court (0.3 s) vers bloc 3 | — |

### 3.3 Ce que l'étudiant dit en direct (script oral slide 15/20)

> « Le candidat ouvre son lien unique. Il coche le consentement avant toute donnée collectée. Il répond au QCM, puis attaque l'exercice de code. Quand il lance l'exécution, le code part dans la sandbox, j'y reviens dans un instant. Je vais aussi déclencher volontairement deux signaux anti-fraude : un copier-coller massif, et un changement d'onglet. Vous voyez que l'évènement est tracé, sans bloquer le candidat — c'est le recruteur qui décidera en analysant le rapport. »

### 3.4 Points visuels critiques à filmer

- Case consentement cochée avant toute action
- Éditeur Monaco bien visible, coloration syntaxique lisible
- Statut OK et durée d'exécution (≈ 0,34 s) bien visibles — c'est la preuve que la sandbox fonctionne
- Les 2 badges anti-fraude qui apparaissent sans bloquer le candidat

---

## 4. Bloc 3 — Slide 16/20 Attaque bloquée (3:30 → 5:00)

### 4.1 Pré-conditions à l'image

- Fenêtre navigation privée toujours ouverte (on bascule depuis le candidat sur une nouvelle passation de démo)
- Fichier `attaque-demo.txt` déjà dans le presse-papier
- Terminal avec logs backend visible en arrière-plan ou en picture-in-picture (coin inférieur droit)

### 4.2 Séquence détaillée

| Time | Action à l'écran | Détail visuel |
|---|---|---|
| 3:30 | Retour sur une passation de démo côté candidat, question code ouverte | Éditeur Monaco vide |
| 3:34 | Collage du code malveillant (Ctrl+V) | Code s'affiche dans l'éditeur |
| 3:38 | **Zoom** sur le code malveillant 3 s | Surligner la ligne `FileReader("/etc/passwd")` + la ligne `new Socket(...)` |
| 3:44 | Clic « Exécuter dans la sandbox » | Loader + texte « Exécution... » |
| 3:48 | Attente sandbox 2 s | — |
| 3:50 | **Résultat affiché : panneau rouge** | **Statut `SECURITY_VIOLATION`** + durée blocage ≈ 0,08 s |
| 3:52 | **Zoom** très marqué sur le statut `SECURITY_VIOLATION` 3 s | Flèche visuelle rouge + surlignage |
| 3:57 | Message du conteneur affiché | « Opération refusée par la politique seccomp : openat (/etc/passwd) et socket (AF_INET) bloqués » |
| 4:02 | **Zoom** sur le message d'erreur 3 s | Les 2 syscalls bloqués bien visibles |
| 4:08 | **Switch picture-in-picture** sur le terminal logs backend | Afficher la ligne de log : `seccomp: syscall=openat denied, syscall=socket denied — container killed` |
| 4:13 | **Zoom** sur la ligne de log seccomp 4 s | Surlignage jaune, flèche vers « killed » |
| 4:20 | Retour fenêtre principale (recruteur) | Switch onglet vers dashboard recruteur |
| 4:23 | Clic sur la passation du candidat Rakoto Jean | Ouverture du rapport |
| 4:27 | Rapport final affiché | Score global, forces, faiblesses, section anti-fraude |
| 4:30 | **Zoom** sur le score global 2 s | Score pondéré visible |
| 4:34 | Scroll vers la section « Forces / Faiblesses » | Deux colonnes synthèse IA |
| 4:40 | **Zoom** sur la section anti-fraude 3 s | Liste événements : copier-coller, changement onglet, **tentative d'évasion sandbox détectée** |
| 4:47 | **Zoom** sur la ligne « tentative d'évasion sandbox détectée » | Surligner en rouge |
| 4:52 | Clic sur « Tableau de bord analytique » | Vue agrégée des passations |
| 4:56 | **Zoom** 2 s sur l'indicateur « 0 évasion / 50 attaques testées » | Chiffre bien visible |
| 5:00 | Fin de vidéo (fondu noir 0,5 s) | — |

### 4.3 Ce que l'étudiant dit en direct (script oral slide 16/20)

> « Je bascule dans l'exercice et je saisis un code malveillant. Deux attaques classiques : lire /etc/passwd, puis ouvrir un appel réseau sortant. Je lance. Vous voyez : les deux appels système sont bloqués par seccomp, et le réseau est coupé par la configuration network-none. La sandbox renvoie une erreur, le reste de la plateforme n'est pas affecté. Je repasse côté recruteur. Le rapport final s'ouvre : score global, forces et faiblesses détectées par l'IA, et une section anti-fraude qui liste les évènements du candidat. Je rappelle le principe : l'IA propose la synthèse, le recruteur décide. »

### 4.4 Points culminants visuels (à filmer avec soin)

- **Statut `SECURITY_VIOLATION`** : le mot doit être lisible en gros, surligné 3 s minimum
- **Durée de blocage** : ≈ 0,08 s, bien en dessous du timeout 5 secondes
- **Message du conteneur** : les 2 syscalls bloqués (`openat` et `socket`) explicitement cités
- **Ligne de log seccomp** : la ligne qui a tué le process, surlignée en jaune
- **Rapport anti-fraude** : la ligne « tentative d'évasion sandbox détectée » surlignée en rouge
- **Indicateur agrégé** : « 0 évasion / 50 attaques testées » en gros à la fin

---

## 5. Montage et post-production

### 5.1 Règles de montage

- **Pas de voix off** : muette intégrale (l'étudiant commente en direct)
- **Son UI** : léger, autorisé (clics discrets, bip de confirmation). À baisser à -20 dB
- **Sous-titres** : NON (les labels de l'UI doivent se voir ; la slide porte le titre)
- **Fondus entre blocs** : courts, 0,3 s max (cut sec préféré)
- **Fondu de fin** : fondu noir 0,5 s à 5:00 pile
- **Zoom** : via animation du montage, pas via l'enregistrement. Durée zoom 2-4 s selon le point
- **Surlignages** : rectangles jaunes semi-transparents (opacité 40 %) sur les éléments clés
- **Flèches** : rouges ou noires, apparition/disparition en 0,2 s, maintenues 2 s

### 5.2 Timeline de contrôle

| Repère | Attendu | Marge |
|---|---|---|
| 0:00 | Début bloc 1 recruteur | 0 s |
| 1:45 | Fin bloc 1 / début bloc 2 candidat | ± 1 s |
| 3:30 | Fin bloc 2 / début bloc 3 attaque | ± 1 s |
| 5:00 | Fin de la vidéo (fondu noir) | 0 s pile |

Si un bloc dépasse en tournage, recouper au montage. **5:00 pile, non négociable.**

### 5.3 Export final

- Container : MP4
- Codec vidéo : H.264 (libx264)
- Résolution : 1920×1080
- Framerate : 30 fps
- Bitrate : 8 Mbps minimum (12 Mbps conseillé)
- Audio : AAC 128 kbps (ou pas d'audio si vidéo totalement muette)
- Fichier : `demo-skillforge-v2.mp4` (≈ 300-450 Mo)

### 5.4 Tests avant soutenance

- Lecture sur l'ordinateur de la soutenance (compatibilité VLC + lecteur système)
- Lecture sur un deuxième ordinateur (sécurité)
- Lecture plein écran sur un projecteur si possible
- Vérifier qu'aucune notification système ne s'affiche en bas à droite pendant la vidéo

---

## 6. Plan B — Si problème pendant la soutenance

### 6.1 Si la démo live plante (réseau IA en panne, backend qui crashe, etc.)

1. L'étudiant dit calmement : « Je bascule sur ma vidéo de secours, le résultat est identique. »
2. Lancer `demo-skillforge-v2.mp4` depuis le bureau en plein écran
3. Continuer le script oral slide 14 → 15 → 16 pendant que la vidéo tourne
4. La vidéo dure exactement 5 min, parfaitement calée sur le minutage prévu

### 6.2 Si la vidéo elle-même plante

1. L'étudiant montre une capture d'écran statique du statut `SECURITY_VIOLATION` préparée en PNG
2. Décrit oralement la séquence attaque
3. Enchaîne sur la slide 17 (résultats) qui porte les chiffres : 0 évasion sur 50, p95 4,37 s, aucune alerte OWASP

### 6.3 Si problème de son UI

- Pas grave, la vidéo est muette par conception
- L'étudiant parle en direct, c'est lui qui porte la voix

---

## 7. Checklist finale avant tournage

### 7.1 Fichiers à préparer

- [ ] `cv-demo.pdf` (CV fictif Rakoto Jean, 2 pages, Java/React 3 ans) sur le bureau
- [ ] `attaque-demo.txt` (code Java malveillant : lecture `/etc/passwd` + socket réseau sortant) prêt dans le presse-papier
- [ ] Capture PNG de secours du statut `SECURITY_VIOLATION` (plan C)
- [ ] `demo-skillforge-v2.mp4` final sur clé USB + sur le bureau de l'ordinateur soutenance

### 7.2 Services à lancer

- [ ] Backend Spring Boot profil `demo` sur `localhost:8080`
- [ ] Frontend React sur `localhost:3000`
- [ ] Mailpit sur `localhost:8025`
- [ ] Docker daemon actif, image `skillforge-sandbox:latest` préchargée
- [ ] PostgreSQL avec compte `recruteur@tsarajoro.mg` créé

### 7.3 Comptes et données

- [ ] Compte recruteur `recruteur@tsarajoro.mg` connecté dans Chrome
- [ ] Dashboard recruteur vierge sauf 1 évaluation témoin
- [ ] Mailpit vidé
- [ ] Fenêtre Chrome navigation privée ouverte à côté
- [ ] Terminal avec `tail -f` sur les logs backend filtrés sur `sandbox`

### 7.4 Enregistrement

- [ ] OBS Studio configuré 1920×1080 30 fps
- [ ] Notifications système désactivées (ne pas déranger)
- [ ] Barre de tâches masquée
- [ ] Horloge système neutralisée
- [ ] Zoom navigateur à 110 %
- [ ] Taille police éditeur Monaco à 16 px minimum

### 7.5 Vérification finale timing

- [ ] Bloc 1 : 1 min 45 ± 1 s
- [ ] Bloc 2 : 1 min 45 ± 1 s
- [ ] Bloc 3 : 1 min 30 ± 1 s
- [ ] **Total : 5 min 00 pile**

---

## 8. Vocabulaire et chiffres à respecter dans l'image

### 8.1 Formulations exactes qui doivent apparaître à l'écran

- **« aucune alerte de niveau élevé, moyen ou faible »** (jamais « 0 vulnérabilité »)
- **Statut sandbox : `SECURITY_VIOLATION`** (jamais « bloqué » ou « erreur »)
- **Timeout 5 secondes** (sandbox)
- **« 0 évasion / 50 attaques testées »** sur l'indicateur agrégé

### 8.2 Chiffres fidèles au mémoire v3 (slide 17/20)

- p95 : **4,37 s** sous charge (k6, 20 utilisateurs virtuels, 60 s)
- Médiane sandbox : **330 ms**, p95 sandbox : **422 ms**
- 50 scénarios d'attaque testés, **0 évasion**
- 100 exécutions valides
- 823/823 checks k6 réussis, 0 % d'erreur
- 27 tests JUnit (25 passants + 2 ignorés)

### 8.3 Vocabulaire interdit à l'écran

- « nouvelle génération »
- « révolutionnaire »
- « innovant »
- « entièrement assistée par IA »
- « 0 vulnérabilité »
- « POC 1 / POC 2 / POC 3 / POC 4 »

### 8.4 Message clé répété à l'oral (pas forcément à l'écran)

- **« L'IA propose, le recruteur décide »** — prononcé en slide 11, 16, 20

---

## 9. Points de vigilance pour l'enregistrement

1. **Pas de nom réel autre que celui du candidat fictif « Rakoto Jean »**. Pas de données personnelles réelles à l'écran.
2. **Pas de clé API, mot de passe ou token visible** à aucun moment (vérifier le terminal avant tournage).
3. **Horloge et notifications désactivées** pendant tout le tournage.
4. **Zoom lisible** : chaque texte critique (statut, log, chiffre) doit être lisible depuis le fond de la salle.
5. **Transitions sobres** : cut net ou fondu 0,3 s max. Pas d'effet tape-à-l'œil.
6. **Synchronisation parole-image** : à l'oral, l'étudiant doit arriver sur le mot « email » à peu près au moment où Mailpit s'ouvre (1:36). Ce n'est pas une science exacte, mais plus l'image colle à la parole, plus c'est pro.
7. **Durée bornée** : si on dépasse 5:00 au tournage, on recoupe au montage. Jamais au-dessus de 5 min 00.
8. **Deux versions à conserver** : la version montée finale (celle du jour J) + une version brute non montée en archive.
9. **Test projecteur** : la vidéo doit tourner correctement sur l'ordinateur de la soutenance. Prévoir un test 24 h avant.
10. **Convention de nommage fichier** : `demo-skillforge-v2.mp4` (jamais `final-final-v3.mp4`).

---

*Document rédigé le 2026-10-06. Script vidéo aligné sur les slides 14/20, 15/20 et 16/20 de `06_PLAN_SLIDES_V2.md`, et synchronisé avec le bloc 13:35 → 16:35 de `07_SCRIPT_ORAL_V2.md`. Durée vidéo : 5 min 00 pile.*
