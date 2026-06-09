'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import ProfessorTable from '@/components/roster/ProfessorTable';
import ProfessorModal from '@/components/roster/ProfessorModal';
import type { Professor, ProfessorWithStats } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface ProfessorFormData {
  full_name: string;
  rfid_uid: string;
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<ProfessorWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Professor | null>(null);

  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // 1. Fetch all professors
    const { data: rawProfessors } = await supabase
      .from('professors')
      .select('*')
      .order('full_name', { ascending: true });

    // 2. Fetch total student count (denominator for avg attendance)
    const { count: totalStudents } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true });

    // 3. Fetch completed lectures with attendee counts, grouped by professor
    const { data: completedLectures } = await supabase
      .from('lectures')
      .select('professor_id, attendance_records(count)')
      .in('status', ['Completed', 'Auto-Ended']);

    // Aggregate per professor
    const statsMap: Record<string, { totalRate: number; count: number }> = {};
    const total = totalStudents ?? 0;

    (completedLectures ?? []).forEach((lecture) => {
      const pid = lecture.professor_id;
      if (!pid) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attendees = (lecture.attendance_records as any[])?.[0]?.count ?? 0;
      const rate = total > 0 ? (attendees / total) * 100 : 0;

      if (!statsMap[pid]) statsMap[pid] = { totalRate: 0, count: 0 };
      statsMap[pid].totalRate += rate;
      statsMap[pid].count += 1;
    });

    const enriched: ProfessorWithStats[] = (rawProfessors ?? []).map((p) => {
      const s = statsMap[p.id];
      return {
        ...p,
        completedLectures: s?.count ?? 0,
        avgAttendancePercent:
          s && s.count > 0 ? s.totalRate / s.count : null,
      };
    });

    setProfessors(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfessors(); }, [fetchProfessors]);

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (professor: Professor) => {
    setEditTarget(professor);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from('professors').delete().eq('id', id);
    setProfessors((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (data: ProfessorFormData) => {
    const supabase = createClient();
    if (editTarget) {
      const { error } = await supabase
        .from('professors')
        .update(data)
        .eq('id', editTarget.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('professors').insert([data]);
      if (error) throw new Error(error.message);
    }
    await fetchProfessors();
  };

  return (
    <DashboardShell
      title="Professors Roster"
      subtitle="Faculty members, lecture history, and average class attendance rates"
      onRefresh={fetchProfessors}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-panel-border border-t-violet-600 dark:border-t-violet-400 animate-spin" />
        </div>
      ) : (
        <ProfessorTable
          professors={professors}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProfessorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />
    </DashboardShell>
  );
}
