// supabase/functions/list-closed-reports/index.js
// ---------------------------------------------------------
// Vacation Living – List Closed Reports v4.1
// Devuelve todos los issues CERRADOS para una casa específica.
// Incluye fechas antes / después, imágenes, notas, inspector.
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
    // status: closed
    // ---------------------------------------------------------
    const query = new URL(
      `${supabaseUrl}/rest/v1/reports?select=id,house_id,category_id,category_name,title,status,description,images,created_at,updated_at,closed_at,fix_note,fix_images,inspector_id&house_id=eq.${houseId}&status=eq.closed`,
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
          error: "Error fetching closed reports",
          details: data,
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // ORDER: newest closed first
    // ---------------------------------------------------------
    data.sort(
      (a, b) =>
        new Date(b.closed_at).getTime() - new Date(a.closed_at).getTime(),
    );

    // ---------------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        count: data.length,
        houseId,
        closedReports: data,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
