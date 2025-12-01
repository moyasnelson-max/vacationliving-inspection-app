"use client";

import HouseSelector from "./components/HouseSelector";

export default function HousesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Select a Property</h2>
      <HouseSelector />
    </div>
  );
}
