import { type LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Nothing to display here yet.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-panel-hover mb-4">
        <Icon size={24} className="text-fg-muted" />
      </div>
      <p className="text-sm font-medium text-fg-tertiary">{title}</p>
      <p className="text-xs text-fg-muted mt-1 max-w-xs">{description}</p>
    </div>
  );
}
