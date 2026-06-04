'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next';
import DashboardShell from '@/components/layout/DashboardShell';
import LectureFilters from '@/components/history/LectureFilters';
import LectureTable from '@/components/history/LectureTable';
import AttendeeSlideOver from '@/components/history/AttendeeSlideOver';
import type { LectureHistoryRow, AttendeeRow, Professor } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export default function HistoryPage() {
  // Filter state
  const [professorId, setProfessorId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Data state
  const [lectures, setLectures] = useState<LectureHistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [professors, setProfessors] = useState<Professor[]>([]);

  // Slide-over state
  const [selectedRow, setSelectedRow] = useState<LectureHistoryRow | null>(null);
  const [attendees, setAttendees] = useState<AttendeeRow[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  const PAGE_SIZE = 20;

  // Fetch professors for filter dropdown
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('professors')
      .select('*')
      .order('full_name')
      .then(({ data }) => setProfessors(data ?? []));
  }, []);

  // Fetch lectures
  const fetchLectures = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('lectures')
      .select(
        `id, professor_id, start_time, end_time, status,
         professors ( full_name ),
         attendance_records ( count )`,
        { count: 'exact' },
      )
      .order('start_time', { ascending: false })
      .range(from, to);

    // Resolve professorId from search text if needed
    const effectiveProfessorId = professorId;
    if (effectiveProfessorId) query = query.eq('professor_id', effectiveProfessorId);
    if (dateFrom) query = query.gte('start_time', `${dateFrom}T00:00:00`);
    if (dateTo) query = query.lte('start_time', `${dateTo}T23:59:59`);

    const { data, count } = await query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: LectureHistoryRow[] = (data ?? []).map((row: any) => ({
      id: row.id,
      professor_id: row.professor_id,
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      professor_name: row.professors?.full_name ?? '—',
      attendee_count: row.attendance_records?.[0]?.count ?? 0,
    }));

    // Client-side search by professor name
    const filtered = search
      ? rows.filter((r) =>
          r.professor_name.toLowerCase().includes(search.toLowerCase()),
        )
      : rows;

    setLectures(filtered);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, professorId, dateFrom, dateTo, search]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [professorId, dateFrom, dateTo, search]);

  // Fetch attendees when a row is selected
  const handleRowClick = async (row: LectureHistoryRow) => {
    if (selectedRow?.id === row.id) {
      setSlideOverOpen(false);
      setTimeout(() => setSelectedRow(null), 300);
      return;
    }
    setSelectedRow(row);
    setSlideOverOpen(true);
    setAttendeesLoading(true);

    const supabase = createClient();
    const { data } = await supabase
      .from('attendance_records')
      .select(`student_id, timestamp, students ( full_name, roll_number )`)
      .eq('lecture_id', row.id)
      .order('timestamp', { ascending: true });

    setAttendees((data as unknown as AttendeeRow[]) ?? []);
    setAttendeesLoading(false);
  };

  const handleReset = () => {
    setProfessorId('');
    setDateFrom('');
    setDateTo('');
    setSearch('');
    setPage(1);
  };

  return (
    <DashboardShell
      title="Lecture History"
      subtitle="Browse, filter, and inspect all recorded lectures"
      onRefresh={fetchLectures}
    >
      <LectureFilters
        professors={professors}
        professorId={professorId}
        dateFrom={dateFrom}
        dateTo={dateTo}
        search={search}
        onProfessorChange={setProfessorId}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSearchChange={setSearch}
        onReset={handleReset}
      />

      <LectureTable
        data={lectures}
        total={total}
        page={page}
        loading={loading}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        selectedId={selectedRow?.id ?? null}
      />

      <AttendeeSlideOver
        open={slideOverOpen}
        onClose={() => {
          setSlideOverOpen(false);
          setTimeout(() => setSelectedRow(null), 300);
        }}
        lectureId={selectedRow?.id ?? null}
        professorName={selectedRow?.professor_name ?? ''}
        startTime={selectedRow?.start_time ?? ''}
        attendees={attendees}
        loading={attendeesLoading}
      />
    </DashboardShell>
  );
}
