import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CodeEditor } from '@/components/CodeEditor';
import { ScoreRing } from '@/components/ScoreRing';
import { ReportSection } from '@/components/ReportSection';
import { FraudSection } from '@/components/FraudSection';
import { AnswerDetail, PassationDetail, api } from '@/lib/api';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  Check,
  ChevronDown,
  Code2,
  FlaskConical,
  Inbox,
  Loader2,
  Mail,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Developpeur PHP',
  INT_WORDPRESS: 'Integrateur WordPress',
  DEV_VUE: 'Developpeur Vue.js',
  SEO_TECH: 'Specialiste SEO technique',
};

const AVATAR_COLORS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-fuchsia-400 to-pink-600',
];

function colorOf(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum = (sum + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initialsOf(name: string | null, email: string): string {
  const base = (name ?? email).trim();
  if (!base) return '?';
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return base.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function parseScore(v: number | string | null): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ResultDetailPage() {
  const { passationId } = useParams<{ passationId: string }>();
  const [detail, setDetail] = useState<PassationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!passationId) return;
    let cancelled = false;
    setLoading(true);
    api
      .getPassationDetail(passationId)
      .then((res) => {
        if (!cancelled) setDetail(res);
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
  }, [passationId]);

  const breakdown = useMemo(() => {
    if (!detail) return null;
    const b = { qcm: { ok: 0, total: 0 }, code: { ok: 0, total: 0 }, cas: { ok: 0, total: 0 } };
    for (const a of detail.answers) {
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
  }, [detail]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-160px)] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement de la passation…
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <Inbox className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Passation introuvable
        </h2>
        <p className="mt-2 text-sm text-muted">{error ?? "Cette passation n'existe pas."}</p>
        <Link to="/app/results" className="mt-5 inline-block">
          <Button variant="secondary" size="md">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux resultats
          </Button>
        </Link>
      </div>
    );
  }

  const score = parseScore(detail.globalScore);
  const submitted = !!detail.submittedAt;
  const profileLabel = PROFILE_LABELS[detail.profileCode] ?? detail.profileCode;
  const initials = initialsOf(detail.candidateName, detail.candidateEmail);
  const gradient = colorOf(detail.candidateEmail);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 pb-12 pt-6">
      {/* Back link */}
      <Link
        to="/app/results"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour aux resultats
      </Link>

      {/* HEADER hero */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="grid items-center gap-6 p-8 md:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-5">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white shadow-md',
                gradient,
              )}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold tracking-tighter text-foreground">
                  {detail.candidateName ?? detail.candidateEmail}
                </h1>
                {submitted ? (
                  <Badge tone="success" variant="mono">
                    Soumis
                  </Badge>
                ) : (
                  <Badge tone="warning" variant="mono">
                    En cours
                  </Badge>
                )}
                {detail.fraudRiskScore > 0 && (
                  <Badge tone="danger" variant="mono">
                    <ShieldAlert className="h-3 w-3" />
                    Risque fraude {detail.fraudRiskScore}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {detail.candidateEmail}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {profileLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Soumis le {formatDateTime(detail.submittedAt ?? detail.startedAt)}
                </span>
              </div>

              {/* Mini stats par type */}
              {breakdown && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {breakdown.qcm.total > 0 && (
                    <StatChip label="QCM" ok={breakdown.qcm.ok} total={breakdown.qcm.total} />
                  )}
                  {breakdown.code.total > 0 && (
                    <StatChip label="Code" ok={breakdown.code.ok} total={breakdown.code.total} />
                  )}
                  {breakdown.cas.total > 0 && (
                    <StatChip label="Cas pratique" ok={breakdown.cas.ok} total={breakdown.cas.total} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Score ring */}
          <div className="flex justify-center md:justify-end">
            <ScoreRing score={score} size={150} strokeWidth={12} label="Score global" />
          </div>
        </div>
      </Card>

      {/* Compte rendu IA */}
      <FraudSection passation={detail} />

      <ReportSection passation={detail} />

      {/* Liste des questions */}
      <div className="space-y-3">
        {detail.answers.map((a) => (
          <AnswerRow key={a.questionId} answer={a} />
        ))}
      </div>
    </div>
  );
}

function StatChip({ label, ok, total }: { label: string; ok: number; total: number }) {
  const ratio = total === 0 ? 0 : ok / total;
  const tone =
    ratio >= 0.75 ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300'
    : ratio >= 0.5 ? 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300'
    : 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300';
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        tone,
      )}
    >
      <span>{label}</span>
      <span className="font-mono">
        {ok}/{total}
      </span>
    </div>
  );
}

