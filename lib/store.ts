"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Quiz,
  Question,
  Submission,
  NotificationItem,
  AnswerRecord,
  UserAccount,
  Role,
  Language,
} from "./types";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `QZ-${out}`;
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

// Whether a quiz's exam window currently allows a student to join/attempt.
// No window set at all => always open. Otherwise "now" must fall inside
// [examStartAt, examEndAt] (examEndAt may have been pushed later by the
// teacher via extendExamEnd — that's the whole point of "extend time").
export function isExamWindowOpen(quiz: Pick<Quiz, "examStartAt" | "examEndAt">): boolean {
  const now = Date.now();
  if (quiz.examStartAt && now < quiz.examStartAt) return false;
  if (quiz.examEndAt && now > quiz.examEndAt) return false;
  return true;
}

export function examWindowStatus(
  quiz: Pick<Quiz, "examStartAt" | "examEndAt">
): "open" | "not-started" | "ended" {
  const now = Date.now();
  if (quiz.examStartAt && now < quiz.examStartAt) return "not-started";
  if (quiz.examEndAt && now > quiz.examEndAt) return "ended";
  return "open";
}

// Whether every auto-gradable question in a quiz actually has an answer key.
// Without this, submissions silently grade as "wrong" for any question the
// teacher forgot to mark — this is enforced before a quiz can be published.
export function isAnswerKeyComplete(questions: Question[]): boolean {
  return questions.every((q) => {
    if (q.type === "mcq" || q.type === "true-false") {
      return q.correctIndex !== undefined && q.correctIndex !== null;
    }
    if (q.type === "fill-blank") {
      return !!q.correctText && q.correctText.trim().length > 0;
    }
    return true; // "short" is always manually graded
  });
}

interface AppState {
  // Auth / identity
  users: UserAccount[];
  currentUserId: string | null;

  // Preferences
  darkMode: boolean;
  language: Language;

  quizzes: Quiz[];
  submissions: Submission[];
  notifications: NotificationItem[];

