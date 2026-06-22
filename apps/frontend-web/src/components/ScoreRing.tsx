import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

/** Anneau de progression circulaire SVG anime, couleur auto selon le score (0-100). */
export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  className,
}: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const target = score == null ? 0 : Math.max(0, Math.min(100, Math.round(score)));

  useEffect(() => {
    const start = performance.now();
    const from = displayScore;
    const duration = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - displayScore / 100);

  const colorClass =
    score == null
      ? 'stroke-muted'
      : target >= 75
        ? 'stroke-emerald-500'
        : target >= 50
          ? 'stroke-amber-500'
          : 'stroke-rose-500';

  const textColor =
    score == null
      ? 'text-muted'
      : target >= 75
        ? 'text-emerald-600 dark:text-emerald-400'
        : target >= 50
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-rose-600 dark:text-rose-400';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-700 ease-out', colorClass)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score == null ? (
          <span className="font-mono text-xs text-muted">—</span>
        ) : (
          <>
            <span className={cn('font-display font-bold tracking-tighter', textColor)} style={{ fontSize: size * 0.3 }}>
              {displayScore}
            </span>
            {label && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {label}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
