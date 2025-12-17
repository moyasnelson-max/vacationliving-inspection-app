"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RoleGate from "./RoleGate";

const NavItem = ({ href, label }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`block px-4 py-3 rounded-lg text-sm transition
        ${active
          ? "bg-[#C8A36D]/10 text-[#2E2E2E] font-medium"
          : "text-[#6B6B6B] hover:bg-black/5"}
      `}
    >
      {label}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#FAF9F7] border-r border-[#E6E2DC] p-4 flex flex-col">
      <div className="mb-8 px-2">
        <div className="text-lg font-semibold text-[#2E2E2E]">
          Vacation Living
        </div>
        <div className="text-xs text-[#6B6B6B]">Inspection System</div>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/dashboard/inspections" label="Inspections" />
        <NavItem href="/dashboard/issues" label="Issues" />
        <NavItem href="/dashboard/history" label="History" />

        <RoleGate allow={["admin"]}>
          <NavItem href="/dashboard/users" label="Users" />
          <NavItem href="/dashboard/settings" label="Settings" />
        </RoleGate>
      </nav>

      <div className="pt-4 border-t border-[#E6E2DC] text-sm text-[#6B6B6B]">
        Profile · Logout
      </div>
    </aside>
  );
}
