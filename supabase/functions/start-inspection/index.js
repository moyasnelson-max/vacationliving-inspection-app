// supabase/functions/start-inspection/index.js
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { house_id, inspector_id } = await req.json();

    if (!house_id || !inspector_id) {
      return new Response(
        JSON.stringify({
          error: "house_id and inspector_id are required.",
        }),
        { status: 400 },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // =====================================================
    // 1. Validar que la casa exista
    // =====================================================
    const { data: house, error: houseErr } = await supabase
      .from("houses")
      .select("id, name")
      .eq("id", house_id)
      .single();

    if (houseErr || !house) {
      return new Response(
        JSON.stringify({
          error: "House not found.",
        }),
        { status: 404 },
      );
    }

    // =====================================================
    // 2. Crear inspección con estado "in_progress"
    // =====================================================
    const { data: inspection, error: inspErr } = await supabase
      .from("inspections_v2")
      .insert({
        house_id,
        inspector_id,
        started_at: new Date().toISOString(),
        status: "in_progress",
      })
      .select()
      .single();

    if (inspErr) {
      return new Response(
        JSON.stringify({
          error: "Could not start inspection.",
          details: inspErr.message,
        }),
        { status: 400 },
      );
    }

    // =====================================================
    // 3. Respuesta final
    // =====================================================
    return new Response(
      JSON.stringify({
        success: true,
        message: "Inspection started successfully.",
        inspection_id: inspection.id,
        house_name: house.name,
        started_at: inspection.started_at,
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
