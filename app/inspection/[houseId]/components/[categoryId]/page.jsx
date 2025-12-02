"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase-browser.js";     // ← ya correcto

export default function CategoryItems() {
  const params = useParams();
  const houseId = params.houseId;
  const categoryId = params.categoryId;

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // Load category + items
  // ============================================
  const loadData = async () => {
    setLoading(true);

    // Load category info
    const { data: cat, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (!catErr) setCategory(cat);

    // Load items belonging to category
    const { data: itemsData, error: itemsErr } = await supabase
      .from("items")
      .select("*")
      .eq("category_id", categoryId);

    if (!itemsErr) setItems(itemsData);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [categoryId]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="lux-container">
      <div className="lux-header">
        <h1 className="lux-title">{category?.name}</h1>
        <p className="lux-subtitle">Checklist</p>
      </div>

      {loading && <p className="lux-loading">Loading...</p>}

      {!loading && (
        <div className="lux-list">
          {items.map((item) => (
            <div
              key={item.id}
              className="lux-list-item"
            >
              <span className="lux-item-name">{item.name}</span>
              <span className="lux-arrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}