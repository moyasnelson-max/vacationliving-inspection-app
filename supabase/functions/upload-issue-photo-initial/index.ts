// upload-issue-photo-initial — Vacation Living
// Sube 1–3 fotos iniciales del issue a:
// issue-media/{houseId}/{categoryId}/{issueId}/initial/

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const url = new URL(req.url);
      const house_id = url.searchParams.get("house_id");
      const category_id = url.searchParams.get("category_id");
      const issue_id = url.searchParams.get("issue_id");
      const filename = url.searchParams.get("filename") || "photo.jpg";

      if (!house_id || !category_id || !issue_id) {
        return new Response(
          JSON.stringify({
            error:
              "Missing house_id, category_id or issue_id in query parameters",
          }),
          { status: 400 },
        );
      }

      // Leer el archivo enviado por form-data
      const form = await req.formData();
      const file = form.get("file") as File;

      if (!file) {
        return new Response(JSON.stringify({ error: "Missing file" }), {
          status: 400,
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      );

      // Verificar cuántas fotos tiene ya el issue (máximo 3)
      const { data: mediaCount, error: countError } = await supabase
        .from("inspection_issue_media")
        .select("*", { count: "exact", head: true })
        .eq("issue_id", issue_id)
        .eq("type", "initial");

      if (countError) {
        return new Response(JSON.stringify({ error: countError }), {
          status: 500,
        });
      }

      if ((mediaCount?.length ?? 0) >= 3) {
        return new Response(
          JSON.stringify({
            error: "Maximum of 3 photos allowed for initial issue media",
          }),
          { status: 400 },
        );
      }

      // Ruta dentro de Supabase Storage
      const storagePath =
        `issue-media/${house_id}/${category_id}/${issue_id}/initial/${filename}`;

      // Subir archivo
      const fileBuffer = await file.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("issue-media")
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        return new Response(JSON.stringify({ error: uploadError }), {
          status: 500,
        });
      }

      // Obtener URL pública
      const { data: publicUrl } = supabase.storage
        .from("issue-media")
        .getPublicUrl(storagePath);

      // Guardar referencia en DB
      await supabase.from("inspection_issue_media").insert([
        {
          issue_id,
          house_id,
          category_id,
          media_url: publicUrl.publicUrl,
          type: "initial",
          created_at: new Date().toISOString(),
        },
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          url: publicUrl.publicUrl,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
