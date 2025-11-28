import "../styles/inspection-layout.css";
import LuxHeader from "@/app/components/LuxHeader";

export const metadata = {
  title: "Inspection · Vacation Living",
};

export default function InspectionLayout({ children }) {
  return (
    <div className="lux-inspection-wrapper">
      {/* HEADER GLOBAL PARA INSPECTORES */}
      <LuxHeader title="Inspection Dashboard" backHref="/login" />

      {/* CONTENIDO */}
      <main className="lux-inspection-content">
        {children}
      </main>
    </div>
  );
}
