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
      let image_url = null;

      if (image) {
        const path = `inspections/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(path, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = await supabase.storage
          .from("reports")
          .getPublicUrl(path);

        image_url = urlData.publicUrl;
      }

      await supabase.from("reports").insert({
        title,
        details,
        image_url,
        created_at: new Date().toISOString(),
      });

      router.push("/reports");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Report</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
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
