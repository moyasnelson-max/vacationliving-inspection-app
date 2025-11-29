// start-issue-flow — Vacation Living
// Inicia la creación de un nuevo Issue dentro de una inspección abierta.
// Crea el registro y prepara estructura para media.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { inspection_id, house_id, category_id, subcategory_id } =
        await req.json();

      if (!inspection_id || !house_id || !category_id || !subcategory_id) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required fields (inspection_id, house_id, category_id, subcategory_id)",
          }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Verificar inspección
      const { data: inspection, error: inspectErr } = await supabase
        .from("inspections")
        .select("*")
        .eq("id", inspection_id)
        .single();

      if (inspectErr || !inspection) {
        return new Response(JSON.stringify({ error: "Inspection not found" }), {
          status: 404,
        });
      }

      if (inspection.status !== "open") {
        return new Response(
          JSON.stringify({
            error: "Inspection is not open. Cannot add new issues.",
          }),
          { status: 400 },
        );
      }

      // Crear Issue
      const { data: issue, error: issueErr } = await supabase
        .from("issues")
        .insert({
          inspection_id,
          house_id,
          category_id,
          subcategory_id,
          status: "open",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (issueErr) {
        return new Response(JSON.stringify({ error: issueErr }), {
          status: 500,
        });
      }

      const issue_id = issue.id;

      // Crear estructura de media (solo lógica, no carpetas físicas)
      const storagePath = `issue-media/${house_id}/${category_id}/${issue_id}/`;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Issue flow started successfully",
          issue_id,
          media_path: storagePath,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
