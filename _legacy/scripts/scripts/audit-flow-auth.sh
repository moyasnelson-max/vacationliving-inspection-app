#!/bin/bash

echo ""
echo "🔍 AUDITORÍA AUTH FLOW · Vacation Living"
echo "Login → Dashboard → Inspector Panel"
echo "----------------------------------------"

fail=0

check() {
  if [ -e "$1" ]; then
    echo "✅ OK: $1"
  else
    echo "❌ FAIL: $1"
    fail=1
  fi
}

echo ""
echo "1️⃣ RUTAS CRÍTICAS"
check "app/auth/login/page.jsx"
check "app/dashboard/page.jsx"
check "app/inspection/page.jsx"

echo ""
echo "2️⃣ SUPABASE CLIENTES"
check "lib/supabase/browser.js"
check "lib/supabase/server.js"

echo ""
echo "3️⃣ MIDDLEWARE"
if [ -e "middleware.js" ]; then
  echo "✅ middleware.js ACTIVO"
else
  echo "⚠️ middleware.js NO ACTIVO"
  if [ -e "middleware.DISABLED.js" ]; then
    echo "ℹ️ middleware.DISABLED.js existe (desactivado)"
  fi
  fail=1
fi

echo ""
echo "4️⃣ LOGIN FLOW"
grep -q "signInWithPassword" app/auth/login/page.jsx \
  && echo "✅ Login usa signInWithPassword" \
  || { echo "❌ Login NO autentica"; fail=1; }

grep -q "router.push" app/auth/login/page.jsx \
  && echo "⚠️ Login hace redirect manual (riesgo de loop)" \
  || echo "✅ Login NO redirige manualmente"

echo ""
echo "5️⃣ DASHBOARD SESIÓN"
grep -q "getUser" app/dashboard/page.jsx \
  && echo "✅ Dashboard valida sesión" \
  || { echo "❌ Dashboard NO valida sesión"; fail=1; }

echo ""
echo "----------------------------------------"
if [ $fail -eq 0 ]; then
  echo "🟢 RESULTADO: FLUJO CONSISTENTE"
else
  echo "🔴 RESULTADO: FLUJO INCOMPLETO"
fi
echo ""
