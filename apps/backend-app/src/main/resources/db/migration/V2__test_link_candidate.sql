-- Lien Test -> Candidate (chaque generation cree un Test sur mesure pour 1 candidat).
ALTER TABLE tests
    ADD COLUMN candidate_id UUID,
    ADD COLUMN profile_code VARCHAR(64),
    ADD CONSTRAINT fk_tests_candidate FOREIGN KEY (candidate_id)
        REFERENCES candidates(id) ON DELETE CASCADE;

CREATE INDEX idx_tests_candidate ON tests(candidate_id);
