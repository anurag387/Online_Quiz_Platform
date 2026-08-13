"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "./store";
import type { Role } from "./types";

// Redirects to the login page if nobody (or the wrong role) is signed in.
// Keeps teacher-only and student-only pages from being opened by the
// other role or by a logged-out visitor.
export function useRequireRole(role: Role) {
  const router = useRouter();
  const user = useAppStore((s) => s.getCurrentUser());

  useEffect(() => {
    if (!user || user.role !== role) {
      router.replace("/");
    }
  }, [user, role, router]);

  return user;
}
