"use client";

import supabase from "@/app/lib/supabase-client";

export default function Home() {
  return (
    <main style={{ padding: 30 }}>
      <h1>Vacation Living - Inspection System</h1>
      <a href="/login">Login Inspectors</a>
    </main>
  );
}
