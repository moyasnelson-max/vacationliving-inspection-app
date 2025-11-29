import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { house_id, category_id, subcategory_id, notes } = await request.json();

  if (!house_id || !category_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from("issues")
    .insert({
      house_id,
      category_id,
      subcategory_id,
      notes,
      status: "open",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true, issue: data });
}
