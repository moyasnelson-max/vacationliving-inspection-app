#!/bin/bash
echo "=============================================="
echo " VACATION LIVING — FIX IMPORTS v2.0"
echo "=============================================="

# Reparar import de LuxHeader
HEADER_PATH="app/components/LuxHeader.jsx"
if [ ! -f "$HEADER_PATH" ]; then
    echo "Creando LuxHeader.jsx ..."
    mkdir -p app/components
    cat <<JSX > "$HEADER_PATH"
"use client";
export default function LuxHeader() { return null; }
JSX
fi

# Reemplazar import incorrectos
grep -Rl "@/app/components/LuxHeader" app | xargs sed -i 's|@/app/components/LuxHeader|@/components/LuxHeader|g'
grep -Rl "@components/LuxHeader" app | xargs sed -i 's|@components/LuxHeader|@/components/LuxHeader|g'

# Reparar imports CSS rotos
grep -Rl "@/styles/" app | xargs -I {} sed -i 's|@/styles/|../../../styles/|g' {}

echo "✔ Imports reparados"
