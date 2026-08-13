export type Role = "teacher" | "student";

export type Language = "en" | "bn";

export type QuestionType = "mcq" | "true-false" | "short" | "fill-blank";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // for mcq / true-false
  correctIndex?: number; // for mcq / true-false (auto-gradable)
  correctText?: string; // for fill-blank (auto-gradable, case-insensitive)
  marks: number;
}

// A real, separate account for every teacher and every student.
// This is a client-only demo (no server/database), so "separate identity"
// means: a stable account with its own id, tied to a role, stored locally —
// not a globally-secure login system. Good enough to make per-user data
// (attempts, results, notifications) behave correctly for each person.
export interface UserAccount {
  id: string;
  role: Role;
  name: string;
  username: string; // used as the unique login handle
  password: string; // demo-only plaintext check, never expose in UI
  photoUrl?: string; // small base64 data URL, set from the profile page
  createdAt: number;
}

export interface Quiz {
  id: string;
  code: string; // e.g. QZ-3F9K2A
  teacherId: string; // owner — only this teacher can manage it
  title: string;
  subject: string;
  instructions: string;
  durationMinutes: number;
  randomizeOrder: boolean;
  negativeMarking: boolean;
  resultsPublished: boolean; // gate: students can't see results until true
  whitelist: string[]; // student ids/usernames, empty = open to all
  questions: Question[];
  createdAt: number;
  status: "draft" | "live" | "ended";
  // Exam window — when set, students may only join/attempt between these
  // two timestamps (ms). Either can be left unset for "no restriction".
  // The teacher can push examEndAt later at any time ("extend time").
  examStartAt?: number;
  examEndAt?: number;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex?: number;
  textAnswer?: string;
}

export interface Submission {
  id: string;
  quizId: string;
  studentName: string;
  studentId: string; // stable account id — one attempt enforced per (quizId, studentId)
  answers: AnswerRecord[];
  submittedAt: number;
  tabSwitchCount: number;
  autoScore: number; // auto-gradable portion
  manualScore: number; // manually graded portion (short answers)
  manualGradesGiven: Record<string, number>; // questionId -> marks given
  totalPossible: number;
  fullyGraded: boolean;
}

export interface NotificationItem {
  id: string;
  type: "submission" | "verification" | "info" | "result_published" | "duplicate_attempt";
  message: string;
  createdAt: number;
  recipientId: string; // userId of the teacher or student this notification is for
  quizId?: string;
  read: boolean;
}
