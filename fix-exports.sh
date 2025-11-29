#!/bin/bash
echo "=========================================="
echo " REPARANDO EXPORT DEFAULT — VACATION LIVING"
echo "=========================================="

FILES=$(find app -type f -name "page.jsx")

for f in $FILES; do
  if ! grep -q "export default function" "$f"; then
    FUNCTION_NAME=$(basename "$f" .jsx)
    sed -i "1i export default function ${FUNCTION_NAME^}() {" "$f"
    echo "}" >> "$f"
    echo "✔ Agregado export default en $f"
  fi
done

echo "✔ Export defaults corregidos"
