// delete-issue — Delete an issue and its media
// Vacation Living · Inspection System

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

      // 1. Validate issue exists
      const { data: issue, error: issueError } = await supabase
        .from("inspection_issues")
        .select("*")
        .eq("id", issue_id)
        .single();

      if (!issue || issueError) {
        return new Response(JSON.stringify({ error: "Issue not found" }), {
          status: 404,
        });
      }

      if (issue.status === "closed") {
        return new Response(
          JSON.stringify({
            error: "Closed issues cannot be deleted",
          }),
          { status: 403 },
        );
      }

      // 2. Delete associated media from storage
      const { data: mediaFiles } = await supabase.storage
        .from("issue-media")
        .list(`${issue.house_id}/${issue.category_id}/${issue.id}`);

      if (mediaFiles?.length) {
        const paths = mediaFiles.map(
          (f) => `${issue.house_id}/${issue.category_id}/${issue.id}/${f.name}`,
        );

        await supabase.storage.from("issue-media").remove(paths);
      }

      // 3. Delete issue record
      const { error: deleteError } = await supabase
        .from("inspection_issues")
        .delete()
        .eq("id", issue_id);

      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          deleted_issue_id: issue_id,
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
