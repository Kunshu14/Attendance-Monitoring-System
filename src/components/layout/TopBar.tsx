'use client';

import { useState } from 'react';
import { Menu, Bell, RefreshCw } from 'lucide-react';

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
    <header className="flex items-center gap-4 px-6 h-16 border-b border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white/50 hover:text-white/90 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-white leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-white/40 leading-tight mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={handleRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
            aria-label="Refresh"
          >
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin text-indigo-400' : ''}
            />
          </button>
        )}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </button>
      </div>
    </header>
  );
}
