export async function sendEmail({ to, subject, html }) {
  try {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    return await res.json();
  } catch (error) {
    console.error("Email error:", error);
    return { error: true };
  }
}
