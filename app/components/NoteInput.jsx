"use client";

import { useState } from "react";
import "@theme/note-input.css";

export default function NoteInput({ onChange }) {
  const [value, setValue] = useState("");

  function handle(e) {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  }

  return (
    <textarea
      className="vl-note-input fade-in"
      placeholder="Add notes..."
      value={value}
      onChange={handle}
      rows={4}
    />
  );
}
