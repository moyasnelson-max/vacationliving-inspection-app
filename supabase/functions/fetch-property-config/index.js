// supabase/functions/fetch-property-config/index.js
// -------------------------------------------------------------
// Vacation Living • Property Config Resolver v3.2
// Devuelve la configuración de una propiedad para:
// - send-report
// - generate-html
// - generate-pdf
// - dashboard
// -------------------------------------------------------------

export const config = {
  runtime: "edge",
};

export default async (req) => {
  try {
    // Parse request body
    const { property_slug } = await req.json();

    if (!property_slug) {
      return new Response(
        JSON.stringify({ error: "Missing property_slug" }),
        { status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRole) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase keys" }),
        { status: 500 }
      );
    }

    // Fetch property config
    const resp = await fetch(`${supabaseUrl}/rest/v1/properties?slug=eq.${property_slug}`, {
      method: "GET",
      headers: {
        apikey: supabaseServiceRole,
        Authorization: `Bearer ${supabaseServiceRole}`,
      },
    });

    const data = await resp.json();

    if (!Array.isArray(data) || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Property not found" }),
        { status: 404 }
      );
    }

    const p = data[0];

    // Build config object
    const configObj = {
      slug: p.slug,
      display_name: p.display_name,
      inspector_email: p.inspector_email,
      owner_email: p.owner_email,
      director_email: p.director_email,
      team_email: p.team_email,
      default_recipient_email: p.default_recipient_email,
      active: p.active,
    };

    return new Response(JSON.stringify(configObj), {
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
