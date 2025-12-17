// app/pdf/sendEmail.js
export async function sendEmail({ to, subject, message, pdfUrl }) {
  try {
    if (!to || !subject || !message) {
      throw new Error("Missing required email fields.");
    }

    const apiKey = process.env.NEXT_PUBLIC_SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SendGrid API Key not found.");
    }

    // -------------------------------------------------------------
    // HTML PREMIUM • Marriott-Level
    // -------------------------------------------------------------
    const emailBody = {
      personalizations: [
        {
          to: [{ email: to }],
          subject,
        },
      ],
      from: {
        email: "reports@vacationlivingvirtualtour.com",
        name: "Vacation Living Reports",
      },
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family:Inter, sans-serif; color:#333; padding:20px;">
              <h2 style="color:#0A2540; margin:0 0 12px;">Inspection Report</h2>
              <p style="font-size:16px; line-height:1.5;">
                ${message}
              </p>

              ${
                pdfUrl
                  ? `
                <p style="margin-top:18px;">
                  <strong>Download PDF Report:</strong><br>
                  <a href="${pdfUrl}"
                     target="_blank"
                     style="display:inline-block; margin-top:8px; 
                            padding:10px 16px; background:#0A2540; color:#fff;
                            text-decoration:none; border-radius:6px;">
                     Open Report
                  </a>
                </p>`
                  : `<p style="margin-top:18px; color:#B00020;">PDF URL missing.</p>`
              }

              <br><hr style="border:0; border-top:1px solid #ddd; margin-top:25px;">
              <p style="font-size:12px; color:#777; margin-top:10px;">
                Vacation Living • Automated Inspection System
              </p>
            </div>
          `,
        },
      ],
    };

    // -------------------------------------------------------------
    // SENDGRID REQUEST
    // -------------------------------------------------------------
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    // -------------------------------------------------------------
    // ERROR HANDLING PROFESIONAL
    // -------------------------------------------------------------
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${errorText}`);
    }

    return { ok: true };
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return { ok: false, error: err.message };
  }
}
