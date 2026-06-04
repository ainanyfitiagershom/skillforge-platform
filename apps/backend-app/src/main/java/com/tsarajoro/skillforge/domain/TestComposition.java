package com.tsarajoro.skillforge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "test_compositions")
public class TestComposition {

    @EmbeddedId
    private Pk id;

    @Column(nullable = false)
    private int position;

    protected TestComposition() {}

    public TestComposition(UUID testId, UUID questionId, int position) {
        this.id = new Pk(testId, questionId);
        this.position = position;
    }

    public Pk getId() { return id; }
    public int getPosition() { return position; }

    @Embeddable
    public static class Pk implements Serializable {
        @Column(name = "test_id", nullable = false)
        private UUID testId;

        @Column(name = "question_id", nullable = false)
        private UUID questionId;

        protected Pk() {}

        public Pk(UUID testId, UUID questionId) {
            this.testId = testId;
            this.questionId = questionId;
        }

        public UUID getTestId() { return testId; }
        public UUID getQuestionId() { return questionId; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Pk pk)) return false;
            return Objects.equals(testId, pk.testId) && Objects.equals(questionId, pk.questionId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(testId, questionId);
        }
    }
}
