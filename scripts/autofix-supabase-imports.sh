#!/bin/bash

echo "🛠️ Supabase Import AutoFix (SAFE MODE)"
echo "-------------------------------------"

TARGET_DIRS="app lib components pages"
BACKUP_EXT=".bak"

fix_file () {
  FILE="$1"

  # Backup
  cp "$FILE" "$FILE$BACKUP_EXT"

  HAS_USE_CLIENT=$(grep -q '"use client"' "$FILE" && echo "yes" || echo "no")

  # Eliminar cliente universal
  sed -i '' \
    -e 's|import .*supabaseClient.*||g' \
    -e 's|from .*/supabaseClient.*||g' \
    "$FILE"

  if [ "$HAS_USE_CLIENT" = "yes" ]; then
    # CLIENT COMPONENT
    sed -i '' \
      -e 's|import .*supabase.*from .*/supabase-browser.*|import { supabaseBrowser } from "@/lib/supabase/browser";|g' \
      -e 's|const supabase *=.*|const supabase = supabaseBrowser();|g' \
      "$FILE"
  else
    # SERVER COMPONENT
    sed -i '' \
      -e 's|import .*supabase.*from .*/supabase-browser.*|import { supabaseServer } from "@/lib/supabase/server";|g' \
      -e 's|const supabase *=.*|const supabase = supabaseServer();|g' \
      "$FILE"
  fi
}

export -f fix_file

for DIR in $TARGET_DIRS; do
  if [ -d "$DIR" ]; then
    find "$DIR" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
      -exec bash -c 'fix_file "$0"' {} \;
  fi
done

echo ""
echo "✅ Autofix terminado"
echo "📦 Backups creados con extensión $BACKUP_EXT"
echo "👉 Revisa y luego elimina backups cuando confirmes"
