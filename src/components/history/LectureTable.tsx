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
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                Professor
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  Start Time
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                End Time
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5">
                  <Users size={11} />
                  Attendees
                </div>
              </th>
              <th className="px-5 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
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
                        : 'hover:bg-white/[0.025]'
                      }
                    `}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-white/90">{row.professor_name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white/55">
                      {formatDateTime(row.start_time)}
                    </td>
                    <td className="px-5 py-3.5 text-white/40">
                      {row.end_time ? formatDateTime(row.end_time) : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-white/70">
                        <Users size={10} className="text-white/40" />
                        {row.attendee_count}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronDown
                        size={14}
                        className={`text-white/30 transition-transform duration-200 ${isSelected ? 'rotate-180 text-indigo-400' : ''}`}
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <p className="text-xs text-white/30">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
