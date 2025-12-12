#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Marriott-Level CSS Alias Validator "
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ROOT="app"

# ==== ALIAS MAP ====
declare -A ALIAS_MAP=(
  ["@styles"]="$ROOT/styles"
  ["@theme"]="$ROOT/theme"
  ["@components"]="$ROOT/components"
  ["@dashboard"]="$ROOT/dashboard"
  ["@inspection"]="$ROOT/inspection"
)

# ==== Buscar imports .css ====
FILES=$(grep -R "import .*\.css" -n app | awk -F'"' '{print $2}')

MISSING=()
VALID=()

echo "🔍 Validando imports CSS..."
echo ""

for f in $FILES; do
    ORIGINAL="$f"

    # Detectar alias
    ALIAS_PREFIX=$(echo "$f" | cut -d'/' -f1)

    if [[ ${ALIAS_MAP[$ALIAS_PREFIX]} ]]; then
        REAL_PATH="${ALIAS_MAP[$ALIAS_PREFIX]}/${f#*/}"
    else
        REAL_PATH="$ROOT/$f"
    fi

    # Verificar existencia
    if [[ -f "$REAL_PATH" ]]; then
        VALID+=("$ORIGINAL  →  $REAL_PATH")
    else
        MISSING+=("$ORIGINAL  →  $REAL_PATH")
    fi
done

echo ""
echo "✔ CSS encontrados:"
for v in "${VALID[@]}"; do
    echo "   ✓ $v"
done

echo ""
echo "❌ CSS faltantes:"
for m in "${MISSING[@]}"; do
    echo "   ✗ $m"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"