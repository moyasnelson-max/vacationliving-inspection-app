import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { houseId, inspectorId } = await req.json();

  const { data, error } = await supabase
    .from("inspections")
    .insert({
      house_id: houseId,
      inspector_id: inspectorId,
      status: "in_progress"
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  return res.json({ inspection: data });
};
