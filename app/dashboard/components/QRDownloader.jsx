"use client";

import { useState } from "react";
import { generateQR } from "@lib/qrGenerator.js";
import "@theme/qr-downloader.css";

export default function QRDownloader({ houseId }) {
  const [url, setUrl] = useState(null);

  const handleGenerate = async () => {
    const qrUrl = await generateQR(houseId);
    setUrl(qrUrl);
  };

  return (
    <div className="vl-qr-container fade-in">
      <button className="vl-btn-generate" onClick={handleGenerate}>
        Generate QR Code
      </button>

      {url && (
        <a
          className="vl-qr-download-link"
          href={url}
          download={`${houseId}-qr.png`}
        >
          Download QR Code
        </a>
      )}
    </div>
  );
}
