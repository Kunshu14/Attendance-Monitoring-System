'use client';

import { CreditCard, Pencil, Trash2, Plus } from 'lucide-react';
import type { Professor } from '@/types/database';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';


interface ProfessorTableProps {
  professors: Professor[];
  onAdd: () => void;
  onEdit: (professor: Professor) => void;
  onDelete: (id: string) => void;
}

export default function ProfessorTable({
  professors,
  onAdd,
  onEdit,
  onDelete,
}: ProfessorTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div>
          <h2 className="text-sm font-semibold text-white">Faculty Roster</h2>
          <p className="text-xs text-white/35 mt-0.5">{professors.length} professors registered</p>
        </div>
        <button
          onClick={onAdd}
          id="add-professor-btn"
          className="flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-lg shadow-violet-500/20"
        >
          <Plus size={13} />
          Add Professor
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">Name</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5"><CreditCard size={11} /> RFID UID</div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">Registered</th>
              <th className="px-5 py-3 w-24 text-right text-[11px] font-medium uppercase tracking-wider text-white/35">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {professors.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    title="No professors"
                    description="Register your first faculty member using the button above."
                  />
                </td>
              </tr>
            ) : (
              professors.map((prof) => (
                <tr key={prof.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-pink-500/25 text-xs font-bold text-violet-300">
                        {prof.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white/90">{prof.full_name}</p>
                        <p className="text-[11px] text-white/30 mt-0.5">Professor</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-300/80">
                      {prof.rfid_uid}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/35">{formatDate(prof.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(prof)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                        title="Edit professor"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(prof.id)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                          deleteConfirm === prof.id
                            ? 'bg-red-500/20 text-red-400'
                            : 'text-white/40 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                        title={deleteConfirm === prof.id ? 'Click again to confirm' : 'Delete professor'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
