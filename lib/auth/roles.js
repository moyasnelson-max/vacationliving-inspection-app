export const ROLES = {
  ADMIN: "admin",
  INSPECTOR: "inspector",
  MANAGER: "manager",
};

export function hasRole(user, role) {
  if (!user || !user.role) return false;
  return user.role === role;
}
