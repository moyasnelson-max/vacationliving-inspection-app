import { PERMISSIONS } from "../roles/permissions";

export function canViewHouse(role) {
  return PERMISSIONS.VIEW_ALL_HOUSES.includes(role);
}
