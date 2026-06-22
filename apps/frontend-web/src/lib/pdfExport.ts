import { jsPDF } from 'jspdf';
import { PassationDetail, Recommendation, ReportView } from '@/lib/api';

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Developpeur PHP',
  INT_WORDPRESS: 'Integrateur WordPress',
  DEV_VUE: 'Developpeur Vue.js',
  SEO_TECH: 'Specialiste SEO technique',
};

const RECO_LABELS: Record<Recommendation, { label: string; color: [number, number, number] }> = {
  HIRE: { label: 'A EMBAUCHER', color: [16, 185, 129] },
  INTERVIEW: { label: 'A APPROFONDIR EN ENTRETIEN', color: [245, 158, 11] },
  REJECT: { label: 'A ECARTER', color: [239, 68, 68] },
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function parseScore(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function breakdownFromPassation(passation: PassationDetail) {
  const b = { qcm: { ok: 0, total: 0 }, code: { ok: 0, total: 0 }, cas: { ok: 0, total: 0 } };
  for (const a of passation.answers) {
    const score = parseScore(a.score);
    const passed =
      a.type === 'CODE'
        ? score !== null && score >= 75
        : a.type === 'QCM'
          ? score !== null && score >= 100
          : score !== null && score >= 60;
    if (a.type === 'QCM') {
      b.qcm.total++;
      if (passed) b.qcm.ok++;
    } else if (a.type === 'CODE') {
      b.code.total++;
      if (passed) b.code.ok++;
    } else {
      b.cas.total++;
      if (passed) b.cas.ok++;
    }
  }
  return b;
}

/** Genere et telecharge un PDF du compte rendu (1-2 pages A4, jsPDF pur). */
export function exportReportToPdf(report: ReportView, passation: PassationDetail) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const MARGIN = 48;
  let y = MARGIN;

  // ===== En-tete =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(10, 22, 40);
  doc.text('SkillForge', MARGIN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Compte rendu d evaluation technique', W - MARGIN, y, { align: 'right' });

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, W - MARGIN, y);
  y += 26;

  // ===== Bloc identite candidat =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(10, 22, 40);
  doc.text(passation.candidateName ?? passation.candidateEmail, MARGIN, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const profileLabel = PROFILE_LABELS[passation.profileCode] ?? passation.profileCode;
  const submittedAt = passation.submittedAt ?? passation.startedAt;
  const dateStr = submittedAt
    ? new Date(submittedAt).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
  doc.text(
    `${passation.candidateEmail}  ·  ${profileLabel}  ·  Passation du ${dateStr}`,
    MARGIN,
    y,
  );
  y += 28;

  // ===== Score global + breakdown =====
  const breakdown = breakdownFromPassation(passation);
  const globalScore = parseScore(passation.globalScore);
  const scoreLabel = globalScore == null ? '—' : `${Math.round(globalScore)} / 100`;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, 70, 8, 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('SCORE GLOBAL', MARGIN + 16, y + 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(10, 22, 40);
  doc.text(scoreLabel, MARGIN + 16, y + 52);

  // 3 mini-stats a droite
  const statsX = W - MARGIN - 240;
  let sy = y + 18;
  const allStats: Array<[string, { ok: number; total: number }]> = [
    ['QCM', breakdown.qcm],
    ['Code', breakdown.code],
    ['Cas pratique', breakdown.cas],
  ];
  const stats = allStats.filter(([, b]) => b.total > 0);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  for (const [label, b] of stats) {
    doc.setTextColor(100, 116, 139);
    doc.text(label, statsX, sy);
    doc.setTextColor(10, 22, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(`${b.ok} / ${b.total}`, statsX + 100, sy);
    doc.setFont('helvetica', 'normal');
    sy += 14;
  }
  y += 90;

  // ===== Bandeau Recommandation =====
  const reco = RECO_LABELS[report.recommendation];
  doc.setFillColor(reco.color[0], reco.color[1], reco.color[2]);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, 36, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('VERDICT : ' + reco.label, MARGIN + 16, y + 23);
  y += 50;

  // ===== Resume executif =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 22, 40);
  doc.text('Resume executif', MARGIN, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(report.summary || '—', W - 2 * MARGIN);
  doc.text(summaryLines, MARGIN, y);
  y += summaryLines.length * 13 + 20;

  // ===== Forces =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 122, 76);
  doc.text('Points forts', MARGIN, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  for (const s of report.strengths) {
    if (y > 760) {
      doc.addPage();
      y = MARGIN;
    }
    const lines = doc.splitTextToSize('•  ' + s, W - 2 * MARGIN - 10);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * 13 + 4;
  }
  y += 14;

  // ===== Faiblesses =====
  if (y > 700) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(180, 35, 24);
  doc.text('Points faibles', MARGIN, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  for (const w of report.weaknesses) {
    if (y > 760) {
      doc.addPage();
      y = MARGIN;
    }
    const lines = doc.splitTextToSize('•  ' + w, W - 2 * MARGIN - 10);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * 13 + 4;
  }

  // ===== Footer (sur chaque page) =====
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const provider = report.llmProvider ?? '—';
    const model = report.llmModel ?? '—';
    const generated = new Date(report.generatedAt).toLocaleString('fr-FR');
    doc.text(
      `Genere par ${provider}/${model} le ${generated}  ·  SkillForge POC M2 MBDS  ·  ${i}/${pages}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 24,
      { align: 'center' },
    );
  }

  const candidateSlug = slugify(passation.candidateName ?? passation.candidateEmail);
  const dateSlug = new Date(report.generatedAt).toISOString().slice(0, 10);
  doc.save(`skillforge-rapport-${candidateSlug}-${dateSlug}.pdf`);
}
