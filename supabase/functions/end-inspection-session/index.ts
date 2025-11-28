// end-inspection-session — Closes an inspection session
// Vacation Living · Inspection System

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { session_id, final_notes } = await req.json();

      if (!session_id) {
        return new Response(
          JSON.stringify({ error: "Missing required field: session_id" }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check session exists
      const { data: sessionData, error: sessionError } = await supabase
        .from("inspection_sessions")
        .select("*")
        .eq("id", session_id)
        .single();

      if (sessionError || !sessionData) {
        return new Response(
          JSON.stringify({
            error: "Session not found",
            details: sessionError?.message,
          }),
          { status: 404 },
        );
      }

      // Close session
      const ended_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("inspection_sessions")
        .update({
          status: "closed",
          ended_at,
          final_notes: final_notes || null,
        })
        .eq("id", session_id)
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
          session_id,
          ended_at,
          message: "Inspection session closed successfully",
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
