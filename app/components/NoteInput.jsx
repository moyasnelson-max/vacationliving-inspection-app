'use client';

export default function NoteInput({ value, onChange }) {
  return (
    <textarea
      placeholder="Add notes (required)…"
      className="note-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
}
