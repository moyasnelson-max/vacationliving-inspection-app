"use client";

import { createContext, useContext, useState, useEffect } from "react";

/**
 * ThemeProvider Marriott v3.0
 * -------------------------------------------------------------
 * - Evita el flash inicial (Flicker-Free Startup)
 * - Persiste tema en localStorage con clave "vl-theme"
 * - Aplica clase <html class="light|dark"> automáticamente
 * - Limpio, robusto y escalable
 * - Compatible con ThemeSwitcher Marriott v2.0
 */

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  // 1) Cargar tema guardado sin flicker
  useEffect(() => {
    const saved = localStorage.getItem("vl-theme");
    const initial = saved || "Light";

    setTheme(initial);
    document.documentElement.classList.add(initial.toLowerCase());
  }, []);

  // 2) Función para alternar tema
  const toggleTheme = () => {
    if (!theme) return;

    const next = theme === "Light" ? "Dark" : "Light";

    // Quitar clase anterior
    document.documentElement.classList.remove(theme.toLowerCase());

    // Agregar clase nueva
    document.documentElement.classList.add(next.toLowerCase());

    // Guardar en React y en localStorage
    setTheme(next);
    localStorage.setItem("vl-theme", next);
  };

  // 3) Evitar parpadeo mientras el estado inicial no ha cargado
  if (!theme) {
    return (
      <div
        style={{
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
