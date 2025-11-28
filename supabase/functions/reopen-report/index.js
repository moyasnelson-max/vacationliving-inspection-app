// supabase/functions/reopen-report/index.js
// ---------------------------------------------------------
// Vacation Living — Reopen Issue v4.3 (Final Production)
// Reabre un issue solo si está cerrado.
// Limpia fix_note, fix_images y closed_at.
// Añade un log "reopened".
// ---------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const { issueId, houseId, reason } = await req.json();

    // ---------------------------------------------------------
    // 1. VALIDACIONES
    // ---------------------------------------------------------
    if (!issueId || !houseId) {
      return new Response(
        JSON.stringify({ error: "issueId and houseId are required" }),
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 3) {
      return new Response(
        JSON.stringify({
          error: "Reopen reason is required (min 3 chars)",
        }),
        { status: 400 }
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
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 3. PATCH → SET OPEN + CLEAR FIX DATA
    // ---------------------------------------------------------
    const reopenReq = await fetch(
      `${supabaseUrl}/rest/v1/reports?id=eq.${issueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          status: "open",
          fix_note: null,
          fix_images: [],
          closed_at: null,
          reopened_at: new Date().toISOString(),
          reopen_reason: reason,
        }),
      }
    );

    const reopenResp = await reopenReq.json();

    if (!reopenReq.ok) {
      return new Response(
        JSON.stringify({
          error: "Error reopening report",
          details: reopenResp,
        }),
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 4. LOG ENTRY
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
        action: "reopened",
        message: `Issue reopened. Reason: ${reason}`,
        created_at: new Date().toISOString(),
      }),
    });

    // ---------------------------------------------------------
    // 5. SUCCESS
    // ---------------------------------------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Issue successfully reopened",
        issueId,
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
