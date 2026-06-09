import type { Metadata } from 'next';
import { getKPIStats, getDailyAttendanceChart } from '@/lib/supabase/queries';
import DashboardShell from '@/components/layout/DashboardShell';
import StatsGrid from '@/components/dashboard/StatsGrid';
import AttendanceChart from '@/components/dashboard/AttendanceChart';

export const metadata: Metadata = {
  title: 'Overview',
};

// Revalidate every 60 seconds for fresh stats
export const revalidate = 60;

export default async function DashboardPage() {
  const [stats, chartData] = await Promise.all([
    getKPIStats(),
    getDailyAttendanceChart(7),
  ]);

  return (
    <DashboardShell
      title="Dashboard Overview"
      subtitle="Real-time summary of your Smart Attendance System"
    >
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceChart data={chartData} />
        </div>

        {/* Quick Info Panel */}
        <div className="rounded-2xl border border-panel-border bg-gradient-to-br from-panel-hover to-transparent p-5">
          <h2 className="text-sm font-semibold text-fg-primary mb-4">System Status</h2>
          <div className="space-y-3">
            <StatusRow label="Database" status="Online" color="emerald" />
            <StatusRow label="Realtime" status="Active" color="emerald" />
            <StatusRow label="IoT Gateway" status="Connected" color="emerald" />
            <StatusRow label="RFID Reader" status="Ready" color="cyan" />
          </div>

          <div className="mt-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Attendance Rate</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-fg-primary">{stats.avgAttendanceRate.toFixed(1)}</span>
              <span className="text-sm text-fg-tertiary mb-1">%</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-panel-hover overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${Math.min(stats.avgAttendanceRate, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-fg-muted mt-2">Average across completed lectures</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusRow({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: 'emerald' | 'cyan' | 'amber';
}) {
  const dotCls = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    amber: 'bg-amber-400',
  }[color];

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-fg-tertiary">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotCls} animate-pulse`} />
        <span className="text-xs font-medium text-fg-secondary">{status}</span>
      </div>
    </div>
  );
}
