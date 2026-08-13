"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertTriangle, ChevronDown, ArrowRight, XCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function SubmissionsPage() {
  const teacher = useRequireRole("teacher");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const quiz = useAppStore((s) => s.getQuizById(id));
  const submissions = useAppStore((s) => s.getSubmissionsForQuiz(id));
  const users = useAppStore((s) => s.users);
  const gradeShortAnswer = useAppStore((s) => s.gradeShortAnswer);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const t = useT();

  if (!quiz || (teacher && quiz.teacherId !== teacher.id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF6F6] dark:bg-[#0f171c]">
        <p className="text-ink-soft">{t("quizNotFound")}</p>
      </div>
    );
  }

  const usernameFor = (studentId: string) =>
    users.find((u) => u.id === studentId)?.username ?? "";

  const filtered = submissions.filter((sub) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      sub.studentName.toLowerCase().includes(needle) ||
      usernameFor(sub.studentId).toLowerCase().includes(needle)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar
          title={`${t("submissionsTitle")} — ${quiz.title}`}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={t("searchStudentsPlaceholder")}
        />

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-ink-soft">
            {filtered.length} / {submissions.length} {t("studentsSubmitted")}
          </p>
          <button
            onClick={() => router.push(`/teacher/quiz/${quiz.id}/results`)}
            className="btn-primary text-sm"
          >
            {t("goToResults")} <ArrowRight size={15} />
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">
            {t("noSubmissionsYet")} {quiz.code}.
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-soft">{t("noMatchingResults")}</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 font-bold text-sky">
                      {sub.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{sub.studentName}</p>
                      <p className="text-xs text-ink-soft">
                        {usernameFor(sub.studentId) && `@${usernameFor(sub.studentId)} · `}
                        {t("submitted")} {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {sub.tabSwitchCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-pastel-pink px-2.5 py-1 text-xs font-medium text-pastel-pinkText">
                        <AlertTriangle size={12} /> {sub.tabSwitchCount} {t("tabSwitch")}
                        {sub.tabSwitchCount === 1 ? "" : "es"}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                      {sub.fullyGraded ? (
                        <CheckCircle2 size={16} className="text-pastel-greenText" />
                      ) : (
                        <Circle size={16} className="text-ink-faint" />
                      )}
                      {sub.autoScore + sub.manualScore}/{sub.totalPossible}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-ink-soft transition-transform ${
                        expanded === sub.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {expanded === sub.id && (
                  <div className="space-y-3 border-t border-ink/5 p-5">
                    <p className="text-sm font-semibold text-ink">{t("fullAnswerSheetTitle")}</p>
                    {quiz.questions.map((q, qi) => {
                      const ans = sub.answers.find((a) => a.questionId === q.id);
                      let correct: boolean | null = null;
                      if (q.type === "mcq" || q.type === "true-false") {
                        correct = q.correctIndex !== undefined && ans?.selectedIndex === q.correctIndex;
                      } else if (q.type === "fill-blank") {
                        correct =
                          !!ans?.textAnswer &&
                          !!q.correctText &&
                          ans.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
                      }
                      const given = sub.manualGradesGiven[q.id];

                      return (
                        <div key={q.id} className="rounded-xl bg-ink/5 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-ink">
                              {qi + 1}. {q.text}
                            </p>
                            {correct === true && (
                              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-pastel-greenText">
                                <CheckCircle2 size={14} /> {t("correctBadge")}
                              </span>
                            )}
                            {correct === false && (
                              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-pastel-pinkText">
                                <XCircle size={14} /> {t("incorrectBadge")}
                              </span>
                            )}
                          </div>

                          {(q.type === "mcq" || q.type === "true-false") && (
                            <p className="mt-1.5 text-sm text-ink-soft">
                              {t("answerLabel")}:{" "}
                              <span className="font-medium text-ink">
                                {ans?.selectedIndex !== undefined && q.options
                                  ? q.options[ans.selectedIndex]
                                  : <em>{t("noAnswer")}</em>}
                              </span>
                            </p>
                          )}

                          {(q.type === "short" || q.type === "fill-blank") && (
                            <p className="mt-1.5 text-sm text-ink-soft">
                              {t("answerLabel")}:{" "}
                              <span className="font-medium text-ink">
                                {ans?.textAnswer || <em>{t("noAnswer")}</em>}
                              </span>
                            </p>
                          )}

                          {q.type === "short" && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-ink-soft">
                                {t("marksOutOf")} {q.marks})
                              </span>
                              <input
                                type="number"
                                min={0}
                                max={q.marks}
                                defaultValue={given ?? ""}
                                onBlur={(e) =>
                                  gradeShortAnswer(
                                    sub.id,
                                    q.id,
                                    Math.min(q.marks, Math.max(0, Number(e.target.value) || 0))
                                  )
                                }
                                className="w-20 rounded-lg border border-ink/10 px-2 py-1 text-sm dark:bg-[#101A20] dark:text-white dark:border-white/10"
                              />
                              {given === undefined && (
                                <span className="text-xs text-pastel-pinkText">{t("ungradedBadge")}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
