export default function GlassButton({ children, onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className="glass-btn">
      {children}
    </button>
  );
}
