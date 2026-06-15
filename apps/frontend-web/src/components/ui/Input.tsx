import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  pill?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, pill = false, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        'block w-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground',
        'placeholder:text-muted-soft',
        'transition-all duration-200',
        'focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
        'hover:border-border-strong',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-soft',
        pill ? 'rounded-full px-5' : 'rounded-xl',
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = 'Input';