function AnswerRow({ answer }: { answer: AnswerDetail }) {
  const [open, setOpen] = useState(false);
  const score = parseScore(answer.score);
  const typeTone =
    answer.type === 'QCM' ? 'info' : answer.type === 'CODE' ? 'warning' : 'success';

  const statusBadge = useMemo(() => {
    if (score == null) {
      return (
        <Badge tone="muted" variant="mono">
          Non note
        </Badge>
      );
    }
    if (answer.type === 'QCM') {
      return score >= 100 ? (
        <Badge tone="success" variant="mono">
          <Check className="h-3 w-3" /> Correct
        </Badge>
      ) : (
        <Badge tone="danger" variant="mono">
          <X className="h-3 w-3" /> Incorrect
        </Badge>
      );
    }
    if (score >= 75) {
      return (
        <Badge tone="success" variant="mono">
          {Math.round(score)} / 100
        </Badge>
      );
    }
    if (score >= 50) {
      return (
        <Badge tone="warning" variant="mono">
          {Math.round(score)} / 100
        </Badge>
      );
    }
    return (
      <Badge tone="danger" variant="mono">
        {Math.round(score)} / 100
      </Badge>
    );
  }, [score, answer.type]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-colors hover:border-border-strong">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-background-soft/40"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-soft font-mono text-xs font-bold text-muted">
          {String(answer.position).padStart(2, '0')}
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={typeTone} variant="mono">
              {answer.type === 'CAS_PRATIQUE' ? 'CAS' : answer.type}
            </Badge>
            <Badge tone="muted" variant="mono">
              Diff {answer.difficulty}/5
            </Badge>
            {statusBadge}
          </div>
          <p className="text-sm leading-6 text-foreground">{answer.statement}</p>
          {answer.gradingExplanation && (
            <p className="mt-2 text-xs text-muted">
              <Sparkles className="-mt-0.5 mr-1 inline h-3 w-3 text-accent" />
              {answer.gradingExplanation}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn('mt-2 h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-background-soft/40 px-5 py-5">
          <AnswerBody answer={answer} />
        </div>
      )}
    </div>
  );
}

type ParsedPayload = {
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  language?: string;
  starterCode?: string;
  hiddenTests?: string;
  scenario?: string;
  expectedAnswerPoints?: string[];
};

function AnswerBody({ answer }: { answer: AnswerDetail }) {
  const parsed = useMemo<ParsedPayload | null>(() => {
    try {
      return JSON.parse(answer.jsonPayload) as ParsedPayload;
    } catch {
      return null;
    }
  }, [answer.jsonPayload]);

  if (answer.type === 'QCM') {
    return <QcmReview answer={answer} parsed={parsed} />;
  }
  if (answer.type === 'CODE') {
    return <CodeReview answer={answer} parsed={parsed} />;
  }
  return <CasReview answer={answer} parsed={parsed} />;
}

function QcmReview({ answer, parsed }: { answer: AnswerDetail; parsed: ParsedPayload | null }) {
  const options = parsed?.options ?? [];
  const correctIndex = parsed?.correctIndex;
  const chosen = answer.qcmSelectedIndex;

  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        const isCorrect = correctIndex === i;
        const isChosen = chosen === i;
        const chosenWrong = isChosen && !isCorrect;
        return (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 rounded-xl border-2 px-4 py-2.5 text-sm',
              isCorrect && 'border-emerald-300 bg-emerald-50 text-foreground dark:border-emerald-700 dark:bg-emerald-950/30',
              chosenWrong && 'border-rose-300 bg-rose-50 text-foreground dark:border-rose-700 dark:bg-rose-950/30',
              !isCorrect && !isChosen && 'border-border bg-surface text-muted',
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{opt}</span>
            <div className="flex shrink-0 items-center gap-1">
              {isChosen && (
                <Badge tone={isCorrect ? 'success' : 'danger'} variant="mono">
                  Reponse candidat
                </Badge>
              )}
              {isCorrect && (
                <Badge tone="success" variant="mono">
                  Bonne reponse
                </Badge>
              )}
            </div>
          </div>
        );
      })}
      {chosen == null && (
        <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 px-4 py-3 text-xs text-warning">
          Le candidat n'a pas repondu a cette question.
        </div>
      )}
      {parsed?.explanation && (
        <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
          <span className="font-semibold text-foreground">Explication : </span>
          {parsed.explanation}
        </p>
      )}
    </div>
  );
}

