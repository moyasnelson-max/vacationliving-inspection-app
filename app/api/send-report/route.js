import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // 🔥 Llamada directa a la Edge Function send-report
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API /api/send-report Error:", err);
    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500 }
    );
  }
}
