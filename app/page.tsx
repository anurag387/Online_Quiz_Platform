"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, PenSquare } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import PasswordInput from "@/components/PasswordInput";
import type { Role } from "@/lib/types";

// "Remember me" is a small, separate localStorage entry per role — kept
// apart from the main app store so it survives logout and only ever
// prefills the login form, never auto-logs anyone in on its own.
function rememberKey(role: Role) {
  return `quizzy_remember_${role}`;
}
function loadRemembered(role: Role): { username: string; password: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(rememberKey(role));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveRemembered(role: Role, username: string, password: string) {
  window.localStorage.setItem(rememberKey(role), JSON.stringify({ username, password }));
}
function clearRemembered(role: Role) {
  window.localStorage.removeItem(rememberKey(role));
}

export default function LandingPage() {
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const register = useAppStore((s) => s.register);
  const t = useT();

  // Prefill from a remembered login whenever the role tab changes.
  useEffect(() => {
    if (mode !== "login") return;
    const remembered = loadRemembered(role);
    if (remembered) {
      setUsername(remembered.username);
      setPassword(remembered.password);
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleContinue = () => {
    setError("");
    const result =
      mode === "login"
        ? login(role, username, password)
        : register(role, name, username, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (mode === "login") {
      if (rememberMe) saveRemembered(role, username.trim().toLowerCase(), password);
      else clearRemembered(role);
    }

    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/join");
  };

  const canSubmit =
    username.trim() && password.trim() && (mode === "login" || name.trim());

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal dark:bg-[#0b1216] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lift"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-lg font-extrabold text-white">
            Q
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{t("appName")}</h1>
            <p className="text-xs text-ink-soft">{t("appTagline")}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-ink">{t("welcomeQuestion")}</h2>
        <p className="mb-5 text-sm text-ink-soft">{t("pickRole")}</p>

        <div className="relative mb-6 flex rounded-2xl bg-ink/5 p-1">
          <motion.div
            className="absolute inset-y-1 w-1/2 rounded-xl bg-sky shadow-soft"
            animate={{ x: role === "student" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          />
          <button
            onClick={() => {
              setRole("student");
              setError("");
            }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              role === "student" ? "text-white" : "text-ink-soft"
            }`}
          >
            <GraduationCap size={16} /> {t("student")}
          </button>
          <button
            onClick={() => {
              setRole("teacher");
              setError("");
            }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              role === "teacher" ? "text-white" : "text-ink-soft"
            }`}
          >
            <PenSquare size={16} /> {t("teacher")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={role + mode}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">{t("yourName")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "teacher" ? "e.g. Ayesha Rahman" : "e.g. Tanvir Ahmed"}
                  className="input-field"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">{t("username")}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tanvir123"
                autoComplete="username"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">{t("password")}</label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                onEnter={() => canSubmit && handleContinue()}
              />
            </div>
            {mode === "login" && (
              <label className="flex items-center gap-2 pt-1 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-sky"
                />
                {t("rememberMe")}
              </label>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-3 rounded-lg bg-pastel-pink px-3 py-2 text-xs font-medium text-pastel-pinkText">
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={!canSubmit}
          className="btn-primary mt-5 w-full"
        >
          {mode === "login" ? t("login") : t("register")} — {t("continueAs")}{" "}
          {role === "teacher" ? t("teacher") : t("student")}
        </button>

        <p className="mt-4 text-center text-xs text-ink-soft">
          {mode === "login" ? (
            <>
              {t("noAccount")}{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="font-semibold text-sky underline"
              >
                {t("createOne")}
              </button>
            </>
          ) : (
            <>
              {t("haveAccount")}{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-semibold text-sky underline"
              >
                {t("logInInstead")}
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-ink-faint">{t("demoNote")}</p>
      </motion.div>
    </main>
  );
}
