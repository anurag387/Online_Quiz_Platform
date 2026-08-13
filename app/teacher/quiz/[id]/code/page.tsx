"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, QrCode, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function QuizCodePage() {
  const teacher = useRequireRole("teacher");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizById(id));
  const [copied, setCopied] = useState(false);
  const t = useT();

  if (!quiz || (teacher && quiz.teacherId !== teacher.id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF6F6] dark:bg-[#0f171c]">
        <p className="text-ink-soft">{t("quizNotFound")}</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(quiz.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    quiz.code
  )}`;

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("quizCodeTitle")} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg card p-8 text-center"
        >
          <p className="text-sm text-ink-soft">
            &ldquo;{quiz.title}&rdquo; {t("quizReadyShare")}
          </p>

          <div className="my-6 flex justify-center gap-2">
            {quiz.code.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 300 }}
                className={`flex h-14 w-10 items-center justify-center rounded-xl text-2xl font-extrabold ${
                  ch === "-" ? "text-ink-faint" : "bg-sky/10 text-sky"
                }`}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={handleCopy} className="btn-primary">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t("copied") : t("copyCode")}
            </button>
            <div className="flex flex-col items-center gap-1">
              <img
                src={qrUrl}
                alt="QR code for quiz"
                className="h-24 w-24 rounded-xl border border-ink/10"
              />
              <span className="flex items-center gap-1 text-xs text-ink-soft">
                <QrCode size={12} /> {t("scanToJoin")}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-ink/5 p-4 text-left text-sm">
            <div>
              <p className="text-ink-soft">{t("durationLabel")}</p>
              <p className="font-semibold text-ink">{quiz.durationMinutes} min</p>
            </div>
            <div>
              <p className="text-ink-soft">{t("questionsLabel")}</p>
              <p className="font-semibold text-ink">{quiz.questions.length}</p>
            </div>
            <div>
              <p className="text-ink-soft">{t("totalMarks")}</p>
              <p className="font-semibold text-ink">
                {quiz.questions.reduce((s, q) => s + q.marks, 0)}
              </p>
            </div>
          </div>

          {quiz.whitelist.length > 0 && (
            <p className="mt-4 rounded-lg bg-pastel-blue px-3 py-2 text-xs text-pastel-blueText">
              {t("restrictedTo")} {quiz.whitelist.length} {t("whitelistedStudents")}
            </p>
          )}

          <button
            onClick={() => router.push(`/teacher/quiz/${quiz.id}/submissions`)}
            className="btn-secondary mt-6 w-full"
          >
            {t("goToSubmissions")} <ArrowRight size={15} />
          </button>
        </motion.div>
      </main>
    </div>
  );
}
