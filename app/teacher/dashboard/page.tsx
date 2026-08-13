"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ListChecks, PenLine, FileEdit, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NotificationCard from "@/components/NotificationCard";
import QuizCard from "@/components/QuizCard";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useRequireRole } from "@/lib/useRequireRole";

export default function TeacherDashboard() {
  useRequireRole("teacher");
  const t = useT();
  const user = useAppStore((s) => s.getCurrentUser());
  const notifications = useAppStore((s) =>
    user ? s.getNotificationsFor(user.id) : []
  );
  const quizzes = useAppStore((s) =>
    user ? s.getQuizzesForTeacher(user.id) : []
  );
  const liveQuizzes = quizzes.filter((q) => q.status === "live");

  const testTypes = [
    {
      href: "/teacher/create-quiz?type=blank",
      label: t("blankTest"),
      icon: FileEdit,
      desc: t("blankTestDesc"),
    },
    {
      href: "/teacher/create-quiz?type=mcq",
      label: t("mcqTest"),
      icon: ListChecks,
      desc: t("mcqTestDesc"),
    },
    {
      href: "/teacher/create-quiz?type=fill",
      label: t("fillTest"),
      icon: PenLine,
      desc: t("fillTestDesc"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("teacherDashboard")} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-sky" />
              <h2 className="text-lg font-semibold text-ink">{t("makeNewTest")}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {testTypes.map(({ href, label, icon: Icon, desc }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link href={href} className="card flex h-full flex-col gap-3 p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{label}</p>
                      <p className="text-xs text-ink-soft">{desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-ink">{t("currentlyHappening")}</h2>
              {liveQuizzes.length === 0 ? (
                <div className="card p-8 text-center text-sm text-ink-soft">
                  {t("noLiveQuizzes")}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {liveQuizzes.map((q, i) => (
                    <QuizCard key={q.id} quiz={q} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-ink">{t("notifications")}</h2>
            <div className="flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="card p-6 text-center text-sm text-ink-soft">
                  {t("noNotifications")}
                </div>
              ) : (
                notifications.slice(0, 8).map((n, i) => (
                  <NotificationCard key={n.id} item={n} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
