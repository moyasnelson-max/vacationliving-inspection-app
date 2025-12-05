"use client";
import Link from "next/link";
import "../styles/lux-header.css";

export default function LuxHeader({ title = "Vacation Living", back }) {
  return (
    <header className="lux-header">
      {back && (
        <Link href={back} className="lux-header-back">
          ← Back
        </Link>
      )}

      <h1 className="lux-header-title">{title}</h1>
    </header>
  );
}