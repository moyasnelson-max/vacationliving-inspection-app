#!/bin/bash

echo "==============================================="
echo " VACATION LIVING — CREACIÓN COMPLETA DE ESTILOS"
echo "==============================================="

# Crear carpetas necesarias
mkdir -p app/styles
mkdir -p app/inspection/[houseId]/submit

echo "Creando: inspection-review.css..."
cat << 'CSS' > app/styles/inspection-review.css
.reviewContainer {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reviewItem {
  background: #ffffff;
  border-radius: 10px;
  padding: 18px;
  border: 1px solid #e5e5e5;
}

.reviewLabel {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.reviewValue {
  font-size: 15px;
  color: #444;
}

.reviewPhotos {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.reviewPhotos img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
CSS

echo "Creando: inspection-close.css..."
cat << 'CSS' > app/styles/inspection-close.css
.closeContainer {
  padding: 24px;
}

.closeTitle {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.closeButton {
  background: #1a1a1a;
  color: #fff;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
}

.closeButton:active {
  opacity: 0.8;
}
CSS

echo "Creando: inspection-subcategories.css..."
cat << 'CSS' > app/styles/inspection-subcategories.css
.subcategoryContainer {
  padding: 24px;
}

.subcategoryItem {
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #fff;
  margin-bottom: 12px;
}

.subcategoryTitle {
  font-size: 18px;
  font-weight: 600;
}

.subcategoryArrow {
  float: right;
  opacity: 0.5;
}
CSS

echo "Creando: luxury-inspection.css..."
cat << 'CSS' > app/styles/luxury-inspection.css
.inspectionPage {
  padding: 24px;
}

.inspectionTitle {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
}

.inspectionList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inspectionItem {
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}

.inspectionItem span {
  font-size: 17px;
  font-weight: 600;
}
CSS

echo "Creando: inspection-categories.css..."
cat << 'CSS' > app/styles/inspection-categories.css
.categoriesContainer {
  padding: 24px;
}

.categoryBox {
  background: #fff;
  border: 1px solid #e5e5e5;
  padding: 18px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.categoryName {
  font-size: 18px;
  font-weight: 600;
}
CSS

echo "Creando: submit.css..."
cat << 'CSS' > app/inspection/[houseId]/submit/submit.css
.submitContainer {
  padding: 24px;
}

.submitButton {
  background: #000;
  color: #fff;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.submitButton:active {
  opacity: 0.8;
}
CSS

echo "==============================================="
echo " TODOS LOS ARCHIVOS CSS CREADOS CORRECTAMENTE ✔️"
echo "==============================================="
