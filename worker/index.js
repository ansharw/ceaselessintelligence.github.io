/**
 * Cloudflare Worker entry point (unified Workers + Static Assets model).
 *
 * Routing:
 *   POST /api/submit-lead  -> handled here, server-side. Emails a lead
 *                              notification via Cloudflare's native Email
 *                              Workers binding (env.SEND_EMAIL) — no
 *                              third-party API key needed.
 *   everything else        -> falls through to the static Next.js export
 *                              via the ASSETS binding (see wrangler.toml [assets],
 *                              which points at the `out/` build directory)
 *
 * Security headers are applied to every response here (rather than
 * relying on a Pages-only `_headers` file) so they hold regardless of
 * platform conventions.
 */

import { EmailMessage } from "cloudflare:email";
import { createMimeMessage, Mailbox } from "mimetext";

// Must already be a verified destination address in Cloudflare Email Routing
// (Cloudflare -> Email -> Email Routing -> Destination addresses), and match
// the `destination_address` set on the [[send_email]] binding in wrangler.toml.
const NOTIFY_EMAIL = "ceaselessintelligence@gmail.com";
// Any address on a domain with Email Routing enabled in Cloudflare — this is
// just the "From" the notification appears to come from, no inbox required.
const FROM_EMAIL = "contact@ceaselessintelligence.com";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'none'"
};

const REQUIRED_FIELDS = [
  "fullName",
  "companyName",
  "email",
  "companyDescription",
  "improvementGoal"
];

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    const response =
      url.pathname === "/api/submit-lead"
        ? await handleSubmitLead(request, env)
        : await env.ASSETS.fetch(request);

    return withSecurityHeaders(response);
  }
};

export default worker;

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

  if (!env.SEND_EMAIL) {
    // Binding not available (e.g. local dev without the Email Routing
    // destination set up) — demo mode, nothing is sent anywhere.
    return jsonResponse({ ok: true, demo: true });
  }

  const sent = await sendLeadEmail(data, env);
  if (!sent) {
    return jsonResponse({ error: "Email notification failed" }, 502);
  }

  return jsonResponse({ ok: true });
}

async function sendLeadEmail(data, env) {
  const services = Array.isArray(data.services) ? data.services.filter((s) => typeof s === "string") : [];

  const bodyText = [
    `Name: ${data.fullName.trim()}`,
    `Company: ${data.companyName.trim()}`,
    `Email: ${data.email.trim()}`,
    `Website: ${(data.website || "").trim() || "—"}`,
    `Services: ${services.join(", ") || "—"}`,
    "",
    "What does your company do?",
    data.companyDescription.trim(),
    "",
    "Constraint they're trying to remove:",
    data.improvementGoal.trim()
  ].join("\n");

  const msg = createMimeMessage();
  msg.setSender({ name: "Ceaseless Intelligence", addr: FROM_EMAIL });
  msg.setRecipient(NOTIFY_EMAIL);
  msg.setSubject(`New lead: ${data.companyName.trim()}`);
  msg.setHeader("Reply-To", new Mailbox(data.email.trim()));
  msg.addMessage({ contentType: "text/plain", data: bodyText });

  try {
    const message = new EmailMessage(FROM_EMAIL, NOTIFY_EMAIL, msg.asRaw());
    await env.SEND_EMAIL.send(message);
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
