"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    // Already logged in — send to dashboard
    if (user) router.replace("/dashboard");
  }, [user]);

  if (user) return null;

  return <>{children}</>;
}