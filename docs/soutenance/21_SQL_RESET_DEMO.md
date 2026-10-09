# Scripts SQL pour préparer la démo soutenance

Scripts à exécuter dans l'éditeur SQL de Supabase (dashboard → SQL Editor).

## 1. Purge d'un candidat de test avant re-démo

Supprime toutes les traces d'un candidat précis (passations, réponses, événements anti-fraude, rapports, invitations liées à ses tests, tests, CV, analyses, et finalement le candidat). Idempotent, aucun risque sur les autres données.

```sql
-- Candidat cible
WITH candidat AS (
    SELECT id FROM candidates WHERE email = 'gershomfitia@gmail.com'
),
tests_candidat AS (
    SELECT id FROM tests WHERE candidate_id IN (SELECT id FROM candidat)
),
invitations_candidat AS (
    SELECT id FROM invitations WHERE test_id IN (SELECT id FROM tests_candidat)
),
passations_candidat AS (
    SELECT id FROM passations
    WHERE candidate_id IN (SELECT id FROM candidat)
       OR invitation_id IN (SELECT id FROM invitations_candidat)
)
-- Supprime d'abord ce qui référence passations (cascade couvre déjà fraud_events, answers, reports)
DELETE FROM passations WHERE id IN (SELECT id FROM passations_candidat);

-- Puis invitations (cascade avec test, mais test_candidat ne cascade pas vers invitations)
DELETE FROM invitations WHERE test_id IN (
    SELECT id FROM tests WHERE candidate_id IN (
        SELECT id FROM candidates WHERE email = 'gershomfitia@gmail.com'
    )
);

-- Tests du candidat (cascade supprime test_compositions)
DELETE FROM tests WHERE candidate_id IN (
    SELECT id FROM candidates WHERE email = 'gershomfitia@gmail.com'
);

-- CV + analyses (cascade de cvs supprime cv_analyses)
DELETE FROM cvs WHERE candidate_id IN (
    SELECT id FROM candidates WHERE email = 'gershomfitia@gmail.com'
);

-- Candidat lui-même
DELETE FROM candidates WHERE email = 'gershomfitia@gmail.com';

-- Verification : doit renvoyer 0
SELECT COUNT(*) AS reste FROM candidates WHERE email = 'gershomfitia@gmail.com';
```

Exécuter les 6 blocs un par un dans l'éditeur Supabase, ou tout d'un coup (Supabase accepte plusieurs statements séparés par `;`).

## 2. Préparation de données remarquables pour la démo

### 2.1 Candidats de démo prêts à l'emploi

Trois candidats avec des profils différents, pour illustrer la richesse de l'outil pendant la soutenance.

```sql
INSERT INTO candidates (id, email, display_name, created_at) VALUES
    (gen_random_uuid(), 'marie.laurent.demo@skillforge.app',  'Marie Laurent',  NOW() - INTERVAL '7 days'),
    (gen_random_uuid(), 'ahmed.benali.demo@skillforge.app',   'Ahmed Benali',   NOW() - INTERVAL '5 days'),
    (gen_random_uuid(), 'sarah.rakoto.demo@skillforge.app',   'Sarah Rakoto',   NOW() - INTERVAL '3 days')
ON CONFLICT (email) DO NOTHING;
```

### 2.2 Statistiques banque de questions actuelle

Avant d'enrichir, voir ce qu'il y a déjà :

```sql
SELECT
    type,
    status,
    COUNT(*) AS nb,
    MIN(created_at) AS premiere,
    MAX(created_at) AS derniere
FROM questions
GROUP BY type, status
ORDER BY type, status;
```

### 2.3 Ne pas peupler la banque directement en SQL

**Important** : la banque de questions n'est pas peuplée en SQL manuel. Chaque question doit être générée par le LLM via le flux normal pour que :

- Les `question_skills` soient correctement rattachées (dépendent du profil cible)
- Le `json_payload` ait la structure attendue par le frontend
- Les cas pratiques aient leurs `expectedPoints` corrects pour la correction LLM
- Les tests cachés des exercices CODE soient valides

**Procédure recommandée pour enrichir la banque avant la soutenance** :

1. Se connecter en recruteur.
2. Créer trois évaluations successives, chacune avec un CV différent :
   - CV développeur PHP → 10 à 15 questions générées, les valider
   - CV développeur JS/TypeScript → 10 à 15 questions
   - CV développeur fullstack senior → 10 à 15 questions
3. Pour chaque évaluation : laisser l'IA générer, valider les meilleures (status = APPROVED), supprimer les mauvaises.
4. **Ne pas envoyer d'invitation** sur ces évaluations : on veut juste alimenter la banque.
5. Résultat : la banque passe de 56 approuvées à ~90-100 approuvées, répartie entre QCM, CODE et CAS_PRATIQUE.

### 2.4 Vérifier la banque après enrichissement

```sql
SELECT
    type,
    COUNT(*) FILTER (WHERE status = 'APPROVED')       AS approuvees,
    COUNT(*) FILTER (WHERE status = 'PENDING_REVIEW') AS en_attente,
    COUNT(*) FILTER (WHERE status = 'REJECTED')       AS rejetees,
    COUNT(*)                                           AS total
FROM questions
GROUP BY type
ORDER BY type;
```

Résultat visuel attendu après enrichissement :

| type         | approuvees | en_attente | rejetees | total |
|--------------|------------|------------|----------|-------|
| QCM          | 30 à 40    | ~ 50       | 2 à 5    | ~ 85  |
| CODE         | 15 à 20    | ~ 30       | 2 à 5    | ~ 50  |
| CAS_PRATIQUE | 10 à 15    | ~ 25       | 2 à 5    | ~ 45  |

Cette répartition montre au jury que :

- La banque n'est pas vide
- Le processus de revue humaine est actif (il y a des rejetées)
- Les trois types sont équilibrés

## 3. Nettoyer les passations de démo après chaque test

Si tu testes plusieurs fois le même candidat pendant la préparation, utilise le script 1 entre chaque test pour repartir sur une base propre.

Pour nettoyer tous les candidats de démo d'un coup à la fin de la préparation :

```sql
-- Attention : supprime les 3 candidats demo et toutes leurs donnees
DELETE FROM passations WHERE candidate_id IN (
    SELECT id FROM candidates WHERE email LIKE '%.demo@skillforge.app'
);
DELETE FROM invitations WHERE test_id IN (
    SELECT id FROM tests WHERE candidate_id IN (
        SELECT id FROM candidates WHERE email LIKE '%.demo@skillforge.app'
    )
);
DELETE FROM tests  WHERE candidate_id IN (SELECT id FROM candidates WHERE email LIKE '%.demo@skillforge.app');
DELETE FROM cvs    WHERE candidate_id IN (SELECT id FROM candidates WHERE email LIKE '%.demo@skillforge.app');
DELETE FROM candidates WHERE email LIKE '%.demo@skillforge.app';
```

## 4. Snapshot avant soutenance (sauvegarde)

Avant la soutenance, faire un dump SQL via Supabase (dashboard → Database → Backups) pour pouvoir restaurer en cas d'incident. La restauration prend 2 minutes.
