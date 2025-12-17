
export const metadata = {
  title: "Vacation Living · Login",
  description: "Secure access to the inspection system",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f8f5f0, #efe6d8)",
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "32px",
              borderRadius: "16px",
              background: "#ffffff",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          >
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
