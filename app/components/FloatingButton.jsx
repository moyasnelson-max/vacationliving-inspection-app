export default function FloatingButton({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "62px",
        height: "62px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#C8A36D,#AD8A56)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "34px",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(200,163,109,0.35)",
        zIndex: 9999,
      }}
    >
      +
    </div>
  );
}
