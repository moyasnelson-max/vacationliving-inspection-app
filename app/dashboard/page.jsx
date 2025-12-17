import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardUI from "./components/DashboardUI";

export default async function DashboardPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies }
  );

  const { data: inspections } = await supabase
    .from("inspections")
    .select("id", { count: "exact" });

  const { data: issues } = await supabase
    .from("issues")
    .select("id", { count: "exact" });

  return (
    <DashboardUI
      stats={{
        inspections: inspections?.length || 0,
        issues: issues?.length || 0,
      }}
    />
  );
}
