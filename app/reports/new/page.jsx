"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

// GLASS COMPONENTS
import GlassPage from "../../components/GlassPage";
import GlassHeader from "../../components/GlassHeader";
import GlassCard from "../../components/GlassCard";
import FloatingButton from "../../components/FloatingButton";

export default function NewReportPage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [reportId, setReportId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create Report
  const createMainReportIfNeeded = async () => {
    if (reportId) return reportId;

    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open" }])
      .select()
      .single();

    if (error) throw error;

    setReportId(data.id);
    return data.id;
  };

  // Upload Photo
  const uploadImage = async (file, id) => {
    if (!file) return null;

    const filename = `${id}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (error) return null;

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const id = await createMainReportIfNeeded();
      const imageUrl = await uploadImage(image, id);

      const { error } = await supabase
        .from("reports")
        .update({
          category,
          subcategory,
          notes,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      router.push("/reports");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <GlassPage>
      <GlassHeader title="New Report" back />

      <GlassCard>
        {error && (
          <p style={{ color: "#b00020", fontWeight: 600, marginBottom: 10 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <label className="vl-label">Category</label>
          <select
            className="vl-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
            <option value="Safety">Safety</option>
            <option value="Cleaning">Cleaning</option>
          </select>

          {/* SUBCATEGORY */}
          <label className="vl-label">Subcategory</label>
          <input
            type="text"
            className="vl-input"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="Describe subcategory"
            required
          />

          {/* NOTES */}
          <label className="vl-label">Notes</label>
          <textarea
            className="vl-textarea"
            value={notes}
            rows={4}
            placeholder="Add detailed notes..."
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* IMAGE */}
          <label className="vl-label">Image</label>
          <input
            type="file"
            accept="image/*"
            className="vl-input"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="vl-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
        </form>
      </GlassCard>

      <FloatingButton
        onClick={async () => {
          const id = await createMainReportIfNeeded();
          setReportId(id);
          router.push(`/reports/${id}`);
        }}
      />
    </GlassPage>
  );
}
