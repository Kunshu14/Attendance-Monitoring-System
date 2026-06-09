/**
 * Small inline attendance percentage badge with a mini progress bar.
 * Used in both the Students and Professors tables.
 */
interface AttendanceBadgeProps {
  percent: number | null;
}

function getColor(pct: number): { bar: string; text: string; bg: string } {
  if (pct >= 75) return { bar: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  if (pct >= 50) return { bar: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-400/10'   };
  return             { bar: 'bg-red-400',     text: 'text-red-600 dark:text-red-400',     bg: 'bg-red-400/10'     };
}

export default function AttendanceBadge({ percent }: AttendanceBadgeProps) {
  if (percent === null) {
    return <span className="text-xs text-fg-muted">—</span>;
  }

  const pct = Math.min(Math.max(percent, 0), 100);
  const c = getColor(pct);

  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      {/* Bar */}
      <div className="flex-1 h-1.5 rounded-full bg-panel-hover overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Label */}
      <span className={`text-xs font-semibold tabular-nums ${c.text} min-w-[36px] text-right`}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}
