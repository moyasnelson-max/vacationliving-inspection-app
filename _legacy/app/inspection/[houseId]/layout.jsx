// app/inspection/[houseId]/layout.jsx

export default function InspectionLayout({ children }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px 24px",
        background: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e5e5e5",
        boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
        marginTop: "25px",
      }}
    >
      {children}
    </div>
  );
}
