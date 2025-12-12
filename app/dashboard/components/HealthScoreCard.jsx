"use client";

import { useEffect, useState } from "react";
import calculateHealthScore from "@lib/health-score";
import "@theme/health-score-card.css";

export default function HealthScoreCard() {
  const [score, setScore] = useState(null);

  useEffect(() => {
    async function loadScore() {
      try {
        const result = await calculateHealthScore();
        setScore(result);
      } catch (err) {
        console.error("Error loading health score:", err);
        setScore(0);
      }
    }
    loadScore();
  }, []);

  const percentage = score ? score / 100 : 0;

  return (
    <div className="vl-health-card fade-in">
      <h3 className="vl-health-title">Property Health Score</h3>

      <div className="vl-health-circle">
        <div
          className="vl-health-fill"
          style={{ "--p": `${percentage * 100}%` }}
        ></div>
        <span className="vl-health-value">
          {score === null ? "—" : `${score}/100`}
        </span>
      </div>

      <p className="vl-health-desc">Overall condition and inspection metrics</p>
    </div>
  );
}
