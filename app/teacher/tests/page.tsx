"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import QuizCard from "@/components/QuizCard";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useRequireRole } from "@/lib/useRequireRole";
import { Plus } from "lucide-react";

export default function TestsPage() {
  useRequireRole("teacher");
  const t = useT();
  const user = useAppStore((s) => s.getCurrentUser());
  const quizzes = useAppStore((s) => (user ? s.getQuizzesForTeacher(user.id) : []));
  const [query, setQuery] = useState("");

  const filtered = quizzes.filter((q) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      q.title.toLowerCase().includes(needle) ||
      q.subject.toLowerCase().includes(needle) ||
      q.code.toLowerCase().includes(needle) ||
      q.questions.some((qq) => qq.text.toLowerCase().includes(needle))
    );
  });

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar
          title={t("allTests")}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={t("searchTestsPlaceholder")}
        />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            {filtered.length} {t("testsCount")}
          </h2>
          <Link href="/teacher/create-quiz" className="btn-primary text-sm">
            <Plus size={16} /> {t("newTest")}
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">
            {t("noTestsYet")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">
            {t("noMatchingResults")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((q, i) => (
              <QuizCard key={q.id} quiz={q} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
