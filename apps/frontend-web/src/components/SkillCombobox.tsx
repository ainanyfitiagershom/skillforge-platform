import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SKILL_REFERENTIAL, makeCustomCode, searchReferential } from '@/lib/skillReferential';

export type SkillToAdd = {
  code: string;
  displayName: string;
  level: 'JUNIOR' | 'CONFIRME' | 'SENIOR';
  isCustom: boolean;
};

type Props = {
  excludeCodes: string[];
  onAdd: (skill: SkillToAdd) => void;
};

export function SkillCombobox({ excludeCodes, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(
    () => searchReferential(query, excludeCodes),
    [query, excludeCodes],
  );

  const exactMatchInRef = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SKILL_REFERENTIAL.some(
      (s) => s.displayName.toLowerCase() === q || s.code.toLowerCase() === q,
    );
  }, [query]);

  const canCreate = query.trim().length >= 2 && !exactMatchInRef;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleAddFromRef = (code: string, displayName: string) => {
    onAdd({ code, displayName, level: 'CONFIRME', isCustom: false });
    setOpen(false);
    setQuery('');
  };

  const handleCreateCustom = () => {
    const name = query.trim();
    if (!name) return;
    onAdd({
      code: makeCustomCode(name),
      displayName: name,
      level: 'CONFIRME',
      isCustom: true,
    });
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-sm font-medium transition-all',
          open
            ? 'border-foreground bg-surface text-foreground'
            : 'border-border-strong text-muted hover:border-foreground hover:text-foreground',
        )}
      >
        <Plus className="h-3.5 w-3.5" />
        Ajouter une competence
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  setQuery('');
                }
                if (e.key === 'Enter' && canCreate) {
                  e.preventDefault();
                  handleCreateCustom();
                }
              }}
              placeholder="Rechercher ou taper un nom..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-soft focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-muted hover:text-foreground"
                title="Effacer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {matches.length === 0 && !canCreate && (
              <div className="px-3 py-4 text-center text-xs text-muted">
                Aucune correspondance.
              </div>
            )}

            {matches.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => handleAddFromRef(s.code, s.displayName)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-background-soft"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {s.displayName}
                  </div>
                  <div className="font-mono text-[10px] text-muted">{s.code}</div>
                </div>
                <span className="rounded-full bg-background-soft px-2 py-0.5 text-[10px] font-medium text-muted">
                  {s.category}
                </span>
              </button>
            ))}

            {canCreate && (
              <button
                type="button"
                onClick={handleCreateCustom}
                className="flex w-full items-center gap-2 border-t border-border bg-accent-soft/30 px-3 py-2 text-left text-sm font-medium text-accent-strong transition-colors hover:bg-accent-soft/60"
              >
                <Plus className="h-3.5 w-3.5" />
                Creer la competence personnalisee « {query.trim()} »
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
