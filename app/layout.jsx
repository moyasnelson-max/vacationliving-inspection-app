export const metadata = {
  title: "Vacation Living – Inspection System",
  description: "Professional inspection system for Vacation Living Rentals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#F7F3EC" }}>
        {children}
      </body>
    </html>
  );
}
