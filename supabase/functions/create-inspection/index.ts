// create-inspection — Vacation Living
// Crea una inspección activa por casa e inspector
// Si ya existe una abierta, la devuelve.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id, inspector_id } = await req.json();

      if (!house_id || !inspector_id) {
        return new Response(
          JSON.stringify({
            error: "Missing house_id or inspector_id",
          }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // 1. Verificar si ya hay inspección abierta
      const { data: existing, error: existingError } = await supabase
        .from("inspections")
        .select("*")
        .eq("house_id", house_id)
        .eq("status", "open")
        .limit(1);

      if (existingError) {
        return new Response(JSON.stringify({ error: existingError }), {
          status: 500,
        });
      }

      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({
          success: true,
          inspection: existing[0],
          already_open: true,
        }), { status: 200 });
      }

      // 2. Crear nueva inspección
      const { data: newInspection, error: insertError } = await supabase
        .from("inspections")
        .insert([
          {
            house_id,
            inspector_id,
            status: "open",
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify({
        success: true,
        inspection: newInspection,
        already_open: false,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
