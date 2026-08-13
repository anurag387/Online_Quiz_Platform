"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useRequireRole } from "@/lib/useRequireRole";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        checked ? "bg-sky" : "bg-ink/15 dark:bg-white/15"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  useRequireRole("teacher");
  const t = useT();
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [webcam, setWebcam] = useState(false);
  const [sound, setSound] = useState(true);

  const rows = [
    {
      label: t("darkMode"),
      desc: t("darkModeDesc"),
      state: darkMode,
      set: () => toggleDarkMode(),
    },
    {
      label: t("langToggleLabel"),
      desc: t("langToggleDesc"),
      state: language === "bn",
      set: (v: boolean) => setLanguage(v ? "bn" : "en"),
    },
    { label: t("timerSound"), desc: t("timerSoundDesc"), state: sound, set: setSound },
    {
      label: t("webcamProctor"),
      desc: t("webcamProctorDesc"),
      state: webcam,
      set: setWebcam,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("settingsTitle")} />
        <div className="card divide-y divide-ink/5 dark:divide-white/5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-ink">{r.label}</p>
                <p className="text-sm text-ink-soft">{r.desc}</p>
              </div>
              <Toggle checked={r.state} onChange={r.set} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
