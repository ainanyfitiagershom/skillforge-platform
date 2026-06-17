import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SkillLevel = 'JUNIOR' | 'CONFIRME' | 'SENIOR' | 'UNKNOWN';

const LEVELS: { value: Exclude<SkillLevel, 'UNKNOWN'>; label: string }[] = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'CONFIRME', label: 'Confirme' },
  { value: 'SENIOR', label: 'Senior' },
];

type Props = {
  displayName: string;
  level: SkillLevel;
  selected: boolean;
  isCustom?: boolean;
  onToggleSelected: () => void;
  onChangeLevel?: (level: Exclude<SkillLevel, 'UNKNOWN'>) => void;
  onRemove?: () => void;
};

export function SkillPill({
  displayName,
  level,
  selected,
  isCustom,
  onToggleSelected,
  onChangeLevel,
  onRemove,
}: Props) {
  const [levelOpen, setLevelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!levelOpen) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLevelOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [levelOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        className={cn(
          'group inline-flex items-center gap-2 rounded-full border transition-all',
          selected
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-surface text-muted hover:border-border-strong hover:text-foreground',
        )}
      >
        <button
          type="button"
          onClick={onToggleSelected}
          className="flex items-center gap-2 py-2 pl-4"
        >
          {selected ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <X className="h-3.5 w-3.5 opacity-40" />
          )}
          <span className="text-sm font-medium">{displayName}</span>
          {isCustom && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                selected
                  ? 'bg-background/15 text-background'
                  : 'bg-accent-soft text-accent-strong',
              )}
            >
              custom
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeLevel && setLevelOpen((o) => !o)}
          disabled={!onChangeLevel}
          className={cn(
            'flex items-center gap-1 border-l py-2 pl-2 pr-2 font-mono text-[10px] uppercase tracking-wide',
            selected ? 'border-background/20' : 'border-border',
            !onChangeLevel && 'cursor-default',
          )}
        >
          {level.toLowerCase()}
          {onChangeLevel && <ChevronDown className="h-3 w-3" />}
        </button>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Retirer"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
              selected
                ? 'text-background/60 hover:bg-background/15 hover:text-background'
                : 'mr-1 text-muted hover:bg-background-soft hover:text-danger',
            )}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {levelOpen && onChangeLevel && (
        <div className="absolute left-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => {
                onChangeLevel(l.value);
                setLevelOpen(false);
              }}
              className={cn(
                'block w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-background-soft',
                level === l.value ? 'text-foreground' : 'text-muted',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
