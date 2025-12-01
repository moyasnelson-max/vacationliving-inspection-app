"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "#C8A36D",
        color: "white",
        borderRadius: "6px",
        padding: "8px 14px",
        fontSize: "14px",
        marginLeft: "12px",
      }}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
