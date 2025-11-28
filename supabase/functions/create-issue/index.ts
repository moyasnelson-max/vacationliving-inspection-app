// create-issue — Vacation Living
// Crea un nuevo issue abierto y devuelve la ruta para subir fotos iniciales.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const body = await req.json();

      const {
        house_id,
        category_id,
        subcategory_id,
        note,
        inspector_id,
      } = body;

      // Validación de campos obligatorios
      if (!house_id || !category_id || !note || !inspector_id) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required fields: house_id, category_id, note, inspector_id",
          }),
          { status: 400 },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Crear el issue en DB
      const { data, error } = await supabase
        .from("inspection_issues")
        .insert([
          {
            house_id,
            category_id,
            subcategory_id: subcategory_id || null,
            note,
            inspector_id,
            status: "open",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      const issue_id = data.id;

      // 2. Generar ruta de media para subir fotos iniciales
      const upload_path =
        `issue-media/${house_id}/${category_id}/${issue_id}/initial/`;

      return new Response(
        JSON.stringify({
          success: true,
          issue_id,
          upload_path,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      console.error("create-issue error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 },
      );
    }
  },
});
