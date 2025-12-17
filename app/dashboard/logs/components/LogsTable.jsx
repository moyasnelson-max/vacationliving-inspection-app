"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p className="text-muted">Loading system activity…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">System Activity</h1>

      <div className="overflow-auto rounded-xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">House</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr
                key={log.id}
                className="border-t border-neutral-800 hover:bg-neutral-900/50"
              >
                <td className="px-4 py-2 text-neutral-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">{log.event}</td>
                <td className="px-4 py-2">{log.entity_type}</td>
                <td className="px-4 py-2 text-neutral-400">
                  {log.house_id || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
