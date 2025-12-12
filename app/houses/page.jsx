"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LuxHeader from "@/components/LuxHeader";

export default function HousesPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouses() {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        setHouses([]);
        setLoading(false);
        return;
      }

      // Obtener casas asignadas al usuario
      const { data, error } = await supabase
        .from("inspector_houses")
        .select("property_slug")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading houses:", error);
        setHouses([]);
      } else {
        setHouses(data);
      }

      setLoading(false);
    }

    fetchHouses();
  }, []);

  return (
    <>
      <LuxHeader title="Select a Property" back="/dashboard" />

      <section className="vl-page fade-in">
        <h2 className="vl-section-title">Select a Property</h2>
        <p className="vl-section-subtitle">
          Selecciona la casa que deseas inspeccionar.
        </p>

        {loading ? (
          <p className="vl-loading">Loading...</p>
        ) : houses.length === 0 ? (
          <p>No houses found.</p>
        ) : (
          <div className="vl-house-grid">
            {houses.map((row) => (
              <div key={row.property_slug} className="vl-house-card">
                <h3>{row.property_slug.replace("_", " ").toUpperCase()}</h3>

                <a
                  href={`/inspection/${row.property_slug}`}
                  className="vl-btn-primary"
                >
                  Inspect
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}