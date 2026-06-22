import { useLocation } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ScoreRing';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScoreBreakdownView } from '@/lib/api';
import { CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/cn';

type DoneState = {
  score?: number | string | null;
  breakdown?: ScoreBreakdownView | null;
};

function parseScore(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function CandidateDonePage() {
  const location = useLocation();
  const state = (location.state as DoneState | null) ?? {};
  const score = parseScore(state.score);
  const breakdown = state.breakdown ?? null;

  return (
    <div className="min-h-screen bg-app-gradient text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
            <span className="font-display text-lg font-bold">S</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            SkillForge
          </span>
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-6 py-12 text-center">
        <div className="relative animate-fade-in-up">
          <div
            className="blob-accent left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Badge tone="success" className="mb-3">
            <CheckCircle2 className="h-3 w-3" />
            Passation soumise
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter text-foreground sm:text-5xl">
            Merci d'avoir
            <br />
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              passe le test.
            </span>
          </h1>
          <p className="mt-4 text-base text-muted">
            Vos reponses ont bien ete enregistrees. Le recruteur recevra votre
            compte rendu et vous recontactera prochainement.
          </p>
        </div>

        {score !== null && (
          <Card
            variant="elevated"
            className="w-full animate-fade-in-up p-8"
            style={{ animationDelay: '0.2s' } as React.CSSProperties}
          >
            <CardBody className="text-center">
              <div className="mb-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                <Sparkles className="h-3 w-3 text-accent" />
                Score indicatif
              </div>
              <div className="flex justify-center">
                <ScoreRing score={score} size={160} strokeWidth={14} label="Score" />
              </div>

              {breakdown && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {breakdown.qcmTotal > 0 && (
                    <Stat label="QCM" ok={breakdown.qcmPassed} total={breakdown.qcmTotal} />
                  )}
                  {breakdown.codeTotal > 0 && (
                    <Stat label="Code" ok={breakdown.codePassed} total={breakdown.codeTotal} />
                  )}
                  {breakdown.casTotal > 0 && (
                    <Stat label="Cas" ok={breakdown.casPassed} total={breakdown.casTotal} />
                  )}
                </div>
              )}

              <p className="mt-5 text-xs text-muted">
                Score automatique base sur les questions automatisables et l'evaluation IA des cas
                pratiques. Le recruteur ajoutera son avis qualitatif.
              </p>
            </CardBody>
          </Card>
        )}

        <div
          className="animate-fade-in-up max-w-md rounded-2xl border border-border bg-surface/80 px-5 py-4 text-left backdrop-blur-md"
          style={{ animationDelay: '0.25s' } as React.CSSProperties}
        >
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Et apres ?
            </span>
          </div>
          <p className="text-sm text-foreground">
            Votre evaluation est en cours de synthese par notre IA. Le recruteur
            recevra un compte rendu detaille et vous recontactera prochainement.
          </p>
        </div>

        <div
          className="flex animate-fade-in-up items-center gap-3 rounded-full border border-border bg-surface/80 px-4 py-2 backdrop-blur-md"
          style={{ animationDelay: '0.3s' } as React.CSSProperties}
        >
          <Lock className="h-3.5 w-3.5 text-muted" />
          <p className="text-xs text-muted">
            Vos donnees seront purgees apres 12 mois conformement au RGPD.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, ok, total }: { label: string; ok: number; total: number }) {
  const ratio = total === 0 ? 0 : ok / total;
  const tone =
    ratio >= 0.75
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300'
      : ratio >= 0.5
        ? 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300'
        : 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300';
  return (
    <div className={cn('rounded-2xl border px-3 py-2', tone)}>
      <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-lg font-bold tracking-tight">
        {ok}
        <span className="text-sm opacity-60"> / {total}</span>
      </div>
    </div>
  );
}
