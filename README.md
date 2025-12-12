# Vacation Living · Luxury Inspection System

Bienvenido al sistema oficial de inspecciones de **Vacation Living Rentals**.  
Este proyecto fue diseñado con estándares tipo _Marriott / Four Seasons_, combinando:

- Next.js 14 (App Router)
- Supabase 2.x (Auth, Storage, SQL, Edge Functions)
- SendGrid (Email + PDF)
- pdf-lib (Generación profesional de PDF)
- QR Codes dinámicos
- Dashboard estilo lujo
- Flujos completos para Inspectores, Administradores y Huéspedes

---

## 🚀 Características principales

### 🔹 1. Inspecciones completas

- Selección de casa
- Categorías → Subcategorías → Ítems
- Fotos ilimitadas
- Notas obligatorias
- Mandatory warning para campos faltantes
- Severidad del issue (Low, Medium, High)

### 🔹 2. Reportes

- Se genera un PDF profesional
- Envío automático por SendGrid
- Almacenamiento en Supabase Storage
- Panel para administrar y descargar reportes

### 🔹 3. Dashboard Nivel Ejecutivo

- Todas las propiedades
- Issues abiertos/cerrados
- Health Score por casa
- Descarga de QR Codes para inspecciones

### 🔹 4. Roles

- Inspector
- Admin (acceso a todo)
- Guest Reporter (reportes sin login)

---

## 🗂 Estructura del proyecto

La estructura completa se encuentra definida en `estructura-ideal.txt`  
y está completamente implementada en:
