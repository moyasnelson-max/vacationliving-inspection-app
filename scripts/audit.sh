#!/bin/bash
echo "🔎 Starting Full Project Audit (Vacation Living – 5-Stars Edition)..."

echo "------------------------------------------------------"
echo "1) Checking invalid imports (@/* aliases)"
echo "------------------------------------------------------"
grep -R "@/" -n ./app ./lib ./components ./styles || echo "✔ No invalid imports found"

echo "------------------------------------------------------"
echo "2) Checking for deleted module references"
echo "------------------------------------------------------"
grep -R "supabase-client" -n ./app || echo "✔ All references updated"

echo "------------------------------------------------------"
echo "3) Checking for missing files"
echo "------------------------------------------------------"
for file in $(grep -R "from \"@/components" -h ./app | sed 's/.*@\/components\///' | sed 's/".*//' | sed 's/\(.*\)/\1.jsx/'); do
    if [ ! -f "./components/$file" ]; then
        echo "❌ Missing component: $file"
    fi
done

echo "------------------------------------------------------"
echo "4) Validating use client placement"
echo "------------------------------------------------------"
grep -R "use client" -n ./app | grep -v "^1:" && echo "⚠ Fix needed" || echo "✔ All client directives at top"

echo "------------------------------------------------------"
echo "5) Validating Tailwind + PostCSS install"
echo "------------------------------------------------------"
if [ -f "./postcss.config.js" ] && [ -f "./tailwind.config.js" ]; then
    echo "✔ Tailwind + PostCSS OK"
else
    echo "❌ Missing config – needs fix"
fi

echo "------------------------------------------------------"
echo "6) Running production build"
echo "------------------------------------------------------"
npm run build

echo "------------------------------------------------------"
echo "Audit complete."
