"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function TokenSync() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // While the session is still loading, don't touch the token in localStorage.
    // Clearing it here would cause in-flight API requests to lose their auth header.
    if (isPending) return;

    if (!session) {
      localStorage.removeItem("server_token");
      return;
    }
    if (session?.session?.token) {
      localStorage.setItem("server_token", session.session.token);
    }
  }, [session, isPending]);

  return null;
}
