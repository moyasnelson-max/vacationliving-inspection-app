"use client";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{ position: "fixed", bottom: 20, right: 20 }}
      >
        ��
      </button>
      {children}
    </>
  );
}
