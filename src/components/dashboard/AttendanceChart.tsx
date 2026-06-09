'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyAttendance } from '@/types/database';
import { format, parseISO } from 'date-fns';

interface AttendanceChartProps {
  data: DailyAttendance[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  // Use the original ISO date from the data object, not the XAxis label (short day name)
  const isoDate: string | undefined = payload[0]?.payload?.date;
  return (
    <div className="rounded-xl border border-panel-border bg-panel-bg px-4 py-3 shadow-2xl">
      <p className="text-xs text-fg-tertiary mb-1">
        {isoDate ? format(parseISO(isoDate), 'EEEE, MMM d') : ''}
      </p>
      <p className="text-sm font-semibold text-fg-primary">
        {payload[0].value}{' '}
        <span className="text-fg-tertiary font-normal text-xs">check-ins</span>
      </p>
    </div>
  );
};

export default function AttendanceChart({ data }: AttendanceChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'EEE'),
  }));

  return (
    <div className="rounded-2xl border border-panel-border bg-gradient-to-br from-panel-hover to-transparent p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-fg-primary">Attendance Trend</h2>
          <p className="text-xs text-fg-tertiary mt-0.5">Daily check-ins — last 7 days</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          <span className="text-xs text-fg-tertiary">Check-ins</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#attendanceGrad)"
            dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#818cf8', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
