#!/bin/bash

echo "======================================="
echo " VACATION LIVING — LOGIN AUDIT v1"
echo " Solo revisa el flujo del Login"
echo "======================================="

echo ""
echo "🔍 1) Verificando imports en LoginPage.jsx..."
grep -R "from" -n app/auth/login/page.jsx

echo ""
echo "🔍 2) Verificando uso correcto de supabaseBrowser()..."
grep -R "supabaseBrowser" -n app/auth/login

echo ""
echo "🔍 3) Verificando existencia del archivo supabase-browser.js..."
ls -l app/lib | grep supabase-browser

echo ""
echo "🔍 4) Verificando imports de componentes visuales..."
grep -R "GoldenParticles" -n app/auth/login
grep -R "HotelLoader" -n app/auth/login

echo ""
echo "🔍 5) Verificando que los componentes existan realmente..."
ls -l app/components | grep GoldenParticles
ls -l app/components | grep HotelLoader

echo ""
echo "🔍 6) Verificando existencia de assets requeridos..."
ls -l public | grep background
ls -l public | grep logo
ls -l public | grep icon

echo ""
echo "🔍 7) Validando ruta de redirección..."
grep -R "router.push" -n app/auth/login

echo ""
echo "🔍 8) Revisando variables de entorno para login..."
grep -R "NEXT_PUBLIC_SUPABASE" .env*

echo ""
echo "🔍 9) Simulando login build (solo login) ..."
# No hace build completo: analiza solo sintaxis
npx next lint app/auth/login/page.jsx --quiet 2>/dev/null

echo ""
echo "======================================="
echo " LOGIN AUDIT FINALIZADA "
echo "======================================="
