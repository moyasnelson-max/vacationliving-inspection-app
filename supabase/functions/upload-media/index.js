import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const form = await req.formData();
  const file = form.get("file");

  const filePath = `issues/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("issue-media")
    .upload(filePath, file, { upsert: false });

  if (error) return res.status(500).json({ error });

  return res.json({ url: filePath });
};
