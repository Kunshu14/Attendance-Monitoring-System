'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  History,
  Users,
  GraduationCap,
  ChevronRight,
  Wifi,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    exact: true,
  },
  { href: '/dashboard/live', label: 'Live Sessions', icon: Radio },
  { href: '/dashboard/history', label: 'Lecture History', icon: History },
  { href: '/dashboard/students', label: 'Students', icon: Users },
  { href: '/dashboard/professors', label: 'Professors', icon: GraduationCap },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-[#0d1117] border-r border-white/[0.06]
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
            <Wifi size={18} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d1117]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              AttendIQ
            </p>
            <p className="text-[10px] text-white/40 leading-tight mt-0.5">
              Admin Console
            </p>
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/25 font-medium">
            Navigation
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-150 relative
                  ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-300 shadow-sm'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-indigo-400" />
                )}
                <Icon
                  size={16}
                  className={active ? 'text-indigo-400' : 'text-white/35 group-hover:text-white/60'}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={12} className="text-indigo-400/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">Admin</p>
              <p className="text-[10px] text-white/35 truncate">System Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
