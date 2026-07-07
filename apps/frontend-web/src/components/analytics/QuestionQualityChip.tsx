import { QuestionQualityLabel } from '@/lib/api';
import { cn } from '@/lib/cn';
import { AlertCircle, Check, Minus, X } from 'lucide-react';

type Props = {
  quality: QuestionQualityLabel;
  className?: string;
};

const CONFIG: Record<
  QuestionQualityLabel,
  { label: string; hint: string; classes: string; icon: typeof Check }
> = {
  GOOD: {
    label: 'Bonne question',
    hint: 'Question discriminante et equilibree',
    classes:
      'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: Check,
  },
  TOO_EASY: {
    label: 'Trop facile',
    hint: 'Plus de 90% de reussite : n apporte pas d information',
    classes:
      'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    icon: AlertCircle,
  },
  TOO_HARD: {
    label: 'Trop difficile',
    hint: 'Moins de 10% de reussite : a reformuler ou retirer',
    classes:
      'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    icon: X,
  },
  POOR_DISCRIMINANT: {
    label: 'Peu discriminante',
    hint: 'Ne separe pas bien les niveaux, a revoir',
    classes:
      'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    icon: Minus,
  },
  INSUFFICIENT_DATA: {
    label: 'Donnees insuffisantes',
    hint: 'Trop peu d utilisations pour statuer',
    classes:
      'border-border bg-background-soft text-muted',
    icon: AlertCircle,
  },
};

export function QuestionQualityChip({ quality, className }: Props) {
  const cfg = CONFIG[quality];
  const Icon = cfg.icon;
  return (
    <span
      title={cfg.hint}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        cfg.classes,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}
