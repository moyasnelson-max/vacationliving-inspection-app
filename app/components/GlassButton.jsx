"use client";

import "@theme/glass-button.css";

export default function GlassButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`vl-glass-btn ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="vl-glass-label">{children}</span>
    </button>
  );
}
