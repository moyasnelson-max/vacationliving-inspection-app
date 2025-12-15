"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import "@/styles/luxury-inspection.css";

export default function InspectionHubPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("INSPECTION / SESSION ERROR:", error);
        }
        setSession(data?.session || null);
      } catch (err) {
        console.error("INSPECTION / UNEXPECTED ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Si no hay sesión → mandar a login
  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [loading, session, router]);

  // Nombre a mostrar
  const fullName = session?.user?.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0] || "";
  const displayName = firstName || session?.user?.email || "";

  // Navegación
  const goToHouseList = () => {
    router.push("/inspection/houselist");
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const goToReports = () => {
    router.push("/reports");
  };

  return (
    <main className="lux-inspection-shell">
      {/* HEADER BRAND + USER */}
      <header className="lux-inspection-header">
        <div className="lux-inspection-brand">
          {/* Logo oficial */}
          <div className="lux-inspection-logo">
            <Image
              src="/logo.png"
              alt="Vacation Living logo"
              width={150}
              height={40}
              priority
            />
          </div>
          <div className="lux-inspection-tagline">
            <span className="lux-tag-main">Inspection &amp; Operations Suite</span>
            <span className="lux-tag-sub">
              Precision inspections for luxury stays. Built for speed and clarity.
            </span>
          </div>
        </div>

        {session && (
          <div className="lux-inspection-user">
            <span className="lux-inspection-greeting">
              Welcome back, {displayName}.
            </span>
            <span className="lux-inspection-role">Inspector workspace · Internal use only</span>
          </div>
        )}
      </header>

      {/* MAIN GRID */}
      <div className="lux-inspection-grid">
        {/* LEFT – STORY + CTA PRINCIPAL */}
        <section className="lux-inspection-left">
          <p className="lux-kicker">INSPECTOR WORKSPACE</p>
          <h1 className="lux-title">Inspection Center</h1>

          <p className="lux-paragraph">
            Use this workspace to start new inspections, capture photos and notes,
            and keep every Vacation Living property guest-ready before each stay.
          </p>

          <div className="lux-highlight-card">
            <h2 className="lux-highlight-title">Today&apos;s focus</h2>
            <ul className="lux-highlight-list">
              <li>Start an inspection for any assigned property.</li>
              <li>Walk the house with your checklist and take clear photos.</li>
              <li>Send an instant report so the operations team can act quickly.</li>
            </ul>

            <div className="lux-button-row">
              <button
                type="button"
                className="lux-btn-primary"
                onClick={goToHouseList}
              >
                Start inspection
              </button>
              <button
                type="button"
                className="lux-btn-secondary"
                onClick={goToDashboard}
              >
                Open inspector dashboard
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT – SESSION + QUICK ACTIONS */}
        <section className="lux-inspection-right">
          {/* SESSION CARD */}
          <div className="lux-card lux-card-session">
            <h2 className="lux-card-title">Your session</h2>
            {loading && <p className="lux-loading-text">Loading your session…</p>}

            {!loading && session && (
              <>
                <div className="lux-session-row">
                  <span className="lux-session-label">Account</span>
                  <span className="lux-session-value">{session.user.email}</span>
                </div>
                <div className="lux-session-row">
                  <span className="lux-session-label">Status</span>
                  <span className="lux-pill-online">Logged in</span>
                </div>
              </>
            )}

            {!loading && !session && (
              <p className="lux-error-text">
                Session not found. Redirecting you to login…
              </p>
            )}
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="lux-card lux-card-quick">
            <h2 className="lux-card-title">Quick actions</h2>
            <div className="lux-quick-list">
              <div className="lux-quick-item">
                <div className="lux-quick-text">
                  <span className="lux-quick-title">Start inspection</span>
                  <span className="lux-quick-desc">
                    Choose a property and begin a full inspection with photos.
                  </span>
                </div>
                <button
                  type="button"
                  className="lux-quick-link"
                  onClick={goToHouseList}
                >
                  Open →
                </button>
              </div>

              <div className="lux-quick-item">
                <div className="lux-quick-text">
                  <span className="lux-quick-title">Inspector dashboard</span>
                  <span className="lux-quick-desc">
                    See your assigned properties and inspection history.
                  </span>
                </div>
                <button
                  type="button"
                  className="lux-quick-link"
                  onClick={goToDashboard}
                >
                  Open →
                </button>
              </div>

              <div className="lux-quick-item">
                <div className="lux-quick-text">
                  <span className="lux-quick-title">Reports &amp; PDFs</span>
                  <span className="lux-quick-desc">
                    View generated inspection reports and download PDFs.
                  </span>
                </div>
                <button
                  type="button"
                  className="lux-quick-link"
                  onClick={goToReports}
                >
                  View →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}