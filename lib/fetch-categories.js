import { supabase } from "./supabase-browser.js";

export async function fetchCategories(houseId) {
  const { data, error } = await supabase
    .from("inspection_categories")
    .select("*")
    .eq("house_id", houseId);

  if (error) throw error;
  return data;
}