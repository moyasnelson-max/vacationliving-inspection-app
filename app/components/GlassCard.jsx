"use client";

import "@theme/glass-card.css";

export default function GlassCard({ children, onClick }) {
  return (
    <div
      className={`vl-glass-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="vl-glass-inner">{children}</div>
    </div>
  );
}
