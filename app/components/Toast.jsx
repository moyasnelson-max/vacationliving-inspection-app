"use client";

import { useEffect, useState } from "react";
import "@theme/toast.css";

export default function Toast({ message = "" }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <div className="vl-toast fade-in-up">{message}</div>;
}
