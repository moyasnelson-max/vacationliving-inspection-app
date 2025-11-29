// complete-issue-step — Vacation Living
// Marca una etapa del issue como completada (note_done / photos_done)

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { issue_id, step, inspector_email } = await req.json();

      if (!issue_id || !step || !inspector_email) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields (issue_id, step, inspector_email)",
          }),
          { status: 400 },
        );
      }

      if (!["note_done", "photos_done"].includes(step)) {
        return new Response(
          JSON.stringify({
            error: "Invalid step. Allowed: note_done, photos_done",
          }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Actualizar el issue dependiendo del step
      const updateData: any = {};
      updateData[step] = true;
      updateData[`${step}_by`] = inspector_email;
      updateData[`${step}_at`] = new Date().toISOString();

      const { data, error } = await supabase
        .from("issues")
        .update(updateData)
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
          message: `Issue step "${step}" marked as completed`,
          issue: data,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
