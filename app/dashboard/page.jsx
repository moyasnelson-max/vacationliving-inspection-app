import { supabase } from "@/lib/supabase-client";
import HouseCard from "./components/HouseCard";
import ReportCard from "./components/ReportCard";
import IssueCard from "./components/IssueCard";
import HealthScoreCard from "./components/HealthScoreCard";

export const revalidate = 0;

async function getData() {
  const { data: houses } = await supabase.from("houses").select("*");
  const { data: reports } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
  const { data: issues } = await supabase.from("issues").select("*").order("created_at", { ascending: false });

  return { houses, reports, issues };
}

export default async function DashboardPage() {
  const { houses, reports, issues } = await getData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <h2>Properties</h2>
      <div className="grid">
        {houses?.map((h) => (
          <HouseCard key={h.id} data={h} />
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Latest Reports</h2>
      <div className="grid">
        {reports?.map((r) => (
          <ReportCard key={r.id} data={r} />
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Open Issues</h2>
      <div className="grid">
        {issues?.map((i) => (
          <IssueCard key={i.id} data={i} />
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Health Score</h2>
      <HealthScoreCard />
    </div>
  );
}
