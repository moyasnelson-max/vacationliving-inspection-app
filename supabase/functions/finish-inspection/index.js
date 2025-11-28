// supabase/functions/finish-inspection/index.js
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { inspection_id } = await req.json();

    if (!inspection_id) {
      return new Response(
        JSON.stringify({ error: "inspection_id is required." }),
        { status: 400 },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // =====================================================
    // 1. Validar que la inspección existe y está activa
    // =====================================================
    const { data: inspection, error: inspErr } = await supabase
      .from("inspections_v2")
      .select("id, status, house_id")
      .eq("id", inspection_id)
      .single();

    if (inspErr || !inspection) {
      return new Response(
        JSON.stringify({ error: "Inspection not found." }),
        { status: 404 },
      );
    }

    if (inspection.status !== "in_progress") {
      return new Response(
        JSON.stringify({
          error: "Inspection is not in progress or already completed.",
        }),
        { status: 400 },
      );
    }

    // =====================================================
    // 2. Verificar si hay issues abiertos en esa inspección
    // =====================================================
    const { data: openIssues, error: openErr } = await supabase
      .from("issues_v3")
      .select("id")
      .eq("inspection_id", inspection_id)
      .eq("status", "open");

    if (openErr) {
      return new Response(
        JSON.stringify({ error: "Error checking issues.", details: openErr }),
        { status: 500 },
      );
    }

    if (openIssues.length > 0) {
      return new Response(
        JSON.stringify({
          error: "There are still open issues in this inspection.",
          open_issues: openIssues,
        }),
        { status: 400 },
      );
    }

    // =====================================================
    // 3. Actualizar la inspección a COMPLETADA
    // =====================================================
    const { error: updateErr } = await supabase
      .from("inspections_v2")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
      })
      .eq("id", inspection_id);

    if (updateErr) {
      return new Response(
        JSON.stringify({
          error: "Could not finish inspection.",
          details: updateErr.message,
        }),
        { status: 400 },
      );
    }

    // =====================================================
    // 4. Éxito
    // =====================================================
    return new Response(
      JSON.stringify({
        success: true,
        message: "Inspection completed successfully.",
        inspection_id,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Unexpected server error.",
        details: err.message,
      }),
      { status: 500 },
    );
  }
});
