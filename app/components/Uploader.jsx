'use client';
import { useState } from 'react';

export default function Uploader({ onUpload }) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    try {
      await onUpload(file);
    } catch (err) {
      console.error('Upload error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="uploader-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden-input"
      />
      <div className="uploader-button">
        {loading ? 'Uploading…' : 'Upload Photo'}
      </div>
    </div>
  );
}
