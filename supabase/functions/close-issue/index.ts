// close-issue — Vacation Living System
// Cierra un issue después de reparación (nota + fotos requeridas)

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { issue_id, inspector_email, closing_note, closing_photos } =
        await req.json();

      if (!issue_id || !inspector_email || !closing_note || !closing_photos) {
        return new Response(
          JSON.stringify({
            error:
              "Missing fields (issue_id, inspector_email, closing_note, closing_photos)",
          }),
          { status: 400 },
        );
      }

      if (!Array.isArray(closing_photos) || closing_photos.length === 0) {
        return new Response(
          JSON.stringify({
            error: "closing_photos must be a non-empty array",
          }),
          { status: 400 },
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Validar que el issue exista
      const { data: issue, error: issueErr } = await supabase
        .from("issues")
        .select("id, is_closed")
        .eq("id", issue_id)
        .single();

      if (issueErr || !issue) {
        return new Response(JSON.stringify({ error: "Issue not found" }), {
          status: 404,
        });
      }

      if (issue.is_closed === true) {
        return new Response(
          JSON.stringify({ error: "Issue is already closed" }),
          { status: 400 },
        );
      }

      // Cerrar issue
      const { data: closed, error: closeErr } = await supabase
        .from("issues")
        .update({
          is_closed: true,
          closed_at: new Date().toISOString(),
          closed_by: inspector_email,
          closing_note,
          closing_photos,
        })
        .eq("id", issue_id)
        .select()
        .single();

      if (closeErr) {
        return new Response(JSON.stringify({ error: closeErr.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Issue closed successfully",
          closed_issue: closed,
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
