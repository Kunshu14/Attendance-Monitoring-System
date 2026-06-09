'use client';

import type { Professor } from '@/types/database';
import { Search, SlidersHorizontal } from 'lucide-react';

interface LectureFiltersProps {
  professors: Professor[];
  professorId: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  onProfessorChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onReset: () => void;
}

const inputCls =
  'w-full rounded-lg border border-panel-border bg-panel-hover px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors';

export default function LectureFilters({
  professors,
  professorId,
  dateFrom,
  dateTo,
  search,
  onProfessorChange,
  onDateFromChange,
  onDateToChange,
  onSearchChange,
  onReset,
}: LectureFiltersProps) {
  return (
    <div className="rounded-2xl border border-panel-border bg-panel-hover p-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal size={14} className="text-fg-tertiary" />
        <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search professor..."
            className={`${inputCls} pl-8`}
          />
        </div>

        {/* Professor */}
        <select
          value={professorId}
          onChange={(e) => onProfessorChange(e.target.value)}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="">All Professors</option>
          {professors.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name}
            </option>
          ))}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className={`${inputCls} dark:[color-scheme:dark]`}
        />

        {/* Date to */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className={`${inputCls} dark:[color-scheme:dark]`}
        />
      </div>

      {(professorId || dateFrom || dateTo || search) && (
        <button
          onClick={onReset}
          className="mt-3 text-xs text-fg-tertiary hover:text-fg-secondary underline underline-offset-2 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
