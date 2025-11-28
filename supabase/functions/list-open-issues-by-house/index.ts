// list-open-issues-by-house — Vacation Living
// Devuelve todos los issues abiertos de una propiedad con sus fotos incluidas.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id } = await req.json();

      if (!house_id) {
        return new Response(
          JSON.stringify({ error: "house_id is required" }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Buscar issues abiertos
      const { data: issues, error } = await supabase
        .from("inspection_issues")
        .select("*")
        .eq("house_id", house_id)
        .eq("status", "open")
        .order("created_at", { ascending: true });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Error fetching issues" }),
          { status: 500 },
        );
      }

      // 2. Cargar fotos del storage
      for (const issue of issues) {
        const folder = `${issue.house_id}/${issue.category_id}/${issue.id}/initial`;

        const { data: photos } = await supabase.storage
          .from("issue-media")
          .list(folder);

        issue.photos = photos
          ? photos.map((p) =>
              supabase.storage
                .from("issue-media")
                .getPublicUrl(`${folder}/${p.name}`).data.publicUrl
            )
          : [];
      }

      return new Response(
        JSON.stringify({
          success: true,
          issues,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error("list-open-issues-by-house error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 },
      );
    }
  },
});
