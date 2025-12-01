export function pdfDocument(report) {
  return `
    <html>
      <body style="font-family: Arial;">
        <h1>Inspection Report – ${report.house}</h1>
        <p>Date: ${report.date}</p>

        ${report.items
          .map(
            (i) => `
          <div>
            <h3>${i.name}</h3>
            <p>Status: ${i.status}</p>
            <p>Severity: ${i.severity}</p>
            <p>Notes: ${i.notes}</p>
          </div>
        `
          )
          .join('')}
      </body>
    </html>
  `;
}
