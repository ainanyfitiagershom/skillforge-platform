import { useLocation } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CheckCircle2, Sparkles, Lock } from 'lucide-react';

export function CandidateDonePage() {
  const location = useLocation();
  const rawScore = (location.state as { score?: number | string } | null)?.score;
  const score = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;

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

        {score !== null && score !== undefined && !Number.isNaN(score) && (
          <Card
            variant="elevated"
            className="w-full animate-fade-in-up p-8"
            style={{ animationDelay: '0.2s' } as React.CSSProperties}
          >
            <CardBody>
              <div className="mb-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                <Sparkles className="h-3 w-3 text-accent" />
                Score indicatif
              </div>
              <div className="font-display text-6xl font-bold tracking-tighter text-foreground">
                {Math.round(score * 100)}
                <span className="text-3xl text-muted">%</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent-gradient transition-all duration-1000"
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                Note brute des questions automatisables. Le recruteur ajoutera
                son evaluation qualitative.
              </p>
            </CardBody>
          </Card>
        )}

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
