"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <button className="theme-toggle" onClick={()=>setTheme(t=>t==="light"?"dark":"light")}>{theme==="light"?"🌙":"☀️"}</button>;
}
