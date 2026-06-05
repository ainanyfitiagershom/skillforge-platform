import { useLocation } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CheckCircle2 } from 'lucide-react';

export function CandidateDonePage() {
  const location = useLocation();
  const rawScore = (location.state as { score?: number | string } | null)?.score;
  const score = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            S
          </div>
          <span className="text-sm font-semibold">SkillForge</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/30 bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>

        <div>
          <Badge tone="success" className="mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            passation.submitted
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Merci !</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre test a bien ete soumis. Le recruteur recevra votre compte rendu et vous
            recontactera prochainement.
          </p>
        </div>

        {score !== null && score !== undefined && !Number.isNaN(score) && (
          <Card>
            <CardHeader>
              <CardTitle>Score indicatif</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-4xl font-semibold tracking-tight">
                {Math.round(score * 100)}%
              </div>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                $ note brute des questions automatisables
              </p>
            </CardBody>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          Vous pouvez fermer cet onglet. Vos donnees seront purgees apres 12 mois
          conformement au RGPD.
        </p>
      </div>
    </div>
  );
}
