'use client';

import { useEffect, useRef } from 'react';
import { X, TrendingUp } from 'lucide-react';
import type { StudentWithAttendance } from '@/types/database';
import AttendanceBadge from '@/components/ui/AttendanceBadge';
import Spinner from '@/components/ui/Spinner';
import { initials } from '@/lib/utils';

export interface ProfessorBreakdown {
  professorId: string;
  professorName: string;
  attended: number;
  total: number;
  percent: number;
}

interface StudentSlideOverProps {
  open: boolean;
  onClose: () => void;
  student: StudentWithAttendance | null;
  breakdown: ProfessorBreakdown[];
  loading: boolean;
}

export default function StudentSlideOver({
  open,
  onClose,
  student,
  breakdown,
  loading,
}: StudentSlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed right-0 top-0 z-50 h-full w-full max-w-md
          bg-panel-bg border-l border-panel-border shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-panel-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {student ? initials(student.full_name) : '??'}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-fg-primary">
                {student?.full_name ?? 'Student'}
              </h2>
              <p className="text-xs text-fg-tertiary mt-0.5">
                {student?.roll_number} · Attendance by Subject
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Overall summary bar */}
        {student && (
          <div className="px-6 py-3 border-b border-panel-border bg-indigo-500/[0.07]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1.5">
                <TrendingUp size={11} /> Overall Attendance
              </span>
              <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-200">
                {student.lecturesAttended} lectures attended
              </span>
            </div>
            <AttendanceBadge percent={student.attendancePercent} />
          </div>
        )}

        {/* Per-professor breakdown */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : breakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-hover mb-3">
                <TrendingUp size={20} className="text-fg-muted" />
              </div>
              <p className="text-sm text-fg-tertiary">No lecture data yet</p>
              <p className="text-xs text-fg-muted mt-1">Attendance will appear once lectures are completed.</p>
            </div>
          ) : (
            <>
              <p className="px-6 pt-4 pb-2 text-[10px] uppercase tracking-widest text-fg-muted font-medium">
                Breakdown by Professor / Subject
              </p>
              <div className="divide-y divide-white/[0.04]">
                {breakdown.map((row) => (
                  <div key={row.professorId} className="px-6 py-4 hover:bg-panel-hover transition-colors">
                    {/* Professor name + avatar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/25 to-pink-500/25 text-xs font-bold text-violet-700 dark:text-violet-300">
                        {initials(row.professorName)}
                      </div>
                      <p className="text-sm font-medium text-fg-primary truncate">
                        {row.professorName}
                      </p>
                    </div>

                    {/* Progress + stats */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <AttendanceBadge percent={row.percent} />
                      </div>
                      <span className="text-xs text-fg-muted shrink-0 tabular-nums">
                        {row.attended} / {row.total} lectures
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
