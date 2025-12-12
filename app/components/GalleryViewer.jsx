"use client";

import "@theme/gallery-viewer.css";

export default function GalleryViewer({ images = [] }) {
  if (!images.length) {
    return <p className="gallery-empty">No hay imágenes disponibles</p>;
  }

  return (
    <div className="gallery-grid fade-in">
      {images.map((src, idx) => (
        <div key={idx} className="gallery-item">
          <img src={src} alt={`Imagen ${idx + 1}`} className="gallery-image" />
        </div>
      ))}
    </div>
  );
}
