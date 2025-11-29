import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: any) {
  const id = context.params.id;
  const body = await request.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from("issues")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true, updated: data });
}
