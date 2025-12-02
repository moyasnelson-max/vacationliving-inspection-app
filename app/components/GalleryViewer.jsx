export default function GalleryViewer({ images = [] }) {
  return (
    <div className="gallery-viewer">
      {images.map((src, i) => (
        <img key={i} src={src} alt="" className="gallery-thumb" />
      ))}
    </div>
  );
}