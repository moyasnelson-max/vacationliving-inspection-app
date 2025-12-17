export function inspectionHTML(data) {
  return \`
  <html><body style="font-family:Arial;padding:32px">
  <h1>Inspection Report</h1>
  <p><strong>Property:</strong> \${data.property}</p>
  <p><strong>Inspector:</strong> \${data.inspector}</p>
  <p><strong>Date:</strong> \${data.date}</p>
  \${data.categories.map(c => \`
    <h2>\${c.name}</h2>
    \${c.subcategories.map(s => \`
      <h3>\${s.name}</h3>
      <ul>\${s.items.map(i => \`<li>\${i.name} – \${i.status}</li>\`).join("")}</ul>
    \`).join("")}
  \`).join("")}
  <footer style="margin-top:40px;font-size:12px">
    Generated automatically by Vacation Living
  </footer>
  </body></html>\`;
}
