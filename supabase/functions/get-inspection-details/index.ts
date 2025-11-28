// get-inspection-details — Vacation Living
// Devuelve todos los datos de una inspección específica:
// issues abiertos/cerrados, fotos, notas, fechas, inspector y estructura completa.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { inspection_id } = await req.json();

      if (!inspection_id) {
        return new Response(JSON.stringify({ error: "inspection_id missing" }), {
          status: 400,
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // -----------------------------
      // 1 — Datos principales
      // -----------------------------
      const { data: inspection, error: inspErr } = await supabase
        .from("inspections")
        .select("*")
        .eq("id", inspection_id)
        .single();

      if (inspErr) {
        return new Response(JSON.stringify({ error: inspErr.message }), {
          status: 500,
        });
      }

      // -----------------------------
      // 2 — Issues de la inspección
      // -----------------------------
      const { data: issues, error: issuesErr } = await supabase
        .from("issues")
        .select("*")
        .eq("inspection_id", inspection_id)
        .order("created_at", { ascending: true });

      if (issuesErr) {
        return new Response(JSON.stringify({ error: issuesErr.message }), {
          status: 500,
        });
      }

      // -----------------------------
      // 3 — Fotos de cada issue
      // -----------------------------
      const fullIssues = [];

      for (const issue of issues) {
        const { data: media, error: mediaErr } = await supabase
          .from("issue_media")
          .select("*")
          .eq("issue_id", issue.id)
          .order("created_at", { ascending: true });

        if (mediaErr) {
          return new Response(JSON.stringify({ error: mediaErr.message }), {
            status: 500,
          });
        }

        fullIssues.push({
          ...issue,
          media,
        });
      }

      // -----------------------------
      // 4 — PDF generado (si existe)
      // -----------------------------
      const { data: pdfs, error: pdfErr } = await supabase.storage
        .from("reports")
        .list(`${inspection.house_id}/${inspection_id}/`);

      if (pdfErr) {
        return new Response(JSON.stringify({ error: pdfErr.message }), {
          status: 500,
        });
      }

      // -----------------------------
      // 5 — Respuesta final
      // -----------------------------
      return new Response(
        JSON.stringify({
          success: true,
          inspection,
          issues: fullIssues,
          pdfs,
        }),
        { status: 200 }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
