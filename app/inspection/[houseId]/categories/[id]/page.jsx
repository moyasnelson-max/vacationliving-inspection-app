"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-client";
import "../../../../styles/inspection-subcategories.css";

export default function SubcategoriesPage({ params }) {
  const router = useRouter();
  const { houseId, categoryId } = params;

  const [subcategories, setSubcategories] = useState([]);
  const [lang, setLang] = useState("es");

  useEffect(() => {
    async function loadSubcategories() {
      const { data, error } = await supabase
        .from("subcategories_v2")
        .select("*")
        .eq("category_id", categoryId)
        .order("id");

      if (!error) setSubcategories(data || []);
    }
    loadSubcategories();
  }, [categoryId]);

  const goToIssueForm = (subcategoryId) => {
    router.push(`/inspection/${houseId}/issue/${subcategoryId}`);
  };

  return (
    <div className="lux-container">
      <h1 className="lux-title">Selecciona una Subcategoría</h1>

      <div className="lux-list">
        {subcategories.length === 0 ? (
          <p className="lux-empty">No hay subcategorías registradas.</p>
        ) : (
          subcategories.map((sub) => (
            <div
              key={sub.id}
              className="lux-item"
              onClick={() => goToIssueForm(sub.id)}
            >
              <span>{lang === "es" ? sub.name_es : sub.name_en}</span>
              <i className="lux-arrow"></i>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
