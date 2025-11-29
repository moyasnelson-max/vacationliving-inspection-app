"use client";

import "../../../styles/luxury-inspection.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase-client";

export default function HouseDashboard() {
  const params = useParams();
  const houseId = params.houseId;

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHouse = async () => {
    const { data } = await supabase
      .from("houses")
      .select("*")
      .eq("id", houseId)
      .single();

    setHouse(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHouse();
  }, []);

  return (
    <div className="lux-container">
      <div className="lux-header">
        <h1 className="lux-title">{loading ? "Loading..." : house?.name}</h1>
        <p className="lux-subtitle">Inspection Dashboard</p>
      </div>

      <div className="lux-card">
        <h2 className="lux-section-title">Actions</h2>

        <button
          className="lux-btn"
          onClick={() => (window.location.href = `/inspection/${houseId}/components`)}
        >
          Start Inspection
        </button>

        <button
          className="lux-btn-outline"
          onClick={() => (window.location.href = `/reports?house=${houseId}`)}
        >
          View Reports
        </button>
      </div>
    </div>
  );
}
