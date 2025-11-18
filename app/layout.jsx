import "./globals.css";

export const metadata = {
  title: "Vacation Living · Inspections",
  description: "Luxury Inspection Management Platform for Vacation Living.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme */}
        <meta name="theme-color" content="#E8D9BC" />

        {/* Apple iOS PWA */}
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VL Inspection" />

        {/* Splash Screen iOS */}
        <link rel="apple-touch-startup-image" href="/icon.png" />
      </head>

      <body>{children}</body>

      {/* Service Worker Registration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").catch(err => {
                  console.error("SW registration failed:", err);
                });
              });
            }
          `,
        }}
      />
    </html>
  );
}
