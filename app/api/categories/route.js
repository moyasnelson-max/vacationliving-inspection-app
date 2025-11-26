import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 1. Obtener categorías activas
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (catError) return NextResponse.json({ error: catError }, { status: 500 });

  // 2. Obtener subcategorías activas
  const { data: subcategories, error: subError } = await supabase
    .from("subcategories")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (subError)
    return NextResponse.json({ error: subError }, { status: 500 });

  // 3. Agrupar subcategorías dentro de cada categoría
  const grouped = categories.map((cat) => ({
    ...cat,
    subcategories: subcategories.filter(
      (sub) => sub.category_id === cat.id
    ),
  }));

  return NextResponse.json(grouped);
}
