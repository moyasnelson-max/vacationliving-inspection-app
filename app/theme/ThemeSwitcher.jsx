"use client";

import { useTheme } from "./ThemeProvider";
import { useState } from "react";

/**
 * ThemeSwitcher (Marriott Level)
 * ----------------------------------------
 * - Botón elegante con animación suave
 * - Cambia entre Light/Dark sin flicker
 * - Colores premium (#C8A36D Gold / #1A1A1A Black)
 * - Iconografía limpia y transiciones fluidas
 */

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [pressed, setPressed] = useState(false);

  const isLight = theme === "Light";

  return (
    <button
      onClick={() => {
        setPressed(true);
        toggleTheme();
        setTimeout(() => setPressed(false), 180);
      }}
      style={{
        background: isLight ? "#C8A36D" : "#1A1A1A",
        color: isLight ? "#1A1A1A" : "white",
        borderRadius: "50px",
        padding: "10px 18px",
        fontSize: "15px",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: pressed
          ? "0 0 0 rgba(0,0,0,0.0)"
          : "0 4px 12px rgba(0,0,0,0.15)",
        transform: pressed ? "scale(0.94)" : "scale(1)",
      }}
    >
      {isLight ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
