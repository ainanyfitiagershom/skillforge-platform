import { cn } from '@/lib/cn';

type Props = {
  count?: number;
  label?: string;
  className?: string;
};

const AVATAR_COLORS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
];

const INITIALS = ['FN', 'AB', 'KL', 'SM', 'TR'];

/**
 * Pile d avatars (style Socialynx "3M+ User") — social proof.
 */
export function AvatarStack({ count = 3, label = '3k+ candidats evalues', className }: Props) {
  const shown = Math.min(count, AVATAR_COLORS.length);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex -space-x-2">
        {Array.from({ length: shown }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm',
              AVATAR_COLORS[i],
            )}
            style={{ zIndex: shown - i }}
          >
            {INITIALS[i]}
          </div>
        ))}
      </div>
      <div className="text-xs leading-tight">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-muted">deja sur SkillForge</div>
      </div>
    </div>
  );
}
