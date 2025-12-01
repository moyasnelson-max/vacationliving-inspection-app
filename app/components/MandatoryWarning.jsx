export default function MandatoryWarning({ show }) {
  if (!show) return null;

  return (
    <div className="mandatory-warning">
      ⚠️ You must add a note before continuing.
    </div>
  );
}
