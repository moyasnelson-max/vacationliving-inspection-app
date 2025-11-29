// supabase/functions/list-open-reports/index.js
// ---------------------------------------------------------
// Vacation Living – List Open Reports v4.1 (PRODUCTION READY)
// Devuelve solo issues abiertos de una casa específica.
// Incluye: título, categoría, fotos, notas, fechas, inspector.
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

    // ---------------------------------------------------------
    // ENV
    // ---------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // QUERY
    // ---------------------------------------------------------
    const query = new URL(
      `${supabaseUrl}/rest/v1/reports?select=id,house_id,category_id,category_name,title,status,description,images,created_at,updated_at,closed_at,fix_note,fix_images,inspector_id&house_id=eq.${houseId}&status=eq.open`,
    );

    const fetchReq = await fetch(query.toString(), {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    const data = await fetchReq.json();

    if (!fetchReq.ok) {
      return new Response(
        JSON.stringify({
          error: "Error fetching open reports",
          details: data,
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // ORDER: newest first
    // ---------------------------------------------------------
    data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // ---------------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        count: data.length,
        houseId,
        openReports: data,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
