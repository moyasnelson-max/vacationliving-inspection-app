import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (_, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data } = await supabase
    .from("reports")
    .select("*, houses(name)")
    .order("created_at", { ascending: false });

  return res.json({ reports: data });
};
