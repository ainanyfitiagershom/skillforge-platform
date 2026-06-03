package com.tsarajoro.skillforge.rgpd;

import com.tsarajoro.skillforge.domain.Cv;
import com.tsarajoro.skillforge.repository.CandidateRepository;
import com.tsarajoro.skillforge.repository.CvRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Module RGPD :
 * 1. Purge automatique quotidienne des CV dont la date de retention est depassee (12 mois par defaut).
 * 2. Droit a l'oubli : suppression complete d'un candidat et de toutes ses donnees (a la demande d'un admin).
 */
@Service
public class RgpdService {

    private static final Logger log = LoggerFactory.getLogger(RgpdService.class);

    private final CvRepository cvRepo;
    private final CandidateRepository candidateRepo;

    public RgpdService(CvRepository cvRepo, CandidateRepository candidateRepo) {
        this.cvRepo = cvRepo;
        this.candidateRepo = candidateRepo;
    }

    /**
     * Tous les jours a 03:00 (heure serveur), supprime les CV expires.
     */
    @Scheduled(cron = "${skillforge.rgpd.purge-cron:0 0 3 * * *}")
    @Transactional
    public void purgeExpiredCvs() {
        List<Cv> expired = cvRepo.findByPurgeAtBefore(OffsetDateTime.now());
        if (expired.isEmpty()) {
            log.debug("RGPD : aucun CV expire");
            return;
        }
        cvRepo.deleteAll(expired);
        log.info("RGPD : {} CV expires supprimes automatiquement", expired.size());
    }

    /**
     * Droit a l'oubli : supprime un candidat et toutes ses donnees liees (cascade en BDD).
     */
    @Transactional
    public void deleteCandidateData(UUID candidateId) {
        cvRepo.deleteByCandidateId(candidateId);
        candidateRepo.deleteById(candidateId);
        log.info("RGPD : donnees du candidat {} supprimees (droit a l'oubli)", candidateId);
    }
}
