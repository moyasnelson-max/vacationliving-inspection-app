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

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      // 1. Upload image
      let image_url = null;

      if (image) {
        const path = `inspections/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("reports")
          .upload(path, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("reports")
          .getPublicUrl(path);

        image_url = urlData.publicUrl;
      }

      // 2. Save report
      const { error: insertError } = await supabase.from("reports").insert({
        title,
        details,
        image_url,
        status: "open",
        property_slug: "casa_carmela",
        created_at: new Date(),
      });

      if (insertError) throw insertError;

      router.push("/reports");
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Report</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <p>Title</p>
        <input
          style={{ width: "100%", marginBottom: 12 }}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p>Details</p>
        <textarea
          style={{ width: "100%", height: 120, marginBottom: 12 }}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>

        <p>Image (optional)</p>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ marginBottom: 12 }}
        />

        <button
          type="submit"
          style={{
            background: "black",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
          }}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
