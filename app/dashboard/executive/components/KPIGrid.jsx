"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import KPIStat from "./KPIStat";

export default function KPIGrid() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = supabaseBrowser();

      const [{ count: openIssues }, { count: inspections }, { count: closedIssues }] =
        await Promise.all([
          supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "open"),
          supabase.from("inspections").select("*", { count: "exact", head: true })
            .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
          supabase.from("issues").select("*", { count: "exact", head: true })
            .eq("status", "closed")
            .gte("updated_at", new Date(Date.now() - 7 * 86400000).toISOString()),
        ]);

      setStats({ openIssues, inspections, closedIssues });
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPIStat label="Open Issues" value={stats.openIssues} />
      <KPIStat label="Inspections (7 days)" value={stats.inspections} />
      <KPIStat label="Issues Closed (7 days)" value={stats.closedIssues} />
    </div>
  );
}
