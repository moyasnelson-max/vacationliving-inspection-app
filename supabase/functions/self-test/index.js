// supabase/functions/self-test/index.js
// -------------------------------------------------------------
// Vacation Living • Self-Test v3.0
// Auto-diagnóstico completo del sistema:
// - Verifica Supabase URL + KEY
// - Revisa Edge Functions (send-report, generate-html, generate-pdf)
// - Verifica bucket "issue-media"
// - Testea escritura temporal en storage
// - Testea base de datos (tabla properties)
// -------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let diagnostics = {
      supabase_url: !!SUPABASE_URL,
      service_role_key: !!SERVICE_KEY,
      functions: {},
      storage: {},
      database: {},
    };

    // -------------------------------------------------------------
    // 1. Test Edge Functions
    // -------------------------------------------------------------
    async function testFunction(name) {
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: JSON.stringify({ test: true }),
        });

        diagnostics.functions[name] = resp.ok;
      } catch (e) {
        diagnostics.functions[name] = false;
      }
    }

    await testFunction("send-report");
    await testFunction("generate-html");
    await testFunction("generate-pdf");

    // -------------------------------------------------------------
    // 2. Test Storage: issue-media bucket
    // -------------------------------------------------------------
    try {
      const testResp = await fetch(
        `${SUPABASE_URL}/storage/v1/object/issue-media/selftest.txt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: "self-test OK",
        },
      );

      diagnostics.storage.issue_media = testResp.ok;
    } catch (e) {
      diagnostics.storage.issue_media = false;
    }

    // -------------------------------------------------------------
    // 3. Test Database: properties table
    // -------------------------------------------------------------
    try {
      const dbResp = await fetch(`${SUPABASE_URL}/rest/v1/properties?limit=1`, {
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
        },
      });

      diagnostics.database.properties = dbResp.ok;
    } catch (e) {
      diagnostics.database.properties = false;
    }

    // -------------------------------------------------------------
    // FIN: retornar resultados
    // -------------------------------------------------------------
    return new Response(JSON.stringify({ ok: true, diagnostics }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
    });
  }
};
