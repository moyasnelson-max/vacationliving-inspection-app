export default function DashboardUI({ stats }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Inspections</div>
          <div className="text-3xl font-semibold">{stats.inspections}</div>
        </div>
        <div className="p-6 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Open Issues</div>
          <div className="text-3xl font-semibold">{stats.issues}</div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border">
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="flex gap-4">
          <a href="/inspection/new" className="text-sm underline">
            New Inspection
          </a>
          <a href="/dashboard/issues" className="text-sm underline">
            View Issues
          </a>
        </div>
      </div>
    </div>
  );
}
