import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { issueId } = await req.json();

  await supabase
    .from("issues")
    .update({ status: "closed", closed_at: new Date() })
    .eq("id", issueId);

  return res.json({ success: true });
};
