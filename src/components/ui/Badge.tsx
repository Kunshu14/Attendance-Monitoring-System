import type { LectureStatus } from '@/types/database';

const STATUS_STYLES: Record<LectureStatus, string> = {
  Active:
    'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20',
  Completed:
    'bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20',
  'Auto-Ended':
    'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20',
};

const STATUS_DOT: Record<LectureStatus, string> = {
  Active: 'bg-emerald-400 animate-pulse',
  Completed: 'bg-indigo-400',
  'Auto-Ended': 'bg-amber-400',
};

interface BadgeProps {
  status: LectureStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}
