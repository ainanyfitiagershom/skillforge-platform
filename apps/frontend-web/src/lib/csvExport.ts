import JSZip from 'jszip';
import { api } from '@/lib/api';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const README = `SkillForge — Export analytique
==============================

Ce ZIP contient deux fichiers CSV extraits du dashboard analytique
recruteur SkillForge :

1. candidates.csv
   Colonnes :
   - passation_id : identifiant unique de la passation
   - candidate_name, candidate_email : identite du candidat
   - profile_code : profil metier cible (DEV_PHP, INT_WORDPRESS...)
   - submitted_at : timestamp ISO 8601 de la soumission
   - global_score : score global final (0-100)
   - fraud_risk_score : score de risque anti-fraude (0-100)
   - recommendation : verdict IA (HIRE / INTERVIEW / REJECT)

2. questions_stats.csv
   Colonnes :
   - question_id : identifiant unique de la question
   - type : QCM / CODE / CAS_PRATIQUE
   - difficulty : niveau de difficulte declare (1-5)
   - usages : nombre de fois utilisee en passation soumise
   - difficulty_index : proportion de reussite (0-1) = indice statistique
   - avg_score : score moyen obtenu (0-100)
   - discriminant_power : correlation point-biseriale (-1 a +1)
     Calcul valide contre scipy.stats.pointbiserialr
   - quality_label : verdict qualitatif
     * GOOD : question discriminante et equilibree
     * TOO_EASY : reussie par plus de 90% des candidats
     * TOO_HARD : reussie par moins de 10% des candidats
     * POOR_DISCRIMINANT : |rpb| < 0.15 malgre volume suffisant
     * INSUFFICIENT_DATA : moins de 3 utilisations
   - statement : enonce de la question

Genere le ${todayIso()} depuis SkillForge — POC M2 MBDS.
`;

/** Telecharge les deux CSV, les zip cote client avec un README explicatif. */
export async function exportAnalyticsZip() {
  const [candidatesBlob, questionsBlob] = await Promise.all([
    api.fetchCandidatesCsv(),
    api.fetchQuestionsStatsCsv(),
  ]);

  const zip = new JSZip();
  zip.file('candidates.csv', candidatesBlob);
  zip.file('questions_stats.csv', questionsBlob);
  zip.file('README.txt', README);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  download(zipBlob, `skillforge-analytics-${todayIso()}.zip`);
}
