"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "../../../../lib/supabase-client";
import "../../../../styles/glass.css";

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

    router.back();
  };

  return (
    <div className="glass-card">
      <h2 className="glass-card-title">Add Item</h2>

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
        className="glass-input"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button className="glass-button" onClick={saveItem}>
        Save Item
      </button>
    </div>
  );
}
