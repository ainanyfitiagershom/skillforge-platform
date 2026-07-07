import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/analytics/KpiCard';
import { QuestionQualityChip } from '@/components/analytics/QuestionQualityChip';
import { ScoresDistributionChart } from '@/components/analytics/ScoresDistributionChart';
import { QuestionsScatterChart } from '@/components/analytics/QuestionsScatterChart';
import { SkillsAverageChart } from '@/components/analytics/SkillsAverageChart';
import {
  AnalyticsKpis,
  QuestionStats,
  Recommendation,
  RecentCandidate,
  ScoreBucket,
  SkillAverage,
  api,
} from '@/lib/api';
import { exportAnalyticsZip } from '@/lib/csvExport';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Download,
  FileText,
  FilePlus2,
  Loader2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/cn';

function parseScore(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function formatScore(v: number | string | null | undefined, digits = 0): string {
  const n = parseScore(v);
  if (n == null) return '—';
  return digits === 0 ? Math.round(n).toString() : n.toFixed(digits);
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Developpeur PHP',
  INT_WORDPRESS: 'Integrateur WordPress',
  DEV_VUE: 'Developpeur Vue.js',
  SEO_TECH: 'Specialiste SEO technique',
};

const RECO_STYLES: Record<Recommendation, { label: string; classes: string }> = {
  HIRE: {
    label: 'A embaucher',
    classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  INTERVIEW: {
    label: 'A approfondir',
    classes: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  },
  REJECT: {
    label: 'A ecarter',
    classes: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  },
};

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [buckets, setBuckets] = useState<ScoreBucket[]>([]);
  const [questionsStats, setQuestionsStats] = useState<QuestionStats[]>([]);
  const [skillsAvg, setSkillsAvg] = useState<SkillAverage[]>([]);
  const [recent, setRecent] = useState<RecentCandidate[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.getAnalyticsKpis(),
      api.getScoresDistribution(),
      api.getQuestionsStats(),
      api.getSkillsAvg(),
      api.getRecentCandidates(),
    ])
      .then(([k, b, q, s, r]) => {
        if (cancelled) return;
        setKpis(k);
        setBuckets(b);
        setQuestionsStats(q);
        setSkillsAvg(s);
        setRecent(r);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const questionsToReview = useMemo(
    () =>
      questionsStats
        .filter((q) => q.qualityLabel !== 'GOOD' && q.qualityLabel !== 'INSUFFICIENT_DATA')
        .slice(0, 8),
    [questionsStats],
  );

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await exportAnalyticsZip();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export impossible');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-24">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement du dashboard analytique…
        </div>
      </div>
    );
  }

  const hasData = (kpis?.submittedPassations ?? 0) > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div>
          <Badge tone="accent" className="mb-3">
            <BarChart3 className="h-3 w-3" />
            Tableau de bord analytique
          </Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tighter text-foreground">
            Vue d'ensemble{' '}
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              du recrutement.
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Statistiques agrégées, pouvoir discriminant des questions, boucle d'amélioration
            continue.
          </p>
        </div>
        {hasData && (
          <Button variant="secondary" size="md" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exporting ? 'Export en cours…' : 'Exporter CSV'}
          </Button>
        )}
      </div>

      {error && (
        <Card variant="elevated" className="border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </Card>
      )}
      {exportError && (
        <Card variant="elevated" className="border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {exportError}
        </Card>
      )}

      {!hasData && !error && <EmptyState />}

      {hasData && kpis && (
        <>
          {/* KPIs Row */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={Users}
              label="Candidats évalués"
              value={kpis.submittedPassations}
              hint={`${kpis.totalCandidates} candidats en base`}
            />
            <KpiCard
              icon={TrendingUp}
              label="Score moyen"
              value={formatScore(kpis.avgGlobalScore)}
              hint="Toutes passations soumises"
              tone="success"
            />
            <KpiCard
              icon={FileText}
              label="Questions validées"
              value={kpis.approvedQuestions}
              hint={`${kpis.reportsGenerated} rapports IA générés`}
            />
            <KpiCard
              icon={ShieldAlert}
              label="Risque fraude"
              value={kpis.highFraudCount}
              hint={
                kpis.highFraudCount > 0
                  ? `${kpis.highFraudCount} passations à vérifier`
                  : 'Aucun risque élevé détecté'
              }
              tone={kpis.highFraudCount > 0 ? 'danger' : 'success'}
            />
          </section>

          {/* Chart 1 : Distribution */}
          <ScoresDistributionChart buckets={buckets} />

          {/* Charts 2 + 3 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <QuestionsScatterChart questions={questionsStats} />
            <SkillsAverageChart skills={skillsAvg} />
          </div>

          {/* Questions à revoir */}
          {questionsToReview.length > 0 && (
            <QuestionsToReviewSection questions={questionsToReview} />
          )}

          {/* Passations récentes */}
          {recent.length > 0 && <RecentCandidatesSection items={recent} />}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card variant="elevated" className="p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Pas encore de passations soumises
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Le dashboard analytique s'active dès qu'un premier candidat a terminé son test. Créez un
        test et envoyez une invitation pour commencer.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link to="/app/new-test">
          <Button variant="cta" size="lg">
            <FilePlus2 className="h-4 w-4" />
            Démarrer un test
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/app/review">
          <Button variant="secondary" size="lg">
            Banque de questions
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function QuestionsToReviewSection({ questions }: { questions: QuestionStats[] }) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="border-b border-border bg-background-soft/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-accent" />
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
            Questions à revoir
          </h3>
        </div>
        <p className="mt-1 text-xs text-muted">
          Boucle d'amélioration continue : ces questions gagneraient à être reformulées ou retirées.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {questions.map((q) => (
          <li key={q.id} className="flex items-start gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Badge tone="muted" variant="mono">
                  {q.type}
                </Badge>
                <Badge tone="muted" variant="mono">
                  Diff {q.difficulty}/5
                </Badge>
                <QuestionQualityChip quality={q.qualityLabel} />
              </div>
              <p className="text-sm text-foreground">{q.statement}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                <span>Utilisations : {q.usages}</span>
                <span>Difficulté : {formatScore(q.difficultyIndex, 2)}</span>
                <span>
                  Discrimination :{' '}
                  {q.discriminantPower == null ? 'n/a' : formatScore(q.discriminantPower, 2)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RecentCandidatesSection({ items }: { items: RecentCandidate[] }) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-background-soft/50 px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
              Passations récentes
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">Les 10 dernières évaluations soumises</p>
        </div>
        <Link to="/app/results">
          <Button variant="secondary" size="sm">
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-soft/30 text-left text-[10px] uppercase tracking-wider text-muted">
              <th className="px-6 py-2 font-semibold">Candidat</th>
              <th className="px-3 py-2 font-semibold">Profil</th>
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Score</th>
              <th className="px-3 py-2 font-semibold">Verdict IA</th>
              <th className="px-3 py-2 font-semibold">Fraude</th>
              <th className="px-6 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <RecentCandidateRow key={c.passationId} candidate={c} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RecentCandidateRow({ candidate }: { candidate: RecentCandidate }) {
  const score = parseScore(candidate.globalScore);
  const scoreColor =
    score == null
      ? 'text-muted'
      : score >= 75
        ? 'text-emerald-600 dark:text-emerald-400'
        : score >= 50
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-rose-600 dark:text-rose-400';
  const reco = candidate.recommendation;
  const profileLabel = PROFILE_LABELS[candidate.profileCode] ?? candidate.profileCode;
  return (
    <tr className="border-b border-border/50 transition-colors hover:bg-background-soft/40">
      <td className="min-w-0 px-6 py-3">
        <div className="truncate font-medium text-foreground">
          {candidate.candidateName ?? candidate.candidateEmail}
        </div>
        <div className="truncate text-[11px] text-muted">{candidate.candidateEmail}</div>
      </td>
      <td className="px-3 py-3 text-xs text-muted">{profileLabel}</td>
      <td className="px-3 py-3 font-mono text-[11px] text-muted">
        {formatDate(candidate.submittedAt)}
      </td>
      <td className={cn('px-3 py-3 font-display text-lg font-semibold', scoreColor)}>
        {formatScore(candidate.globalScore)}
      </td>
      <td className="px-3 py-3">
        {reco ? (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
              RECO_STYLES[reco].classes,
            )}
          >
            {RECO_STYLES[reco].label}
          </span>
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        {candidate.fraudRiskScore > 0 ? (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-3 w-3" />
            {candidate.fraudRiskScore}
          </span>
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </td>
      <td className="px-6 py-3">
        <Link
          to={`/app/results/${candidate.passationId}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-strong hover:underline"
        >
          Détail
          <ArrowRight className="h-3 w-3" />
        </Link>
      </td>
    </tr>
  );
}
