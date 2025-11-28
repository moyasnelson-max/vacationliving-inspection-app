// supabase/functions/generate-html/index.js
// -------------------------------------------------------------
// Vacation Living • Generate HTML v3.8 (Premium Gold)
// Crea el HTML que se usará para el PDF y el Email.
// -------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const {
      property_name,
      property_slug,
      inspector_email,
      created_at,
      notes,
      items = [],
    } = await req.json();

    if (!property_name) {
      return new Response(JSON.stringify({ error: "Missing HTML inputs" }), {
        status: 400,
      });
    }

    // -------------------------------------------------------------
    // BUILD HTML PREMIUM
    // -------------------------------------------------------------
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Inspection Report - ${property_name}</title>
<style>
  body {
    font-family: Helvetica, Arial, sans-serif;
    background: #F7F3EC;
    padding: 20px 30px;
    color: #1F1F1F;
  }
  .header {
    text-align: center;
    margin-bottom: 25px;
  }
  .title {
    font-size: 28px;
    font-weight: bold;
    color: #C8A36D;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
  }
  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #C8A36D;
    margin-top: 30px;
    margin-bottom: 10px;
    border-bottom: 1px solid #C8A36D;
    padding-bottom: 6px;
  }
  .item {
    background: white;
    padding: 14px 18px;
    margin-bottom: 12px;
    border-radius: 8px;
    border-left: 4px solid #C8A36D;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.07);
  }
  .item-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  .item-note {
    font-size: 14px;
    color: #555;
    margin-top: 6px;
  }
</style>
</head>

<body>

  <div class="header">
    <div class="title">Vacation Living — Inspection Report</div>
    <div class="subtitle">${property_name}</div>
    <div class="subtitle">Inspector: ${inspector_email}</div>
    <div class="subtitle">Date: ${created_at}</div>
  </div>

  <div class="section-title">General Notes</div>
  <p>${notes || "No additional notes"}</p>

  <div class="section-title">Reported Items</div>

  ${items
    .map(
      (item) => `
    <div class="item">
      <div class="item-title">${item.category_name} — ${item.subcategory_name}</div>
      <div class="item-note">${item.note}</div>

      ${
        item.media_urls && item.media_urls.length > 0
          ? item.media_urls
              .map(
                (url) =>
                  `<p><strong>Photo:</strong> ${url}</p>`
              )
              .join("")
          : `<p><em>No media uploaded</em></p>`
      }
    </div>
  `
    )
    .join("")}

</body>
</html>
`;

    return new Response(JSON.stringify({ html }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
