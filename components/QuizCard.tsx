"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, ArrowUpRight } from "lucide-react";
import type { Quiz } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

const statusStyles: Record<Quiz["status"], string> = {
  live: "bg-pastel-green text-pastel-greenText",
  draft: "bg-pastel-blue text-pastel-blueText",
  ended: "bg-ink/5 text-ink-soft",
};

export default function QuizCard({ quiz, index = 0 }: { quiz: Quiz; index?: number }) {
  const submissions = useAppStore((s) => s.getSubmissionsForQuiz(quiz.id));
  const t = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
      className="card flex flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[quiz.status]}`}>
              {quiz.status.toUpperCase()}
            </span>
            {quiz.resultsPublished && (
              <span className="rounded-full bg-pastel-blue px-2.5 py-1 text-[11px] font-semibold text-pastel-blueText">
                {t("resultsPublished").toUpperCase()}
              </span>
            )}
          </div>
          <Link href={`/teacher/quiz/${quiz.id}`}>
            <h3 className="mt-2 text-lg font-semibold text-ink hover:text-sky">{quiz.title}</h3>
          </Link>
          <p className="text-sm text-ink-soft">{quiz.subject}</p>
        </div>
        <span className="rounded-lg bg-sky/10 px-2 py-1 font-mono text-xs font-bold tracking-wide text-sky">
          {quiz.code}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-ink-soft">
        <span className="flex items-center gap-1.5">
          <Clock size={15} /> {quiz.durationMinutes} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={15} /> {submissions.length} submitted
        </span>
      </div>

      <div className="mt-1 flex gap-2">
        <Link href={`/teacher/quiz/${quiz.id}`} className="btn-secondary flex-1 !py-2 text-sm">
          Details
        </Link>
        <Link
          href={`/teacher/quiz/${quiz.id}/submissions`}
          className="btn-primary flex-1 !py-2 text-sm"
        >
          Submissions <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
