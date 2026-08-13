"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, User, Settings, LogOut, ListChecks } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const role = useAppStore((s) => s.getCurrentUser()?.role);
  const t = useT();

  const teacherItems = [
    { href: "/teacher/dashboard", label: t("navHome"), icon: Home },
    { href: "/teacher/tests", label: t("navTests"), icon: FileText },
    { href: "/teacher/profile", label: t("navProfile"), icon: User },
    { href: "/teacher/settings", label: t("navSettings"), icon: Settings },
  ];

  const studentItems = [
    { href: "/student/join", label: t("navJoinExam"), icon: Home },
    { href: "/student/results", label: t("navMyResults"), icon: ListChecks },
    { href: "/student/profile", label: t("navProfile"), icon: User },
  ];

  const items = role === "student" ? studentItems : teacherItems;

  return (
    <aside className="sticky top-0 hidden h-screen w-20 flex-col items-center gap-8 bg-teal dark:bg-[#0b1216] py-8 md:flex lg:w-24">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl font-extrabold text-white">
        Q
      </div>
      <nav className="flex flex-1 flex-col items-center gap-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center gap-1 px-2 py-3"
            >
              {active && (
                <span className="absolute -left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-sky transition-all" />
              )}
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                  active ? "bg-white text-sky" : "text-white/50 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-white" : "text-white/50"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="flex flex-col items-center gap-1 px-2 py-3 text-white/50 hover:text-white/80"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10">
          <LogOut size={20} strokeWidth={2.2} />
        </span>
        <span className="text-[10px] font-medium">{t("navExit")}</span>
      </button>
    </aside>
  );
}
