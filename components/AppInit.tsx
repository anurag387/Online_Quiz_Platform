"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export default function AppInit() {
  const darkMode = useAppStore((s) => s.darkMode);
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  return null;
}
