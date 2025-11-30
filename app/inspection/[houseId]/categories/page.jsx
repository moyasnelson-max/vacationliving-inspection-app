import "../../../../styles/luxury-inspection.css";
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../../lib/supabase-client";
import "../../../../styles/inspection-categories.css";

export default function CategoriesPage({ params }) {
  const router = useRouter();
  const { houseId } = params;

  const [categories, setCategories] = useState([]);
  const [lang, setLang] = useState("es");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories_v2")
        .select("*")
        .order("id");

      if (!error) setCategories(data);
    }
    loadCategories();
  }, []);

  const goToSubcategories = (categoryId) => {
    router.push(`/inspection/${houseId}/categories/${categoryId}`);
  };

  return (
    <div className="lux-container">
      <h1 className="lux-title">Selecciona una Categoría</h1>

      <div className="lux-list">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="lux-item"
            onClick={() => goToSubcategories(cat.id)}
          >
            <span>{lang === "es" ? cat.name_es : cat.name_en}</span>
            <i className="lux-arrow"></i>
          </div>
        ))}
      </div>
    </div>
  );
}
