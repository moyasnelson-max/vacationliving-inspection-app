"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function GuestReport() {
  const supabase = supabaseBrowser();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    await supabase.from("issues").insert({
      description: message,
      source: "guest",
    });
    setSent(true);
  }

  if (sent) {
    return <p>Thank you. Your report has been sent.</p>;
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <h1 className="text-lg font-medium">Report an Issue</h1>
      <textarea
        className="w-full border rounded-lg p-3"
        placeholder="Describe the issue"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="px-4 py-2 bg-[#C8A36D] text-white rounded-lg">
        Submit
      </button>
    </form>
  );
}
