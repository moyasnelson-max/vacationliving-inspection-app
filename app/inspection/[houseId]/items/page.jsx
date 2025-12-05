"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@lib/supabase-browser";
import "@styles/luxury-inspection.css";

import Spinner from "@components/Spinner.jsx";

export default function ItemsPage() {
  const router = useRouter();
  const { houseId } = useParams();
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [subcategory, setSubcategory] = useState(null);

  // ===========================================
  // Cargar items y subcategoría
  // ===========================================
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: subcat } = await supabase
        .from("subcategories")
        .select("*")
        .eq("id", houseId)
        .single();

      setSubcategory(subcat);

      const { data: itemsData } = await supabase
        .from("items")
        .select("*")
        .eq("subcategory_id", subcat?.id);

      setItems(itemsData || []);
      setLoading(false);
    }

    loadData();
  }, [houseId]);

  function handleSelect(itemId) {
    router.push(`/inspection/${houseId}/issue?item=${itemId}`);
  }

  if (loading) return <Spinner />;

  return (
    <div className="luxury-container fade-in">
      <h1 className="luxury-title">Select an Item</h1>

      {subcategory && (
        <p className="luxury-subtitle">
          {subcategory.name}
        </p>
      )}

      <div className="luxury-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="luxury-card"
            onClick={() => handleSelect(item.id)}
          >
            <Image
              src={item.icon_url || "/icon.png"}
              alt={item.name}
              width={70}
              height={70}
            />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
