"use client";

import { useRouter } from "next/navigation";

export default function HouseInspectionHome({ params }) {
  const router = useRouter();
  const { houseId } = params;

  return (
    <div>
      <h2>Inspection — House {houseId}</h2>

      <button
        onClick={() => router.push(`/inspection/${houseId}/categories`)}
        style={{
          padding: 12,
          marginTop: 20,
          borderRadius: 6,
          background: "#C8A36D",
          color: "#fff",
        }}
      >
        Start Inspection
      </button>
    </div>
  );
}
