"use client";

import { ThemeProvider } from "./theme/ThemeProvider";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Providers({ children }) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient()
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionContextProvider>
  );
}
