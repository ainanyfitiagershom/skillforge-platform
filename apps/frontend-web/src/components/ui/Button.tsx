import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'cta' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  pill?: boolean;
};

const variants: Record<Variant, string> = {
  // CTA principal noir style Socialynx "Get Started"
  cta: 'bg-cta text-cta-foreground hover:bg-cta-hover shadow-md hover:shadow-lg active:scale-[0.98]',
  // Bouton accent bleu electrique
  primary:
    'bg-accent text-accent-foreground hover:bg-accent-strong shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-surface text-foreground border border-border hover:border-border-strong hover:bg-background-soft',
  outline:
    'border border-border-strong bg-transparent text-foreground hover:bg-surface hover:border-foreground',
  ghost: 'bg-transparent text-foreground-soft hover:bg-background-soft hover:text-foreground',
  danger: 'bg-danger text-white hover:opacity-90 shadow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
  xl: 'h-14 px-8 text-base',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', pill = true, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        'whitespace-nowrap',
        pill ? 'rounded-full' : 'rounded-xl',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
