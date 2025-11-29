#!/bin/bash

echo ""
echo "==============================="
echo "  VACATION LIVING – AUTO FIXER"
echo "==============================="
echo ""

# -----------------------------
# 1. LIMPIEZA DE ARCHIVOS BASURA
# -----------------------------
echo "→ Eliminando basura (.swp, .save, .DS_Store)..."
find . -type f -name "*.swp" -delete
find . -type f -name "*.save" -delete
find . -type f -name ".DS_Store" -delete

# -----------------------------
# 2. CREAR DIRECTORIOS NECESARIOS
# -----------------------------
echo "→ Asegurando carpetas de estilos..."
mkdir -p app/styles
mkdir -p app/inspection/[houseId]/subcategories
mkdir -p app/inspection/[houseId]/submit

# -----------------------------
# 3. CREAR TODOS LOS CSS FALTANTES
# -----------------------------
echo "→ Generando estilos faltantes..."

# inspection-review.css
cat << 'EOF2' > app/styles/inspection-review.css
.reviewContainer {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.sectionTitle {
  font-size: 22px;
  font-weight: 600;
}
.issueCard {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
}
.buttonPrimary {
  background: #c8a36d;
  padding: 14px;
  border-radius: 8px;
  color: white;
  border: none;
  cursor: pointer;
}
.buttonPrimary:hover {
  background: #b48f57;
}
EOF2

# subcategories/styles.css
cat << 'EOF3' > app/inspection/[houseId]/subcategories/styles.css
.subcategoryList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.subcategoryCard {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
}
.subcategoryCard:hover {
  background: #f2f2f2;
}
EOF3

# submit.css
cat << 'EOF4' > app/inspection/[houseId]/submit/submit.css
.submitContainer {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.formLabel {
  font-size: 16px;
  font-weight: 500;
}
.formInput {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.buttonPrimary {
  background: #c8a36d;
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 20px;
}
.buttonPrimary:hover {
  background: #b48f57;
}
EOF4

# -----------------------------
# 4. ARREGLAR ERROR FATAL DE EOF
# -----------------------------
echo "→ Reparando error de sintaxis en review/submit..."

REVIEW_FILE="app/inspection/[houseId]/submit/review/page.jsx"

if grep -q "repair_note:" "$REVIEW_FILE"; then
  sed -i 's/repair_note:/repair_note: repairNote,/g' "$REVIEW_FILE"
  echo "   ✓ Reparado repair_note:"
else
  echo "   ⚠ No se encontró repair_note:"
fi

# -----------------------------
# 5. REPARAR IMPORT DE LUXHEADER
# -----------------------------
echo "→ Verificando import de LuxHeader..."

find . -type f -name "*.jsx" -print0 | while IFS= read -r -d '' file; do
  if grep -q "@/app/components/LuxHeader" "$file"; then
    sed -i 's#@/app/components/LuxHeader#@/components/LuxHeader#g' "$file"
    echo "   ✓ Reparado import en → $file"
  fi
done

# -----------------------------
# 6. REVISAR ALIAS @
# -----------------------------
echo "→ Verificando alias @ en jsconfig.json..."
if ! grep -q "\"@/*\"" jsconfig.json; then
  cat << 'EOF5' > jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["app/*"] }
  },
  "include": ["app", "components", "styles"]
}
EOF5
  echo "   ✓ jsconfig.json reparado"
else
  echo "   ✓ Alias @ correcto"
fi

echo ""
echo "==============================="
echo "     REVISIÓN FINAL COMPLETA"
echo "==============================="
echo "Todo listo ✔️"
