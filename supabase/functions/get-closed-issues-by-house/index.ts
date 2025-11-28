// supabase/functions/get-closed-issues-by-house/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const houseId = url.searchParams.get("houseId");

    if (!houseId) {
      return new Response(JSON.stringify({ error: "Missing houseId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("issues")
      .select(
        `
          id,
          house_id,
          category,
          subcategory,
          description,
          status,
          created_at,
          closed_at,
          media_urls
        `
      )
      .eq("house_id", houseId)
      .eq("status", "closed")
      .order("closed_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ issues: data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
