import { Card } from '@/components/ui/Card';
import { ScoreBucket } from '@/lib/api';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  buckets: ScoreBucket[];
};

function colorForBucket(min: number): string {
  if (min >= 75) return '#10b981';
  if (min >= 50) return '#f59e0b';
  return '#ef4444';
}

type BarPayload = { bucket: string; min: number; count: number };

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: BarPayload }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lg">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Tranche</div>
      <div className="text-sm font-semibold text-foreground">{item.bucket}</div>
      <div className="mt-1 font-mono text-xs text-muted">
        {item.count} candidat{item.count > 1 ? 's' : ''}
      </div>
    </div>
  );
}

export function ScoresDistributionChart({ buckets }: Props) {
  const data: BarPayload[] = buckets.map((b) => ({
    bucket: `${b.min}-${b.max}`,
    min: b.min,
    count: b.count,
  }));

  return (
    <Card variant="elevated" className="p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Distribution des scores
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            Repartition des scores globaux par tranches de 10 points
          </p>
        </div>
      </div>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="bucket"
              tick={{ fill: 'var(--muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--background-soft)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.bucket} fill={colorForBucket(d.min)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
