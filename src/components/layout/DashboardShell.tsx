'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function DashboardShell({
  children,
  title,
  subtitle,
  onRefresh,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={onRefresh}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
