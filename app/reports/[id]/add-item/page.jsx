"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../../../lib/supabaseClient";

import GlassPage from "../../../components/GlassPage";
import GlassHeader from "../../../components/GlassHeader";
import GlassCard from "../../../components/GlassCard";

export default function AddItemPage() {
  const pathname = usePathname();
  const router = useRouter();
  const reportId = pathname.split("/")[2]; // /reports/[id]/add-item

  const [categories, setCategories] = useState([]);
  const [subcats, setSubcats] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [severity, setSeverity] = useState("low");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const [error, setError] = useState("");

  // LOAD CATEGORIES + SUBCATEGORIES
  const loadData = async () => {
    const { data: catData } = await supabase.from("categories").select("*");
    setCategories(catData || []);
  };

  const loadSubcategories = async (catId) => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", catId);

    setSubcats(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // IMAGE UPLOAD
  const uploadImage = async (file) => {
    if (!file) return null;

    const filename = `${reportId}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  // SAVE ITEM
  const saveItem = async () => {
    if (!categoryId || !subcategoryId) {
      setError("Please select a category and subcategory");
      return;
    }

    let imgUrl = null;
    if (image) imgUrl = await uploadImage(image);

    const { error } = await supabase.from("report_items").insert([
      {
        report_id: reportId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        severity,
        notes,
        image_url: imgUrl,
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/reports/${reportId}`);
  };

  return (
    <GlassPage>
      <GlassHeader title="Add Item" back />

      <GlassCard>
        {error && (
          <p style={{ color: "#B00020", marginBottom: 10 }}>{error}</p>
        )}

        {/* CATEGORY */}
        <label style={{ fontWeight: 600 }}>Category</label>
        <select
          style={inputStyle}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            loadSubcategories(e.target.value);
          }}
        >
          <option>Select...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <label style={{ marginTop: 18, fontWeight: 600 }}>Subcategory</label>
        <select
          style={inputStyle}
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
        >
          <option>Select...</option>
          {subcats.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* SEVERITY */}
        <label style={{ marginTop: 22, fontWeight: 600 }}>Severity</label>
        <div style={severityBox}>
          {["low", "medium", "high"].map((level) => (
            <button
              key={level}
              onClick={() => setSeverity(level)}
              style={{
                ...sevButton,
                background:
                  severity === level ? "#C8A36D" : "rgba(255,255,255,0.2)",
                color: severity === level ? "#fff" : "#444",
              }}
            >
              {level}
            </button>
          ))}
        </div>

        {/* NOTES */}
        <label style={{ marginTop: 22, fontWeight: 600 }}>Notes</label>
        <textarea
          style={textareaStyle}
          rows={4}
          placeholder="Enter notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* IMAGE */}
        <label style={{ marginTop: 22, fontWeight: 600 }}>Image</label>
        <input
          type="file"
          accept="image/*"
          style={inputStyle}
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* SAVE */}
        <button style={goldButton} onClick={saveItem}>
          Save Item
        </button>
      </GlassCard>
    </GlassPage>
  );
}

// ----------- STYLES -----------
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #D8D5CC",
  background: "#FAF9F7",
  fontSize: 15,
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #D8D5CC",
  background: "#FAF9F7",
  fontSize: 15,
};

const severityBox = {
  display: "flex",
  gap: 12,
  marginTop: 10,
};

const sevButton = {
  flex: 1,
  padding: "12px 0",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
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
};
