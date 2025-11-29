// open-issue — Creates a new issue for a house inspection
// Vacation Living · Inspection System

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const {
        house_id,
        inspection_id,
        category_id,
        subcategory_id,
        note,
        created_by,
      } = await req.json();

      if (!house_id || !inspection_id || !category_id || !subcategory_id) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required fields: house_id, inspection_id, category_id, subcategory_id",
          }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insert issue
      const { data, error } = await supabase
        .from("issues_v3")
        .insert([
          {
            house_id,
            inspection_id,
            category_id,
            subcategory_id,
            note,
            status: "open",
            created_by,
            created_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Error creating issue:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({ success: true, issue_id: data.id }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      console.error("Unhandled error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  },
});
