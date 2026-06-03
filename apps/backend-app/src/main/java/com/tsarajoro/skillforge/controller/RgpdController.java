package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.rgpd.RgpdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/rgpd")
@PreAuthorize("hasRole('ADMIN')")
public class RgpdController {

    private final RgpdService rgpdService;

    public RgpdController(RgpdService rgpdService) {
        this.rgpdService = rgpdService;
    }

    /**
     * Droit a l'oubli : supprime un candidat et toutes ses donnees.
     */
    @DeleteMapping("/candidates/{candidateId}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable UUID candidateId) {
        rgpdService.deleteCandidateData(candidateId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Declenche manuellement la purge des CV expires (utile pour tests / interventions ponctuelles).
     */
    @PostMapping("/purge-expired-cvs")
    public ResponseEntity<Void> purgeExpiredCvs() {
        rgpdService.purgeExpiredCvs();
        return ResponseEntity.ok().build();
    }
}
