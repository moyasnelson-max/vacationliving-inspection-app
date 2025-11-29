// supabase/functions/get-inspection-history/index.js
// --------------------------------------------------------------
// Vacation Living — Inspection History v5.0
// Devuelve todas las inspecciones de una casa,
// con issues cerrados, inspector, timestamps y PDFs
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500 },
      );
    }

    // 🔥 1. OBTENER TODAS LAS INSPECCIONES DE ESTA CASA
    const inspectionsRes = await fetch(
      `${supabaseUrl}/rest/v1/inspection_history?house_id=eq.${houseId}&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    const inspections = await inspectionsRes.json();

    if (!inspectionsRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed fetching inspection_history",
          details: inspections,
        }),
        { status: 500 },
      );
    }

    // 🔥 2. CARGAR ISSUES CERRADOS EN ESTA INSPECCIÓN
    const enriched = [];

    for (const ins of inspections) {
      const issuesRes = await fetch(
        `${supabaseUrl}/rest/v1/reports?inspection_id=eq.${ins.id}&order=created_at.desc`,
        {
          method: "GET",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        },
      );

      const issues = await issuesRes.json();

      enriched.push({
        ...ins,
        issues_closed: issues,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_inspections: enriched.length,
        inspections: enriched,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
