#!/bin/bash

echo "🧪 Comprobando archivos de configuración..."

check_file() {
  if [ ! -f "$1" ]; then
    echo "❌ Falta: $1"
    return 1
  fi
  if ! cat "$1" | jq empty >/dev/null 2>&1; then
    echo "❌ Dañado: $1"
    return 1
  fi
  echo "✔ Ok: $1"
  return 0
}

problem=0

check_file "jsconfig.json" || problem=1
check_file ".eslintrc.json" || problem=1

# next.config.js no usa JSON → solo chequeo de existencia
if [ ! -f "next.config.js" ]; then
  echo "❌ next.config.js no existe"
  problem=1
else
  echo "✔ next.config.js existe"
fi

# gitignore nunca debe faltar
if [ ! -f ".gitignore" ]; then
  echo "❌ Falta .gitignore"
  problem=1
fi

exit $problem
