// get-issue-details — Vacation Living Issues
// Devuelve toda la información de un issue + fotos en storage

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { issue_id } = await req.json();

      if (!issue_id) {
        return new Response(
          JSON.stringify({ error: "Missing required field: issue_id" }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Get issue data
      const { data: issue, error } = await supabase
        .from("inspection_issues")
        .select("*")
        .eq("id", issue_id)
        .single();

      if (error || !issue) {
        return new Response(JSON.stringify({ error: "Issue not found" }), {
          status: 404,
        });
      }

      // 2. Fetch all media for this issue
      const mediaPath = `${issue.house_id}/${issue.category_id}/${issue.id}`;

      const { data: mediaFiles } = await supabase.storage
        .from("issue-media")
        .list(mediaPath);

      let media_urls = [];

      if (mediaFiles && mediaFiles.length > 0) {
        media_urls = mediaFiles.map(
          (file) =>
            supabase.storage
              .from("issue-media")
              .getPublicUrl(`${mediaPath}/${file.name}`).data.publicUrl,
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          issue,
          media_urls,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error("Error in get-issue-details", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  },
});
