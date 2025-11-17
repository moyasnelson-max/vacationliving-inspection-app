"use client";

import { useEffect, useState } from "react";
import supabase from "../../../../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditItemPage({ params }) {
  const router = useRouter();
  const { id, itemId } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("open");
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");

  async function loadItem() {
    const { data } = await supabase
      .from("report_items")
      .select("*")
      .eq("id", itemId)
      .single();

    setCategory(data.category);
    setSubcategory(data.subcategory);
    setNotes(data.notes || "");
    setStatus(data.status);
    setPhotoUrl(data.photo_url || "");

    setLoading(false);
  }

  useEffect(() => {
    loadItem();
  }, []);

  async function uploadNewPhoto() {
    if (!photo) return photoUrl;

    const filename = `${itemId}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, photo);

    if (uploadError) return photoUrl;

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  }

  async function save() {
    setSaving(true);

    const finalPhoto = await uploadNewPhoto();

    await supabase
      .from("report_items")
      .update({
        category,
        subcategory,
        notes,
        status,
        photo_url: finalPhoto,
      })
      .eq("id", itemId);

    setSaving(false);
    router.push(`/reports/${id}`);
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 22, fontFamily: "Inter" }}>
      <h1 style={{ fontSize: 26, fontWeight: 600 }}>Edit Item</h1>

      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
          padding: 20,
          borderRadius: 16,
          border: "1px solid #EEE8DD",
          marginTop: 20,
        }}
      >
        <label>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
          }}
        />

        <label>Subcategory</label>
        <input
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
          }}
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
          }}
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
            marginBottom: 12,
          }}
        >
          <option value="open">Open</option>
          <option value="ok">OK</option>
          <option value="issue">Issue</option>
          <option value="urgent">Urgent</option>
        </select>

        {photoUrl && (
          <img
            src={photoUrl}
            style={{ width: "100%", borderRadius: 12, marginTop: 10 }}
          />
        )}

        <label>Replace Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button
          onClick={save}
          disabled={saving}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 22,
            borderRadius: 12,
            background: "linear-gradient(135deg,#C8A36D,#B48A54)",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Item"}
        </button>
      </div>
    </div>
  );
}
