#!/bin/bash
echo "🛠 Auto-Repair Started"

echo "1) Fixing deprecated supabase-client imports..."
grep -Rl "@/lib/supabase-client" ./app \
  | xargs sed -i 's/@\/lib\/supabase-client/@\/lib\/supabase-browser/g'

echo "2) Fixing incorrect styles imports..."
grep -Rl "@/styles" ./app \
  | xargs sed -i 's/@\/styles/\.\/styles/g'

echo "3) Ensuring correct use client placement..."
find ./app -name "*.jsx" | while read file; do
  if grep -q "use client" $file && ! head -n 1 $file | grep -q "use client"; then
    sed -i '/use client/d' $file
    sed -i '1i use client\n' $file
    echo "✔ Fixed: $file"
  fi
done

echo "4) Installing Tailwind PostCSS plugin properly..."
npm install @tailwindcss/postcss7-compat postcss autoprefixer

echo "5) Rebuilding project..."
npm run build

echo "🟢 Auto-Repair Complete"
