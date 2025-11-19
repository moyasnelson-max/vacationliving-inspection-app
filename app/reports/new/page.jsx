"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

export default function NewReportPage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const createReport = async () => {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open" }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  };

  const uploadImage = async (file, id) => {
    if (!file) return null;

    const filename = `${id}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (uploadError) return null;

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await createReport();
      const url = await uploadImage(image, id);

      await supabase
        .from("reports")
        .update({
          category,
          subcategory,
          notes,
          image_url: url,
        })
        .eq("id", id);

      router.push(`/reports/${id}`);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="glass-page">
      <h1 className="glass-title">New Report</h1>

      <form className="glass-form" onSubmit={handleSubmit}>
        <label>Category</label>
        <select
          className="glass-input"
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select...</option>
          <option value="Interior">Interior</option>
          <option value="Exterior">Exterior</option>
          <option value="Safety">Safety</option>
          <option value="Cleaning">Cleaning</option>
        </select>

        <label>Subcategory</label>
        <input
          className="glass-input"
          placeholder="Ex: Kitchen Window"
          onChange={(e) => setSubcategory(e.target.value)}
          required
        />

        <label>Notes</label>
        <textarea
          className="glass-textarea"
          rows={4}
          placeholder="Describe the issue..."
          onChange={(e) => setNotes(e.target.value)}
        />

        <label>Image</label>
        <input
          className="glass-input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="glass-button-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Report"}
        </button>
      </form>
    </div>
  );
}
