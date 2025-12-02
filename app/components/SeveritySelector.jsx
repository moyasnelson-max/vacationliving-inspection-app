"use client";
"use client";
import { useState } from "react";

export default function SeveritySelector({ onSelect }) {
  const [level, setLevel] = useState(null);

  const levels = [
    { id: 1, label: "Low", color: "green" },
    { id: 2, label: "Medium", color: "orange" },
    { id: 3, label: "High", color: "red" }
  ];

  return (
    <div className="severity-selector">
      {levels.map(s => (
        <button
          key={s.id}
          className={`sev-btn ${level === s.id ? "active" : ""}`}
          style={{ borderColor: s.color }}
          onClick={() => {
            setLevel(s.id);
            onSelect(s.id);
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}