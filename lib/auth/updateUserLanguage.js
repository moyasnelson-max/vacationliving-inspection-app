"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

export async function updateUserLanguage(lang) {
  const supabase = supabaseBrowser();

  await supabase.auth.updateUser({
    data: { language: lang },
  });
}
