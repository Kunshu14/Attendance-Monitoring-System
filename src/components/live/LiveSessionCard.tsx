'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, Clock, Wifi } from 'lucide-react';
import type { ActiveLecture } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime, elapsedMinutes, formatDurationMinutes, initials } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

interface LiveSessionCardProps {
  initial: ActiveLecture[];
}

export default function LiveSessionCard({ initial }: LiveSessionCardProps) {
  const [sessions, setSessions] = useState<ActiveLecture[]>(initial);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('lectures')
      .select(`
        id, professor_id, start_time, end_time, status,
        professors ( full_name ),
        attendance_records ( count )
      `)
      .eq('status', 'Active')
      .order('start_time', { ascending: false });

    if (data) {
      setSessions(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((row: any) => ({
          ...row,
          professors: row.professors as { full_name: string },
          attendee_count: row.attendance_records?.[0]?.count ?? 0,
        })),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('realtime-attendance')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_records' },
        () => { refresh(); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lectures' },
        () => { refresh(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  // Tick to update elapsed timers every 30s
  useEffect(() => {
    const timer = setInterval(() => setSessions((s) => [...s]), 30_000);
    return () => clearInterval(timer);
  }, []);

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel-hover mb-4">
          <Wifi size={28} className="text-fg-muted" />
        </div>
        <p className="text-sm font-medium text-fg-tertiary">No Active Sessions</p>
        <p className="text-xs text-fg-muted mt-1">Lectures will appear here once started by professors.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sessions.map((session) => {
        const elapsed = elapsedMinutes(session.start_time);
        return (
          <div
            key={session.id}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-5 hover:border-emerald-500/30 transition-all duration-300"
          >
            {/* Pulse indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Live</span>
            </div>

            {/* Professor avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                {initials(session.professors?.full_name ?? 'Unknown')}
              </div>
              <div>
                <p className="text-sm font-semibold text-fg-primary leading-tight">
                  {session.professors?.full_name ?? 'Unknown Professor'}
                </p>
                <p className="text-xs text-fg-tertiary mt-0.5">Professor</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-panel-hover px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={11} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] uppercase tracking-wider text-fg-tertiary">Students</span>
                </div>
                <p className="text-xl font-bold text-fg-primary">{session.attendee_count}</p>
              </div>

              <div className="rounded-xl bg-panel-hover px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} className="text-cyan-400" />
                  <span className="text-[10px] uppercase tracking-wider text-fg-tertiary">Elapsed</span>
                </div>
                <p className="text-xl font-bold text-fg-primary">{formatDurationMinutes(elapsed)}</p>
              </div>
            </div>

            {/* Start time */}
            <p className="mt-3 text-[11px] text-fg-muted truncate">
              Started {formatDateTime(session.start_time)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
