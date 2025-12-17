"use client";

import Link from "next/link";
import Image from "next/image";
import "@app/styles/lux-header.css";

export default function LuxHeader({ title = "Vacation Living", back }) {
  return (
    <header className="lux-header fade-in">
      {/* LOGO */}
      <div className="lux-header-left">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Vacation Living"
            width={145}
            height={45}
            className="lux-header-logo"
            priority
          />
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="lux-header-title">{title}</h1>

      {/* ACTIONS */}
      <div className="lux-header-actions">

        {/* BACK BUTTON */}
        {back && (
          <Link href={back} className="lux-header-back">
            ← Back
          </Link>
        )}

        {/* LANG SWITCH */}
        <button
          className="lux-header-btn"
          onClick={() => alert("Language switcher pending integration")}
        >
          EN / ES
        </button>
      </div>
    </header>
  );
}