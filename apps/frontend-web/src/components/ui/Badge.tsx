import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'info' | 'muted' | 'danger';

// Pilules colorees, compatibles mode clair / sombre.
const tones: Record<Tone, string> = {
  default:
    'bg-background-soft text-foreground border border-border',
  accent:
    'bg-accent-soft text-accent-strong border border-accent/20 dark:text-accent dark:bg-accent/10',
  success:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  warning:
    'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  info:
    'bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
  muted:
    'bg-background-soft text-muted border border-border',
  danger:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  /** mono = label techno (Monospace, uppercase petit), pill = label premium normal */
  variant?: 'mono' | 'pill';
};

export function Badge({ className, tone = 'default', variant = 'pill', ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-colors',
        variant === 'mono'
          ? 'px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider'
          : 'px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
