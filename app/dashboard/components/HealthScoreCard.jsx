"use client";
"use client";

import { useEffect, useState } from "react";
import { calculateHealthScore } from "@/lib/health-score.js";

export default function HealthScoreCard() {
  const [score, setScore] = useState(null);

  useEffect(() => {
    async function loadScore() {
      const result = await calculateHealthScore();
      setScore(result);
    }
    loadScore();
  }, []);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>Property Health Score</h3>
      <p style={{ fontSize: 36, marginTop: 10 }}>
        {score === null ? "…" : `${score}/100`}
      </p>
    </div>
  );
}
