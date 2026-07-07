import { Card } from '@/components/ui/Card';
import { QuestionQualityLabel, QuestionStats, QuestionType } from '@/lib/api';
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

type Props = {
  questions: QuestionStats[];
};

function parseNum(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

const COLOR_BY_QUALITY: Record<QuestionQualityLabel, string> = {
  GOOD: '#10b981',
  TOO_EASY: '#f59e0b',
  TOO_HARD: '#ef4444',
  POOR_DISCRIMINANT: '#8b5cf6',
  INSUFFICIENT_DATA: '#94a3b8',
};

type Point = {
  x: number;
  y: number;
  z: number;
  quality: QuestionQualityLabel;
  type: QuestionType;
  statement: string;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Point }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="max-w-xs rounded-xl border border-border bg-surface px-3 py-2 shadow-lg">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
        {p.type}
      </div>
      <div className="text-xs text-foreground">{p.statement.slice(0, 100)}{p.statement.length > 100 ? '…' : ''}</div>
      <div className="mt-1.5 grid grid-cols-2 gap-2 border-t border-border pt-1.5 text-[11px]">
        <div>
          <div className="text-muted">Difficulte</div>
          <div className="font-mono text-foreground">{p.x.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted">Discrimination</div>
          <div className="font-mono text-foreground">{p.y.toFixed(2)}</div>
        </div>
        <div className="col-span-2">
          <div className="text-muted">Utilisations</div>
          <div className="font-mono text-foreground">{p.z}</div>
        </div>
      </div>
    </div>
  );
}

export function QuestionsScatterChart({ questions }: Props) {
  const points: Point[] = questions
    .map((q) => {
      const x = parseNum(q.difficultyIndex);
      const y = parseNum(q.discriminantPower);
      if (x == null || y == null) return null;
      return {
        x,
        y,
        z: q.usages,
        quality: q.qualityLabel,
        type: q.type,
        statement: q.statement,
      };
    })
    .filter((p): p is Point => p !== null);

  if (points.length === 0) {
    return (
      <Card variant="elevated" className="p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Pouvoir discriminant × Difficulte
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          Chaque point = une question, taille = nombre d utilisations
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background-soft py-12 text-center text-xs text-muted">
          Donnees insuffisantes : au moins 3 utilisations par question sont necessaires.
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Pouvoir discriminant × Difficulte
      </h3>
      <p className="mt-0.5 text-xs text-muted">
        Point-biseriale (Y) vs indice de difficulte (X) — taille = utilisations
      </p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 12, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="x"
              name="Difficulte"
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tick={{ fill: 'var(--muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Discrimination"
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fill: 'var(--muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="z" range={[40, 240]} name="Utilisations" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={points}>
              {points.map((p, i) => (
                <Cell key={i} fill={COLOR_BY_QUALITY[p.quality]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px]">
        {(Object.entries(COLOR_BY_QUALITY) as [QuestionQualityLabel, string][]).map(([k, c]) => (
          <span key={k} className="inline-flex items-center gap-1.5 text-muted">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            {k.toLowerCase().replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </Card>
  );
}
