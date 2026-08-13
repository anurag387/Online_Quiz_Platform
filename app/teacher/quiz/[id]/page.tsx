"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  QrCode,
  FileEdit,
  CheckCircle2,
  Timer as TimerIcon,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore, examWindowStatus } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

function toLocalInputValue(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function QuizOverviewPage() {
  const teacher = useRequireRole("teacher");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizById(id));
  const submissions = useAppStore((s) => s.getSubmissionsForQuiz(id));
  const extendExamEnd = useAppStore((s) => s.extendExamEnd);
  const t = useT();

  const [newEnd, setNewEnd] = useState("");
  const [extendedFlash, setExtendedFlash] = useState(false);

  if (!quiz || (teacher && quiz.teacherId !== teacher.id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF6F6] dark:bg-[#0f171c]">
        <p className="text-ink-soft">{t("quizNotFound")}</p>
      </div>
    );
  }

  const status = examWindowStatus(quiz);
  const ranked = [...submissions]
    .sort((a, b) => b.autoScore + b.manualScore - (a.autoScore + a.manualScore))
    .slice(0, 5);

  const handleExtend = () => {
    if (!newEnd) return;
    extendExamEnd(quiz.id, new Date(newEnd).getTime());
    setExtendedFlash(true);
    setTimeout(() => setExtendedFlash(false), 1800);
    setNewEnd("");
  };

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("quizOverviewTitle")} />

        <button
          onClick={() => router.push("/teacher/tests")}
          className="mb-4 flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={15} /> {t("backToTests")}
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-ink">{quiz.title}</h1>
                  <p className="text-sm text-ink-soft">{quiz.subject}</p>
                </div>
                <span className="rounded-lg bg-sky/10 px-2 py-1 font-mono text-xs font-bold tracking-wide text-sky">
                  {quiz.code}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> {quiz.durationMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={15} /> {submissions.length} submitted
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> {quiz.questions.reduce((s, q) => s + q.marks, 0)}{" "}
                  {t("marksLabel").toLowerCase()}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/teacher/quiz/${quiz.id}/code`} className="btn-secondary text-sm">
                  <QrCode size={15} /> {t("quizCodeTitle")}
                </Link>
                <Link href={`/teacher/quiz/${quiz.id}/submissions`} className="btn-secondary text-sm">
                  <FileEdit size={15} /> {t("viewAnswerSheet")}
                </Link>
                <Link href={`/teacher/quiz/${quiz.id}/results`} className="btn-primary text-sm">
                  <Trophy size={15} /> {t("leaderboard")}
                </Link>
              </div>
            </motion.div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-ink">
                {t("questions")} <span className="text-ink-soft">({quiz.questions.length})</span>
              </h2>
              <div className="space-y-3">
                {quiz.questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky/10 text-xs font-bold text-sky">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-ink">{q.text}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                        {q.marks} {t("marksLabel").toLowerCase()}
                      </span>
                    </div>

                    <p className="ml-8 mt-1 text-[11px] uppercase tracking-wide text-ink-faint">
                      {q.type.replace("-", " ")}
                    </p>

                    {(q.type === "mcq" || q.type === "true-false") && q.options && (
                      <div className="ml-8 mt-2 flex flex-wrap gap-1.5">
                        {q.options.map((opt, oi) => (
                          <span
                            key={oi}
                            className={`rounded-lg px-2.5 py-1 text-xs ${
                              q.correctIndex === oi
                                ? "bg-pastel-green text-pastel-greenText font-semibold"
                                : "bg-ink/5 text-ink-soft"
                            }`}
                          >
                            {opt || `Option ${oi + 1}`}
                          </span>
                        ))}
                      </div>
                    )}

                    {q.type === "fill-blank" && (
                      <p className="ml-8 mt-2 text-xs text-ink-soft">
                        {t("answerKeyLabel")}:{" "}
                        <span className="font-semibold text-pastel-greenText">{q.correctText}</span>
                      </p>
                    )}

                    {q.type === "short" && (
                      <p className="ml-8 mt-2 text-xs text-ink-soft">{t("manuallyMarked")}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-4 p-6">
              <div className="flex items-center gap-2">
                <TimerIcon size={17} className="text-sky" />
                <h2 className="text-sm font-semibold text-ink">{t("examWindowLabel")}</h2>
              </div>

              {!quiz.examStartAt && !quiz.examEndAt ? (
                <p className="text-sm text-ink-soft">{t("noExamWindow")}</p>
              ) : (
                <div className="space-y-1.5 text-sm">
                  {quiz.examStartAt && (
                    <p className="text-ink-soft">
                      {t("opensAtLabel")}:{" "}
                      <span className="font-medium text-ink">
                        {new Date(quiz.examStartAt).toLocaleString()}
                      </span>
                    </p>
                  )}
                  {quiz.examEndAt && (
                    <p className="text-ink-soft">
                      {t("closesAtLabel")}:{" "}
                      <span className="font-medium text-ink">
                        {new Date(quiz.examEndAt).toLocaleString()}
                      </span>
                    </p>
                  )}
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      status === "open"
                        ? "bg-pastel-green text-pastel-greenText"
                        : status === "not-started"
                        ? "bg-pastel-blue text-pastel-blueText"
                        : "bg-pastel-pink text-pastel-pinkText"
                    }`}
                  >
                    {status === "open"
                      ? t("examOpenBadge")
                      : status === "not-started"
                      ? t("examNotStartedYet")
                      : t("examWindowEndedMsg")}
                  </span>
                </div>
              )}

              <div className="space-y-2 border-t border-ink/5 pt-4">
                <p className="text-xs font-medium text-ink">{t("extendTime")}</p>
                <p className="text-xs text-ink-soft">{t("extendTimeDesc")}</p>
                <input
                  type="datetime-local"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  min={quiz.examEndAt ? toLocalInputValue(quiz.examEndAt) : undefined}
                  className="input-field text-sm"
                />
                <button
                  onClick={handleExtend}
                  disabled={!newEnd}
                  className="btn-primary w-full text-sm"
                >
                  {extendedFlash ? t("extended") : t("extendAction")}
                </button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-ink/5 p-5">
                <Trophy size={17} className="text-sky" />
                <h2 className="text-sm font-semibold text-ink">{t("leaderboard")}</h2>
              </div>
              {ranked.length === 0 ? (
                <p className="p-6 text-center text-sm text-ink-soft">{t("noSubmissionsToRank")}</p>
              ) : (
                <div className="divide-y divide-ink/5">
                  {ranked.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="flex items-center gap-2 text-ink">
                        <span className="font-semibold">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                        {s.studentName}
                      </span>
                      <span className="font-semibold text-ink">
                        {s.autoScore + s.manualScore}/{s.totalPossible}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href={`/teacher/quiz/${quiz.id}/results`}
                className="block border-t border-ink/5 p-4 text-center text-xs font-semibold text-sky"
              >
                {t("goToResults")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
