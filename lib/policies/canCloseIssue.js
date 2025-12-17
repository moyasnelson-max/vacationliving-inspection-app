import { PERMISSIONS } from "../roles/permissions";

export function canCloseIssue(role) {
  return PERMISSIONS.CLOSE_ISSUE.includes(role);
}