function CodeReview({ answer, parsed }: { answer: AnswerDetail; parsed: ParsedPayload | null }) {
  const lang = (parsed?.language?.toUpperCase() as 'PHP' | 'JS') ?? 'JS';
  const code = answer.submittedCode ?? parsed?.starterCode ?? '';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge tone="accent">{lang}</Badge>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Code soumis par le candidat
        </span>
        {answer.lastTestsTotal != null && answer.lastTestsPassed != null && answer.lastTestsTotal > 0 && (
          <Badge
            tone={
              answer.lastTestsPassed === answer.lastTestsTotal
                ? 'success'
                : answer.lastTestsPassed === 0
                  ? 'danger'
                  : 'warning'
            }
            variant="mono"
          >
            <FlaskConical className="h-3 w-3" />
            {answer.lastTestsPassed}/{answer.lastTestsTotal} tests
          </Badge>
        )}
      </div>

      {answer.submittedCode ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <CodeEditor language={lang} value={code} onChange={() => {}} height="260px" readOnly />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-3 text-xs text-warning">
          Aucun code soumis par le candidat.
        </div>
      )}

      {(answer.lastStdout || answer.lastStderr) && (
        <details className="rounded-xl border border-border bg-surface">
          <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-accent" />
            Sortie sandbox (derniere execution)
          </summary>
          <div className="space-y-2 border-t border-border px-3 py-3">
            {answer.lastStdout && (
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                  stdout
                </div>
                <pre className="overflow-x-auto rounded-lg bg-background-soft p-3 font-mono text-[11px] text-foreground">
                  {answer.lastStdout}
                </pre>
              </div>
            )}
            {answer.lastStderr && (
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-danger">
                  stderr
                </div>
                <pre className="overflow-x-auto rounded-lg bg-background-soft p-3 font-mono text-[11px] text-danger">
                  {answer.lastStderr}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}

      {parsed?.hiddenTests && (
        <details className="rounded-xl border border-border bg-surface">
          <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-muted" />
            Tests caches utilises
          </summary>
          <div className="border-t border-border">
            <CodeEditor
              language={lang}
              value={parsed.hiddenTests}
              onChange={() => {}}
              height="160px"
              readOnly
            />
          </div>
        </details>
      )}

      {parsed?.explanation && (
        <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
          <span className="font-semibold text-foreground">Explication attendue : </span>
          {parsed.explanation}
        </p>
      )}
    </div>
  );
}

function CasReview({ answer, parsed }: { answer: AnswerDetail; parsed: ParsedPayload | null }) {
  return (
    <div className="space-y-3">
      {parsed?.scenario && (
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <Code2 className="h-3 w-3" />
            Scenario
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground">{parsed.scenario}</p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          Reponse du candidat
        </div>
        {answer.answerText ? (
          <p className="whitespace-pre-wrap text-sm text-foreground">{answer.answerText}</p>
        ) : (
          <p className="text-xs italic text-muted">Aucune reponse fournie.</p>
        )}
      </div>

      {(answer.gradingExplanation || parsed?.expectedAnswerPoints) && (
        <div className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-4 dark:border-accent/30 dark:bg-accent/5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent-strong">
            <Sparkles className="h-3 w-3" />
            Verdict IA
          </div>
          {answer.gradingExplanation && (
            <p className="text-sm text-foreground">{answer.gradingExplanation}</p>
          )}
          {parsed?.expectedAnswerPoints && parsed.expectedAnswerPoints.length > 0 && (
            <div className="mt-3">
              <div className="mb-1 text-xs font-semibold text-muted">Points attendus :</div>
              <ul className="ml-4 list-disc space-y-1 text-xs text-foreground">
                {parsed.expectedAnswerPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

