/**
 * Cloudflare Pages Function — POST /api/submit-lead
 *
 * Runs server-side (never shipped to the browser). This is where
 * HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID actually live, as environment
 * variables set in the Cloudflare dashboard (or wrangler secrets) —
 * never in client-side JS.
 */

const REQUIRED_FIELDS = [
  "fullName",
  "companyName",
  "jobTitle",
  "email",
  "whatsapp",
  "industry",
  "challenge"
];

export async function onRequestPost(context) {
  const { request, env } = context;

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

// Reject anything that isn't POST (GET/PUT/DELETE etc.)
export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  return onRequestPost(context);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
