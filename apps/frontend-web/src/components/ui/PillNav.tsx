import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';

export type PillNavItem = {
  label: string;
  to: string;
  end?: boolean;
};

type Props = {
  items: PillNavItem[];
  className?: string;
};

/**
 * Navigation en pilule (style Socialynx top-nav).
 * Cadre arrondi pill, items qui s allument en accent sur active/hover.
 */
export function PillNav({ items, className }: Props) {
  return (
    <nav
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-surface/80 p-1 shadow-sm backdrop-blur-md',
        className,
      )}
    >
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-background-soft',
            )
          }
        >
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Variante "simple" : juste des liens horizontaux (utilisee dans la Landing) */
export function PillNavSimple({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        'hidden items-center gap-1 rounded-full border border-border bg-surface/80 p-1 shadow-sm backdrop-blur-md md:inline-flex',
        className,
      )}
    >
      {children}
    </nav>
  );
}
