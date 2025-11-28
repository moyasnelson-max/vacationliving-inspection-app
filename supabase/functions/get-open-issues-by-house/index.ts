// get-open-issues-by-house/index.ts
// Vacation Living · Fetch all OPEN issues for a specific house

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

serve(async (req) => {
  try {
    // 1. Read secret keys
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey);

    // 2. Parse body
    const { house_id } = await req.json();

    if (!house_id) {
      return new Response(
        JSON.stringify({
          error: "house_id is required",
        }),
        { status: 400 }
      );
    }

    // 3. Fetch OPEN issues for this house
    const { data, error } = await supabase
      .from("issues")
      .select(
        `
          id,
          house_id,
          category,
          subcategory,
          note,
          status,
          created_at,
          updated_at,
          images
        `
      )
      .eq("house_id", house_id)
      .eq("status", "open")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    // 4. Return list
    return new Response(
      JSON.stringify({
        house_id,
        count: data?.length || 0,
        issues: data || [],
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500 }
    );
  }
});
