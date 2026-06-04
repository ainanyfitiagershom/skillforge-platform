import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'default' | 'success' | 'warning' | 'info' | 'muted' | 'danger';

// Tons compatibles mode clair ET mode sombre.
const tones: Record<Tone, string> = {
  default:
    'bg-muted text-foreground border border-border',
  success:
    'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  warning:
    'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  info:
    'bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
  muted:
    'bg-muted text-muted-foreground border border-border',
  danger:
    'bg-red-100 text-red-900 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
};

type Props = HTMLAttributes<HTMLSpanElement> & { tone?: Tone };

export function Badge({ className, tone = 'default', ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
