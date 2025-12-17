import { getSession } from "@/lib/auth/getSession";
import { getUserRole } from "@/lib/auth/getUserRole";
import RoleGate from "@/app/dashboard/components/RoleGate";
import KPIGrid from "./components/KPIGrid";
import RecentActivity from "./components/RecentActivity";

export default async function ExecutiveDashboard() {
  const session = await getSession();
  const role = await getUserRole(session?.user?.id);

  return (
    <RoleGate allow={["admin", "director", "owner"]} role={role}>
      <div className="space-y-10">
        <h1 className="text-2xl font-semibold">Executive Overview</h1>
        <KPIGrid />
        <RecentActivity />
      </div>
    </RoleGate>
  );
}
