"use client";

import Link from "next/link";
import supabase from "@/lib/supabase-client";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Vacation Living - Inspection System</h1>

      <Link href="/auth/login">
        Login Inspectors
      </Link>
    </div>
  );
}