"use client";

import { supabaseBrowser } from "@lib/supabase-browser";
import { getOrCreateTempReportGroup } from "@lib/temp-report";

export async function createIssue({
  houseId,
  inspectorId,
  categoryId,
  subcategoryId,
  itemId,
  description,
  mediaUrls = [],
}) {
  const supabase = supabaseBrowser();

  const tempGroup = await getOrCreateTempReportGroup();

  const payload = {
    house_id: houseId,
    inspector_id: inspectorId,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    item_id: itemId,
    description,
    media_urls: mediaUrls,
    temp_report_group: tempGroup,
    status: "pending",
  };

  const { data, error } = await supabase
    .from("issues_v3")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("❌ Error creando issue:", error);
    throw new Error("No se pudo crear el issue");
  }

  return data;
}
