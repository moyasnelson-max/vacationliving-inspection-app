import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { ROLES } from "@/lib/roles/roles";

export async function getUserRole() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: cookieStore }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return ROLES.GUEST;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return profile?.role || ROLES.GUEST;
}
