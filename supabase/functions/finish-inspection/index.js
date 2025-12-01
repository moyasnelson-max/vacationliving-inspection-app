import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { inspectionId } = await req.json();

  await supabase
    .from("inspections")
    .update({ status: "completed", finished_at: new Date() })
    .eq("id", inspectionId);

  return res.json({ success: true });
};
