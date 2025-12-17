"use client";

import { useTheme } from "@/app/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        transition: "all var(--transition)",
      }}
    >
      <span style={{ fontSize: "14px", opacity: 0.7 }}>
        {theme === "dark" ? "Dark" : "Light"}
      </span>
      <span style={{ fontSize: "18px" }}>
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
