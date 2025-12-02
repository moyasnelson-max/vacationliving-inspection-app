"use client";
"use client";
import { useState } from "react";

export default function NoteInput({ onChange }) {
  const [value, setValue] = useState("");

  function handle(e) {
    setValue(e.target.value);
    onChange(e.target.value);
  }

  return (
    <textarea
      className="note-input"
      placeholder="Add notes..."
      value={value}
      onChange={handle}
    />
  );
}