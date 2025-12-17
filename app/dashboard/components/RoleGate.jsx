"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserRole } from "@/lib/auth/getUserRole";

export default function RoleGate({ allow, children }) {
  const { session } = useAuth();
  const role = getUserRole(session);

  if (!allow.includes(role)) return null;
  return children;
}
