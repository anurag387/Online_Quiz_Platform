"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Info, Trophy, AlertOctagon } from "lucide-react";
import type { NotificationItem } from "@/lib/types";

const styles: Record<
  NotificationItem["type"],
  { bg: string; text: string; icon: React.ElementType }
> = {
  submission: { bg: "bg-pastel-pink", text: "text-pastel-pinkText", icon: CheckCircle2 },
  verification: { bg: "bg-pastel-green", text: "text-pastel-greenText", icon: ShieldCheck },
  info: { bg: "bg-pastel-blue", text: "text-pastel-blueText", icon: Info },
  result_published: { bg: "bg-pastel-green", text: "text-pastel-greenText", icon: Trophy },
  duplicate_attempt: { bg: "bg-pastel-pink", text: "text-pastel-pinkText", icon: AlertOctagon },
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCard({
  item,
  index,
}: {
  item: NotificationItem;
  index: number;
}) {
  const s = styles[item.type] ?? styles.info;
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`flex items-start gap-3 rounded-2xl ${s.bg} p-4 ${item.read ? "opacity-70" : ""}`}
    >
      <span className={`mt-0.5 ${s.text}`}>
        <Icon size={18} />
      </span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${s.text}`}>{item.message}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{timeAgo(item.createdAt)}</p>
      </div>
      {!item.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky" />}
    </motion.div>
  );
}
