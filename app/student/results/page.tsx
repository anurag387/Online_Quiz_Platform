"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Clock, ArrowUpRight, PlusCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function StudentResultsPage() {
  const student = useRequireRole("student");
  const t = useT();
  const submissions = useAppStore((s) =>
    student ? s.submissions.filter((sub) => sub.studentId === student.id) : []
  );
  const quizzes = useAppStore((s) => s.quizzes);
  const [query, setQuery] = useState("");

  const rows = submissions
    .map((sub) => ({ sub, quiz: quizzes.find((q) => q.id === sub.quizId) }))
    .filter((r) => !!r.quiz)
    .sort((a, b) => b.sub.submittedAt - a.sub.submittedAt);

  const filtered = rows.filter(({ quiz }) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      quiz!.title.toLowerCase().includes(needle) ||
      quiz!.subject.toLowerCase().includes(needle) ||
      quiz!.questions.some((q) => q.text.toLowerCase().includes(needle))
    );
  });

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar
          title={t("myResultsTitle")}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={t("searchResultsPlaceholder")}
        />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            {filtered.length} {t("testsCount")}
          </h2>
          <Link href="/student/join" className="btn-primary text-sm">
            <PlusCircle size={16} /> {t("joinNewExam")}
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">{t("noAttemptsYet")}</div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">{t("noMatchingResults")}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ sub, quiz }, i) => {
              const score = sub.autoScore + sub.manualScore;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card flex flex-col gap-4 p-5"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{quiz!.title}</h3>
                    <p className="text-sm text-ink-soft">{quiz!.subject}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} /> {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    {quiz!.resultsPublished ? (
                      <span className="flex items-center gap-1.5 font-semibold text-ink">
                        <Trophy size={15} className="text-sky" /> {score}/{sub.totalPossible}
                      </span>
                    ) : (
                      <span className="rounded-full bg-pastel-blue px-2.5 py-1 text-[11px] font-semibold text-pastel-blueText">
                        {t("awaitingPublish")}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/student/quiz/${quiz!.code}/result`}
                    className="btn-secondary mt-1 justify-center !py-2 text-sm"
                  >
                    {t("viewMyResult")} <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
