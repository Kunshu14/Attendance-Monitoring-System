import { Users, GraduationCap, Radio, TrendingUp } from 'lucide-react';
import KPICard from './KPICard';
import type { KPIStats } from '@/types/database';

export default function StatsGrid({ stats }: { stats: KPIStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        title="Total Students"
        value={stats.totalStudents}
        icon={Users}
        color="indigo"
        delta="Enrolled in system"
      />
      <KPICard
        title="Faculty Members"
        value={stats.totalProfessors}
        icon={GraduationCap}
        color="cyan"
        delta="Registered professors"
      />
      <KPICard
        title="Active Lectures"
        value={stats.activeLectures}
        icon={Radio}
        color="emerald"
        delta="Running right now"
      />
      <KPICard
        title="Avg Attendance Rate"
        value={stats.avgAttendanceRate.toFixed(1)}
        suffix="%"
        icon={TrendingUp}
        color="amber"
        delta="Across completed lectures"
      />
    </div>
  );
}
