"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

import GlassPage from "../../components/GlassPage";
import GlassHeader from "../../components/GlassHeader";
import GlassCard from "../../components/GlassCard";

export default function NewReportPage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const [reportId, setReportId] = useState(null);
  const [error, setError] = useState("");

  //------------------------------------------------------
  // 1 — CREATE REPORT
  //------------------------------------------------------
  const createMainReport = async () => {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open" }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    setReportId(data.id);
    return data.id;
  };

  //------------------------------------------------------
  // 2 — IMAGE UPLOAD
  //------------------------------------------------------
  const uploadImage = async (file, id) => {
    if (!file) return null;

    const filename = `${id}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  //------------------------------------------------------
  // 3 — FINAL SUBMIT
  //------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const id = reportId || (await createMainReport());
      const imageUrl = await uploadImage(image, id);

      const { error: updateError } = await supabase
        .from("reports")
        .update({
          category,
          subcategory,
          notes,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      router.push(`/reports/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  //------------------------------------------------------
  // UI — GLASS PREMIUM
  //------------------------------------------------------

  return (
    <GlassPage>
      <GlassHeader title="New Report" back />

      <GlassCard>
        {error && (
          <p style={{ color: "#B00020", marginBottom: 12 }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* CATEGORY */}
          <label style={label}>Category</label>
          <select
            style={input}
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
          <label style={label}>Subcategory</label>
          <input
            type="text"
            placeholder="Describe subcategory"
            style={input}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          />

          {/* NOTES */}
          <label style={label}>Notes</label>
          <textarea
            placeholder="Add detailed notes..."
            style={textarea}
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* IMAGE */}
          <label style={label}>Image</label>
          <input
            type="file"
            accept="image/*"
            style={input}
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* SUBMIT */}
          <button type="submit" style={goldButton}>
            Save Report
          </button>
        </form>
      </GlassCard>
    </GlassPage>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const label = {
  fontSize: 15,
  fontWeight: 600,
  marginTop: 18,
  marginBottom: 6,
  color: "#3A3A3A",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #D8D5CC",
  background: "#FAF9F7",
  fontSize: 15,
  outline: "none",
};

const textarea = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #D8D5CC",
  background: "#FAF9F7",
  fontSize: 15,
  outline: "none",
  resize: "none",
};

const goldButton = {
  marginTop: 26,
  width: "100%",
  padding: "14px",
  borderRadius: 12,
  background: "linear-gradient(135deg,#C8A36D,#b48a54)",
  color: "#fff",
  border: "none",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};
