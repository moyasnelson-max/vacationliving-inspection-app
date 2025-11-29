#!/bin/bash

echo "=========================================="
echo " REPARANDO CSS FALTANTES"
echo "=========================================="

mkdir -p app/styles
mkdir -p app/inspection/[houseId]/submit

declare -A FILES=(
  ["app/styles/inspection-review.css"]=".reviewContainer{padding:24px;display:flex;flex-direction:column;gap:24px;}"
  ["app/styles/inspection-close.css"]=".closeContainer{padding:24px;}"
  ["app/styles/inspection-subcategories.css"]=".subcategoryContainer{padding:24px;}"
  ["app/styles/luxury-inspection.css"]=".inspectionPage{padding:24px;}"
  ["app/styles/inspection-categories.css"]=".categoriesContainer{padding:24px;}"
  ["app/inspection/[houseId]/submit/submit.css"]=".submitContainer{padding:24px;}"
)

for f in "${!FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "${FILES[$f]}" > "$f"
    echo "✔ Creado: $f"
  fi
done

echo "✔ CSS completo reparado"
