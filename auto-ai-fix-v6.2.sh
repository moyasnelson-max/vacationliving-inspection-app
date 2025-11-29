#!/bin/bash

echo "🔍 AUTO-AI-FIX v6.2 — Iniciando reparación completa..."

PROJECT_ROOT=$(pwd)

echo "📁 Proyecto: $PROJECT_ROOT"

fix_imports() {
  echo "🔧 Reparando imports rotos..."
  grep -rl "@/lib/supabase-client" app | while read -r file; do
    sed -i '' 's|@/lib/supabase-client|@/app/lib/supabase-client|g' "$file"
  done

  grep -rl "@lib/supabase-client" app | while read -r file; do
    sed -i '' 's|@lib/supabase-client|@/app/lib/supabase-client|g' "$file"
  done

  grep -rl "../@lib/supabase-client" app | while read -r file; do
    sed -i '' 's|\.\./@lib/supabase-client|@/app/lib/supabase-client|g' "$file"
  done
}

create_missing_files() {
  echo "🧩 Creando archivos faltantes..."

  mkdir -p app/styles
  touch app/styles/inspection-review.css
  touch app/styles/inspection-subcategories.css
  touch app/styles/inspection-categories.css
  touch app/styles/inspection-close.css
  touch app/styles/luxury-inspection.css

  mkdir -p app/inspection/components
  touch app/inspection/components/LuxHeader.jsx
}

fix_dynamic_routes() {
  echo "🔄 Normalizando rutas dinámicas..."

  find app/inspection -type d -name "[id]" -exec bash -c '
    mv "$1" "${1%/*}/[categoryId]" 2>/dev/null || true
  ' bash {} \;

  find app/inspection -type d -name "[subcategoryId]" -exec bash -c '
    mv "$1" "${1%/*}/[issueId]" 2>/dev/null || true
  ' bash {} \;
}

remove_wrong_files() {
  echo "🗑 Eliminando archivos incorrectos..."
  rm -rf app/inspection/[houseId]/components/[categoryId]/styles.css 2>/dev/null
  rm -rf app/inspection/[houseId]/subcategories 2>/dev/null
}

echo "⚙️ Ejecutando reparaciones..."
fix_imports
create_missing_files
fix_dynamic_routes
remove_wrong_files

echo "✅ AUTO-AI-FIX COMPLETO"
