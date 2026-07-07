-- Anti-fraude : contexte JSON par evenement (longueur paste, duree focus off, id question...).
ALTER TABLE fraud_events
    ADD COLUMN metadata JSONB;

CREATE INDEX idx_fraud_events_occurred_at ON fraud_events(occurred_at);
