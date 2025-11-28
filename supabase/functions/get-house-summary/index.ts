// get-house-summary — Vacation Living
// Devuelve: datos completos de una casa + issues abiertos/cerrados + inspecciones + PDFs

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id } = await req.json();

      if (!house_id) {
        return new Response(JSON.stringify({ error: "house_id missing" }), {
          status: 400,
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // ---------------------------
      // 1 — Datos de la casa
      // ---------------------------
      const { data: house, error: houseErr } = await supabase
        .from("houses")
        .select("*")
        .eq("id", house_id)
        .single();

      if (houseErr) {
        return new Response(JSON.stringify({ error: houseErr.message }), {
          status: 500,
        });
      }

      // ---------------------------
      // 2 — Issues abiertos
      // ---------------------------
      const { data: openIssues, error: openErr } = await supabase
        .from("issues")
        .select("*")
        .eq("house_id", house_id)
        .eq("is_closed", false)
        .order("created_at", { ascending: false });

      if (openErr) {
        return new Response(JSON.stringify({ error: openErr.message }), {
          status: 500,
        });
      }

      // ---------------------------
      // 3 — Issues cerrados
      // ---------------------------
      const { data: closedIssues, error: closedErr } = await supabase
        .from("issues")
        .select("*")
        .eq("house_id", house_id)
        .eq("is_closed", true)
        .order("closed_at", { ascending: false });

      if (closedErr) {
        return new Response(JSON.stringify({ error: closedErr.message }), {
          status: 500,
        });
      }

      // ---------------------------
      // 4 — Inspecciones previas
      // ---------------------------
      const { data: inspections, error: inspErr } = await supabase
        .from("inspections")
        .select("*")
        .eq("house_id", house_id)
        .order("completed_at", { ascending: false });

      if (inspErr) {
        return new Response(JSON.stringify({ error: inspErr.message }), {
          status: 500,
        });
      }

      // ---------------------------
      // 5 — PDFs guardados
      // ---------------------------
      const { data: pdfs, error: pdfErr } = await supabase.storage
        .from("reports")
        .list(`${house_id}/`, { limit: 100 });

      if (pdfErr) {
        return new Response(JSON.stringify({ error: pdfErr.message }), {
          status: 500,
        });
      }

      // ---------------------------
      // 6 — Construir respuesta
      // ---------------------------
      return new Response(
        JSON.stringify({
          success: true,
          house,
          open_issues: openIssues,
          closed_issues: closedIssues,
          inspections,
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
