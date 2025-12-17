import { supabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/getSession";

export default async function IssuesPage() {
  const supabase = supabaseServer();
  const session = await getSession();

  const { data: issues, error } = await supabase
    .from("issues")
    .select("id, title, status, house_name, created_at")
    .eq("inspector_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Error loading issues</p>;
  }

  return (
    <div>
      <h1>Issues</h1>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <strong>{issue.title}</strong> — {issue.house_name} ({issue.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
