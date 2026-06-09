'use client';

import { useEffect, useRef } from 'react';
import { X, User2, Hash, Clock } from 'lucide-react';
import type { AttendeeRow } from '@/types/database';
import { formatDateTime } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

interface AttendeeSlideOverProps {
  open: boolean;
  onClose: () => void;
  lectureId: string | null;
  professorName: string;
  startTime: string;
  attendees: AttendeeRow[];
  loading: boolean;
}

export default function AttendeeSlideOver({
  open,
  onClose,
  professorName,
  startTime,
  attendees,
  loading,
}: AttendeeSlideOverProps) {
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
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
          <div>
            <h2 className="text-sm font-semibold text-fg-primary">Attendee Manifest</h2>
            <p className="text-xs text-fg-tertiary mt-1 leading-relaxed">
              {professorName} · {formatDateTime(startTime)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Count bar */}
        {!loading && (
          <div className="px-6 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              <span className="font-semibold text-indigo-800 dark:text-indigo-200">{attendees.length}</span> student{attendees.length !== 1 ? 's' : ''} attended
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : attendees.length === 0 ? (
            <EmptyState
              icon={User2}
              title="No attendees"
              description="No students tapped in for this lecture."
            />
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {attendees.map((row, idx) => (
                <div key={row.student_id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-panel-hover transition-colors">
                  {/* Index */}
                  <span className="text-xs font-medium text-fg-muted w-5 shrink-0 text-right">
                    {idx + 1}
                  </span>

                  {/* Avatar */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {(row.students?.full_name?.[0] ?? '?').toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User2 size={11} className="text-fg-muted shrink-0" />
                      <p className="text-sm font-medium text-fg-primary truncate">
                        {row.students?.full_name ?? '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-fg-tertiary">
                        <Hash size={10} />
                        {row.students?.roll_number ?? '—'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-fg-muted">
                        <Clock size={10} />
                        {formatDateTime(row.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
