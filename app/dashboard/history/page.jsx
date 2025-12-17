import { supabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/getSession";

export default async function HistoryPage() {
  const supabase = supabaseServer();
  const session = await getSession();

  const { data: inspections, error } = await supabase
    .from("inspections")
    .select("id, house_name, closed_at, pdf_url")
    .eq("inspector_id", session.user.id)
    .eq("status", "closed")
    .order("closed_at", { ascending: false });

  if (error) {
    return <p>Error loading history</p>;
  }

  return (
    <div>
      <h1>Inspection History</h1>
      <ul>
        {inspections.map((i) => (
          <li key={i.id}>
            {i.house_name} —{" "}
            <a href={i.pdf_url} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
