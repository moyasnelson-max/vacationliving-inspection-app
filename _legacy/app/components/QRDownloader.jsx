"use client";

export default function QRDownloader({ url }) {
  if (!url) {
    return <p className="qr-download-error fade-in">QR not available</p>;
  }

  return (
    <a href={url} download className="qr-download-btn fade-in">
      Download QR
    </a>
  );
}
