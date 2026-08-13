"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Avatar from "@/components/Avatar";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useRequireRole } from "@/lib/useRequireRole";
import { fileToAvatarDataUrl } from "@/lib/image";

export default function StudentProfilePage() {
  useRequireRole("student");
  const t = useT();
  const user = useAppStore((s) => s.getCurrentUser());
  const updateProfilePhoto = useAppStore((s) => s.updateProfilePhoto);
  const submissions = useAppStore((s) =>
    user ? s.submissions.filter((sub) => sub.studentId === user.id) : []
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToAvatarDataUrl(file);
    updateProfilePhoto(dataUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
    e.target.value = "";
  };

  const pctScores = submissions
    .filter((s) => s.totalPossible > 0)
    .map((s) => ((s.autoScore + s.manualScore) / s.totalPossible) * 100);
  const avgPct =
    pctScores.length > 0 ? Math.round(pctScores.reduce((a, b) => a + b, 0) / pctScores.length) : null;

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("studentProfileTitle")} />

        <div className="card flex items-center gap-5 p-6">
          <div className="relative">
            <Avatar name={user?.name} photoUrl={user?.photoUrl} size={72} className="text-2xl" />
            <button
              onClick={() => fileInput.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky text-white shadow-card"
              aria-label={t("changePhoto")}
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">{user?.name || "Student"}</h2>
            {user?.username && <p className="text-xs text-ink-faint">@{user.username}</p>}
            <button
              onClick={() => fileInput.current?.click()}
              className="mt-1.5 text-xs font-semibold text-sky"
            >
              {user?.photoUrl ? t("changePhoto") : t("addPhoto")}
            </button>
            {saved && <span className="ml-2 text-xs text-pastel-greenText">{t("photoUpdated")}</span>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <p className="text-3xl font-bold text-ink">{submissions.length}</p>
            <p className="text-sm text-ink-soft">{t("quizzesTaken")}</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl font-bold text-ink">{avgPct !== null ? `${avgPct}%` : "—"}</p>
            <p className="text-sm text-ink-soft">{t("averageScorePct")}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
