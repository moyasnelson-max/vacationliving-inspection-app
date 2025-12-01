'use client';
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', timeout = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), timeout);
    return () => clearTimeout(t);
  }, [timeout]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
