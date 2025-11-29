// create-inspection-report-step — Vacation Living
// Genera un reporte parcial dentro de una inspección (por issue)

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const {
        inspection_id,
        issue_id,
        house_id,
        category_id,
        subcategory_id,
        note,
        photos,
        inspector_email,
      } = await req.json();

      if (
        !inspection_id ||
        !issue_id ||
        !house_id ||
        !category_id ||
        !subcategory_id ||
        !note ||
        !photos ||
        !inspector_email
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Missing fields (inspection_id, issue_id, house_id, category_id, subcategory_id, note, photos, inspector_email)",
          }),
          { status: 400 },
        );
      }

      if (!Array.isArray(photos) || photos.length === 0) {
        return new Response(
          JSON.stringify({ error: "Photos must be a non-empty array" }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Validar que el issue este listo (note_done + photos_done)
      const { data: issue, error: issueErr } = await supabase
        .from("issues")
        .select("id, note_done, photos_done")
        .eq("id", issue_id)
        .single();

      if (issueErr || !issue)
        return new Response(
          JSON.stringify({ error: "Issue not found or DB error" }),
          { status: 404 },
        );

      if (!issue.note_done || !issue.photos_done) {
        return new Response(
          JSON.stringify({
            error: "Issue is not ready yet (missing note_done or photos_done).",
          }),
          { status: 400 },
        );
      }

      // Insertar reporte parcial
      const { data: partial, error: partialErr } = await supabase
        .from("inspection_reports_partial")
        .insert({
          inspection_id,
          issue_id,
          house_id,
          category_id,
          subcategory_id,
          note,
          photos,
          inspector_email,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (partialErr) {
        return new Response(JSON.stringify({ error: partialErr.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Partial inspection report created",
          partial_report: partial,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
