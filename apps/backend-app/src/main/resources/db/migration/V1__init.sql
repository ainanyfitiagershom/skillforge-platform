-- Migration initiale SkillForge V1
-- Cree les tables fondamentales : utilisateurs, profils, competences, banque de questions,
-- candidats, CV, tests, passations, reponses, comptes rendus, evenements de fraude.

-- ===== Utilisateurs =====

CREATE TABLE users (
    id            UUID         PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(32)  NOT NULL CHECK (role IN ('ADMIN', 'RECRUTEUR', 'CANDIDAT')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ===== Profils et competences =====

CREATE TABLE profiles (
    id            UUID         PRIMARY KEY,
    code          VARCHAR(64)  NOT NULL UNIQUE,
    display_name  VARCHAR(128) NOT NULL
);

CREATE TABLE skills (
    id            UUID         PRIMARY KEY,
    code          VARCHAR(64)  NOT NULL UNIQUE,
    display_name  VARCHAR(128) NOT NULL,
    category      VARCHAR(64)  NOT NULL
);

CREATE TABLE profile_skills (
    profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id      UUID NOT NULL REFERENCES skills(id)   ON DELETE CASCADE,
    PRIMARY KEY (profile_id, skill_id)
);

-- ===== Banque de questions =====

CREATE TABLE questions (
    id            UUID         PRIMARY KEY,
    type          VARCHAR(32)  NOT NULL CHECK (type IN ('QCM', 'CODE', 'CAS_PRATIQUE')),
    statement     TEXT         NOT NULL,
    difficulty    INTEGER      NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    status        VARCHAR(32)  NOT NULL CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')),
    version       INT          NOT NULL DEFAULT 1,
    json_payload  JSONB        NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE question_skills (
    question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    skill_id      UUID NOT NULL REFERENCES skills(id)    ON DELETE CASCADE,
    PRIMARY KEY (question_id, skill_id)
);

CREATE INDEX idx_questions_status  ON questions(status);
CREATE INDEX idx_questions_type    ON questions(type);

-- ===== Candidats et CV =====

CREATE TABLE candidates (
    id            UUID         PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    display_name  VARCHAR(255),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE cvs (
    id            UUID         PRIMARY KEY,
    candidate_id  UUID         NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    file_name     VARCHAR(255) NOT NULL,
    content       BYTEA        NOT NULL,
    uploaded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    purge_at      TIMESTAMPTZ  NOT NULL
);

CREATE INDEX idx_cvs_purge_at ON cvs(purge_at);

CREATE TABLE cv_analyses (
    id                UUID         PRIMARY KEY,
    cv_id             UUID         NOT NULL UNIQUE REFERENCES cvs(id) ON DELETE CASCADE,
    extracted_skills  JSONB        NOT NULL,
    llm_provider      VARCHAR(32)  NOT NULL,
    llm_model         VARCHAR(64)  NOT NULL,
    tokens_used       INT          NOT NULL DEFAULT 0,
    cost_eur          NUMERIC(10,5) NOT NULL DEFAULT 0,
    analyzed_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ===== Tests et invitations =====

CREATE TABLE tests (
    id                UUID         PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    duration_minutes  INT          NOT NULL CHECK (duration_minutes > 0),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE test_compositions (
    test_id       UUID NOT NULL REFERENCES tests(id)     ON DELETE CASCADE,
    question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    position      INT  NOT NULL,
    PRIMARY KEY (test_id, question_id)
);

CREATE TABLE invitations (
    id            UUID         PRIMARY KEY,
    test_id       UUID         NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    token         VARCHAR(64)  NOT NULL UNIQUE,
    expires_at    TIMESTAMPTZ  NOT NULL,
    used          BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_invitations_token ON invitations(token);

-- ===== Passations =====

CREATE TABLE passations (
    id                 UUID         PRIMARY KEY,
    invitation_id      UUID         NOT NULL UNIQUE REFERENCES invitations(id),
    candidate_id       UUID         NOT NULL REFERENCES candidates(id),
    started_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    submitted_at       TIMESTAMPTZ,
    global_score       NUMERIC(5,2),
    fraud_risk_score   INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE answers (
    id              UUID         PRIMARY KEY,
    passation_id    UUID         NOT NULL REFERENCES passations(id) ON DELETE CASCADE,
    question_id     UUID         NOT NULL REFERENCES questions(id),
    answer_text     TEXT,
    submitted_code  TEXT,
    score           NUMERIC(5,2)
);

CREATE INDEX idx_answers_passation ON answers(passation_id);

CREATE TABLE reports (
    id              UUID         PRIMARY KEY,
    passation_id    UUID         NOT NULL UNIQUE REFERENCES passations(id) ON DELETE CASCADE,
    summary         TEXT         NOT NULL,
    strengths       TEXT,
    weaknesses      TEXT,
    recommendation  VARCHAR(32)  NOT NULL CHECK (recommendation IN ('HIRE', 'INTERVIEW', 'REJECT')),
    generated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE fraud_events (
    id            UUID         PRIMARY KEY,
    passation_id  UUID         NOT NULL REFERENCES passations(id) ON DELETE CASCADE,
    event_type    VARCHAR(64)  NOT NULL,
    occurred_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fraud_events_passation ON fraud_events(passation_id);
