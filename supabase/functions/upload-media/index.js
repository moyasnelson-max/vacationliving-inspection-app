// supabase/functions/upload-media/index.js
// -------------------------------------------------------------
// Vacation Living • Media Upload Engine v4.1
// -------------------------------------------------------------
// Subida segura de imágenes para:
// - Inspectors
// - Issues
// - Repairs
// - Close Issue
// - PDF generator
// - HTML generator
// -------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500 }
      );
    }

    const formData = await req.formData();

    // Required fields
    const houseId = formData.get("houseId");
    const categoryId = formData.get("categoryId");
    const itemId = formData.get("itemId");

    if (!houseId || !categoryId || !itemId) {
      return new Response(
        JSON.stringify({ error: "Missing required metadata" }),
        { status: 400 }
      );
    }

    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one file is required" }),
        { status: 400 }
      );
    }

    if (files.length > 3) {
      return new Response(
        JSON.stringify({ error: "Maximum 3 photos allowed" }),
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    // Loop each file
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);

      const ext = file.name.split(".").pop().toLowerCase();
      const allowedExt = ["jpg", "jpeg", "png", "webp"];

      if (!allowedExt.includes(ext)) {
        return new Response(
          JSON.stringify({ error: "Invalid format (jpg/jpeg/png/webp only)" }),
          { status: 400 }
        );
      }

      const timestamp = Date.now();

      const filePath = `issue-media/${houseId}/${categoryId}/${itemId}/${timestamp}.${ext}`;

      const resp = await fetch(
        `${supabaseUrl}/storage/v1/object/issue-media/${filePath}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: buffer,
        }
      );

      if (!resp.ok) {
        return new Response(
          JSON.stringify({ error: "Upload failed", details: await resp.text() }),
          { status: 500 }
        );
      }

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/issue-media/${filePath}`;

      uploadedFiles.push({
        url: publicUrl,
        path: filePath,
      });
    }

    return new Response(JSON.stringify({ success: true, files: uploadedFiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
