'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import type { Student, StudentFormData } from '@/types/database';

interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: Student | null;
}

const EMPTY: StudentFormData = { full_name: '', roll_number: '', rfid_uid: '' };

const labelCls = 'block text-xs font-medium text-white/50 mb-1.5';
const inputCls =
  'w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors';

export default function StudentModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: StudentModalProps) {
  const [form, setForm] = useState<StudentFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              full_name: initialData.full_name,
              roll_number: initialData.roll_number,
              rfid_uid: initialData.rfid_uid,
            }
          : EMPTY,
      );
      setErrors({});
      setServerError(null);
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const e: Partial<StudentFormData> = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required';
    if (!form.roll_number.trim()) e.roll_number = 'Roll number is required';
    if (!form.rfid_uid.trim()) e.rfid_uid = 'RFID UID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Student' : 'Register New Student'}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label className={labelCls} htmlFor="student-name">Full Name</label>
          <input
            id="student-name"
            type="text"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            placeholder="e.g. Jane Doe"
            className={`${inputCls} ${errors.full_name ? 'border-red-500/50' : ''}`}
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-400">{errors.full_name}</p>
          )}
        </div>

        {/* Roll Number */}
        <div>
          <label className={labelCls} htmlFor="roll-number">Roll Number</label>
          <input
            id="roll-number"
            type="text"
            value={form.roll_number}
            onChange={(e) => setForm((f) => ({ ...f, roll_number: e.target.value }))}
            placeholder="e.g. CS-2024-001"
            className={`${inputCls} ${errors.roll_number ? 'border-red-500/50' : ''}`}
          />
          {errors.roll_number && (
            <p className="mt-1 text-xs text-red-400">{errors.roll_number}</p>
          )}
        </div>

        {/* RFID UID */}
        <div>
          <label className={labelCls} htmlFor="rfid-uid">RFID UID</label>
          <input
            id="rfid-uid"
            type="text"
            value={form.rfid_uid}
            onChange={(e) => setForm((f) => ({ ...f, rfid_uid: e.target.value.toUpperCase() }))}
            placeholder="e.g. A1B2C3D4"
            className={`${inputCls} font-mono ${errors.rfid_uid ? 'border-red-500/50' : ''}`}
          />
          {errors.rfid_uid && (
            <p className="mt-1 text-xs text-red-400">{errors.rfid_uid}</p>
          )}
          <p className="mt-1.5 text-[11px] text-white/25">
            The unique UID from the physical RFID card or NFC device assigned to this student.
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
            <p className="text-xs text-red-400">{serverError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            id={isEdit ? 'edit-student-submit' : 'add-student-submit'}
            className="flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Register Student'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
