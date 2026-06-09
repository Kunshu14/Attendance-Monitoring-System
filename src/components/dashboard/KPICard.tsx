import { type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'cyan' | 'emerald' | 'amber';
  delta?: string;
  suffix?: string;
}

const COLOR_MAP = {
  indigo: {
    icon: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    glow: 'shadow-indigo-500/10',
    value: 'text-indigo-950 dark:text-indigo-50',
  },
  cyan: {
    icon: 'bg-cyan-500/15 text-cyan-400',
    glow: 'shadow-cyan-500/10',
    value: 'text-cyan-950 dark:text-cyan-50',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-emerald-500/10',
    value: 'text-emerald-950 dark:text-emerald-50',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    glow: 'shadow-amber-500/10',
    value: 'text-amber-950 dark:text-amber-50',
  },
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  color,
  delta,
  suffix,
}: KPICardProps) {
  const c = COLOR_MAP[color];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-panel-border
        bg-gradient-to-br from-panel-hover to-transparent
        p-5 shadow-xl ${c.glow}
        hover:border-panel-border transition-all duration-300 group
      `}
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5 dark:opacity-[0.02] text-fg-primary"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-3">
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${c.value}`}>
            {value}
            {suffix && (
              <span className="text-lg font-medium text-fg-tertiary ml-1">
                {suffix}
              </span>
            )}
          </p>
          {delta && (
            <p className="text-xs text-fg-muted mt-2">{delta}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.icon} ml-3 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
