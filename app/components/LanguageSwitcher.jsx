"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { updateUserLanguage } from "@/lib/auth/updateUserLanguage";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const currentLang = segments[0] === "es" ? "es" : "en";
  const nextLang = currentLang === "en" ? "es" : "en";

  const newPath = "/" + [nextLang, ...segments.slice(1)].join("/");

  async function handleSwitch() {
    document.cookie = `lang=${nextLang}; path=/`;
    await updateUserLanguage(nextLang);
    router.push(newPath);
  }

  return (
    <button onClick={handleSwitch} className="lang-switch">
      {nextLang.toUpperCase()}
    </button>
  );
}
