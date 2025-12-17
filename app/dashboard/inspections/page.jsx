import { supabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/getSession";

export default async function InspectionsPage() {
  const supabase = supabaseServer();
  const session = await getSession();

  const { data: inspections, error } = await supabase
    .from("inspections")
    .select("id, house_name, status, created_at")
    .eq("inspector_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Error loading inspections</p>;
  }

  return (
    <div>
      <h1>Inspections</h1>
      <ul>
        {inspections.map((i) => (
          <li key={i.id}>
            <strong>{i.house_name}</strong> — {i.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
