'use client';

export default function SeveritySelector({ value, onChange }) {
  return (
    <div className="severity-selector">
      {['Low', 'Medium', 'High', 'Critical'].map((level) => (
        <button
          key={level}
          className={`severity-btn ${value === level ? 'active' : ''}`}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
