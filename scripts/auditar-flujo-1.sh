#!/bin/bash

echo ""
echo "====================================="
echo " AUDITORÍA FLUJO 1 — INSPECCIÓN VL"
echo "====================================="
echo ""

ROOT="app/inspection"

###############################
# 1. VERIFICAR ARCHIVOS CLAVE
###############################

echo "[1] Verificando estructura completa..."
declare -a REQUIRED_FILES=(
  "app/auth/login/page.jsx"
  "app/houses/page.jsx"
  "app/houses/components/HouseSelector.jsx"
  "$ROOT/[houseId]/page.jsx"
  "$ROOT/[houseId]/categories/page.jsx"
  "$ROOT/[houseId]/subcategories/page.jsx"
  "$ROOT/[houseId]/items/page.jsx"
  "$ROOT/[houseId]/issue/page.jsx"
  "$ROOT/[houseId]/issues/[id]/page.jsx"
  "$ROOT/[houseId]/submit/page.jsx"
  "$ROOT/[houseId]/finish/page.jsx"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "✔ $FILE"
  else
    echo "❌ FALTA: $FILE"
  fi
done

echo ""
###############################
# 2. VERIFICAR IMPORTS ROTOS
###############################

echo "[2] Buscando imports rotos..."
grep -RIN "from\s\+['\"]/[^@./]" app | sed 's/^/   -> /'

echo ""

###############################
# 3. VERIFICAR IMPORTS DE ALIAS
###############################

echo "[3] Verificando imports con alias (@components, @lib, @styles)..."

grep -RIN "from ['\"]@components" app | while read -r line; do
  FILE=$(echo "$line" | cut -d: -f1)
  IMPORT=$(echo "$line" | sed -n 's/.*from [\"\x27]\(@components[^\"\x27]*\).*/\1/p')
  TARGET="app/components/${IMPORT#@components/}"

  if [ -f "$TARGET" ]; then
    echo "✔ $IMPORT → OK"
  else
    echo "❌ $IMPORT → NO EXISTE → debería estar en $TARGET"
  fi
done

echo ""

###############################
# 4. VERIFICAR SUPABASE
###############################

echo "[4] Verificando supabase-browser..."
if [ -f "lib/supabase-browser.js" ]; then
  echo "✔ supabase-browser existe"
else
  echo "❌ Falta lib/supabase-browser.js"
fi

echo ""
echo "[5] Verificando que el login use supabaseBrowser() correctamente..."
grep -RIN "supabase.auth" app/auth/login/page.jsx
grep -RIN "supabaseBrowser" app/auth/login/page.jsx

echo ""

###############################
# 5. VERIFICAR ASSETS
###############################

echo "[6] Verificando assets requeridos del login..."
ASSETS=("public/logo.png" "public/background.webp" "public/icon.png")

for ASSET in "${ASSETS[@]}"; do
  if [ -f "$ASSET" ]; then
    echo "✔ Asset ok: $ASSET"
  else
    echo "❌ Falta asset: $ASSET"
  fi
done

echo ""

###############################
# 6. VERIFICAR COMPONENTES USADOS
###############################

echo "[7] Verificando componentes llamados desde login..."
declare -a COMPONENTS=(
  "components/GoldenParticles.jsx"
  "components/HotelLoader.jsx"
)

for C in "${COMPONENTS[@]}"; do
  if [ -f "app/$C" ]; then
    echo "✔ $C"
  else
    echo "❌ FALTA COMPONENTE: app/$C"
  fi
done

echo ""

###############################
# 7. VERIFICAR REDIRECCIONES
###############################

echo "[8] Verificando redirecciones..."
grep -RIN "router.push" app/auth/login/page.jsx

echo ""

###############################
# 8. SIMULAR FLUJO LOGICO
###############################

echo "[9] Simulación lógica — FLUJO 1:"
echo "   Login → Houses → /inspection/[houseId] → Categories → Subcategories → Items → Issue → Submit → Finish"
echo ""

# Check if folders exist for each step
FLOW_PATHS=(
  "app/houses"
  "$ROOT"
  "$ROOT/[houseId]/categories"
  "$ROOT/[houseId]/subcategories"
  "$ROOT/[houseId]/items"
  "$ROOT/[houseId]/issue"
  "$ROOT/[houseId]/submit"
  "$ROOT/[houseId]/finish"
)

for P in "${FLOW_PATHS[@]}"; do
  if [ -d "$P" ]; then
    echo "✔ Existe: $P"
  else
    echo "❌ No existe carpeta del flujo: $P"
  fi
done

echo ""
echo "====================================="
echo " AUDITORÍA FINALIZADA"
echo "====================================="
echo ""
