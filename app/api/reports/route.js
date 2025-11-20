import supabase from "@/app/lib/supabase-client";

export async function GET(req) { ... }
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: "Error fetching reports" }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
