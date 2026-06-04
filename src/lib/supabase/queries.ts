/**
 * All Supabase database query functions.
 * Server-side functions use createClient from lib/supabase/server.
 * Client-side real-time functions consume the browser client directly.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  ActiveLecture,
  AttendeeRow,
  DailyAttendance,
  KPIStats,
  LectureFilters,
  LectureHistoryRow,
  Professor,
  Student,
  StudentFormData,
} from '@/types/database';
import { lastNDays } from '@/lib/utils';

const PAGE_SIZE = 20;

// ─── KPI Stats ───────────────────────────────────────────────────────────────

export async function getKPIStats(): Promise<KPIStats> {
  const supabase = await createClient();

  const [studentsRes, professorsRes, activeLecturesRes, completedRes] =
    await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('professors').select('id', { count: 'exact', head: true }),
      supabase
        .from('lectures')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Active'),
      supabase
        .from('lectures')
        .select('id, attendance_records(count)')
        .in('status', ['Completed', 'Auto-Ended']),
    ]);

  const totalStudents = studentsRes.count ?? 0;
  const totalProfessors = professorsRes.count ?? 0;
  const activeLectures = activeLecturesRes.count ?? 0;

  // Average attendance rate: mean of (attendees / totalStudents) per completed lecture
  let avgAttendanceRate = 0;
  if (completedRes.data && completedRes.data.length > 0 && totalStudents > 0) {
    const rates = completedRes.data.map((lecture) => {
      const count =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (lecture.attendance_records as any[])?.[0]?.count ?? 0;
      return count / totalStudents;
    });
    avgAttendanceRate =
      (rates.reduce((a, b) => a + b, 0) / rates.length) * 100;
  }

  return { totalStudents, totalProfessors, activeLectures, avgAttendanceRate };
}

// ─── Daily Attendance Chart ───────────────────────────────────────────────────

export async function getDailyAttendanceChart(
  days = 7,
): Promise<DailyAttendance[]> {
  const supabase = await createClient();
  const dayList = lastNDays(days);
  const since = `${dayList[0]}T00:00:00`;

  const { data } = await supabase
    .from('attendance_records')
    .select('timestamp')
    .gte('timestamp', since)
    .order('timestamp', { ascending: true });

  // Group by date
  const countMap: Record<string, number> = {};
  dayList.forEach((d) => (countMap[d] = 0));

  (data ?? []).forEach((row) => {
    const date = row.timestamp.slice(0, 10);
    if (date in countMap) countMap[date]++;
  });

  return dayList.map((date) => ({ date, count: countMap[date] }));
}

// ─── Active Lectures ──────────────────────────────────────────────────────────

export async function getActiveLectures(): Promise<ActiveLecture[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lectures')
    .select(
      `
      id,
      professor_id,
      start_time,
      end_time,
      status,
      professors ( full_name ),
      attendance_records ( count )
    `,
    )
    .eq('status', 'Active')
    .order('start_time', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    professor_id: row.professor_id,
    start_time: row.start_time,
    end_time: row.end_time,
    status: row.status as 'Active',
    professors: row.professors as unknown as { full_name: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attendee_count: (row.attendance_records as any[])?.[0]?.count ?? 0,
  }));
}

// ─── Lecture History ──────────────────────────────────────────────────────────

export async function getLectureHistory(filters: Partial<LectureFilters>): Promise<{
  data: LectureHistoryRow[];
  total: number;
}> {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('lectures')
    .select(
      `
      id,
      professor_id,
      start_time,
      end_time,
      status,
      professors ( full_name ),
      attendance_records ( count )
    `,
      { count: 'exact' },
    )
    .order('start_time', { ascending: false })
    .range(from, to);

  if (filters.professorId) {
    query = query.eq('professor_id', filters.professorId);
  }
  if (filters.dateFrom) {
    query = query.gte('start_time', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('start_time', `${filters.dateTo}T23:59:59`);
  }

  const { data, count, error } = await query;
  if (error || !data) return { data: [], total: 0 };

  return {
    data: data.map((row) => ({
      id: row.id,
      professor_id: row.professor_id,
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status as 'Active' | 'Completed' | 'Auto-Ended',
      professor_name: (row.professors as unknown as { full_name: string } | null)?.full_name ?? '—',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attendee_count: (row.attendance_records as any[])?.[0]?.count ?? 0,
    })),
    total: count ?? 0,
  };
}

// ─── Lecture Attendees ────────────────────────────────────────────────────────

export async function getLectureAttendees(
  lectureId: string,
): Promise<AttendeeRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attendance_records')
    .select(
      `
      student_id,
      timestamp,
      students ( full_name, roll_number )
    `,
    )
    .eq('lecture_id', lectureId)
    .order('timestamp', { ascending: true });

  if (error || !data) return [];
  return data as unknown as AttendeeRow[];
}

// ─── Students ─────────────────────────────────────────────────────────────────

export async function getStudents(): Promise<Student[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('students')
    .select('*')
    .order('full_name', { ascending: true });
  return data ?? [];
}

export async function createStudent(
  payload: StudentFormData,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('students').insert([payload]);
  return { error: error?.message ?? null };
}

export async function updateStudent(
  id: string,
  payload: Partial<StudentFormData>,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('students')
    .update(payload)
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteStudent(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('students').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ─── Professors ───────────────────────────────────────────────────────────────

export async function getProfessors(): Promise<Professor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('professors')
    .select('*')
    .order('full_name', { ascending: true });
  return data ?? [];
}
