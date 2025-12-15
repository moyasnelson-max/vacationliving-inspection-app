// lib/i18n.js

const dictionaries = {
  en: {
    // Header / Nav
    nav_brandTitle: "Vacation Living",
    nav_brandSub: "Inspections",
    nav_dashboard: "Dashboard",
    nav_inspections: "Inspections",
    nav_reports: "Reports",
    nav_login: "Login",

    // Hero
    hero_kicker: "Inspection & Operations Suite",
    hero_title: "Vacation Living · Inspection System",
    hero_subtitle:
      "Internal platform for inspections, reports, and property-level operational control. Designed to be fast, clear, and scalable.",

    hero_primaryCta: "Start new inspection",
    hero_secondaryCta: "View property reports",

    // Badges
    badge_role: "Role-based security",
    badge_photos: "Photos + evidence",
    badge_mobile: "Mobile-first",
    badge_scale: "Ready for 50+ properties",

    // Quick actions
    actions_newInspection_title: "New inspection",
    actions_newInspection_desc:
      "Create a full inspection for a property with checklist and photos.",
    actions_newInspection_label: "Start",

    actions_issue_title: "Report an issue",
    actions_issue_desc:
      "Log a quick issue with photos, severity, and category without running a full inspection.",
    actions_issue_label: "Report",

    actions_dashboard_title: "Operations dashboard",
    actions_dashboard_desc:
      "See the overall status of inspections, open issues, and activity by property.",
    actions_dashboard_label: "Open dashboard",

    actions_history_title: "Report history",
    actions_history_desc:
      "View and download the most recent inspection reports and PDFs.",
    actions_history_label: "View history",

    // Tip
    tip_main:
      "If you don’t see any assigned properties, please contact the operations admin to review your access.",

    // How it works
    how_title: "Basic workflow",
    how_step1: "Sign in with your Vacation Living account.",
    how_step2: "Select the property you’re going to inspect.",
    how_step3:
      "Complete the checklist, add photos, and log any issues you find.",
    how_step4:
      "Save the inspection: the system sends notifications and updates the history.",

    // Benefits
    benefits_title: "Built for real-world operations",
    benefits_subtitle:
      "Less clicks, more clarity. Structure ready to scale with your Supabase backend.",

    benefits_ux_title: "Fast, simple UX",
    benefits_ux_desc:
      "Short flows for on-site inspections, large buttons, and clear reading. Mobile-first.",

    benefits_auto_title: "Quiet automation",
    benefits_auto_desc:
      "Connects to emails and PDFs, with weekly summaries when you turn them on.",

    benefits_evidence_title: "Evidence and traceability",
    benefits_evidence_desc:
      "Issues with photos, category, severity, and status. Full history by property and by case.",

    benefits_arch_title: "Clean architecture",
    benefits_arch_desc:
      "Reusable components, consistent styles, and structure prepared for roles and RLS policies.",

    // Footer
    footer_title: "Vacation Living",
    footer_sub: "Inspection & Operations Suite",
    footer_help: "View reports",
  },

  es: {
    // Header / Nav
    nav_brandTitle: "Vacation Living",
    nav_brandSub: "Inspecciones",
    nav_dashboard: "Dashboard",
    nav_inspections: "Inspecciones",
    nav_reports: "Reportes",
    nav_login: "Iniciar sesión",

    // Hero
    hero_kicker: "Suite de Inspecciones y Operaciones",
    hero_title: "Vacation Living · Sistema de Inspecciones",
    hero_subtitle:
      "Plataforma interna para inspecciones, reportes y control operativo por propiedad. Diseñada para ser rápida, clara y escalable.",

    hero_primaryCta: "Iniciar nueva inspección",
    hero_secondaryCta: "Ver reportes por propiedad",

    // Badges
    badge_role: "Seguridad por roles",
    badge_photos: "Fotos + evidencia",
    badge_mobile: "Mobile-first",
    badge_scale: "Lista para 50+ propiedades",

    // Quick actions
    actions_newInspection_title: "Nueva inspección",
    actions_newInspection_desc:
      "Crear una inspección completa para una propiedad con checklist y fotos.",
    actions_newInspection_label: "Empezar",

    actions_issue_title: "Reportar issue",
    actions_issue_desc:
      "Registrar una incidencia rápida con fotos, severidad y categoría sin hacer una inspección completa.",
    actions_issue_label: "Reportar",

    actions_dashboard_title: "Dashboard operativo",
    actions_dashboard_desc:
      "Ver el estado general de inspecciones, issues abiertos y actividad por propiedad.",
    actions_dashboard_label: "Abrir dashboard",

    actions_history_title: "Historial de reportes",
    actions_history_desc:
      "Ver y descargar los reportes de inspección más recientes y sus PDFs.",
    actions_history_label: "Ver historial",

    // Tip
    tip_main:
      "Si no ves propiedades asignadas, contacta al admin de operaciones para revisar tu acceso.",

    // How it works
    how_title: "Flujo básico",
    how_step1: "Inicia sesión con tu cuenta de Vacation Living.",
    how_step2: "Selecciona la propiedad que vas a inspeccionar.",
    how_step3:
      "Completa el checklist, añade fotos y registra cualquier issue.",
    how_step4:
      "Guarda la inspección: el sistema envía notificaciones y actualiza el historial.",

    // Benefits
    benefits_title: "Hecho para la operación real",
    benefits_subtitle:
      "Menos clicks, más claridad. Estructura lista para escalar con tu backend en Supabase.",

    benefits_ux_title: "UX rápida y simple",
    benefits_ux_desc:
      "Flujos cortos para inspecciones en campo, botones grandes y lectura clara. Mobile-first.",

    benefits_auto_title: "Automatización silenciosa",
    benefits_auto_desc:
      "Conexión a emails y PDFs, con resúmenes semanales cuando tú los actives.",

    benefits_evidence_title: "Evidencia y trazabilidad",
    benefits_evidence_desc:
      "Issues con fotos, categoría, severidad y estado. Historial por propiedad y por caso.",

    benefits_arch_title: "Arquitectura limpia",
    benefits_arch_desc:
      "Componentes reutilizables, estilos consistentes y estructura preparada para roles y políticas RLS.",

    // Footer
    footer_title: "Vacation Living",
    footer_sub: "Inspection & Operations Suite",
    footer_help: "Ver reportes",
  },
};

export function getDictionary(lang = "en") {
  return dictionaries[lang] ?? dictionaries.en;
}