// supabase/functions/get-active-reports/index.js
// ---------------------------------------------------------
// Vacation Living — Get Active Issues v7.0
// Devuelve todos los issues (reports) abiertos de una casa
// incluyendo metadata, fotos y categoría.
// ---------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    // body esperado
    const { houseId } = await req.json();

    if (!houseId) {
      return new Response(JSON.stringify({ error: "houseId is required" }), {
        status: 400,
      });
    }

    // Supabase env
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
    // 1. READ active reports
    // ---------------------------------------------------------
    const r = await fetch(
      `${supabaseUrl}/rest/v1/reports?house_id=eq.${houseId}&status=eq.open&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    const reports = await r.json();

    if (!r.ok) {
      return new Response(
        JSON.stringify({
          error: "Error loading reports",
          details: reports,
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // 2. FOR EACH ISSUE, ATTACH IMAGES FROM issue-media bucket
    // ---------------------------------------------------------
    const enhancedReports = [];

    for (const issue of reports) {
      const folderPath = `issue-media/${issue.house_id}/${issue.category_id}/${issue.id}`;

      // list files inside bucket folder
      const mediaReq = await fetch(
        `${supabaseUrl}/storage/v1/object/list/${folderPath}`,
        {
          method: "GET",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        },
      );

      let files = [];
      if (mediaReq.ok) {
        const mediaList = await mediaReq.json();
        files = mediaList.map((f) => ({
          name: f.name,
          url: `${supabaseUrl}/storage/v1/object/public/${folderPath}/${f.name}`,
        }));
      }

      enhancedReports.push({
        ...issue,
        images: files,
      });
    }

    // ---------------------------------------------------------
    // 3. SORT newest → oldest
    // ---------------------------------------------------------
    enhancedReports.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    // ---------------------------------------------------------
    // 4. SEND RESPONSE
    // ---------------------------------------------------------
    return new Response(JSON.stringify(enhancedReports), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
