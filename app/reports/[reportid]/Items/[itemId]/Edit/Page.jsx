"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../../../../lib/supabaseClient";
import "../../../../../glass.css";

export default function EditItem() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/");
  const reportId = segments[2];
  const itemId = segments[4];

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD ITEM
  const loadItem = async () => {
    const { data } = await supabase
      .from("report_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (data) {
      setCategory(data.category);
      setSubcategory(data.subcategory);
      setNotes(data.notes);
      setCurrentImage(data.image_url);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadItem();
  }, []);

  // SAVE CHANGES
  const updateItem = async () => {
    setLoading(true);

    let imageUrl = currentImage;

    if (image) {
      const filename = `${reportId}_${itemId}_${Date.now()}.jpg`;

      await supabase.storage.from("reports").upload(filename, image);

      const { data } = supabase.storage
        .from("reports")
        .getPublicUrl(filename);

      imageUrl = data.publicUrl;
    }

    await supabase
      .from("report_items")
      .update({
        category,
        subcategory,
        notes,
        image_url: imageUrl,
      })
      .eq("id", itemId);

    router.push(`/reports/${reportId}`);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="glass-page">
      <h1 className="glass-title">Edit Item</h1>

      <input
        className="glass-input"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        className="glass-input"
        placeholder="Subcategory"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
      />

      <textarea
        className="glass-textarea"
        placeholder="Notes"
        value={notes}
        rows={4}
        onChange={(e) => setNotes(e.target.value)}
      />

      {currentImage && (
        <img
          src={currentImage}
          className="glass-img"
          style={{ marginBottom: 12 }}
        />
      )}

      <input
        type="file"
        className="glass-input"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="glass-button" onClick={updateItem}>
        Save Changes
      </button>
    </div>
  );
}
