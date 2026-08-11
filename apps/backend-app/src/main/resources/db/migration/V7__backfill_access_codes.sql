-- Fix C5 code review : les invitations pre-V6 ont access_code IS NULL, ce qui
-- desactive silencieusement la verification de code au start (rétro-compat).
-- Sur un env de dev/preprod, ces invitations restent ouvertes sans code.
--
-- Backfill : on genere un code aleatoire a 6 chiffres pour chaque invitation
-- pre-existante qui n en a pas. Note : ces codes ne seront jamais envoyes par
-- email (invitations deja creees), donc les invitations legacy deviennent
-- effectivement inutilisables. C est le comportement voulu : force la creation
-- d une nouvelle invitation (avec envoi email) pour continuer les tests.
--
-- pgcrypto est deja active par Postgres 16-alpine.
UPDATE invitations
SET access_code = LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
WHERE access_code IS NULL;

-- On rend la colonne NOT NULL a partir de maintenant : toute nouvelle invitation
-- DOIT avoir un code (garantie que le fallback rétro-compat ne peut plus
-- desactiver silencieusement la securite).
ALTER TABLE invitations
    ALTER COLUMN access_code SET NOT NULL;
