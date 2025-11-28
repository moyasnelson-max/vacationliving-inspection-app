// supabase/functions/sync-open-issues/index.js
// --------------------------------------------------------------
// Vacation Living — Sync Open Issues v6.0
// Retorna todos los issues abiertos por casa, agrupados por categoría.
// --------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const { houseId } = await req.json();

    if (!houseId) {
      return new Response(
        JSON.stringify({ error: "houseId is required" }),
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // SUPABASE CONFIG
    // ----------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars",
        }),
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // FETCH ALL OPEN ISSUES FOR THIS HOUSE
    // ----------------------------------------------------------
    const res = await fetch(
      `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}&status=eq.open&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed fetching open issues",
          details: data,
        }),
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // GROUP BY CATEGORY
    // ----------------------------------------------------------
    const grouped = {};

    data.forEach((issue) => {
      const category = issue.category_id || "uncategorized";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(issue);
    });

    // ----------------------------------------------------------
    // SORT inside each category (by created_at)
    // ----------------------------------------------------------
    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });

    // ----------------------------------------------------------
    // FINAL RESPONSE
    // ----------------------------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        houseId,
        openIssues: grouped,
        totalOpen: data.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
