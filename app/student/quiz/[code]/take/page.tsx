"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Send } from "lucide-react";
import { useAppStore, examWindowStatus } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useAntiCheat } from "@/lib/useAntiCheat";
import { useT } from "@/lib/i18n";
import Timer from "@/components/Timer";
import type { AnswerRecord } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TakeQuizPage() {
  const student = useRequireRole("student");
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizByCode(code));
  const submitQuiz = useAppStore((s) => s.submitQuiz);
  const hasAttempted = useAppStore((s) => s.hasAttempted);
  const t = useT();

  const questions = useMemo(() => {
    if (!quiz) return [];
    return quiz.randomizeOrder ? shuffle(quiz.questions) : quiz.questions;
  }, [quiz]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [submitting, setSubmitting] = useState(false);
  const [blockedMsg, setBlockedMsg] = useState("");

  const { tabSwitchCount, isBlurred, showWarning, dismissWarning, enterFullscreen } =
    useAntiCheat({ enabled: true });

  useEffect(() => {
    if (quiz && student && hasAttempted(quiz.id, student.id)) {
      router.replace(`/student/quiz/${quiz.code}/instructions`);
      return;
    }
    if (quiz && examWindowStatus(quiz) !== "open") {
      router.replace(`/student/quiz/${quiz.code}/instructions`);
      return;
    }
    enterFullscreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, student]);

  const handleSubmit = () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    const answerList = Object.values(answers);
    const result = submitQuiz(quiz.id, answerList, tabSwitchCount);
    if (!result.ok) {
      setBlockedMsg(result.error);
      setSubmitting(false);
      return;
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    router.push(`/student/quiz/${quiz.code}/success`);
  };

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216]">
        <p className="text-white">{t("quizNotFound")}</p>
      </div>
    );
  }

  if (blockedMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lift">
          <p className="text-ink">{blockedMsg}</p>
          <button onClick={() => router.push("/student/join")} className="btn-primary mt-5 w-full">
            {t("joinAnotherQuiz")}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const answeredCount = Object.keys(answers).length;

  const setAnswer = (patch: Partial<AnswerRecord>) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { questionId: q.id, ...prev[q.id], ...patch },
    }));
  };

  return (
    <div className="min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c] no-select">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-red-600 px-6 py-3 text-white shadow-lg animate-shake"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle size={16} /> Tab switch / focus loss detected — this has been logged
              and flagged to your teacher.
            </span>
            <button onClick={dismissWarning} className="text-xs underline">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isBlurred ? "blur-protect" : ""}>
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 py-4 shadow-card backdrop-blur sm:px-8">
          <div>
            <h1 className="font-semibold text-ink">{quiz.title}</h1>
            <p className="text-xs text-ink-soft">
              {t("question")} {current + 1} {t("of")} {questions.length} · {answeredCount}{" "}
              {t("answered")}
            </p>
          </div>
          <Timer totalSeconds={quiz.durationMinutes * 60} onExpire={handleSubmit} />
        </header>

        <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_220px]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="card relative overflow-hidden p-6"
              >
                <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-4xl font-bold text-ink/[0.04]">
                  {student?.name || "Student"}
                </span>

                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky">
                  {q.marks} mark{q.marks === 1 ? "" : "s"} · {q.type.replace("-", " ")}
                </p>
                <h2 className="mb-5 text-lg font-semibold text-ink">{q.text}</h2>

                {(q.type === "mcq" || q.type === "true-false") && (
                  <div className="space-y-2.5">
                    {q.options?.map((opt, oi) => {
                      const selected = answers[q.id]?.selectedIndex === oi;
                      return (
                        <motion.button
                          key={oi}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setAnswer({ selectedIndex: oi })}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                            selected
                              ? "border-sky bg-sky/10 text-ink"
                              : "border-ink/10 text-ink hover:bg-ink/5"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                              selected ? "border-sky bg-sky text-white" : "border-ink/20"
                            }`}
                          >
                            {selected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                ✓
                              </motion.span>
                            )}
                          </span>
                          {opt || `Option ${oi + 1}`}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {(q.type === "short" || q.type === "fill-blank") && (
                  <textarea
                    value={answers[q.id]?.textAnswer || ""}
                    onChange={(e) => setAnswer({ textAnswer: e.target.value })}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    placeholder={q.type === "fill-blank" ? t("yourAnswer") : t("writeAnswer")}
                    rows={q.type === "fill-blank" ? 1 : 5}
                    className="input-field resize-none"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="btn-secondary text-sm disabled:opacity-40"
              >
                {t("previous")}
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  className="btn-primary text-sm"
                >
                  {t("next")}
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm">
                  <Send size={15} /> {t("submitQuiz")}
                </button>
              )}
            </div>
          </div>

          <aside className="card h-fit p-4">
            <p className="mb-3 text-sm font-semibold text-ink">{t("questions")}</p>
            <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
              {questions.map((qq, i) => {
                const answered = !!answers[qq.id];
                return (
                  <button
                    key={qq.id}
                    onClick={() => setCurrent(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      i === current
                        ? "bg-sky text-white"
                        : answered
                        ? "bg-pastel-green text-pastel-greenText"
                        : "bg-ink/5 text-ink-soft"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
              <p className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-pastel-green" /> {t("answered")}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/10" /> Unanswered
              </p>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary mt-4 w-full text-sm">
              {t("submitQuiz")}
            </button>
          </aside>
        </main>
      </div>
    </div>
  );
}
