// list-house-issues — Fetch all issues for a house
// Vacation Living · Inspection System

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const { house_id } = await req.json();

      if (!house_id) {
        return new Response(
          JSON.stringify({ error: "Missing required field: house_id" }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Fetch issues
      const { data: issues, error } = await supabase
        .from("inspection_issues")
        .select("*")
        .eq("house_id", house_id)
        .order("status", { ascending: true }) // OPEN FIRST
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      // 2. Fetch a thumbnail per issue (if exists)
      for (const issue of issues) {
        const path = `${issue.house_id}/${issue.category_id}/${issue.id}`;

        const { data: media } = await supabase.storage
          .from("issue-media")
          .list(path);

        if (media && media.length > 0) {
          issue.thumbnail_url = supabase.storage
            .from("issue-media")
            .getPublicUrl(`${path}/${media[0].name}`).data.publicUrl;
        } else {
          issue.thumbnail_url = null;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          house_id,
          issues,
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
