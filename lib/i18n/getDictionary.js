export async function getDictionary(lang = "en") {
  return lang === "es"
    ? { title: "Sistema de Inspecciones" }
    : { title: "Inspection System" };
}
