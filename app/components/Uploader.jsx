"use client";
"use client";
import { useState } from "react";

export default function Uploader({ onUpload }) {
  const [files, setFiles] = useState([]);

  function handleChange(e) {
    const list = Array.from(e.target.files);
    setFiles(list);
    onUpload(list);
  }

  return (
    <div className="uploader">
      <input type="file" multiple onChange={handleChange} />
    </div>
  );
}