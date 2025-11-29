import "./globals.css";

export const metadata = {
  title: "Vacation Living Inspection System",
  description: "Luxury-level inspection workflow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
