import type { Metadata } from 'next';
import { getActiveLectures } from '@/lib/supabase/queries';
import DashboardShell from '@/components/layout/DashboardShell';
import LiveSessionCard from '@/components/live/LiveSessionCard';

export const metadata: Metadata = {
  title: 'Live Sessions',
};

export default async function LivePage() {
  const activeLectures = await getActiveLectures();

  return (
    <DashboardShell
      title="Live Session Monitor"
      subtitle="Real-time view of all ongoing lectures — updates automatically"
    >
      {/* Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <p className="text-sm text-emerald-300">
          <span className="font-semibold">{activeLectures.length} session{activeLectures.length !== 1 ? 's' : ''}</span>
          {' '}currently active · Subscribed to Supabase Realtime for automatic updates
        </p>
      </div>

      {/* Real-time cards — Client Component takes over */}
      <LiveSessionCard initial={activeLectures} />
    </DashboardShell>
  );
}
