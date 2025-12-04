#!/bin/bash

echo "=========================================="
echo " Creando archivos de librería ISSUES_V3..."
echo "=========================================="

# Crear carpeta lib si no existe
mkdir -p lib

# 1) temp-report.js
cat > lib/temp-report.js << 'EOF'
"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";

const STORAGE_KEY = "vl_temp_report_group";

export async function getOrCreateTempReportGroup() {
  const supabase = supabaseBrowser();

  // 1) verificar si ya existe en localStorage
  let group = null;
  if (typeof window !== "undefined") {
    group = localStorage.getItem(STORAGE_KEY);
  }

  if (group) return group;

  // 2) generar UUID desde Supabase
  const { data, error } = await supabase.rpc("gen_random_uuid");

  if (error) {
    console.error("❌ Error generating temp_report_group:", error);
    throw new Error("No se pudo generar temp_report_group");
  }

  const newGroup = data;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, newGroup);
  }

  return newGroup;
}

// limpia después de enviar reporte
export function clearTempReportGroup() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
EOF

echo "✔ lib/temp-report.js creado"


# 2) issues-create.js
cat > lib/issues-create.js << 'EOF'
"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import { getOrCreateTempReportGroup } from "@/lib/temp-report";

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
EOF

echo "✔ lib/issues-create.js creado"


# 3) issues-fetch.js
cat > lib/issues-fetch.js << 'EOF'
"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";

export async function getIssuesByTempGroup(tempGroup) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("temp_report_group", tempGroup)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error obteniendo issues por temp_group:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}

export async function getIssuesByHouse(houseId) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("house_id", houseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por casa:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}

export async function getIssuesByInspector(inspectorId) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("inspector_id", inspectorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por inspector:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}
EOF

echo "✔ lib/issues-fetch.js creado"


echo "=========================================="
echo " ✔ TODOS LOS ARCHIVOS ISSUES_V3 CREADOS"
echo " Ubicación: /lib/"
echo "=========================================="
