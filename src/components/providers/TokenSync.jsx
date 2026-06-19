"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function TokenSync() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session) {
      localStorage.removeItem("server_token");
      return;
    }
    // Better Auth session token store করো
    if (session?.session?.token) {
      localStorage.setItem("server_token", session.session.token);
    }
  }, [session]);

  return null;
}
