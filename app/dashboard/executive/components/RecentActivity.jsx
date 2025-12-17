"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function RecentActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from("system_logs")
        .select("event_type, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setLogs(data || []);
    };

    fetchLogs();
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
      <ul className="space-y-2 text-sm text-neutral-400">
        {logs.map((log, i) => (
          <li key={i}>
            {log.event_type} · {new Date(log.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
