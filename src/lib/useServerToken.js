"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function useServerToken() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) {
      localStorage.removeItem("server_token");
      return;
    }

    const sync = async () => {
      const existing = localStorage.getItem("server_token");
      if (existing) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      });
      const data = await res.json();
      if (data.token) localStorage.setItem("server_token", data.token);
    };

    sync();
  }, [session]);
}
