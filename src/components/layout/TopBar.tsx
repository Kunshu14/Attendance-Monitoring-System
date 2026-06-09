'use client';

import { useState } from 'react';
import { Menu, Bell, RefreshCw } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onRefresh?: () => void;
}

export default function TopBar({
  title,
  subtitle,
  onMenuClick,
  onRefresh,
}: TopBarProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <header className="flex items-center gap-4 px-6 h-16 border-b border-panel-border bg-page-bg backdrop-blur-sm sticky top-0 z-10">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-fg-tertiary hover:text-fg-primary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-fg-primary leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-fg-tertiary leading-tight mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {onRefresh && (
          <button
            onClick={handleRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover transition-all"
            aria-label="Refresh"
          >
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}
            />
          </button>
        )}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </button>
      </div>
    </header>
  );
}
