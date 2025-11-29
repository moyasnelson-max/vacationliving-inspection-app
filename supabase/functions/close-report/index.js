// supabase/functions/close-report/index.js
// ---------------------------------------------------------
// Vacation Living — Close Issue v9.1 (Final Production)
// Cierra un issue existente SOLO si:
//  • Inspector sube nota de reparación
//  • Inspector sube al menos 1 foto del fix
// Incluye validación + escritura segura.
// ---------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const { issueId, houseId, fixNote, fixImages } = await req.json();

    // ---------------------------------------------------------
    // 1. VALIDACIONES
    // ---------------------------------------------------------
    if (!issueId || !houseId) {
      return new Response(
        JSON.stringify({ error: "issueId and houseId are required" }),
        { status: 400 },
      );
    }

    if (!fixNote || fixNote.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "A fixNote is required to close this issue" }),
        { status: 400 },
      );
    }

    if (!fixImages || !Array.isArray(fixImages) || fixImages.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least 1 fixImage is required" }),
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // 2. ENVIRONMENT CONFIG
    // ---------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error: "Missing SUPABASE_URL or SERVICE_ROLE_KEY",
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // 3. UPDATE ISSUE → SET CLOSED
    // ---------------------------------------------------------
    const closeReq = await fetch(
      `${supabaseUrl}/rest/v1/reports?id=eq.${issueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          status: "closed",
          fix_note: fixNote,
          fix_images: fixImages, // array de fotos final
          closed_at: new Date().toISOString(),
        }),
      },
    );

    const closeResp = await closeReq.json();

    if (!closeReq.ok) {
      return new Response(
        JSON.stringify({
          error: "Error closing report",
          details: closeResp,
        }),
        { status: 500 },
      );
    }

    // ---------------------------------------------------------
    // 4. OPTIONAL LOG ENTRY
    // ---------------------------------------------------------
    await fetch(`${supabaseUrl}/rest/v1/report_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        report_id: issueId,
        house_id: houseId,
        action: "closed",
        message: `Issue #${issueId} closed with fix note + images`,
        created_at: new Date().toISOString(),
      }),
    });

    // ---------------------------------------------------------
    // 5. SUCCESS RESPONSE
    // ---------------------------------------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Issue successfully closed",
        issueId,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
