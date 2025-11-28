// get-active-inspection — Vacation Living
// Devuelve la inspección abierta (status: "open") de una casa.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id } = await req.json();

      if (!house_id) {
        return new Response(
          JSON.stringify({ error: "Missing house_id" }),
          { status: 400 }
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // Buscar inspección abierta para esta casa
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("house_id", house_id)
        .eq("status", "open")
        .limit(1);

      if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      if (!data || data.length === 0) {
        return new Response(
          JSON.stringify({ success: true, active: null }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          active: data[0],
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
