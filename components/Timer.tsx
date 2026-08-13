"use client";

import { useEffect, useRef, useState } from "react";

export default function Timer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isCritical = remaining <= 300; // last 5 minutes
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 26;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-2 ${
        isCritical ? "animate-pulse-red bg-red-50" : "bg-white"
      } shadow-card`}
    >
      <svg width="56" height="56" viewBox="0 0 60 60" className="-rotate-90">
        <circle cx="30" cy="30" r="26" fill="none" stroke="#EEF2F5" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke={isCritical ? "#DC2626" : "#3EC1E0"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className={`font-mono text-xl font-bold ${isCritical ? "text-red-600" : "text-ink"}`}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
    </div>
  );
}
