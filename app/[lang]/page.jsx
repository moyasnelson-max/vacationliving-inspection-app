import { getDictionary } from "@lib/i18n/getDictionary";

export default async function Page({ params }) {
  const t = await getDictionary(params.lang);

  return (
    <main className="lux-card">
      <h1>{t.title}</h1>
      <button>{t.cta}</button>
    </main>
  );
}
