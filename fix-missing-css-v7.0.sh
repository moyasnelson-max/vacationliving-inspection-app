#!/bin/bash
echo "🎨 Reparando CSS faltante..."

CSS_LIST=(
"inspection-subcategories.css"
"inspection-categories.css"
"inspection-review.css"
"inspection-close.css"
"luxury-inspection.css"
)

mkdir -p app/styles

for css in "${CSS_LIST[@]}"; do
  if [ ! -f "app/styles/$css" ]; then
    echo "/* $css auto-generado */" > app/styles/$css
  fi
done

echo "✅ CSS reparado."
