"use client";

import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1. Obtener el usuario logueado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No authenticated user");
        return router.push("/login");
      }

      // 2. Subir imagen a Storage
      let image_url = null;

      if (image) {
        const filePath = `inspections/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        image_url = supabase.storage
          .from("reports")
          .getPublicUrl(filePath).data.publicUrl;
      }

      // 3. INSERT a la tabla reports con TODOS los campos necesarios
      const { error: dbError } = await supabase.from("reports").insert({
        title,
        summary: details,
        details,
        image_url,
        user_id: user.id,
        inspector_id: user.id,
        property_id: "00000000-0000-0000-0000-000000000000", // temporal, luego lo cambiamos
        status: "pending",
        submitted_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      // 4. Redirigir al listado
      router.push("/reports");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Create New Report</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Details"
          onChange={(e) => setDetails(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}
