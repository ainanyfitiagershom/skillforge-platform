import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

const TONE_STYLES: Record<NonNullable<Props['tone']>, { bg: string; text: string }> = {
  default: { bg: 'bg-accent-soft', text: 'text-accent-strong' },
  success: { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  danger: { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
};

export function KpiCard({ icon: Icon, label, value, hint, tone = 'default' }: Props) {
  const t = TONE_STYLES[tone];
  return (
    <Card variant="elevated" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', t.bg, t.text)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-1 font-display text-4xl font-semibold tracking-tighter text-foreground">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  );
}
