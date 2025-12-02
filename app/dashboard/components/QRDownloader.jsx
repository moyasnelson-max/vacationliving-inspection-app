"use client";

import { generateQR } from "@/lib/qrGenerator.js";
import { useState } from "react";

export default function QRDownloader({ houseId }) {
  const [qrUrl, setQrUrl] = useState(null);

  const handleGenerate = async () => {
    const url = await generateQR(houseId);
    setQrUrl(url);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={handleGenerate}
        style={{
          padding: "10px 16px",
          borderRadius: 6,
          background: "#C8A36D",
          color: "#fff",
        }}
      >
        Generate QR
      </button>

      {qrUrl && (
        <a
          href={qrUrl}
          download={`house-${houseId}-qr.png`}
          style={{
            display: "block",
            marginTop: 14,
            color: "#0070f3",
            textDecoration: "underline",
          }}
        >
          Download QR Code
        </a>
      )}
    </div>
  );
}
