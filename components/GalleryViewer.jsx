'use client';
import { useState } from 'react';

export default function GalleryViewer({ images = [] }) {
  const [active, setActive] = useState(null);

  if (!images.length) return null;

  return (
    <div className="gallery-viewer">
      <div className="gallery-grid">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="gallery-thumb"
            onClick={() => setActive(img)}
          />
        ))}
      </div>

      {active && (
        <div className="gallery-modal" onClick={() => setActive(null)}>
          <img src={active} className="gallery-full" />
        </div>
      )}
    </div>
  );
}
