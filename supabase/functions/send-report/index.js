import { serve } from "https://deno.land/std@1.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { pdf_url, house, inspector } = await req.json();

    const html = `
    <div style="font-family:Inter, sans-serif; background:#F7F3EC; padding:40px">
      <div style="background:white; border-radius:18px; padding:40px; border:1px solid #E5DCC7">
        
        <img src="{{BASE_URL}}/logo.png" style="width:90px; display:block; margin:0 auto 20px auto" />

        <h1 style="text-align:center; color:#8A6F42; font-size:26px; margin-bottom:10px">
          Inspection Completed
        </h1>

        <p style="text-align:center; color:#6A6A6A; font-size:15px">
          A new inspection report has been submitted for <strong>${house.name}</strong>.
        </p>

        <div style="margin-top:35px; text-align:center">
          <a href="${pdf_url}" 
             style="background:#C8A86A; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-size:16px;">
            Download PDF Report
          </a>
        </div>

        <p style="margin-top:30px; color:#6A6A6A; font-size:13px; text-align:center">
          Inspector: ${inspector.name}<br>
          Thank you for using Vacation Living Inspection System.
        </p>

      </div>
    </div>
    `;

    return new Response(JSON.stringify({ html }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
});
