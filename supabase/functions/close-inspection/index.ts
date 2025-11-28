// close-inspection — Vacation Living
// Cierra una inspección SOLO si no hay issues abiertos.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { inspection_id } = await req.json();

      if (!inspection_id) {
        return new Response(
          JSON.stringify({ error: "Missing inspection_id" }),
          { status: 400 }
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // 1. Verificar si aún hay issues abiertos en esta inspección
      const { data: issues, error: issueError } = await supabase
        .from("issues")
        .select("*")
        .eq("inspection_id", inspection_id)
        .eq("status", "open");

      if (issueError) {
        return new Response(JSON.stringify({ error: issueError }), {
          status: 500,
        });
      }

      if (issues && issues.length > 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Cannot close inspection: there are still open issues.",
            open_issues: issues.length,
          }),
          { status: 400 }
        );
      }

      // 2. Cerrar la inspección
      const { data, error } = await supabase
        .from("inspections")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
        })
        .eq("id", inspection_id)
        .select();

      if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Inspection successfully closed.",
          inspection: data?.[0] || null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  },
});
