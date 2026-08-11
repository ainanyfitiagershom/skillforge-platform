-- UX-01 renforce : ajout d un code d acces a 6 chiffres genere a la creation
-- de l invitation. Envoye dans l email au candidat, le candidat doit le saisir
-- pour demarrer sa passation (defense en profondeur : quelqu un qui intercepte
-- le lien ne pourra pas demarrer sans le code recu par email).
--
-- NULL autorise pour les invitations pre-existantes (compatibilite ascendante).
-- Les nouvelles invitations creees apres cette migration recevront un code.
ALTER TABLE invitations
    ADD COLUMN access_code VARCHAR(6);
