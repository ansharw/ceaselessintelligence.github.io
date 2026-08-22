/**
 * Cloudflare Worker entry point (unified Workers + Static Assets model).
 *
 * Routing:
 *   POST /api/submit-lead  -> handled here, server-side (HubSpot creds
 *                              live in env vars, never shipped to the browser)
 *   everything else        -> falls through to the static site via the
 *                              ASSETS binding (see wrangler.toml [assets])
 *
 * Security headers are applied to every response here (rather than
 * relying on a Pages-only `_headers` file) so they hold regardless of
 * platform conventions.
 */

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com; frame-src https://calendar.google.com; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'none'"
};

const REQUIRED_FIELDS = [
  "fullName",
  "companyName",
  "jobTitle",
  "email",
  "whatsapp",
  "industry",
  "challenge"
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const response =
      url.pathname === "/api/submit-lead"
        ? await handleSubmitLead(request, env)
        : await env.ASSETS.fetch(request);

    return withSecurityHeaders(response);
  }
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function handleSubmitLead(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  // Honeypot: if this hidden field has a value, a bot filled the form.
  // Respond as if it succeeded so bots don't learn to avoid the field.
  if (data.companyWebsite2) {
    return jsonResponse({ ok: true });
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return jsonResponse({ error: `Missing or invalid field: ${field}` }, 400);
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    return jsonResponse({ error: "Invalid email" }, 400);
  }

  const portalId = env.HUBSPOT_PORTAL_ID;
  const formGuid = env.HUBSPOT_FORM_GUID;

  if (!portalId || !formGuid) {
    // Not configured yet — demo mode, nothing is sent anywhere.
    return jsonResponse({ ok: true, demo: true });
  }

  const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  const payload = {
    fields: [
      { name: "firstname", value: data.fullName.trim() },
      { name: "company", value: data.companyName.trim() },
      { name: "jobtitle", value: data.jobTitle.trim() },
      { name: "email", value: data.email.trim() },
      { name: "phone", value: data.whatsapp.trim() },
      { name: "website", value: (data.website || "").trim() },
      { name: "industry", value: data.industry },
      { name: "main_challenge", value: data.challenge }
    ],
    context: {
      pageUri: request.headers.get("referer") || "",
      pageName: "Ceaseless Intelligence"
    }
  };

  const hubspotRes = await fetch(hubspotUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!hubspotRes.ok) {
    return jsonResponse({ error: "CRM submission failed" }, 502);
  }

  return jsonResponse({ ok: true });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
