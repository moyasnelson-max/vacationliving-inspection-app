#!/bin/bash
echo "=============================================="
echo " VACATION LIVING — FIX CSS v2.0"
echo "=============================================="

# Crear carpeta styles si no existe
mkdir -p styles

declare -a FILES=(
  "styles/inspection-review.css"
  "styles/inspection-subcategories.css"
  "styles/inspection-categories.css"
  "styles/inspection-close.css"
  "styles/luxury-inspection.css"
  "app/inspection/[houseId]/submit/submit.css"
  "app/inspection/[houseId]/subcategories/styles.css"
)

for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Creando $f ..."
    mkdir -p "$(dirname "$f")"
    cat <<CSS > "$f"
/* Auto-generated placeholder */
.container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
CSS
  fi
done

echo "✔ CSS reparado"
