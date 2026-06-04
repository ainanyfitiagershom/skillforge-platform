import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...rest }, ref) => (
  <input
    ref={ref}
    className={cn(
      'block w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground',
      'placeholder:text-muted-foreground',
      'focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...rest}
  />
));
Input.displayName = 'Input';
