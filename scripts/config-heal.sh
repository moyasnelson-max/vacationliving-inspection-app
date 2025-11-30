#!/bin/bash

echo "🛡 AUTO-HEAL CONFIG SYSTEM v1.0"

bash scripts/config-check.sh
needs_fix=$?

if [ "$needs_fix" -ne 0 ]; then
  echo "⚠ Archivos corruptos detectados. Reparando..."
  node scripts/config-auto-fix.js
else
  echo "✔ Configuración en perfecto estado."
fi

