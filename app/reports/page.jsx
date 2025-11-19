import GlassPage from "../components/GlassPage";
import GlassCard from "../components/GlassCard";

async function getReports() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <GlassPage title="Inspection Reports">
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        reports.map((report) => (
          <GlassCard key={report.id} report={report} />
        ))
      )}
    </GlassPage>
  );
}
