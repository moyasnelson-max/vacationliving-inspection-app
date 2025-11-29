// finalize-inspection — Vacation Living System
// Cierra una inspección, genera registro final, valida issues y dispara el PDF

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id, inspector_email, final_note } = await req.json();

      if (!house_id || !inspector_email) {
        return new Response(
          JSON.stringify({
            error: "Missing fields: house_id, inspector_email are required",
          }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // 1 — verificar issues abiertos
      const { data: openIssues, error: openErr } = await supabase
        .from("issues")
        .select("*")
        .eq("house_id", house_id)
        .eq("is_closed", false);

      if (openErr) {
        return new Response(JSON.stringify({ error: openErr.message }), {
          status: 500,
        });
      }

      // Si quedan issues abiertos, no se puede finalizar
      if (openIssues.length > 0) {
        return new Response(
          JSON.stringify({
            error: "There are still open issues",
            open_issues: openIssues,
          }),
          { status: 400 },
        );
      }

      // 2 — crear registro en "inspections"
      const { data: inspection, error: inspErr } = await supabase
        .from("inspections")
        .insert({
          house_id,
          inspector_email,
          final_note,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (inspErr) {
        return new Response(JSON.stringify({ error: inspErr.message }), {
          status: 500,
        });
      }

      const inspectionId = inspection.id;

      // 3 — llamar send-report automáticamente
      const response = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get(
              "SUPABASE_SERVICE_ROLE_KEY",
            )}`,
          },
          body: JSON.stringify({
            house_id,
            inspector_email,
            inspection_id: inspectionId,
          }),
        },
      );

      const sendResult = await response.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Inspection finalized and report sent",
          inspection_id: inspectionId,
          report_status: sendResult,
        }),
        { status: 200 },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
