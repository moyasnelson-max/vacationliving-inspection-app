"use client";

import { dictionary } from "@/app/i18n/dictionary";

export default function HomePage() {
  const lang = "en";
  const t = dictionary[lang];

  return (
    <main style={{ padding: 40 }}>
      <h1>{t.title}</h1>
      <p>{t.actions}</p>
    </main>
  );
}
