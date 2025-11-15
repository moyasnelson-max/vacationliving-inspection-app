"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        router.push("/login");
        return;
      }

      router.push("/reports");
    }

    check();
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Vacation Living Inspection App</h1>
      <p>Loading...</p>
    </div>
  );
}
