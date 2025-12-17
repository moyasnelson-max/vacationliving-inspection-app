import { ROLES } from "./roles";

export const PERMISSIONS = {
  viewDashboard: [
    ROLES.ADMIN,
    ROLES.DIRECTOR,
    ROLES.OWNER,
    ROLES.INSPECTOR,
  ],

  createInspection: [
    ROLES.ADMIN,
    ROLES.DIRECTOR,
    ROLES.INSPECTOR,
  ],

  closeIssue: [
    ROLES.ADMIN,
    ROLES.DIRECTOR,
  ],

  viewReports: [
    ROLES.ADMIN,
    ROLES.DIRECTOR,
    ROLES.OWNER,
  ],

  createIssue: [
    ROLES.ADMIN,
    ROLES.DIRECTOR,
    ROLES.INSPECTOR,
    ROLES.GUEST,
  ],
};

export function can(role, permission) {
  return PERMISSIONS[permission]?.includes(role);
}
