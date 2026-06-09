'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface ProfessorFormData {
  full_name: string;
  rfid_uid: string;
}

interface ProfessorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProfessorFormData) => Promise<void>;
  initialData?: { id: string; full_name: string; rfid_uid: string } | null;
}

const EMPTY: ProfessorFormData = { full_name: '', rfid_uid: '' };

const labelCls = 'block text-xs font-medium text-fg-tertiary mb-1.5';
const inputCls =
  'w-full rounded-lg border border-panel-border bg-panel-hover px-3 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors';

import { useEffect } from 'react';

export default function ProfessorModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: ProfessorModalProps) {
  const [form, setForm] = useState<ProfessorFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<ProfessorFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { full_name: initialData.full_name, rfid_uid: initialData.rfid_uid }
          : EMPTY,
      );
      setErrors({});
      setServerError(null);
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const e: Partial<ProfessorFormData> = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required';
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
      title={isEdit ? 'Edit Professor' : 'Register New Professor'}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label className={labelCls} htmlFor="prof-name">Full Name</label>
          <input
            id="prof-name"
            type="text"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            placeholder="e.g. Dr. Ramesh Kumar"
            className={`${inputCls} ${errors.full_name ? 'border-red-500/50' : ''}`}
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.full_name}</p>
          )}
        </div>

        {/* RFID UID */}
        <div>
          <label className={labelCls} htmlFor="prof-rfid">RFID UID</label>
          <input
            id="prof-rfid"
            type="text"
            value={form.rfid_uid}
            onChange={(e) => setForm((f) => ({ ...f, rfid_uid: e.target.value.toUpperCase() }))}
            placeholder="e.g. AB12CD34"
            className={`${inputCls} font-mono ${errors.rfid_uid ? 'border-red-500/50' : ''}`}
          />
          {errors.rfid_uid && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.rfid_uid}</p>
          )}
          <p className="mt-1.5 text-[11px] text-fg-muted">
            The unique UID from the RFID card issued to this professor.
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
            <p className="text-xs text-red-600 dark:text-red-400">{serverError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-fg-tertiary hover:text-fg-primary hover:bg-panel-hover transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            id={isEdit ? 'edit-professor-submit' : 'add-professor-submit'}
            className="flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-sm font-semibold text-fg-primary transition-all shadow-lg shadow-violet-500/20"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Register Professor'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
