import "./globals.css";
import "./styles/glass.css";

export const metadata = {
  title: "Vacation Living Inspection App",
  description: "Premium Glass System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
