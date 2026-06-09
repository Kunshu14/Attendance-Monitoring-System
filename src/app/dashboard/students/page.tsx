'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import StudentTable from '@/components/roster/StudentTable';
import StudentModal from '@/components/roster/StudentModal';
import StudentSlideOver, { type ProfessorBreakdown } from '@/components/roster/StudentSlideOver';
import type { Student, StudentFormData, StudentWithAttendance } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);

  // Slide-over state
  const [selectedStudent, setSelectedStudent] = useState<StudentWithAttendance | null>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<ProfessorBreakdown[]>([]);
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: rawStudents } = await supabase
      .from('students')
      .select('*')
      .order('full_name', { ascending: true });

    const { count: totalCompleted } = await supabase
      .from('lectures')
      .select('id', { count: 'exact', head: true })
      .in('status', ['Completed', 'Auto-Ended']);

    const { data: completedLectureIds } = await supabase
      .from('lectures')
      .select('id')
      .in('status', ['Completed', 'Auto-Ended']);

    const lectureIdList = (completedLectureIds ?? []).map((l) => l.id);
    let attendanceMap: Record<string, number> = {};

    if (lectureIdList.length > 0) {
      const { data: attendanceRows } = await supabase
        .from('attendance_records')
        .select('student_id')
        .in('lecture_id', lectureIdList);

      (attendanceRows ?? []).forEach((row) => {
        attendanceMap[row.student_id] = (attendanceMap[row.student_id] ?? 0) + 1;
      });
    }

    const total = totalCompleted ?? 0;
    const enriched: StudentWithAttendance[] = (rawStudents ?? []).map((s) => {
      const attended = attendanceMap[s.id] ?? 0;
      return {
        ...s,
        lecturesAttended: attended,
        attendancePercent: total > 0 ? (attended / total) * 100 : null,
      };
    });

    setStudents(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // Fetch per-professor breakdown for a selected student
  const fetchBreakdown = useCallback(async (student: StudentWithAttendance) => {
    setBreakdownLoading(true);
    const supabase = createClient();

    // Get all completed lectures with professor info
    const { data: lectures } = await supabase
      .from('lectures')
      .select('id, professor_id, professors(full_name)')
      .in('status', ['Completed', 'Auto-Ended']);

    if (!lectures || lectures.length === 0) {
      setBreakdown([]);
      setBreakdownLoading(false);
      return;
    }

    // Get this student's attendance records for completed lectures
    const lectureIds = lectures.map((l) => l.id);
    const { data: attended } = await supabase
      .from('attendance_records')
      .select('lecture_id')
      .eq('student_id', student.id)
      .in('lecture_id', lectureIds);

    const attendedSet = new Set((attended ?? []).map((r) => r.lecture_id));

    // Group by professor
    const profMap: Record<string, { name: string; total: number; attended: number }> = {};
    lectures.forEach((l) => {
      const pid = l.professor_id;
      if (!pid) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const name = (l.professors as any)?.full_name ?? 'Unknown';
      if (!profMap[pid]) profMap[pid] = { name, total: 0, attended: 0 };
      profMap[pid].total += 1;
      if (attendedSet.has(l.id)) profMap[pid].attended += 1;
    });

    const rows: ProfessorBreakdown[] = Object.entries(profMap)
      .map(([professorId, data]) => ({
        professorId,
        professorName: data.name,
        attended: data.attended,
        total: data.total,
        percent: data.total > 0 ? (data.attended / data.total) * 100 : 0,
      }))
      .sort((a, b) => b.percent - a.percent);

    setBreakdown(rows);
    setBreakdownLoading(false);
  }, []);

  const handleRowClick = (student: StudentWithAttendance) => {
    if (selectedStudent?.id === student.id) {
      setSlideOverOpen(false);
      setTimeout(() => setSelectedStudent(null), 300);
      return;
    }
    setSelectedStudent(student);
    setSlideOverOpen(true);
    fetchBreakdown(student);
  };

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditTarget(student);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from('students').delete().eq('id', id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) handleCloseSlideOver();
  };

  const handleSubmit = async (data: StudentFormData) => {
    const supabase = createClient();
    if (editTarget) {
      const { error } = await supabase.from('students').update(data).eq('id', editTarget.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('students').insert([data]);
      if (error) throw new Error(error.message);
    }
    await fetchStudents();
  };

  return (
    <DashboardShell
      title="Students Roster"
      subtitle="Click any row to see per-subject attendance breakdown"
      onRefresh={fetchStudents}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-panel-border border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
        </div>
      ) : (
        <StudentTable
          students={students}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={handleRowClick}
          selectedId={selectedStudent?.id ?? null}
        />
      )}

      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />

      <StudentSlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        student={selectedStudent}
        breakdown={breakdown}
        loading={breakdownLoading}
      />
    </DashboardShell>
  );
}
