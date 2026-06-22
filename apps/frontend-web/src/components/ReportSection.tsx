import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api, PassationDetail, Recommendation, ReportView } from '@/lib/api';
import { exportReportToPdf } from '@/lib/pdfExport';
import {
  AlertCircle,
  Check,
  Download,
  HelpCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  passation: PassationDetail;
};

const RECO_CONFIG: Record<
  Recommendation,
  { label: string; icon: typeof Check; classes: string; iconClasses: string }
> = {
  HIRE: {
    label: 'À embaucher',
    icon: Check,
    classes:
      'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100',
    iconClasses: 'bg-emerald-500 text-white',
  },
  INTERVIEW: {
    label: 'À approfondir en entretien',
    icon: HelpCircle,
    classes:
      'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100',
    iconClasses: 'bg-amber-500 text-white',
  },
  REJECT: {
    label: 'À écarter',
    icon: X,
    classes:
      'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-100',
    iconClasses: 'bg-rose-500 text-white',
  },
};

export function ReportSection({ passation }: Props) {
  const [report, setReport] = useState<ReportView | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getReport(passation.passationId)
      .then((r) => {
        if (!cancelled) setReport(r);
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
  }, [passation.passationId]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const r = await api.regenerateReport(passation.passationId);
      setReport(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation impossible');
    } finally {
      setRegenerating(false);
    }
  };

  const handleExport = () => {
    if (!report) return;
    exportReportToPdf(report, passation);
  };

  if (loading) {
    return (
      <Card variant="elevated" className="p-8">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement du compte rendu IA…
        </div>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card variant="elevated" className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Compte rendu IA indisponible
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted">
                {error ??
                  "Le compte rendu n'a pas pu être généré automatiquement. Vous pouvez le lancer manuellement."}
              </p>
            </div>
          </div>
          <Button variant="cta" size="md" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Génération…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Générer le compte rendu
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  const reco = RECO_CONFIG[report.recommendation];
  const RecoIcon = reco.icon;
  const generatedAt = new Date(report.generatedAt).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card
      variant="elevated"
      className="animate-fade-in-up overflow-hidden"
      style={{ animationDelay: '0.1s' } as React.CSSProperties}
    >
      {/* Header verdict */}
      <div className={cn('flex flex-wrap items-center justify-between gap-4 border-b-2 px-8 py-5', reco.classes)}>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl shadow-md',
              reco.iconClasses,
            )}
          >
            <RecoIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">
              Recommandation
            </div>
            <div className="font-display text-xl font-bold tracking-tight">{reco.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Régénérer
          </Button>
          <Button variant="cta" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Resume executif */}
      <div className="px-8 pt-6">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          <Sparkles className="h-3 w-3 text-accent" />
          Résumé exécutif
        </div>
        <p className="font-display text-base font-medium leading-relaxed text-foreground">
          {report.summary}
        </p>
      </div>

      {/* Forces + Faiblesses */}
      <div className="grid gap-6 px-8 py-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <h4 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Points forts
            </h4>
          </div>
          <ul className="space-y-2">
            {report.strengths.length === 0 ? (
              <li className="text-xs italic text-muted">Aucun point fort identifié.</li>
            ) : (
              report.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-sm text-foreground dark:border-emerald-900 dark:bg-emerald-950/20"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{s}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <TrendingDown className="h-3.5 w-3.5" />
            </div>
            <h4 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Points faibles
            </h4>
          </div>
          <ul className="space-y-2">
            {report.weaknesses.length === 0 ? (
              <li className="text-xs italic text-muted">Aucun point faible identifié.</li>
            ) : (
              report.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 text-sm text-foreground dark:border-rose-900 dark:bg-rose-950/20"
                >
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{w}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Footer meta */}
      <div className="border-t border-border bg-background-soft/40 px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted">
          <span>
            Généré le <span className="text-foreground">{generatedAt}</span>
          </span>
          {report.llmProvider && (
            <>
              <span>·</span>
              <span>
                par <span className="text-foreground">{report.llmProvider}</span>
                {report.llmModel ? `/${report.llmModel}` : ''}
              </span>
            </>
          )}
          {report.tokensUsed > 0 && (
            <>
              <span>·</span>
              <span>
                <span className="text-foreground">{report.tokensUsed}</span> tokens
              </span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="border-t border-danger/30 bg-danger/5 px-8 py-3 text-xs font-medium text-danger">
          {error}
        </div>
      )}
    </Card>
  );
}
