"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import NotificationCard from "@/components/NotificationCard";
import Avatar from "@/components/Avatar";

export default function Topbar({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: {
  title: string;
  /** Pass these two together to make the search box actually filter something on the page. */
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
}) {
  const t = useT();
  const user = useAppStore((s) => s.getCurrentUser());
  const notifications = useAppStore((s) =>
    user ? s.getNotificationsFor(user.id) : []
  );
  const markNotificationsRead = useAppStore((s) => s.markNotificationsRead);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const name = user?.name ?? "";
  const searchable = onSearchChange !== undefined;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-ink-soft">{title}</p>
        <h1 className="text-2xl font-bold text-ink">
          {t("welcomeBack")}
          {name ? `, ${name.split(" ")[0]}` : ""} 👋
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2.5 shadow-card sm:flex">
          <Search size={16} className="text-ink-faint" />
          <input
            value={searchable ? searchValue ?? "" : undefined}
            onChange={searchable ? (e) => onSearchChange?.(e.target.value) : undefined}
            readOnly={!searchable}
            placeholder={searchPlaceholder ?? t("searchPlaceholder")}
            className="w-40 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none sm:w-56"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setOpen((o) => !o);
              if (!open && user) markNotificationsRead(user.id);
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-card"
          >
            <Bell size={18} className="text-ink-soft" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pastel-pinkText" />
            )}
          </button>
          {open && (
            <div className="absolute right-0 z-20 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl bg-white p-3 shadow-lift dark:bg-[#17222A]">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-ink-soft">{t("noNotifications")}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {notifications.slice(0, 15).map((n, i) => (
                    <NotificationCard key={n.id} item={n} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Avatar name={name} photoUrl={user?.photoUrl} size={44} />
      </div>
    </div>
  );
}
