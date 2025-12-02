"use client";

import { ThemeProvider } from "./theme/ThemeProvider";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Providers({ children }) {
  const [supabaseBrowser] = useState(() =>
    createBrowserSupabaseClient()
  );

  return (
    <SessionContextProvider supabaseBrowser={supabaseBrowser}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionContextProvider>
  );
}
