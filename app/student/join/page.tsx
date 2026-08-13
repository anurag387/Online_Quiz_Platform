"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore, examWindowStatus } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { useT } from "@/lib/i18n";

export default function JoinQuizPage() {
  const student = useRequireRole("student");
  const router = useRouter();
  const getQuizByCode = useAppStore((s) => s.getQuizByCode);
  const hasAttempted = useAppStore((s) => s.hasAttempted);
  const t = useT();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  const handleJoin = () => {
    if (!code.trim() || !student) return;
    setStatus("verifying");
    setTimeout(() => {
      const quiz = getQuizByCode(code.trim());
      if (!quiz) {
        setErrorMsg(t("codeNotFound"));
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 450);
        return;
      }
      if (hasAttempted(quiz.id, student.id)) {
        setErrorMsg(t("alreadyAttempted"));
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 450);
        return;
      }
      const winStatus = examWindowStatus(quiz);
      if (winStatus === "not-started") {
        setErrorMsg(t("examNotStartedYet"));
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 450);
        return;
      }
      if (winStatus === "ended") {
        setErrorMsg(t("examWindowEndedMsg"));
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 450);
        return;
      }
      router.push(`/student/quiz/${quiz.code}/instructions`);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("navJoinExam")} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lift dark:bg-[#17222A]"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky/10 text-sky">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-xl font-bold text-ink">{t("enterQuizCode")}</h1>
          <p className="mb-6 text-sm text-ink-soft">
            Hi {student?.name.split(" ")[0] || "there"}, {t("askTeacherCode")}
          </p>

          <motion.input
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="QZ-XXXXXX"
            className={`mb-2 w-full rounded-2xl border-2 bg-ink/5 px-4 py-5 text-center font-mono text-2xl font-bold tracking-[0.2em] text-ink placeholder:text-ink-faint focus:outline-none ${
              status === "error" ? "border-pastel-pinkText" : "border-transparent focus:border-sky"
            }`}
          />
          {status === "error" && (
            <p className="mb-4 text-sm font-medium text-pastel-pinkText">{errorMsg}</p>
          )}

          <button
            onClick={handleJoin}
            disabled={!code.trim() || status === "verifying"}
            className="btn-primary mt-4 w-full"
          >
            {status === "verifying" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {t("verifying")}
              </>
            ) : (
              t("joinQuiz")
            )}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
