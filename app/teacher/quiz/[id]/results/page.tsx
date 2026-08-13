"use client";

import { useParams } from "next/navigation";
import { Download, Trophy, Send, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function ResultsPage() {
  const teacher = useRequireRole("teacher");
  const { id } = useParams<{ id: string }>();
  const quiz = useAppStore((s) => s.getQuizById(id));
  const submissions = useAppStore((s) => s.getSubmissionsForQuiz(id));
  const publishResults = useAppStore((s) => s.publishResults);
  const t = useT();

  if (!quiz || (teacher && quiz.teacherId !== teacher.id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF6F6] dark:bg-[#0f171c]">
        <p className="text-ink-soft">{t("quizNotFound")}</p>
      </div>
    );
  }

  const ranked = [...submissions].sort(
    (a, b) => b.autoScore + b.manualScore - (a.autoScore + a.manualScore)
  );
  const ungraded = submissions.filter((s) => !s.fullyGraded).length;

  const exportCsv = () => {
    const rows = [
      ["Student", "Score", "Total", "Tab switches", "Submitted at"],
      ...ranked.map((s) => [
        s.studentName,
        String(s.autoScore + s.manualScore),
        String(s.totalPossible),
        String(s.tabSwitchCount),
        new Date(s.submittedAt).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, "_")}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={`${t("resultsTitle")} — ${quiz.title}`} />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-xl bg-white px-4 py-3 shadow-card">
            {quiz.resultsPublished ? (
              <span className="flex items-center gap-2 text-sm font-medium text-pastel-greenText">
                <CheckCircle2 size={16} /> {t("resultsPublished")}
              </span>
            ) : (
              <div>
                <p className="text-sm font-medium text-ink">{t("publishResultsDesc")}</p>
                {ungraded > 0 && (
                  <p className="mt-1 text-xs text-pastel-pinkText">
                    {ungraded} submission{ungraded === 1 ? "" : "s"} still have ungraded short
                    answers.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!quiz.resultsPublished && (
              <button
                onClick={() => publishResults(quiz.id)}
                disabled={submissions.length === 0}
                className="btn-primary text-sm"
              >
                <Send size={15} /> {t("publishResults")}
              </button>
            )}
            <button onClick={exportCsv} className="btn-secondary text-sm">
              <Download size={15} /> {t("exportCsv")}
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink/5 p-5">
            <Trophy size={18} className="text-sky" />
            <h2 className="text-lg font-semibold text-ink">{t("leaderboard")}</h2>
          </div>
          {ranked.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-soft">{t("noSubmissionsToRank")}</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-ink-soft">
                  <th className="px-5 py-3 font-medium">{t("rank")}</th>
                  <th className="px-5 py-3 font-medium">{t("studentLabel")}</th>
                  <th className="px-5 py-3 font-medium">{t("score")}</th>
                  <th className="px-5 py-3 font-medium">{t("tabSwitches")}</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((s, i) => (
                  <tr key={s.id} className="border-t border-ink/5">
                    <td className="px-5 py-3 font-semibold text-ink">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </td>
                    <td className="px-5 py-3 text-ink">{s.studentName}</td>
                    <td className="px-5 py-3 font-semibold text-ink">
                      {s.autoScore + s.manualScore}/{s.totalPossible}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{s.tabSwitchCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
