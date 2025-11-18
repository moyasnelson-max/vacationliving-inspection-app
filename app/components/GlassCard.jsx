export default function GlassCard({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        borderRadius: "18px",
        padding: "18px",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginBottom: "16px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {children}
    </div>
  );
}
