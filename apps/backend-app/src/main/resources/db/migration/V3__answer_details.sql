-- Auto-grading : details persistes par reponse pour visualisation recruteur.
ALTER TABLE answers
    ADD COLUMN qcm_selected_index   INT,
    ADD COLUMN last_tests_passed    INT,
    ADD COLUMN last_tests_total     INT,
    ADD COLUMN last_stdout          TEXT,
    ADD COLUMN last_stderr          TEXT,
    ADD COLUMN grading_explanation  TEXT;
