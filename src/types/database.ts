// ─── Database Row Types ──────────────────────────────────────────────────────

export type LectureStatus = 'Active' | 'Completed' | 'Auto-Ended';

export interface Professor {
  id: string;
  full_name: string;
  rfid_uid: string;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  roll_number: string;
  rfid_uid: string;
  created_at: string;
}

export interface Lecture {
  id: string;
  professor_id: string;
  start_time: string;
  end_time: string | null;
  status: LectureStatus;
}

export interface AttendanceRecord {
  id: string;
  lecture_id: string;
  student_id: string;
  timestamp: string;
}

// ─── Joined / Aggregated Types ───────────────────────────────────────────────

export interface LectureWithProfessor extends Lecture {
  professors: Pick<Professor, 'full_name'>;
}

export interface ActiveLecture extends LectureWithProfessor {
  attendee_count: number;
}

export interface LectureHistoryRow extends Lecture {
  professor_name: string;
  attendee_count: number;
}

export interface AttendeeRow {
  student_id: string;
  timestamp: string;
  students: Pick<Student, 'full_name' | 'roll_number'>;
}

// ─── KPI / Chart Types ───────────────────────────────────────────────────────

export interface KPIStats {
  totalStudents: number;
  totalProfessors: number;
  activeLectures: number;
  avgAttendanceRate: number;
}

export interface DailyAttendance {
  date: string; // "YYYY-MM-DD"
  count: number;
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface StudentFormData {
  full_name: string;
  roll_number: string;
  rfid_uid: string;
}

export interface LectureFilters {
  professorId: string;
  dateFrom: string;
  dateTo: string;
  page: number;
}

// ─── Enriched Row Types (with computed stats) ─────────────────────────────────

export interface StudentWithAttendance extends Student {
  /** Lectures attended out of total completed lectures (0–100), or null if no lectures yet */
  attendancePercent: number | null;
  /** Raw count of lectures this student attended */
  lecturesAttended: number;
}

export interface ProfessorWithStats extends Professor {
  /** Number of completed/auto-ended lectures this professor ran */
  completedLectures: number;
  /** Average % of total students who attended their lectures, or null if none yet */
  avgAttendancePercent: number | null;
}
