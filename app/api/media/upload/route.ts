import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;
  const path = form.get("path") as string;

  if (!file || !path) {
    return NextResponse.json({ error: "Missing file or path" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.storage
    .from("issue-media")
    .upload(path, buffer, {
      contentType: file.type
    });

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true, path });
}
