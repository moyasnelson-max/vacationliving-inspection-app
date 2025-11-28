"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabase-client";
import Image from "next/image";

export default function InspectionDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
      setLoading(false);
    };
    load();
  }, []);

  const goToHouseList = () => {
    window.location.href = "/inspection/houselist";
  };

  const goToReports = () => {
    window.location.href = "/reports";
  };

  return (
    <div className="lux-wrapper">

      {/* LOGO — Four Seasons Style */}
      <div className="lux-logo">
        <Image
          src="/logo.png"
          alt="Vacation Living Logo"
          width={120}
          height={120}
          priority
        />
      </div>

      {/* TITLE */}
      <h1 className="lux-title">Inspection Dashboard</h1>
      <p className="lux-subtitle">
        Manage inspections, access houses, and generate new reports.
      </p>

      {/* CARD */}
      <div className="lux-card">
        {loading ? (
          <p className="lux-loading">Loading your session...</p>
        ) : session ? (
          <>
            <p className="lux-info">
              <strong>Email:</strong> {session.user.email}
            </p>
            <p className="lux-info">
              <strong>Status:</strong> Logged in ✓
            </p>
          </>
        ) : (
          <p className="lux-error">Session not found. Please login again.</p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="lux-button-group">
        <button className="lux-btn" onClick={goToHouseList}>
          Start Inspection
        </button>

        <button className="lux-btn" onClick={goToReports}>
          Go to Reports
        </button>
      </div>

    </div>
  );
}
