#!/bin/bash

echo "🔍 Supabase Import Architecture Audit"
echo "-------------------------------------"

ERRORS=0

echo ""
echo "1️⃣ Buscando cliente universal prohibido (supabaseClient)..."
grep -R --line-number "supabaseClient" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  && ERRORS=1 || echo "✅ OK"

echo ""
echo "2️⃣ Buscando imports directos de @supabase/supabase-js (NO permitido)..."
grep -R --line-number "@supabase/supabase-js" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  && ERRORS=1 || echo "✅ OK"

echo ""
echo "3️⃣ Buscando uso incorrecto de supabase-browser fuera de client components..."
grep -R --line-number "supabase-browser" app lib \
  | grep -v '"use client"' \
  && echo "⚠️ Revisa manualmente estos archivos" || echo "✅ OK"

echo ""
echo "4️⃣ Buscando server components usando supabaseBrowser (ERROR)..."
grep -R --line-number "supabaseBrowser" app \
  | grep -v '"use client"' \
  && ERRORS=1 || echo "✅ OK"

echo ""
echo "5️⃣ Buscando client components usando supabaseServer (ERROR)..."
grep -R --line-number "supabaseServer" app \
  | grep '"use client"' \
  && ERRORS=1 || echo "✅ OK"

echo ""
echo "-------------------------------------"

if [ $ERRORS -eq 0 ]; then
  echo "🎉 Arquitectura Supabase CORRECTA"
else
  echo "🚨 ERRORES DETECTADOS — revisa los archivos listados arriba"
  exit 1
fi
