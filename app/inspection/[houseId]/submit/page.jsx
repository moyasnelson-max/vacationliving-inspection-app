"use client";

import { useRouter } from "next/navigation";

export default function SubmitInspection({ params }) {
  const { houseId } = params;
  const router = useRouter();

  const submit = async () => {
    router.push(`/inspection/${houseId}/submit/success`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Submit Inspection</h2>
      <p>Review is complete. Submit the final report.</p>

      <button
        onClick={submit}
        style={{
          marginTop: 20,
          background: "#C8A36D",
          padding: 12,
          borderRadius: 6,
          color: "#fff",
        }}
      >
        Submit
      </button>
    </div>
  );
}
