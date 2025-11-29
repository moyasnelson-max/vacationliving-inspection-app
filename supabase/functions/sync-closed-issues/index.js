// supabase/functions/sync-closed-issues/index.js
// --------------------------------------------------------------
// Vacation Living — Sync Closed Issues v6.0
// Devuelve todos los issues CERRADOS (status = "closed") por casa,
// agrupados por categoría, ordenados por fecha de reparación.
// --------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const { houseId } = await req.json();

    if (!houseId) {
      return new Response(JSON.stringify({ error: "houseId is required" }), {
        status: 400,
      });
    }

    // ----------------------------------------------------------
    // SUPABASE CONFIG
    // ----------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars",
        }),
        { status: 500 },
      );
    }

    // ----------------------------------------------------------
    // FETCH ALL CLOSED ISSUES FOR THIS HOUSE
    // ----------------------------------------------------------
    const res = await fetch(
      `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}&status=eq.closed&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed fetching closed issues",
          details: data,
        }),
        { status: 500 },
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
    // SORT BY REPAIR_DATE (or created_at fallback)
    // ----------------------------------------------------------
    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => {
        const da = a.repair_date || a.updated_at || a.created_at;
        const db = b.repair_date || b.updated_at || b.created_at;
        return new Date(db) - new Date(da);
      });
    });

    // ----------------------------------------------------------
    // FINAL RESPONSE
    // ----------------------------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        houseId,
        closedIssues: grouped,
        totalClosed: data.length,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
