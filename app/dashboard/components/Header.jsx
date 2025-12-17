"use client";

import { usePathname } from "next/navigation";

const titles = {
  "/dashboard": "Dashboard",
  "/dashboard/inspections": "Inspections",
  "/dashboard/issues": "Issues",
  "/dashboard/history": "History",
};

export default function Header() {
  const pathname = usePathname();
  const title = titles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-[#E6E2DC] px-6 flex items-center justify-between bg-white">
      <div>
        <h1 className="text-lg font-medium text-[#2E2E2E]">{title}</h1>
        <p className="text-xs text-[#6B6B6B]">Operational overview</p>
      </div>

      <div className="text-sm text-[#6B6B6B]">
        Logged in
      </div>
    </header>
  );
}
