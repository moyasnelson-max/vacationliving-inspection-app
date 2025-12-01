// lib/validation.js

export function validateNote(note) {
  return note && note.trim().length >= 3;
}

export function validateSeverity(value) {
  return ['low', 'medium', 'high', 'critical'].includes(value);
}

export function validateMedia(mediaList) {
  return Array.isArray(mediaList) && mediaList.length > 0;
}

export function validateRequiredFields({ note, severity }) {
  return validateNote(note) && validateSeverity(severity);
}
