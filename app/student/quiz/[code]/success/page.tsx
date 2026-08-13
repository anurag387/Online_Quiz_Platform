"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, BellRing } from "lucide-react";
import confetti from "canvas-confetti";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function SuccessPage() {
  useRequireRole("student");
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizByCode(code));
  const t = useT();

  useEffect(() => {
    const duration = 1200;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#3EC1E0", "#0E7C86", "#D9F2E6"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#3EC1E0", "#0E7C86", "#D9F2E6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lift"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pastel-green"
        >
          <CheckCircle2 size={40} className="text-pastel-greenText" />
        </motion.div>
        <h1 className="text-2xl font-bold text-ink">{t("submittedSuccess")}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your answers for &ldquo;{quiz?.title ?? "the quiz"}&rdquo; {t("answersRecorded")}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {quiz?.resultsPublished ? (
            <button
              onClick={() => router.push(`/student/quiz/${code}/result`)}
              className="btn-primary w-full"
            >
              {t("viewMyResult")}
            </button>
          ) : (
            <div className="flex items-start gap-2 rounded-xl bg-pastel-blue p-4 text-left text-xs text-pastel-blueText">
              <BellRing size={16} className="mt-0.5 shrink-0" />
              <span>{t("resultNotPublishedDesc")}</span>
            </div>
          )}
          <button onClick={() => router.push("/student/join")} className="btn-secondary w-full">
            {t("joinAnotherQuiz")}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
