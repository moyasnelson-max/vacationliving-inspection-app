// supabase/functions/search-reports/index.js
// ----------------------------------------------------------------------
// Vacation Living – Search Reports v4.1
// Búsqueda avanzada para reportes con múltiples filtros opcionales.
// ----------------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const { houseId, queryText, inspectorId, status, dateFrom, dateTo } =
      await req.json();

    // --------------------------- VALIDATION ---------------------------
    if (!houseId) {
      return new Response(JSON.stringify({ error: "houseId is required" }), {
        status: 400,
      });
    }

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

    // --------------------------- BASE QUERY ---------------------------
    let url = `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}`;

    // texto libre
    if (queryText && queryText.trim() !== "") {
      const encoded = queryText.trim();
      url += `&or=(title.ilike.%${encoded}%,description.ilike.%${encoded}%,category_name.ilike.%${encoded}%)`;
    }

    // por inspector
    if (inspectorId) {
      url += `&inspector_id=eq.${inspectorId}`;
    }

    // estado open / closed
    if (status) {
      url += `&status=eq.${status}`;
    }

    // fechas
    if (dateFrom) {
      url += `&created_at=gte.${dateFrom}`;
    }

    if (dateTo) {
      url += `&created_at=lte.${dateTo}`;
    }

    // seleccionar columnas
    url +=
      "&select=id,house_id,category_id,category_name,title,status,description,images,created_at,updated_at,closed_at,fix_note,fix_images,inspector_id";

    // --------------------------- FETCH ---------------------------
    const response = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Error searching reports",
          details: json,
        }),
        { status: 500 },
      );
    }

    // order newest first
    json.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // --------------------------- RESPONSE ---------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        count: json.length,
        results: json,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
