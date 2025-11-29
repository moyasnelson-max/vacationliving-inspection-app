// supabase/functions/sync-house-status/index.js
// ---------------------------------------------------------
// Vacation Living — House Status Engine v7.0
// Devuelve estado general de la casa, issues abiertos/cerrados,
// % completado y nivel (green/yellow/red).
// ---------------------------------------------------------

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

    // -----------------------------------------------------
    // Supabase config
    // -----------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment vars",
        }),
        { status: 500 },
      );
    }

    // -----------------------------------------------------
    // FETCH all reports for this house
    // -----------------------------------------------------
    const res = await fetch(
      `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    const entries = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Error reading reports",
          details: entries,
        }),
        { status: 500 },
      );
    }

    // -----------------------------------------------------
    // COUNTS
    // -----------------------------------------------------
    const open = entries.filter((x) => x.status === "open").length;
    const closed = entries.filter((x) => x.status === "closed").length;
    const total = open + closed;

    let completion = total > 0 ? Math.round((closed / total) * 100) : 100;

    // -----------------------------------------------------
    // DETERMINE STATUS (green / yellow / red)
    // -----------------------------------------------------
    let level = "green";

    if (open >= 1 && open <= 2) level = "yellow";
    if (open >= 3) level = "red";

    if (total === 0) {
      level = "green";
      completion = 100;
    }

    // -----------------------------------------------------
    // LAST INSPECTION DATE
    // -----------------------------------------------------
    const lastInspection =
      entries
        .map((x) => x.created_at)
        .sort((a, b) => new Date(b) - new Date(a))[0] || null;

    // -----------------------------------------------------
    // SEND RESPONSE
    // -----------------------------------------------------
    return new Response(
      JSON.stringify({
        houseId,
        total_reports: total,
        open_reports: open,
        closed_reports: closed,
        completion_percent: completion,
        status_level: level, // green | yellow | red
        last_inspection: lastInspection,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
