"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LuxHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lux-header">
      <div className="lux-header-inner">

        {/* LOGO */}
        <Link href="/dashboard" className="lux-logo-wrapper">
          <Image
            src="/logo.png"
            alt="Vacation Living"
            width={120}
            height={40}
            className="lux-logo"
          />
        </Link>

        {/* MENU BUTTON (Mobile) */}
        <button
          className="lux-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* NAVIGATION */}
        <nav className={`lux-nav ${menuOpen ? "open" : ""}`}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/houses">Houses</Link>

          {/* LOGOUT */}
          <Link href="/auth/logout" className="lux-logout-btn">
            Logout
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .lux-header {
          width: 100%;
          padding: 12px 22px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .lux-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }

        .lux-logo-wrapper {
          display: flex;
          align-items: center;
        }

        .lux-logo {
          object-fit: contain;
        }

        .lux-nav {
          display: flex;
          gap: 26px;
          align-items: center;
        }

        .lux-nav a {
          text-decoration: none;
          font-weight: 500;
          color: #1f1f1f;
        }

        .lux-logout-btn {
          padding: 8px 14px;
          border-radius: 10px;
          background: #000;
          color: white !important;
          text-decoration: none;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .lux-nav {
            position: absolute;
            top: 70px;
            right: 20px;
            background: white;
            padding: 14px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            flex-direction: column;
            gap: 14px;
            display: none;
          }

          .lux-nav.open {
            display: flex;
          }

          .lux-menu-btn {
            display: block;
            font-size: 26px;
            background: none;
            border: none;
          }
        }

        /* Desktop hides mobile button */
        .lux-menu-btn {
          display: none;
        }
      `}</style>
    </header>
  );
}nano
