// supabase/functions/get-inspection-details/index.js
// ----------------------------------------------------------------------
// Vacation Living — Get Inspection Details v4.0 PRO
// Devuelve TODA la información que necesita generate-pdf y send-report:
// - Datos de la inspección
// - Datos de la propiedad
// - Datos del inspector
// - Issues abiertos y cerrados
// - Fotografías
// - Notas
// - Estado final
// ----------------------------------------------------------------------

export const config = { runtime: "edge" };

export default async (req) => {
  try {
    const { inspectionId } = await req.json();

    if (!inspectionId) {
      return new Response(
        JSON.stringify({ error: "inspectionId is required" }),
        { status: 400 }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const headers = {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
    };

    // -------------------------------------------------------
    // 1 — Obtener la inspección
    // -------------------------------------------------------
    const inspectionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/inspections?id=eq.${inspectionId}`,
      { headers }
    );
    const inspection = (await inspectionRes.json())[0];

    if (!inspection) {
      return new Response(
        JSON.stringify({ error: "Inspection not found" }),
        { status: 404 }
      );
    }

    // -------------------------------------------------------
    // 2 — Obtener propiedad
    // -------------------------------------------------------
    const propertyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?id=eq.${inspection.property_id}`,
      { headers }
    );
    const property = (await propertyRes.json())[0] || null;

    // -------------------------------------------------------
    // 3 — Obtener inspector
    // -------------------------------------------------------
    const inspectorRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${inspection.inspector_id}`,
      { headers }
    );
    const inspector = (await inspectorRes.json())[0] || null;

    // -------------------------------------------------------
    // 4 — Issues abiertos
    // -------------------------------------------------------
    const openRes = await fetch(
      `${SUPABASE_URL}/rest/v1/reports?inspection_id=eq.${inspectionId}&status=eq.open`,
      { headers }
    );
    const openReports = await openRes.json();

    // -------------------------------------------------------
    // 5 — Issues cerrados
    // -------------------------------------------------------
    const closedRes = await fetch(
      `${SUPABASE_URL}/rest/v1/reports?inspection_id=eq.${inspectionId}&status=eq.closed`,
      { headers }
    );
    const closedReports = await closedRes.json();

    // -------------------------------------------------------
    // 6 — Media
    // -------------------------------------------------------
    const mediaRes = await fetch(
      `${SUPABASE_URL}/rest/v1/issue_media?inspection_id=eq.${inspectionId}`,
      { headers }
    );
    const media = await mediaRes.json();

    // -------------------------------------------------------
    // 7 — Notas finales
    // -------------------------------------------------------
    const notesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/inspection_notes?inspection_id=eq.${inspectionId}`,
      { headers }
    );
    const notes = await notesRes.json();

    // -------------------------------------------------------
    // RESPUESTA FINAL JSON COMPLETO
    // -------------------------------------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        inspection,
        property,
        inspector,
        openReports,
        closedReports,
        media,
        notes,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
        stack: err.stack,
      }),
      { status: 500 }
    );
  }
};