  register: (
    role: Role,
    name: string,
    username: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  login: (
    role: Role,
    username: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  getCurrentUser: () => UserAccount | undefined;
  updateProfilePhoto: (photoUrl: string) => void;

  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;

  createQuiz: (
    data: Omit<Quiz, "id" | "code" | "createdAt" | "status" | "teacherId" | "resultsPublished">
  ) => Quiz;
  updateQuiz: (id: string, patch: Partial<Quiz>) => void;
  getQuizByCode: (code: string) => Quiz | undefined;
  getQuizById: (id: string) => Quiz | undefined;
  getQuizzesForTeacher: (teacherId: string) => Quiz[];
  toggleQuizStatus: (id: string, status: Quiz["status"]) => void;
  publishResults: (quizId: string) => void;
  extendExamEnd: (quizId: string, newEndAt: number) => void;

  hasAttempted: (quizId: string, studentId: string) => boolean;
  submitQuiz: (
    quizId: string,
    answers: AnswerRecord[],
    tabSwitchCount: number
  ) => { ok: true; submission: Submission } | { ok: false; error: string };
  gradeShortAnswer: (submissionId: string, questionId: string, marks: number) => void;
  getSubmissionsForQuiz: (quizId: string) => Submission[];

  addNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  getNotificationsFor: (userId: string) => NotificationItem[];
  markNotificationsRead: (userId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      darkMode: false,
      language: "en",

      quizzes: [],
      submissions: [],
      notifications: [],

      register: (role, name, username, password) => {
        const normUsername = username.trim().toLowerCase();
        if (!name.trim() || !normUsername || !password) {
          return { ok: false, error: "Please fill in every field." };
        }
        const existing = get().users.find((u) => u.username === normUsername);
        if (existing) {
          return { ok: false, error: "An account with this username already exists." };
        }
        const user: UserAccount = {
          id: uid(role === "teacher" ? "tch" : "stu"),
          role,
          name: name.trim(),
          username: normUsername,
          password,
          createdAt: Date.now(),
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },

      login: (role, username, password) => {
        const normUsername = username.trim().toLowerCase();
        const user = get().users.find((u) => u.username === normUsername);
        if (!user) return { ok: false, error: "No account found with this username." };
        if (user.role !== role) {
          return {
            ok: false,
            error: `This username is registered as a ${user.role}. Switch role to log in.`,
          };
        }
        if (user.password !== password) {
          return { ok: false, error: "Incorrect password." };
        }
        set({ currentUserId: user.id });
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      getCurrentUser: () => get().users.find((u) => u.id === get().currentUserId),

      updateProfilePhoto: (photoUrl) => {
        const current = get().getCurrentUser();
        if (!current) return;
        set((s) => ({
          users: s.users.map((u) => (u.id === current.id ? { ...u, photoUrl } : u)),
        }));
      },

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setLanguage: (lang) => set({ language: lang }),

      createQuiz: (data) => {
        const teacher = get().getCurrentUser();
        const quiz: Quiz = {
          ...data,
          id: uid("quiz"),
          code: randomCode(),
          teacherId: teacher?.id ?? "",
          createdAt: Date.now(),
          status: "live",
          resultsPublished: false,
        };
        set((s) => ({ quizzes: [quiz, ...s.quizzes] }));
        return quiz;
      },

      updateQuiz: (id, patch) =>
        set((s) => ({
          quizzes: s.quizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        })),

      getQuizByCode: (code) =>
        get().quizzes.find((q) => q.code.toLowerCase() === code.toLowerCase()),

      getQuizById: (id) => get().quizzes.find((q) => q.id === id),

      getQuizzesForTeacher: (teacherId) =>
        get().quizzes.filter((q) => q.teacherId === teacherId),

      toggleQuizStatus: (id, status) =>
        set((s) => ({
          quizzes: s.quizzes.map((q) => (q.id === id ? { ...q, status } : q)),
        })),

      publishResults: (quizId) => {
        const quiz = get().getQuizById(quizId);
        if (!quiz) return;
        set((s) => ({
          quizzes: s.quizzes.map((q) =>
            q.id === quizId ? { ...q, resultsPublished: true } : q
          ),
        }));
        // Notify every student who submitted — and only them.
        const subs = get().getSubmissionsForQuiz(quizId);
        subs.forEach((sub) => {
          get().addNotification({
            type: "result_published",
            message: `Your result for "${quiz.title}" has been published.`,
            recipientId: sub.studentId,
            quizId,
          });
        });
      },

      extendExamEnd: (quizId, newEndAt) =>
        set((s) => ({
          quizzes: s.quizzes.map((q) =>
            q.id === quizId ? { ...q, examEndAt: newEndAt } : q
          ),
        })),

      hasAttempted: (quizId, studentId) =>
        get().submissions.some((s) => s.quizId === quizId && s.studentId === studentId),

      submitQuiz: (quizId, answers, tabSwitchCount) => {
        const student = get().getCurrentUser();
        const quiz = get().getQuizById(quizId);
        if (!student) return { ok: false, error: "You must be logged in as a student." };
        if (!quiz) return { ok: false, error: "Quiz not found." };

        if (!isExamWindowOpen(quiz)) {
          return { ok: false, error: "The exam window for this quiz is closed." };
        }

        // One attempt per student per quiz — checked server-side-equivalent
        // (in the store), not just hidden in the UI.
        if (get().hasAttempted(quizId, student.id)) {
          return { ok: false, error: "You have already attempted this quiz." };
        }

        let autoScore = 0;
        let totalPossible = 0;
        let hasManual = false;

        quiz.questions.forEach((q) => {
          totalPossible += q.marks;
          const ans = answers.find((a) => a.questionId === q.id);
          if (q.type === "mcq" || q.type === "true-false") {
            if (q.correctIndex === undefined) return; // no key set — skip, never falsely "wrong"
            if (ans && ans.selectedIndex === q.correctIndex) {
              autoScore += q.marks;
            } else if (quiz.negativeMarking && ans && ans.selectedIndex !== undefined) {
              autoScore -= q.marks * 0.25;
            }
          } else if (q.type === "fill-blank") {
            if (!q.correctText) return; // no key set — skip
            if (
              ans?.textAnswer &&
              ans.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase()
            ) {
              autoScore += q.marks;
            }
          } else if (q.type === "short") {
            hasManual = true;
          }
        });

        const submission: Submission = {
          id: uid("sub"),
          quizId,
          studentName: student.name,
          studentId: student.id,
          answers,
          submittedAt: Date.now(),
          tabSwitchCount,
          autoScore: Math.max(0, Math.round(autoScore * 100) / 100),
          manualScore: 0,
          manualGradesGiven: {},
          totalPossible,
          fullyGraded: !hasManual,
        };

        set((s) => ({ submissions: [submission, ...s.submissions] }));

        // Only the owning teacher gets the submission alert.
        get().addNotification({
          type: "submission",
          message: `${student.name} submitted "${quiz.title}"`,
          recipientId: quiz.teacherId,
          quizId,
        });

        return { ok: true, submission };
      },

      gradeShortAnswer: (submissionId, questionId, marks) =>
        set((s) => ({
          submissions: s.submissions.map((sub) => {
            if (sub.id !== submissionId) return sub;
            const grades = { ...sub.manualGradesGiven, [questionId]: marks };
            const quiz = get().getQuizById(sub.quizId);
            const shortQs = quiz?.questions.filter((q) => q.type === "short") ?? [];
            const fullyGraded = shortQs.every((q) => grades[q.id] !== undefined);
            const manualScore = Object.values(grades).reduce((a, b) => a + b, 0);
            return { ...sub, manualGradesGiven: grades, manualScore, fullyGraded };
          }),
        })),

      getSubmissionsForQuiz: (quizId) =>
        get().submissions.filter((s) => s.quizId === quizId),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uid("notif"), createdAt: Date.now(), read: false },
            ...s.notifications,
          ].slice(0, 100),
        })),

      getNotificationsFor: (userId) =>
        get().notifications.filter((n) => n.recipientId === userId),

      markNotificationsRead: (userId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.recipientId === userId ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: "quizzy-storage",
      version: 3,
      // v2 -> v3: accounts moved from `email` to `username` as the login
      // handle. Carry old accounts forward instead of dropping them.
      migrate: (persisted: any, version: number) => {
        if (version < 3 && persisted?.users) {
          persisted.users = persisted.users.map((u: any) =>
            u.username ? u : { ...u, username: (u.email || "").toLowerCase() }
          );
        }
        return persisted;
      },
    }
  )
);
