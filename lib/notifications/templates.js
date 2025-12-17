export const inspectionCompletedTemplate = ({ property, link }) => `
<h2>Inspection Completed</h2>
<p><strong>Property:</strong> ${property}</p>
<a href="${link}">View Report</a>`;
export const issueClosedTemplate = ({ issue, property }) => `
<h2>Issue Resolved</h2>
<p>${issue} – ${property}</p>`;
export const weeklySummaryTemplate = ({ summary }) => `
<h2>Weekly Summary</h2><p>${summary}</p>`;
