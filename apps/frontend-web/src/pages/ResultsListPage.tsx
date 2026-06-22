import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ScoreRing';
import { api, PassationSummary } from '@/lib/api';
import {
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  Inbox,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Developpeur PHP',
  INT_WORDPRESS: 'Integrateur WordPress',
  DEV_VUE: 'Developpeur Vue.js',
  SEO_TECH: 'Specialiste SEO technique',
};

const AVATAR_COLORS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-fuchsia-400 to-pink-600',
];

function initialsOf(name: string | null, email: string): string {
  const base = (name ?? email).trim();
  if (!base) return '?';
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return base.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorOf(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum = (sum + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function parseScore(v: number | string | null): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ResultsListPage() {
  const [items, setItems] = useState<PassationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listPassations()
      .then((res) => {
        if (!cancelled) setItems(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    let submitted = 0;
    let inProgress = 0;
    for (const p of items) {
      if (p.submittedAt) submitted++;
      else inProgress++;
    }
    return { submitted, inProgress };
  }, [items]);

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pt-8">
      <div className="text-center">
        <Badge tone="accent" className="mb-4">
          <ClipboardCheck className="h-3 w-3" />
          Resultats des passations
        </Badge>
        <h1 className="font-display text-display-sm leading-[1.05] tracking-tighter text-foreground">
          Performances des{' '}
          <span className="bg-text-accent-gradient bg-clip-text text-transparent">
            candidats.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-muted">
          {loading
            ? 'Chargement…'
            : items.length === 0
              ? 'Aucune passation pour le moment.'
              : `${counts.submitted} terminee${counts.submitted > 1 ? 's' : ''} · ${counts.inProgress} en cours`}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && (
        <Card variant="elevated">
          <CardBody className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background-soft text-muted">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Aucune passation enregistree
            </h3>
            <p className="mt-2 text-sm text-muted">
              Envoyez une invitation a un candidat depuis la banque de questions
              pour voir les resultats ici.
            </p>
            <Link
              to="/app/review"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-strong hover:underline"
            >
              Aller a la banque de questions
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardBody>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((p) => (
          <ResultRow key={p.passationId} item={p} />
        ))}
      </div>
    </div>
  );
}

function ResultRow({ item }: { item: PassationSummary }) {
  const score = parseScore(item.globalScore);
  const submitted = !!item.submittedAt;
  const profileLabel = PROFILE_LABELS[item.profileCode] ?? item.profileCode;
  const dateLabel = formatDate(item.submittedAt ?? item.startedAt);
  const initials = initialsOf(item.candidateName, item.candidateEmail);
  const gradient = colorOf(item.candidateEmail);

  return (
    <Link to={`/app/results/${item.passationId}`} className="block">
      <Card
        variant="elevated"
        className="group transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-5 px-6 py-5">
          {/* Avatar */}
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md',
              gradient,
            )}
          >
            {initials}
          </div>

          {/* Info candidat */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
                {item.candidateName ?? item.candidateEmail}
              </h3>
              {submitted ? (
                <Badge tone="success" variant="mono">
                  Soumis
                </Badge>
              ) : (
                <Badge tone="warning" variant="mono">
                  En cours
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {item.candidateEmail}
              </span>
              <span className="inline-flex items-center gap-1">
                <BriefcaseBusiness className="h-3 w-3" />
                {profileLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateLabel}
              </span>
            </div>
          </div>

          {/* Score ring */}
          <ScoreRing score={score} size={64} strokeWidth={6} />

          {/* Chevron */}
          <ChevronRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
        </div>
      </Card>
    </Link>
  );
}
