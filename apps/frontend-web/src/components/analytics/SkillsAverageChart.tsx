import { Card } from '@/components/ui/Card';
import { SkillAverage } from '@/lib/api';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  skills: SkillAverage[];
};

function parseNum(v: number | string | null | undefined): number {
  if (v == null) return 0;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function colorForScore(s: number): string {
  if (s >= 75) return '#10b981';
  if (s >= 50) return '#f59e0b';
  return '#ef4444';
}

type Bar = {
  displayName: string;
  avgScore: number;
  candidateCount: number;
  category: string;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Bar }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lg">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{p.category}</div>
      <div className="text-sm font-semibold text-foreground">{p.displayName}</div>
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span>
          <span className="text-muted">Score moyen : </span>
          <span className="font-mono text-foreground">{p.avgScore.toFixed(1)}</span>
        </span>
        <span>
          <span className="text-muted">N : </span>
          <span className="font-mono text-foreground">{p.candidateCount}</span>
        </span>
      </div>
    </div>
  );
}

export function SkillsAverageChart({ skills }: Props) {
  const data: Bar[] = skills
    .slice(0, 12)
    .map((s) => ({
      displayName: s.displayName,
      avgScore: parseNum(s.avgScore),
      candidateCount: s.candidateCount,
      category: s.category,
    }));

  const heading =
    data.length > 0 && data[0].category === 'Profil'
      ? { title: 'Score moyen par profil', hint: 'Referentiel de competences non peuple : fallback sur profil du test' }
      : { title: 'Score moyen par competence', hint: 'Moyenne des scores obtenus sur les questions liees a chaque competence' };

  return (
    <Card variant="elevated" className="p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {heading.title}
      </h3>
      <p className="mt-0.5 text-xs text-muted">{heading.hint}</p>
      {data.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background-soft py-12 text-center text-xs text-muted">
          Aucune donnee disponible pour le moment.
        </div>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                width={110}
                tick={{ fill: 'var(--foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--background-soft)' }} />
              <Bar dataKey="avgScore" radius={[0, 6, 6, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={colorForScore(d.avgScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
