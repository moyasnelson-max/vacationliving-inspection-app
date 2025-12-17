#!/bin/bash

echo "🚀 Marriott-Level Alias Fix — iniciando..."
echo ""

# Fix @/lib → @lib
grep -Rl "@/lib/" app | while read -r file; do
  sed -i 's|@/lib/|@lib/|g' "$file"
  echo "✔ Reparado @/lib → @lib en: $file"
done

# Fix @/app → @app
grep -Rl "@/app/" app | while read -r file; do
  sed -i 's|@/app/|@app/|g' "$file"
  echo "✔ Reparado @/app → @app en: $file"
done

# Fix @/components → @components
grep -Rl "@/components/" app | while read -r file; do
  sed -i 's|@/components/|@components/|g' "$file"
  echo "✔ Reparado @/components → @components en: $file"
done

# Fix @/theme → @theme
grep -Rl "@/theme/" app | while read -r file; do
  sed -i 's|@/theme/|@theme/|g' "$file"
  echo "✔ Reparado @/theme → @theme en: $file"
done

# Fix @/styles → @styles
grep -Rl "@/styles/" app | while read -r file; do
  sed -i 's|@/styles/|@styles/|g' "$file"
  echo "✔ Reparado @/styles → @styles en: $file"
done

echo ""
echo "🏨 Marriott-Level alias fix completado."
