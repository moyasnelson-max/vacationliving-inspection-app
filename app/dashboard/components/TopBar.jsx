"use client";
import ThemeToggle from "./ThemeToggle";
export default function TopBar({ role }) {
  return (
    <header className="topbar">
      <span className="role">{role}</span>
      <ThemeToggle />
    </header>
  );
}
