"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function AddItem() {
  const router = useRouter();
  const pathname = usePathname();
  const reportId = pathname.split("/")[2];

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const saveItem = async () => {
    let imageUrl = null;

    if (image) {
      const filename = `${reportId}_${Date.now()}.jpg`;
      await supabase.storage.from("reports").upload(filename, image);
      const { data } = supabase.storage
        .from("reports")
        .getPublicUrl(filename);
      imageUrl = data.publicUrl;
    }

    await supabase.from("items").insert({
      report_id: reportId,
      category,
      subcategory,
      notes,
      image_url: imageUrl,
    });

    router.push(`/reports/${reportId}`);
  };

  return (
    <div className="glass-page">
      <h2 className="glass-title">Add Item</h2>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="glass-input"
      />

      <input
        type="text"
        placeholder="Subcategory"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        className="glass-input"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="glass-input"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="glass-input"
      />

      <button onClick={saveItem} className="glass-button">
        Save Item
      </button>
    </div>
  );
}
