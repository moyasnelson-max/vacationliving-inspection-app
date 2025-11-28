// supabase/functions/close-issue/index.js
// --------------------------------------------------------------
// Vacation Living — Close Issue v7.0
// Valida nota + fotos + inspector
// Actualiza el issue a "closed", guarda timestamp y autor
// --------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const body = await req.json();
    const { issueId, inspectorId, closingNote, closingPhotos } = body;

    // ----------------------------------------------------------
    // 1. VALIDACIONES
    // ----------------------------------------------------------
    if (!issueId) {
      return new Response(JSON.stringify({ error: "issueId is required" }), {
        status: 400,
      });
    }

    if (!inspectorId) {
      return new Response(JSON.stringify({ error: "inspectorId is required" }), {
        status: 400,
      });
    }

    if (!closingNote || closingNote.trim().length < 2) {
      return new Response(
        JSON.stringify({
          error: "closingNote is required to close an issue",
        }),
        { status: 400 }
      );
    }

    if (!closingPhotos || closingPhotos.length === 0) {
      return new Response(
        JSON.stringify({
          error: "At least 1 closing photo is required to close an issue",
        }),
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // 2. CONFIG SUPABASE
    // ----------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        }),
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // 3. OBTENER EL ISSUE PARA VERIFICAR ESTADO ACTUAL
    // ----------------------------------------------------------
    const issueRes = await fetch(
      `${supabaseUrl}/rest/v1/reports?id=eq.${issueId}&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    const issueData = await issueRes.json();

    if (!issueRes.ok || issueData.length === 0) {
      return new Response(
        JSON.stringify({ error: "Issue not found", details: issueData }),
        { status: 404 }
      );
    }

    const issue = issueData[0];

    // Ya está cerrado?
    if (issue.status === "closed") {
      return new Response(
        JSON.stringify({
          error: "Issue is already closed",
        }),
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // 4. CERRAR ISSUE
    // ----------------------------------------------------------
    const payload = {
      status: "closed",
      closed_at: new Date().toISOString(),
      closed_by: inspectorId,
      closing_note: closingNote,
      closing_photos: closingPhotos, // array de URLs
    };

    const closeRes = await fetch(
      `${supabaseUrl}/rest/v1/reports?id=eq.${issueId}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const closedIssue = await closeRes.json();

    if (!closeRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to close issue",
          details: closedIssue,
        }),
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // 5. RESPUESTA FINAL
    // ----------------------------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        message: "Issue closed successfully",
        issue: closedIssue[0],
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
