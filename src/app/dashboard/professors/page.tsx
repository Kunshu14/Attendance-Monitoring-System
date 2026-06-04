'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import ProfessorTable from '@/components/roster/ProfessorTable';
import ProfessorModal from '@/components/roster/ProfessorModal';
import type { Professor } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface ProfessorFormData {
  full_name: string;
  rfid_uid: string;
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Professor | null>(null);

  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('professors')
      .select('*')
      .order('full_name', { ascending: true });
    setProfessors(data ?? []);
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
      subtitle="Faculty members and their RFID card assignments"
      onRefresh={fetchProfessors}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
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
