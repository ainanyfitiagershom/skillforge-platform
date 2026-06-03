package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Cv;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface CvRepository extends JpaRepository<Cv, UUID> {

    List<Cv> findByPurgeAtBefore(OffsetDateTime moment);

    void deleteByCandidateId(UUID candidateId);
}
