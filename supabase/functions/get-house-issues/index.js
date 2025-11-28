// supabase/functions/get-house-issues/index.js
// --------------------------------------------------------------
// Vacation Living — Get House Issues v4.1
// Devuelve todos los issues OPEN + CLOSED de una casa
// Agrupados por categoría, ordenados por fecha
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500 }
      );
    }

    // 🔥 Consulta optimizada con filtros + orden:
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    const rows = await resp.json();

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Query failed", details: rows }),
        { status: 500 }
      );
    }

    // 🔥 Agrupación por categoría:
    const grouped = rows.reduce((acc, issue) => {
      const category = issue.category_name || "Uncategorized";

      if (!acc[category]) acc[category] = [];
      acc[category].push(issue);

      return acc;
    }, {});

    return new Response(
      JSON.stringify({
        success: true,
        total: rows.length,
        grouped,
        issues: rows,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
};
