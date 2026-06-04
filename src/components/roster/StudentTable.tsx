'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, CreditCard, Hash, TrendingUp, ChevronRight } from 'lucide-react';
import type { StudentWithAttendance } from '@/types/database';
import type { Student } from '@/types/database';
import EmptyState from '@/components/ui/EmptyState';
import AttendanceBadge from '@/components/ui/AttendanceBadge';
import { formatDate } from '@/lib/utils';

interface StudentTableProps {
  students: StudentWithAttendance[];
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onRowClick: (student: StudentWithAttendance) => void;
  selectedId: string | null;
}

export default function StudentTable({
  students,
  onAdd,
  onEdit,
  onDelete,
  onRowClick,
  selectedId,
}: StudentTableProps) {
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
          <h2 className="text-sm font-semibold text-white">Student Roster</h2>
          <p className="text-xs text-white/35 mt-0.5">{students.length} students enrolled</p>
        </div>
        <button
          onClick={onAdd}
          id="add-student-btn"
          className="flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus size={13} />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">Name</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5"><Hash size={11} /> Roll No.</div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5"><CreditCard size={11} /> RFID UID</div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                <div className="flex items-center gap-1.5"><TrendingUp size={11} /> Attendance</div>
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">Enrolled</th>
              <th className="px-5 py-3 w-24 text-right text-[11px] font-medium uppercase tracking-wider text-white/35">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title="No students" description="Register your first student using the button above." />
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedId === student.id;
                return (
                <tr
                  key={student.id}
                  onClick={() => onRowClick(student)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? 'bg-indigo-500/10' : 'hover:bg-white/[0.025]'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/25 to-violet-500/25 text-xs font-bold text-indigo-300">
                        {student.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-white/90">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-xs font-mono text-white/70">
                      {student.roll_number}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-mono text-cyan-300/80">
                      {student.rfid_uid}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <AttendanceBadge percent={student.attendancePercent} />
                      {student.attendancePercent !== null && (
                        <span className="text-[10px] text-white/25">
                          {student.lecturesAttended} lecture{student.lecturesAttended !== 1 ? 's' : ''} attended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/35">{formatDate(student.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                          title="Edit student"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                            deleteConfirm === student.id
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-white/40 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                          title={deleteConfirm === student.id ? 'Click again to confirm' : 'Delete student'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`shrink-0 transition-all duration-200 ${
                          isSelected ? 'text-indigo-400 rotate-90' : 'text-white/20'
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
