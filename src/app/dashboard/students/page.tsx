'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import StudentTable from '@/components/roster/StudentTable';
import StudentModal from '@/components/roster/StudentModal';
import type { Student, StudentFormData } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('full_name', { ascending: true });
    setStudents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

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
  };

  const handleSubmit = async (data: StudentFormData) => {
    const supabase = createClient();
    if (editTarget) {
      const { error } = await supabase
        .from('students')
        .update(data)
        .eq('id', editTarget.id);
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
      subtitle="Manage student registrations and RFID card assignments"
      onRefresh={fetchStudents}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-indigo-400 animate-spin" />
        </div>
      ) : (
        <StudentTable
          students={students}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />
    </DashboardShell>
  );
}
