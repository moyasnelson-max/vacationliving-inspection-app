import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data, error } = await supabase
    .from("properties")
    .select("slug, display_name");

  if (error) return NextResponse.json({ error: error.message });

  return NextResponse.json({ success: true, list: data });
}
