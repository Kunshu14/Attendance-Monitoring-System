'use client';

import { ChevronLeft, ChevronRight, Users, ChevronDown, Calendar } from 'lucide-react';
import type { LectureHistoryRow } from '@/types/database';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { formatDateTime } from '@/lib/utils';

const PAGE_SIZE = 20;

interface LectureTableProps {
  data: LectureHistoryRow[];
  total: number;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRowClick: (row: LectureHistoryRow) => void;
  selectedId: string | null;
}

export default function LectureTable({
  data,
  total,
  page,
  loading,
  onPageChange,
  onRowClick,
  selectedId,
}: LectureTableProps) {
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-panel-border overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-panel-hover">
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-tertiary">
                Professor
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-tertiary">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  Start Time
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-tertiary">
                End Time
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-tertiary">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-tertiary">
                <div className="flex items-center gap-1.5">
                  <Users size={11} />
                  Attendees
                </div>
              </th>
              <th className="px-5 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No lectures found"
                    description="Try adjusting your filters."
                  />
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isSelected = selectedId === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick(row)}
                    className={`
                      cursor-pointer transition-colors duration-100
                      ${isSelected
                        ? 'bg-indigo-500/10 border-l-2 border-l-indigo-400'
                        : 'hover:bg-panel-hover'
                      }
                    `}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-fg-primary">{row.professor_name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-fg-secondary">
                      {formatDateTime(row.start_time)}
                    </td>
                    <td className="px-5 py-3.5 text-fg-tertiary">
                      {row.end_time ? formatDateTime(row.end_time) : <span className="text-fg-muted">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-hover px-2.5 py-0.5 text-xs font-medium text-fg-secondary">
                        <Users size={10} className="text-fg-tertiary" />
                        {row.attendee_count}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronDown
                        size={14}
                        className={`text-fg-muted transition-transform duration-200 ${isSelected ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-panel-border bg-panel-hover">
          <p className="text-xs text-fg-muted">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
