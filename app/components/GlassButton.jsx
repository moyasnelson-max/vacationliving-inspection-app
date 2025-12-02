export default function GlassButton({ children, onClick, type = "button" }) {
  return (
    <button type={type} className="glass-btn" onClick={onClick}>
      {children}
    </button>
  );
}