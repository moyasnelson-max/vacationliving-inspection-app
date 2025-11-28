// create-inspection-session — Creates a new inspection session
// Vacation Living · Inspection System

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id, inspector_id } = await req.json();

      if (!house_id || !inspector_id) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: house_id, inspector_id" }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const started_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("inspection_sessions")
        .insert([
          {
            house_id,
            inspector_id,
            started_at,
            status: "open",
          },
        ])
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500 },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          session_id: data.id,
          started_at,
          message: "Inspection session created successfully",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  },
});
