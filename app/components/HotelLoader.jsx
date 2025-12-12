"use client";

import "@theme/hotel-loader.css";

export default function HotelLoader() {
  return (
    <div className="vl-loader-container fade-in">
      <div className="vl-loader-ring"></div>
      <p className="vl-loader-text">Loading • Vacation Living</p>
    </div>
  );
}
