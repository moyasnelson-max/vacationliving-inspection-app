"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@lib/supabaseClient";
import "@/app/theme/globals.css";

export default function InspectionDashboard() {
  const router = useRouter();

  // =========================
  // STATE
  // =========================
  const [session, setSession] = useState(null);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD SESSION
  // =========================
  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      console.log("DASHBOARD · SESSION RESULT:", { data, error });

      if (!data?.session) {
        router.push("/auth/login");
        return;
      }

      setSession(data.session);
    }

    loadSession();
  }, [router]);

  // =========================
  // LOAD HOUSES WHEN SESSION EXISTS
  // =========================
  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchHouses() {
      setLoading(true);
      const userId = session.user.id;

      console.log("DASHBOARD · FETCH HOUSES FOR USER:", userId);

      // 1. Asignaciones para este usuario
      const {
        data: assignments,
        error: assignErr,
      } = await supabase
        .from("inspector_houses")
        .select("property_slug")
        .eq("user_id", userId);

      console.log("DASHBOARD · ASSIGNMENTS RESULT:", {
        assignments,
        assignErr,
      });

      if (assignErr) {
        console.error("Error loading assignments:", assignErr);
        setHouses([]);
        setLoading(false);
        return;
      }

      if (!assignments || assignments.length === 0) {
        setHouses([]);
        setLoading(false);
        return;
      }

      const slugs = assignments.map((a) => a.property_slug);

      // 2. Detalles de casas desde property_recipients
      const {
        data: properties,
        error: propErr,
      } = await supabase
        .from("property_recipients")
        .select("property_slug, name")
        .in("property_slug", slugs);

      console.log("DASHBOARD · PROPERTIES RESULT:", {
        properties,
        propErr,
      });

      if (propErr) {
        console.error("Error loading house details:", propErr);
        setHouses([]);
        setLoading(false);
        return;
      }

      // 3. Deduplicar por slug (hay muchas filas por casa)
      const uniqueBySlug = Object.values(
        (properties || []).reduce((acc, item) => {
          if (!acc[item.property_slug]) {
            acc[item.property_slug] = item;
          }
          return acc;
        }, {})
      );

      console.log("DASHBOARD · UNIQUE HOUSES:", uniqueBySlug);

      setHouses(uniqueBySlug);
      setLoading(false);
    }

    fetchHouses();
  }, [session]);

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  // =========================
  // NAVIGATE TO HOUSE INSPECTION
  // =========================
  function goToHouse(slug) {
    router.push(`/inspection/${slug}`);
  }

  // =========================
  // RENDER
  // =========================
  return (
    <main className="vl-page">
      <section className="vl-section">
        <h1 className="vl-title">Inspection Center</h1>
        <p className="vl-subtitle">
          Manage inspections and house reports.
        </p>

        <div className="vl-grid">
          {/* SESSION CARD */}
          <div className="vl-card">
            <h2 className="vl-card-title">Your Session</h2>
            <p>
              <strong>Email:</strong>{" "}
              {session?.user?.email || "Loading..."}
            </p>
            <p>
              <strong>Status:</strong> {session ? "Logged in ✓" : "Loading..."}
            </p>
            <button
              type="button"
              className="vl-btn vl-btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* PROPERTIES CARD */}
          <div className="vl-card">
            <h2 className="vl-card-title">Your Properties</h2>
            <p className="vl-card-subtitle">
              Choose a property to start a new inspection or review reports.
            </p>

            {loading ? (
              <p>Loading properties...</p>
            ) : houses.length === 0 ? (
              <p>No properties assigned to your user yet.</p>
            ) : (
              <div className="vl-house-grid">
                {houses.map((house) => (
                  <div
                    key={house.property_slug}
                    className="vl-house-card"
                  >
                    <h3>{house.name || house.property_slug}</h3>
                    <p className="vl-house-slug">{house.property_slug}</p>
                    <button
                      type="button"
                      className="vl-btn vl-btn-primary"
                      onClick={() => goToHouse(house.property_slug)}
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}