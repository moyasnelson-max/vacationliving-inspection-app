// upload-issue-media — Vacation Living
// Sube imágenes para un issue específico.
// Controla máximo de 3 imágenes por issue.

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve({
  "/": async (req) => {
    try {
      const {
        house_id,
        category_id,
        issue_id,
        file_base64,
        extension = "jpg",
      } = await req.json();

      if (!house_id || !category_id || !issue_id || !file_base64) {
        return new Response(JSON.stringify({
          error: "Missing required fields (house_id, category_id, issue_id, file_base64)"
        }), { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      );

      // Contar fotos existentes
      const folderPath = `issue-media/${house_id}/${category_id}/${issue_id}/`;

      const { data: files } = await supabase.storage
        .from("issue-media")
        .list(`${house_id}/${category_id}/${issue_id}`);

      const photoCount = files?.length || 0;

      if (photoCount >= 3) {
        return new Response(
          JSON.stringify({
            error: "Max 3 photos allowed per issue",
          }),
          { status: 400 }
        );
      }

      const fileName = `photo_${photoCount + 1}.${extension}`;
      const filePath = `${folderPath}${fileName}`;

      // Convert base64 → Uint8Array
      const fileData = Uint8Array.from(atob(file_base64), (c) =>
        c.charCodeAt(0)
      );

      // Upload
      const { error: uploadErr } = await supabase.storage
        .from("issue-media")
        .upload(`${house_id}/${category_id}/${issue_id}/${fileName}`, fileData, {
          contentType: `image/${extension}`,
          upsert: false,
        });

      if (uploadErr) {
        return new Response(JSON.stringify({ error: uploadErr }), {
          status: 500,
        });
      }

      // Generar URL pública
      const { data: publicUrl } = supabase.storage
        .from("issue-media")
        .getPublicUrl(`${house_id}/${category_id}/${issue_id}/${fileName}`);

      // Registrar en tabla opcional issue_photos
      await supabase.from("issue_photos").insert({
        issue_id,
        url: publicUrl.publicUrl,
        created_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Photo uploaded",
          url: publicUrl.publicUrl,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
});
