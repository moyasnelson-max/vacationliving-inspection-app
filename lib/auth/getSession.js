import { createServerClient } from "../supabase/server";

export async function getSession() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}
