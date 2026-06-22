-- Compte rendu IA : meta provider + tracabilite cout / tokens.
ALTER TABLE reports
    ADD COLUMN llm_provider VARCHAR(32),
    ADD COLUMN llm_model    VARCHAR(64),
    ADD COLUMN tokens_used  INT             NOT NULL DEFAULT 0,
    ADD COLUMN cost_eur     NUMERIC(8,4)    NOT NULL DEFAULT 0;
