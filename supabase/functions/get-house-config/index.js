import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (_, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data } = await supabase.from("houses").select("*");

  return res.json({ houses: data });
};
