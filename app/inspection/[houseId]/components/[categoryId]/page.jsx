"use client";

import "../../../styles/luxury-inspection.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase-client";

export default function CategoryItems() {
  const params = useParams();
  const houseId = params.houseId;
  const categoryId = params.categoryId;

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    const { data: it } = await supabase
      .from("items")
      .select("*")
      .eq("category_id", categoryId);

    setCategory(cat);
    setItems(it);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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
            <div className="lux-list-item" key={item.id}>
              <span className="lux-item-name">{item.name}</span>
              <span className="lux-arrow">✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
