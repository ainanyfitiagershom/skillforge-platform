import { Sparkles, FileText, Code2, BrainCircuit, CheckCircle2 } from 'lucide-react';

/**
 * Mockup visuel SkillForge utilise dans le hero de la landing / login.
 * Plusieurs cards flottantes qui montrent le produit en action :
 *  - card "CV analyse" (haut gauche)
 *  - card "Test genere par IA" (centre, principale)
 *  - card "Score sandbox" (bas droite)
 * Toutes sur fond d un blob d accent flou.
 */
export function AppMockup() {
  return (
    <div className="relative isolate flex h-full min-h-[480px] w-full items-center justify-center">
      {/* Blobs decoratifs */}
      <div
        className="blob-accent left-0 top-0 h-72 w-72"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
      />
      <div
        className="blob-accent bottom-0 right-0 h-80 w-80"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
      />

      {/* Card 1 : CV analyse (haut gauche, plus petite) */}
      <div className="absolute left-0 top-4 z-20 w-60 animate-float-slow rounded-2xl border border-border bg-surface/95 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
            cv.parse
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-border" />
          <div className="h-1.5 w-3/4 rounded-full bg-border" />
          <div className="h-1.5 w-5/6 rounded-full bg-border" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent-strong">
            PHP
          </span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent-strong">
            Symfony
          </span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent-strong">
            React
          </span>
        </div>
      </div>

      {/* Card 2 : Test genere par IA (centre, principale) */}
      <div
        className="relative z-10 w-[340px] animate-float-slow rounded-3xl border border-border bg-surface p-6 shadow-lg"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold">Test genere</div>
              <div className="font-mono text-[10px] text-muted">gpt-4o-mini · 14 questions</div>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            READY
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-border p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted">Q1 · QCM</span>
              <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold text-accent-strong">
                FACILE
              </span>
            </div>
            <div className="text-xs font-medium">
              Quelle annotation Symfony injecte un service dans un controleur ?
            </div>
          </div>

          <div className="rounded-xl border border-border p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Code2 className="h-3 w-3 text-muted" />
              <span className="font-mono text-[10px] text-muted">Q2 · CODE</span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                MEDIUM
              </span>
            </div>
            <div className="text-xs font-medium">
              Implementez `slugify(string $s): string` en PHP 8.3
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 : Score sandbox (bas droite) */}
      <div
        className="absolute bottom-4 right-0 z-20 w-56 animate-float-slow rounded-2xl border border-border bg-surface/95 p-4 shadow-lg backdrop-blur-md"
        style={{ animationDelay: '0.8s' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              sandbox.ok
            </span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="font-display text-3xl font-bold text-foreground">87</div>
          <div className="mb-1 text-xs text-muted">/100</div>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full w-[87%] rounded-full bg-accent-gradient" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <BrainCircuit className="h-3 w-3" />
          12 / 14 reussis
        </div>
      </div>
    </div>
  );
}
