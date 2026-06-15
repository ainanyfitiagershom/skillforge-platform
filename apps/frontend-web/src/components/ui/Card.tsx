import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** glass = transparence + blur (utilise sur fonds image/gradient) */
  variant?: 'default' | 'elevated' | 'glass' | 'flat';
  /** padding interne fluide */
  padded?: boolean;
};

const variants = {
  default:
    'border border-border bg-surface shadow-sm',
  elevated:
    'border border-border bg-surface-elevated shadow-lg hover:shadow-glow transition-shadow duration-500',
  glass:
    'border border-white/30 bg-white/60 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-white/5',
  flat:
    'border border-transparent bg-background-soft',
};

export function Card({ className, variant = 'default', padded = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl text-foreground transition-colors',
        variants[variant],
        padded && 'p-6',
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 px-6 pt-6', className)}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-lg font-semibold tracking-tight text-foreground', className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm text-muted', className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 px-6 pb-6 pt-2', className)}
      {...rest}
    />
  );
}
