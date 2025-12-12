#!/usr/bin/env bash
set -e

echo "========================================"
echo " SUPABASE NORMALIZE IMPORTS v1.0"
echo "========================================"
echo

# 1. Asegurar que exista lib/supabaseClient.js
if [ ! -f lib/supabaseClient.js ]; then
  echo "⚠️  lib/supabaseClient.js no existe, creándolo..."
  cat > lib/supabaseClient.js <<'EOF'
"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ ERROR Supabase: falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
EOF
fi

echo "✅ Cliente Supabase central: lib/supabaseClient.js"
echo

# 2. Lista de patrones rotos que queremos corregir
BAD_PATTERNS=(
  "@/lib/supabaseClient"
  "@/lib/supabaseClient.mjs"
  "@e/lib/supabaseClient"
  "@e/lib/supabaseClient.mjs"
  "@elib/supabaseClient"
  "@elib/supabaseClient.mjs"
  "e/lib/supabaseClient"
  "e/lib/supabaseClient.mjs"
  "lib/supabaseClient.mjs"
)

TARGET="@lib/supabaseClient"

for P in "${BAD_PATTERNS[@]}"; do
  FILES=$(grep -RIl "$P" app lib 2>/dev/null || true)

  if [ -n "$FILES" ]; then
    echo "🔧 Corrigiendo '$P'  →  '$TARGET' en:"
    echo "$FILES" | sed 's/^/   • /'
    echo "$FILES" | xargs -r sed -i "s|$P|$TARGET|g"
    echo
  fi
done

echo "----------------------------------------"
echo "📋 Imports actuales que siguen mencionando 'supabaseClient':"
grep -RIn "supabaseClient" app lib | sed 's/^/  /' || echo "  (solo en lib/supabaseClient.js)"
echo "----------------------------------------"

echo "✅ Normalización completa."
echo "Ahora puedes probar:"
echo "  npm run dev"
echo "y revisar si siguen saliendo errores de 'module not found' para supabaseClient."
