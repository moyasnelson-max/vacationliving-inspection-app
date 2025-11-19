"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import GlassPage from "../../components/GlassPage";
import GlassHeader from "../../components/GlassHeader";
import GlassCard from "../../components/GlassCard";

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function NewReportPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // LOAD CATEGORIES
  // --------------------------------------------------
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      setCategories(data || []);
    }
    load();
  }, []);

  // LOAD SUBCATS WHEN CATEGORY SELECTED
  const loadSub = async (id) => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", id)
      .order("name");

    setSubcategories(data || []);
  };

  // --------------------------------------------------
  // UPLOAD IMAGE
  // --------------------------------------------------
  const uploadImage = async (file, reportId) => {
    if (!file) return null;

    const filename = `report_${reportId}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (error) return null;

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return urlData?.publicUrl || null;
  };

  // --------------------------------------------------
  // SUBMIT REPORT
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) CREATE MAIN REPORT
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .insert([{ status: "open" }])
        .select()
        .single();

      if (reportError) throw reportError;

      const reportId = report.id;

      // 2) SAVE IMAGE IF EXISTS
      const imageUrl = await uploadImage(image, reportId);

      // 3) UPDATE MAIN REPORT WITH FIELDS
      const { error: updateError } = await supabase
        .from("reports")
        .update({
          category_id: categoryId,
          subcategory_id: subcategoryId,
          notes,
          image_url: imageUrl,
        })
        .eq("id", reportId);

      if (updateError) throw updateError;

      router.push(`/reports/${reportId}`);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <GlassPage>
      <GlassHeader title="New Report" back />

      <GlassCard>
        <form onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <label style={label}>Category</label>
          <select
            style={input}
            value={categoryId}
            required
            onChange={(e) => {
              setCategoryId(e.target.value);
              loadSub(e.target.value);
            }}
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* SUBCATEGORY */}
          <label style={label}>Subcategory</label>
          <select
            style={input}
            value={subcategoryId}
            required
            onChange={(e) => setSubcategoryId(e.target.value)}
          >
            <option value="">Select...</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* NOTES */}
          <label style={label}>Notes</label>
          <textarea
            rows={4}
            style={textarea}
            placeholder="Describe the issue..."
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
          <button style={goldBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Report"}
          </button>
        </form>
      </GlassCard>
    </GlassPage>
  );
}

// --------------------------------------------------
// GLASS ELEMENT STYLES
// --------------------------------------------------

const label = {
  fontSize: 14,
  fontWeight: 500,
  marginTop: 12,
  marginBottom: 6,
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(6px)",
  fontSize: 15,
};

const textarea = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(6px)",
  resize: "none",
  fontSize: 15,
};

const goldBtn = {
  width: "100%",
  marginTop: 20,
  padding: "14px 18px",
  borderRadius: 14,
  background: "linear-gradient(135deg,#C8A36D,#b8915e)",
  boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
  border: "none",
  color: "#fff",
  fontSize: 17,
  fontWeight: 600,
  cursor: "pointer",
};
