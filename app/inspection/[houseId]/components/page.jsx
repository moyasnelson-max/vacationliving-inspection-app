"use client";

import "../../../../styles/luxury-inspection.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase-client";

export default function CategoriesPage() {
  const params = useParams();
  const houseId = params.houseId;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="lux-container">
      <div className="lux-header">
        <h1 className="lux-title">Inspection Categories</h1>
        <p className="lux-subtitle">Choose a section</p>
      </div>

      {loading && <p className="lux-loading">Loading...</p>}

      {!loading && (
        <div className="lux-list">
          {categories.map((cat) => (
            <div
              className="lux-list-item"
              key={cat.id}
              onClick={() =>
                (window.location.href = `/inspection/${houseId}/components/${cat.id}`)
              }
            >
              <span className="lux-item-name">{cat.name}</span>
              <span className="lux-arrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
