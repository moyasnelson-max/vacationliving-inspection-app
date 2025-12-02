import LuxHeader from "@/components/LuxHeader";

export const metadata = {
  title: "Inspection · Vacation Living",
};

export default function InspectionLayout({ children }) {
  return (
    <div className="lux-inspection-wrapper">
      <LuxHeader title="Inspection Dashboard" backHref="/login" />

      <main className="lux-inspection-content">{children}</main>
    </div>
  );
}