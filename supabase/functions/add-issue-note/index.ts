// add-issue-note — Vacation Living
// Guarda la nota del inspector para un Issue específico

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { issue_id, inspector_email, note } = await req.json();

      if (!issue_id || !inspector_email || !note) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields (issue_id, inspector_email, note)",
          }),
          { status: 400 }
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // Actualiza el issue con la nota
      const { data, error } = await supabase
        .from("issues")
        .update({
          note: note,
          note_added_by: inspector_email,
          note_added_at: new Date().toISOString(),
        })
        .eq("id", issue_id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Note saved successfully",
          issue: data,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
