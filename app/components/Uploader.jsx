"use client";

import { useState } from "react";
import "@theme/uploader.css";

export default function Uploader({ onUpload }) {
  const [files, setFiles] = useState([]);

  function handleChange(e) {
    const list = Array.from(e.target.files);
    setFiles(list);
    onUpload(list);
  }

  return (
    <div className="vl-uploader fade-in">
      <label className="vl-upload-box">
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="vl-upload-input"
        />
        <span className="vl-upload-icon">📷</span>
        <span className="vl-upload-text">Tap to upload photos</span>
      </label>

      {files.length > 0 && (
        <div className="vl-upload-preview">
          {files.map((f, i) => (
            <div key={i} className="vl-preview-item">
              {f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
