"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@lib/supabaseClient";

export default function HouseSelector() {
  const [houses, setHouses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadHouses() {
      const { data, error } = await supabase.from("houses").select("*");

      if (error) {
        console.error("Error loading houses:", error);
        return;
      }

      setHouses(data || []);
    }

    loadHouses();
  }, []);

  function handleSelect(id) {
    router.push(`/houses/${id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Select a House</h2>

      {houses.length === 0 ? (
        <p>No houses found.</p>
      ) : (
        <ul>
          {houses.map((h) => (
            <li
              key={h.id}
              onClick={() => handleSelect(h.id)}
              style={{
                cursor: "pointer",
                marginBottom: 10,
                padding: 8,
                background: "#f0f0f0",
                borderRadius: 6,
              }}
            >
              {h.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
