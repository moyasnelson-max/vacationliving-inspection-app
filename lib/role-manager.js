export function checkUserRole(session, allowed = []) {
  const role = session?.user?.role || "guest";
  return allowed.includes(role);
}

export function requireRole(session, allowed = []) {
  if (!checkUserRole(session, allowed)) {
    throw new Error("Unauthorized: Insufficient permissions");
  }
}