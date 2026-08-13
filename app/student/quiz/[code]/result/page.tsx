"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function ResultPage() {
  const student = useRequireRole("student");
  const { code } = useParams<{ code: string }>();
  const quiz = useAppStore((s) => s.getQuizByCode(code));
  const submissions = useAppStore((s) => s.submissions);
  const t = useT();

  // Only ever match THIS student's own submission — never fall back to
  // someone else's, even if none is found.
  const mySubmission = useMemo(
    () =>
      submissions.find(
        (s) => s.quizId === quiz?.id && s.studentId === student?.id
      ),
    [submissions, quiz, student]
  );

  const score = (mySubmission?.autoScore ?? 0) + (mySubmission?.manualScore ?? 0);
  const total = mySubmission?.totalPossible ?? 0;
  const animatedScore = useCountUp(score);

  if (!quiz || !mySubmission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216]">
        <p className="text-white">{t("noResultYet")}</p>
      </div>
    );
  }

  if (!quiz.resultsPublished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lift">
          <Clock size={32} className="mx-auto mb-4 text-sky" />
          <h1 className="text-xl font-bold text-ink">{t("resultNotPublished")}</h1>
          <p className="mt-2 text-sm text-ink-soft">{t("resultNotPublishedDesc")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-lift"
      >
        <h1 className="text-center text-lg font-semibold text-ink">{quiz.title}</h1>
        <div className="my-6 text-center">
          <p className="text-5xl font-extrabold text-sky">
            {animatedScore}
            <span className="text-2xl text-ink-faint">/{total}</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">{t("yourScore")}</p>
        </div>

        {!mySubmission.fullyGraded && (
          <p className="mb-4 rounded-lg bg-pastel-blue px-3 py-2 text-center text-xs text-pastel-blueText">
            {t("stillGrading")}
          </p>
        )}

        <div className="space-y-2">
          {quiz.questions.map((q) => {
            const ans = mySubmission.answers.find((a) => a.questionId === q.id);
            let correct: boolean | null = null;
            if (q.type === "mcq" || q.type === "true-false") {
              correct = q.correctIndex !== undefined && ans?.selectedIndex === q.correctIndex;
            } else if (q.type === "fill-blank") {
              correct =
                !!ans?.textAnswer &&
                !!q.correctText &&
                ans.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
            }
            return (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3 text-sm"
              >
                <span className="text-ink">{q.text}</span>
                {correct === null ? (
                  <span className="text-xs font-medium text-ink-soft">{t("manuallyGraded")}</span>
                ) : correct ? (
                  <CheckCircle2 size={18} className="text-pastel-greenText" />
                ) : (
                  <XCircle size={18} className="text-pastel-pinkText" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
