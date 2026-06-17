package com.tsarajoro.skillforge.test;

import com.tsarajoro.skillforge.domain.Question;
import com.tsarajoro.skillforge.domain.Test;
import com.tsarajoro.skillforge.domain.TestComposition;
import com.tsarajoro.skillforge.repository.QuestionRepository;
import com.tsarajoro.skillforge.repository.TestCompositionRepository;
import com.tsarajoro.skillforge.repository.TestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Compose un test (Test + TestComposition) a partir d'une liste de questions deja approuvees.
 */
@Service
public class TestCompositionService {

    private final TestRepository testRepo;
    private final TestCompositionRepository compositionRepo;
    private final QuestionRepository questionRepo;

    public TestCompositionService(TestRepository testRepo,
                                   TestCompositionRepository compositionRepo,
                                   QuestionRepository questionRepo) {
        this.testRepo = testRepo;
        this.compositionRepo = compositionRepo;
        this.questionRepo = questionRepo;
    }

    @Transactional
    public Test compose(String name, int durationMinutes, List<UUID> orderedQuestionIds) {
        return compose(name, durationMinutes, null, null, orderedQuestionIds);
    }

    @Transactional
    public Test compose(String name, int durationMinutes, UUID candidateId,
                        String profileCode, List<UUID> orderedQuestionIds) {
        Test test = testRepo.save(Test.newTest(name, durationMinutes, candidateId, profileCode));
        int position = 1;
        for (UUID qId : orderedQuestionIds) {
            // Validation : la question existe
            questionRepo.findById(qId).orElseThrow(
                    () -> new IllegalArgumentException("question introuvable : " + qId));
            compositionRepo.save(new TestComposition(test.getId(), qId, position++));
        }
        return test;
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionsOrdered(UUID testId) {
        List<TestComposition> compositions = compositionRepo.findByIdTestIdOrderByPositionAsc(testId);
        List<Question> result = new ArrayList<>();
        for (TestComposition c : compositions) {
            questionRepo.findById(c.getId().getQuestionId()).ifPresent(result::add);
        }
        result.sort(Comparator.comparingInt(q -> {
            // déjà trié par position côté SQL, on conserve l'ordre.
            return 0;
        }));
        return result;
    }
}
