import { getSession } from "@/lib/auth/getSession";
import { getUserRole } from "@/lib/auth/getUserRole";
import LogsTable from "./components/LogsTable";
import RoleGate from "@/app/dashboard/components/RoleGate";

export default async function LogsPage() {
  const session = await getSession();
  const role = await getUserRole(session?.user?.id);

  return (
    <RoleGate allow={["admin", "director", "owner"]} role={role}>
      <LogsTable />
    </RoleGate>
  );
}
