"use client";

import { useState } from "react";

export default function SeveritySelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const levels = [
    { id: 1, label: "Low", color: "var(--success)" },
    { id: 2, label: "Medium", color: "var(--warning)" },
    { id: 3, label: "High", color: "var(--danger)" },
  ];

  function handleSelect(level) {
    setSelected(level.id);
    onSelect(level);
  }

  return (
    <div className="vl-severity-selector fade-in">
      {levels.map((lvl) => (
        <button
          key={lvl.id}
          type="button"
          className={`vl-severity-btn ${selected === lvl.id ? "active" : ""}`}
          style={{ "--border-color": lvl.color }}
          onClick={() => handleSelect(lvl)}
        >
          {lvl.label}
        </button>
      ))}
    </div>
  );
}
