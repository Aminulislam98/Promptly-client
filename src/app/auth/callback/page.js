"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let destination = "/dashboard";
    try {
      const saved = sessionStorage.getItem("postLoginRedirect");
      if (saved) {
        destination = saved;
        sessionStorage.removeItem("postLoginRedirect");
      }
    } catch {
      // sessionStorage unavailable — fall back to dashboard
    }
    router.replace(destination);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <p className="text-base text-text-secondary">Signing you in…</p>
    </main>
  );
}
