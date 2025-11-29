// supabase/functions/append-issue/index.js
// -------------------------------------------------------
// Vacation Living — Issue Creator v4.1
// Crea un issue nuevo dentro de un reporte activo
// -------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const body = await req.json();

    const {
      houseId,
      categoryId,
      itemId,
      inspectorId,
      note,
      photos, // array de URLs retornado por upload-media
    } = body;

    if (!houseId || !categoryId || !itemId || !inspectorId || !note) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500 },
      );
    }

    // 🔥 Crea la fila en "reports"
    const resp = await fetch(`${supabaseUrl}/rest/v1/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        house_id: houseId,
        category_id: categoryId,
        item_id: itemId,
        inspector_id: inspectorId,
        note: note,
        photos: photos || [],
        status: "open",
        created_at: new Date().toISOString(),
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Insert failed", details: data }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        issue: data[0],
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
