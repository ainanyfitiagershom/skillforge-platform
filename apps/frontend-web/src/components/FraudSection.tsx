import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { FraudEventType, FraudEventView, PassationDetail } from '@/lib/api';
import {
  ChevronDown,
  Clipboard,
  Eye,
  MonitorX,
  ShieldAlert,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  passation: PassationDetail;
};

const TYPE_LABELS: Record<FraudEventType, string> = {
  FOCUS_LOSS: 'Sortie d onglet',
  PASTE_SUSPICIOUS: 'Copier-coller volumineux',
  FAST_ANSWER: 'Reponse anormalement rapide',
  DEVTOOLS_OPEN: 'Outils developpeur ouverts',
};

const TYPE_ICONS: Record<FraudEventType, typeof Eye> = {
  FOCUS_LOSS: Eye,
  PASTE_SUSPICIOUS: Clipboard,
  FAST_ANSWER: Timer,
  DEVTOOLS_OPEN: MonitorX,
};

function riskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 51) return 'high';
  if (score >= 21) return 'medium';
  return 'low';
}

const LEVEL_STYLES: Record<'low' | 'medium' | 'high', { header: string; badge: string; icon: string; label: string }> = {
  low: {
    header: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100',
    badge: 'bg-emerald-500 text-white',
    icon: 'text-emerald-700 dark:text-emerald-300',
    label: 'Aucun signal notable',
  },
  medium: {
    header: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100',
    badge: 'bg-amber-500 text-white',
    icon: 'text-amber-700 dark:text-amber-300',
    label: 'Signaux mineurs',
  },
  high: {
    header: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-100',
    badge: 'bg-rose-500 text-white',
    icon: 'text-rose-700 dark:text-rose-300',
    label: 'Risque eleve — a verifier',
  },
};

function parseMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function describeMetadata(type: FraudEventType, raw: string | null): string {
  const m = parseMetadata(raw);
  switch (type) {
    case 'FOCUS_LOSS': {
      const ms = typeof m.durationMs === 'number' ? m.durationMs : 0;
      const seconds = Math.round(ms / 1000);
      return `Absent de l onglet pendant environ ${seconds}s`;
    }
    case 'PASTE_SUSPICIOUS':
      return typeof m.pastedLength === 'number'
        ? `${m.pastedLength} caracteres colles en une fois`
        : 'Contenu colle volumineux';
    case 'FAST_ANSWER': {
      const parts: string[] = [];
      if (typeof m.answerLength === 'number') parts.push(`${m.answerLength} caracteres`);
      if (typeof m.elapsedMs === 'number') {
        parts.push(`ecrits en ${(m.elapsedMs / 1000).toFixed(1)}s`);
      }
      return parts.join(' ');
    }
    case 'DEVTOOLS_OPEN':
      return 'Ouverture detectee via l ecart taille de fenetre';
    default:
      return '';
  }
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return `il y a ${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

function absoluteTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function FraudSection({ passation }: Props) {
  const [open, setOpen] = useState(false);

  const events = passation.fraudEvents ?? [];
  const score = passation.fraudRiskScore ?? 0;

  const countsByType = useMemo(() => {
    const c: Partial<Record<FraudEventType, number>> = {};
    for (const e of events) c[e.eventType] = (c[e.eventType] ?? 0) + 1;
    return c;
  }, [events]);

  if (events.length === 0) return null;

  const level = riskLevel(score);
  const styles = LEVEL_STYLES[level];

  return (
    <Card
      variant="elevated"
      className="animate-fade-in-up overflow-hidden"
      style={{ animationDelay: '0.05s' } as React.CSSProperties}
    >
      <div className={cn('flex flex-wrap items-center justify-between gap-4 border-b-2 px-8 py-5', styles.header)}>
        <div className="flex items-center gap-4">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl shadow-md', styles.badge)}>
            {level === 'low' ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">
              Score anti-fraude
            </div>
            <div className="font-display text-xl font-bold tracking-tight">
              {score} / 100 · {styles.label}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-8 py-5">
        {(Object.entries(countsByType) as [FraudEventType, number][]).map(([type, n]) => {
          const Icon = TYPE_ICONS[type];
          return (
            <div
              key={type}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Icon className={cn('h-3.5 w-3.5', styles.icon)} />
              <span>
                {n}× {TYPE_LABELS[type]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-8 py-3 text-left transition-colors hover:bg-background-soft/40"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Timeline complete ({events.length} evenement{events.length > 1 ? 's' : ''})
          </span>
          <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <ol className="border-t border-border bg-background-soft/30 px-8 py-4">
            {events.map((e, i) => (
              <FraudEventRow key={e.id} event={e} last={i === events.length - 1} />
            ))}
          </ol>
        )}
      </div>

      <div className="border-t border-border bg-background-soft/40 px-8 py-3 text-xs text-muted">
        Ces signaux sont indicatifs. Ils ne prouvent pas la fraude mais meritent une
        verification en entretien.
      </div>
    </Card>
  );
}

function FraudEventRow({ event, last }: { event: FraudEventView; last: boolean }) {
  const Icon = TYPE_ICONS[event.eventType];
  const description = describeMetadata(event.eventType, event.metadata);
  return (
    <li className={cn('relative flex items-start gap-3 py-2', !last && 'border-b border-border/60')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">
        <Icon className="h-3.5 w-3.5 text-muted" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {TYPE_LABELS[event.eventType]}
          </span>
          <span className="font-mono text-[10px] text-muted" title={absoluteTime(event.occurredAt)}>
            {relativeTime(event.occurredAt)}
          </span>
        </div>
        {description && <div className="text-xs text-muted">{description}</div>}
      </div>
    </li>
  );
}
