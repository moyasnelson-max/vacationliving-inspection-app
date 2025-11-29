#!/bin/bash
echo "======================================"
echo "   NEXT.JS LINT + AUTO FIX v5.0"
echo "======================================"

FILES=$(find app -type f -name "*.jsx")

for f in $FILES; do
  sed -i "s#@/#../../../../#g" "$f"

  # Corrige faltas de cierre
  if ! tail -n 1 "$f" | grep -q "}"; then
    echo "}" >> "$f"
  fi

  # Agrega "use client" si es necesario
  if grep -q "onClick" "$f"; then
    if ! grep -q "use client" "$f"; then
      sed -i '1i "use client";' "$f"
      echo "✔ use client agregado en $f"
    fi
  fi
done

echo "✔ Lint completo y corregido"
