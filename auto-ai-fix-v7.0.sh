#!/bin/bash
echo "🔧 AUTO FIX v7.0 – Reparando imports, CSS y estructura..."

# Reparar alias supabase
grep -rl "@/lib/supabase-client" app | xargs sed -i '' 's|@/lib/supabase-client|@/app/lib/supabase-client|g'
grep -rl "@lib/supabase-client" app | xargs sed -i '' 's|@lib/supabase-client|@/app/lib/supabase-client|g'
grep -rl "../@lib/supabase-client" app | xargs sed -i '' 's|\.\./@lib/supabase-client|@/app/lib/supabase-client|g'

# Crear carpetas necesarias
mkdir -p app/styles
mkdir -p app/app/lib
mkdir -p app/inspection/components

# Crear archivos obligatorios si no existen
touch app/styles/inspection-subcategories.css
touch app/styles/inspection-categories.css
touch app/styles/inspection-review.css
touch app/styles/inspection-close.css
touch app/styles/luxury-inspection.css
touch app/inspection/components/LuxHeader.jsx

echo "✅ AUTO FIX v7.0 completo."
