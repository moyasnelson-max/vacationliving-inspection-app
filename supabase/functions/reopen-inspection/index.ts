// reopen-inspection — Vacation Living
// Reabre una inspección cerrada si es necesario hacer correcciones.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { inspection_id } = await req.json();

      if (!inspection_id) {
        return new Response(
          JSON.stringify({ error: "Missing inspection_id" }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Verificar si la inspección existe
      const { data: inspection, error: fetchError } = await supabase
        .from("inspections")
        .select("*")
        .eq("id", inspection_id)
        .single();

      if (fetchError || !inspection) {
        return new Response(JSON.stringify({ error: "Inspection not found" }), {
          status: 404,
        });
      }

      // Si ya está abierta no se puede abrir otra vez
      if (inspection.status === "open") {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Inspection is already open.",
          }),
          { status: 400 },
        );
      }

      // Reabrir la inspección
      const { data, error } = await supabase
        .from("inspections")
        .update({
          status: "open",
          reopened_at: new Date().toISOString(),
        })
        .eq("id", inspection_id)
        .select();

      if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Inspection successfully reopened.",
          inspection: data?.[0] || null,
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
