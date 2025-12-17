import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getUserLanguage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: cookieStore }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return cookieStore.get("lang")?.value || "en";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("language")
    .eq("id", session.user.id)
    .single();

  return profile?.language || "en";
}
