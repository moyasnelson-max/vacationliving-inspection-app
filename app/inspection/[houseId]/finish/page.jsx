"use client";

import { useRouter } from "next/navigation";

export default function FinishInspection({ params }) {
  const router = useRouter();
  const { houseId } = params;

  return (
    <div style={{ padding: 20 }}>
      <h2>Finish Inspection</h2>

      <button
        onClick={() => router.push(`/inspection/${houseId}/submit`)}
        style={{
          marginTop: 20,
          background: "#C8A36D",
          padding: 12,
          borderRadius: 6,
          color: "#fff",
        }}
      >
        Continue
      </button>
    </div>
  );
}
