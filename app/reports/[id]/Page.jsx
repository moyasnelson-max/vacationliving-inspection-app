"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

// GLASS COMPONENTS
import GlassPage from "../../components/GlassPage";
import GlassHeader from "../../components/GlassHeader";
import GlassCard from "../../components/GlassCard";
import FloatingButton from "../../components/FloatingButton";

export default function ReportView() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("report_items")
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq("report_id", id)
      .order("id", { ascending: false });

    setReport(reportData);
    setItems(itemData || []);
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <GlassPage>
      <GlassHeader title="Inspection Report" back />

      {/* MAIN REPORT INFO */}
      {report && (
        <GlassCard>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Report #{report.id}
          </h2>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            Status: <strong>{report.status}</strong>
          </p>
        </GlassCard>
      )}

      {/* ITEMS */}
      {items.map((item) => (
        <GlassCard key={item.id}>
          <h3 style={{ margin: 0 }}>
            {item.categories?.name} → {item.subcategories?.name}
          </h3>

          {item.severity && (
            <p style={{ marginTop: 4 }}>
              <strong>Severity:</strong> {item.severity}
            </p>
          )}

          {item.notes && (
            <p style={{ marginTop: 8, lineHeight: "1.45" }}>
              {item.notes}
            </p>
          )}

          {item.image_url && (
            <img
              src={item.image_url}
              alt="inspection"
              style={{
                width: "100%",
                borderRadius: 14,
                marginTop: 12,
                objectFit: "cover",
              }}
            />
          )}
        </GlassCard>
      ))}

      {/* FLOATING BUTTON */}
      <FloatingButton
        onClick={() => router.push(`/reports/${id}/add-item`)}
      />
    </GlassPage>
  );
}
