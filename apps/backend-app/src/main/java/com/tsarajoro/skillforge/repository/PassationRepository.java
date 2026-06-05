package com.tsarajoro.skillforge.repository;

import com.tsarajoro.skillforge.domain.Passation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PassationRepository extends JpaRepository<Passation, UUID> {

    Optional<Passation> findByInvitationId(UUID invitationId);
}
