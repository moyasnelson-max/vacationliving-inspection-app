#!/usr/bin/env bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 AUDITORÍA FLOW 1 · Vacation Living"
echo "Login → Dashboard → Inspector Panel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=true

fail () {
  echo "❌ FAIL: $1"
  PASS=false
}

ok () {
  echo "✅ OK: $1"
}

warn () {
  echo "⚠️  WARN: $1"
}

echo "1️⃣ Verificando estructura de rutas críticas..."

[ -d app/auth/login ] && ok "Ruta /auth/login existe" || fail "Falta /auth/login"
[ -d app/dashboard ] && ok "Ruta /dashboard existe" || fail "Falta /dashboard"
[ -d app/inspection ] && ok "Ruta /inspection existe" || fail "Falta /inspection"

echo ""
echo "2️⃣ Verificando páginas principales..."

[ -f app/auth/login/page.jsx ] && ok "Login page.jsx existe" || fail "Login page.jsx no existe"
[ -f app/dashboard/page.jsx ] && ok "Dashboard page.jsx existe" || fail "Dashboard page.jsx no existe"

echo ""
echo "3️⃣ Verificando clientes Supabase..."

[ -f lib/supabase/browser.js ] && ok "Supabase browser client existe" || fail "Falta supabase/browser.js"
[ -f lib/supabase/server.js ] && warn "Supabase server client existe (posible conflicto)" || ok "No server client (seguro)"

echo ""
echo "4️⃣ Verificando middleware..."

if [ -f middleware.js ]; then
  ok "middleware.js existe"

  grep -q "createServerClient" middleware.js \
    && warn "Middleware usa Supabase SERVER (alto riesgo de redirect loop)" \
    || ok "Middleware NO usa Supabase server"

  grep -q "NextResponse.redirect" middleware.js \
    && warn "Redirect activo en middleware" \
    || ok "No redirect automático en middleware"
else
  fail "middleware.js no existe"
fi

echo ""
echo "5️⃣ Verificando comportamiento de LOGIN..."

grep -q "signInWithPassword" app/auth/login/page.jsx \
  && ok "Login usa signInWithPassword" \
  || fail "Login NO usa signInWithPassword"

grep -q "router.push" app/auth/login/page.jsx \
  && warn "Login hace redirect manual (puede chocar con middleware)" \
  || ok "Login NO redirige (middleware controla flujo)"

echo ""
echo "6️⃣ Verificando obtención de sesión en Dashboard..."

grep -R "getUser" app/dashboard > /dev/null \
  && ok "Dashboard consulta sesión Supabase" \
  || fail "Dashboard NO valida sesión"

echo ""
echo "7️⃣ Verificando acceso a Inspector desde Dashboard..."

grep -R "/inspection" app/dashboard > /dev/null \
  && ok "Dashboard enlaza a /inspection" \
  || fail "Dashboard NO enlaza a inspection"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$PASS" = true ]; then
  echo "✅ RESULTADO: ESTRUCTURA DEL FLUJO EXISTE"
  echo "⚠️  Si hay loops o pantallas blancas → conflicto AUTH (middleware / server client)"
else
  echo "❌ RESULTADO: FLUJO INCOMPLETO O ROTO"
  echo "👉 Revisar FAIL arriba"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
