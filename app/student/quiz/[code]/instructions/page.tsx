"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ListChecks, Award, Maximize, AlertTriangle, Timer as TimerIcon } from "lucide-react";
import { useAppStore, examWindowStatus } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function InstructionsPage() {
  const student = useRequireRole("student");
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizByCode(code));
  const hasAttempted = useAppStore((s) => s.hasAttempted);
  const t = useT();

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216]">
        <p className="text-white">{t("quizNotFound")}</p>
      </div>
    );
  }

  const alreadyDone = student ? hasAttempted(quiz.id, student.id) : false;
  const totalMarks = quiz.questions.reduce((s, q) => s + q.marks, 0);
  const winStatus = examWindowStatus(quiz);
  const windowBlocked = !alreadyDone && winStatus !== "open";

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-lift"
      >
        <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>
        <p className="mb-6 text-sm text-ink-soft">{quiz.subject}</p>

        {alreadyDone ? (
          <div className="mb-6 rounded-xl bg-pastel-pink p-4 text-sm text-pastel-pinkText">
            {t("alreadyAttempted")}
          </div>
        ) : windowBlocked ? (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-pastel-pink p-4 text-sm text-pastel-pinkText">
            <TimerIcon size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {winStatus === "not-started" ? t("examNotStartedYet") : t("examWindowEndedMsg")}
              </p>
              {quiz.examStartAt && winStatus === "not-started" && (
                <p className="mt-1 text-xs">
                  {t("opensAtLabel")}: {new Date(quiz.examStartAt).toLocaleString()}
                </p>
              )}
              {quiz.examEndAt && winStatus === "ended" && (
                <p className="mt-1 text-xs">
                  {t("closesAtLabel")}: {new Date(quiz.examEndAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-pastel-blue p-4 text-center">
                <Clock size={18} className="mx-auto mb-1 text-pastel-blueText" />
                <p className="text-lg font-bold text-pastel-blueText">{quiz.durationMinutes}m</p>
                <p className="text-xs text-pastel-blueText">{t("durationLabel")}</p>
              </div>
              <div className="rounded-xl bg-pastel-green p-4 text-center">
                <ListChecks size={18} className="mx-auto mb-1 text-pastel-greenText" />
                <p className="text-lg font-bold text-pastel-greenText">{quiz.questions.length}</p>
                <p className="text-xs text-pastel-greenText">{t("questionsLabel")}</p>
              </div>
              <div className="rounded-xl bg-pastel-pink p-4 text-center">
                <Award size={18} className="mx-auto mb-1 text-pastel-pinkText" />
                <p className="text-lg font-bold text-pastel-pinkText">{totalMarks}</p>
                <p className="text-xs text-pastel-pinkText">{t("marksLabel")}</p>
              </div>
            </div>

            {quiz.examEndAt && (
              <p className="mb-4 flex items-center gap-1.5 text-xs text-ink-soft">
                <TimerIcon size={13} /> {t("closesAtLabel")}: {new Date(quiz.examEndAt).toLocaleString()}
              </p>
            )}

            <div className="mb-6 rounded-xl bg-ink/5 p-4">
              <p className="mb-1 text-sm font-semibold text-ink">{t("instructions")}</p>
              <p className="text-sm text-ink-soft">{quiz.instructions}</p>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">{t("fullscreenWarning")}</p>
            </div>

            <button
              onClick={() => router.push(`/student/quiz/${quiz.code}/take`)}
              className="btn-primary w-full"
            >
              <Maximize size={16} /> {t("startQuizFullscreen")}
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}
